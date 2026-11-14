/* Promo Campaign backend: real TikTok login + video analysis. No dependencies, Node 18+.
   Run: TIKTOK_CLIENT_KEY=... TIKTOK_CLIENT_SECRET=... PUBLIC_URL=https://your-domain ADMIN_TOKEN=... node server.js */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PC = require("./analysis.js");

const PORT = process.env.PORT || 3000;
const KEY = process.env.TIKTOK_CLIENT_KEY;
const SECRET = process.env.TIKTOK_CLIENT_SECRET;
const PUBLIC_URL = (process.env.PUBLIC_URL || "http://localhost:" + PORT).replace(/\/$/, "");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const REDIRECT = PUBLIC_URL + "/auth/tiktok/callback";
const SCOPES = "user.info.basic,user.info.stats,video.list";
const DB_FILE = path.join(__dirname, "data.json");
const HISTORY_DAYS = 200;           // how far back we load videos
const MAX_PAGES = 15;               // 20 videos per page

if (!KEY || !SECRET || !ADMIN_TOKEN) { console.error("Set TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET and ADMIN_TOKEN"); process.exit(1); }

/* tiny JSON file store: { users: { uid: { id, accounts: [ {open_id, tokens, profile, videos, price, ...} ] } }, sessions: { sid: uid }, byOpen: { open_id: uid } } */
let db = { users: {}, sessions: {}, byOpen: {} };
try { db = Object.assign(db, JSON.parse(fs.readFileSync(DB_FILE, "utf8"))); } catch (e) {}
function saveDb() { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), { mode: 0o600 }); }
const pending = new Map();          // oauth state -> {exp, handle, uid}

function send(res, code, body, headers) {
  res.writeHead(code, Object.assign({ "Content-Type": "application/json; charset=utf-8" }, headers || {}));
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}
function readBody(req) {
  return new Promise((ok, fail) => {
    let s = ""; req.on("data", c => { s += c; if (s.length > 1e5) req.destroy(); });
    req.on("end", () => { try { ok(s ? JSON.parse(s) : {}); } catch (e) { fail(e); } });
  });
}
function cookie(req, name) {
  const m = (req.headers.cookie || "").match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return m ? m[1] : null;
}
function sessionUser(req) { const sid = cookie(req, "sid"); return sid && db.sessions[sid] ? db.users[db.sessions[sid]] || null : null; }
function findAcc(user, id) { return (user.accounts || []).find(a => a.open_id === id) || null; }

/* ---- TikTok API ---- */
async function tokenRequest(params) {
  const r = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
    body: new URLSearchParams(Object.assign({ client_key: KEY, client_secret: SECRET }, params)).toString()
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("token: " + JSON.stringify(j));
  return j;
}
async function freshToken(user) {
  if (user.expires_at > Date.now() + 60000) return user.access_token;
  const j = await tokenRequest({ grant_type: "refresh_token", refresh_token: user.refresh_token });
  user.access_token = j.access_token; user.refresh_token = j.refresh_token || user.refresh_token;
  user.expires_at = Date.now() + j.expires_in * 1000; saveDb();
  return user.access_token;
}
async function fetchProfile(token) {
  const fields = "open_id,display_name,username,avatar_url,follower_count,likes_count,video_count";
  const r = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=" + fields, { headers: { Authorization: "Bearer " + token } });
  const j = await r.json();
  if (!j.data || !j.data.user) throw new Error("user/info: " + JSON.stringify(j));
  return j.data.user;
}
async function fetchVideos(token) {
  const since = Date.now() - HISTORY_DAYS * PC.DAY, out = [];
  let cursor, more = true;
  for (let page = 0; page < MAX_PAGES && more; page++) {
    const body = { max_count: 20 }; if (cursor) body.cursor = cursor;
    const r = await fetch("https://open.tiktokapis.com/v2/video/list/?fields=id,create_time,view_count,like_count,comment_count,share_count,share_url", {
      method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    const j = await r.json();
    if (!j.data) throw new Error("video/list: " + JSON.stringify(j));
    (j.data.videos || []).forEach(v => out.push({ id: v.id, created: v.create_time * 1000, views: v.view_count || 0, likes: v.like_count || 0, url: v.share_url }));
    more = j.data.has_more; cursor = j.data.cursor;
    if (out.length && out[out.length - 1].created < since) break;     // videos come newest first
  }
  return out;
}
async function refreshAnalysis(user) {
  const token = await freshToken(user);
  user.profile = await fetchProfile(token);
  user.videos = await fetchVideos(token);
  user.analysisAt = Date.now();
  saveDb();
}
function accView(acc) {
  const A = PC.analyze(acc.videos || [], Date.now());
  return { id: acc.open_id, handle: "@" + (acc.profile && acc.profile.username || ""), name: acc.profile && acc.profile.display_name,
    analysis: A, price: acc.price || null, evaluation: PC.evaluate(A, acc.price), adminStatus: acc.adminStatus || "new", recommended: PC.recommend(A), analysisAt: acc.analysisAt,
    videos: (acc.videos || []).slice(0, 150).map(v => ({ id: v.id, created: v.created, views: v.views, url: v.url })) };
}
function view(user) { return { accounts: (user.accounts || []).map(accView) }; }

/* ---- routes ---- */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, PUBLIC_URL);
  try {
    if (url.pathname === "/auth/tiktok") {                       // "Open in TikTok" button points here
      const state = crypto.randomBytes(16).toString("hex");
      const cu = sessionUser(req);
      pending.set(state, { exp: Date.now() + 10 * 60000, handle: (url.searchParams.get("u") || "").toLowerCase().replace(/^@/, ""), uid: cu ? cu.id : null });
      const q = new URLSearchParams({ client_key: KEY, scope: SCOPES, response_type: "code", redirect_uri: REDIRECT, state });
      res.writeHead(302, { Location: "https://www.tiktok.com/v2/auth/authorize/?" + q }); return res.end();
    }
    if (url.pathname === "/auth/tiktok/callback") {
      const state = url.searchParams.get("state"), code = url.searchParams.get("code");
      if (url.searchParams.get("error")) { res.writeHead(302, { Location: "/#signup?denied=1" }); return res.end(); }   // user pressed Cancel in TikTok
      if (!code || !pending.has(state) || pending.get(state).exp < Date.now()) return send(res, 400, { error: "bad state" });
      const want = pending.get(state).handle;     // account link the creator pasted
      const uid0 = pending.get(state).uid;        // signed-in profile that is adding an account (if any)
      pending.delete(state);
      const tok = await tokenRequest({ code, grant_type: "authorization_code", redirect_uri: REDIRECT });
      const owner = db.byOpen[tok.open_id];
      if (owner && uid0 && owner !== uid0) { res.writeHead(302, { Location: "/#signup?taken=1" }); return res.end(); }   // already linked to another profile
      const uid = uid0 || owner || crypto.randomBytes(12).toString("hex");
      const user = db.users[uid] || (db.users[uid] = { id: uid, createdAt: Date.now(), accounts: [] });
      let acc = findAcc(user, tok.open_id);
      if (!acc) { acc = { open_id: tok.open_id, createdAt: Date.now() }; user.accounts.push(acc); }
      Object.assign(acc, { access_token: tok.access_token, refresh_token: tok.refresh_token, expires_at: Date.now() + tok.expires_in * 1000 });
      await refreshAnalysis(acc);
      if (want && (acc.profile.username || "").toLowerCase() !== want) {   // confirmed a different account than the pasted link
        user.accounts = user.accounts.filter(x => x !== acc); saveDb();
        res.writeHead(302, { Location: "/#signup?mismatch=1" }); return res.end();
      }
      db.byOpen[tok.open_id] = uid;
      const headers = { Location: "/#analysis" };
      if (!uid0) { const sid = crypto.randomBytes(24).toString("hex"); db.sessions[sid] = uid; headers["Set-Cookie"] = "sid=" + sid + "; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000"; }
      saveDb();
      res.writeHead(302, headers);
      return res.end();
    }
    if (url.pathname === "/api/me" && req.method === "GET") {
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      return send(res, 200, view(u));
    }
    if (url.pathname === "/api/reanalyze" && req.method === "POST") {
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), acc = findAcc(u, b.id); if (!acc) return send(res, 404, { error: "no such account" });
      await refreshAnalysis(acc); return send(res, 200, view(u));
    }
    if (url.pathname === "/api/price" && req.method === "POST") {  // creator confirms/edits price, we answer with chance + good/bad list
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), price = Number(b.price), acc = findAcc(u, b.id);
      if (!acc) return send(res, 404, { error: "no such account" });
      if (!(price >= 1 && price <= 200)) return send(res, 400, { error: "price 1..200" });
      acc.price = Math.round(price * 100) / 100; saveDb(); return send(res, 200, view(u));
    }
    if (url.pathname === "/api/account/delete" && req.method === "POST") {   // remove one TikTok account and its stored data
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), acc = findAcc(u, b.id); if (!acc) return send(res, 404, { error: "no such account" });
      u.accounts = u.accounts.filter(x => x !== acc); delete db.byOpen[acc.open_id]; saveDb();
      return send(res, 200, view(u));
    }
    if (url.pathname === "/api/admin/applicants" && req.method === "GET") {   // owner screen: take or don't take
      if (req.headers.authorization !== "Bearer " + ADMIN_TOKEN) return send(res, 401, { error: "unauthorized" });
      return send(res, 200, Object.values(db.users).flatMap(u => u.accounts || []).map(accView));
    }
    /* static site */
    const file = path.join(__dirname, "public", url.pathname === "/" ? "index.html" : url.pathname);
    if (file.startsWith(path.join(__dirname, "public")) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".txt": "text/plain; charset=utf-8" };
      res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
      return fs.createReadStream(file).pipe(res);
    }
    send(res, 404, { error: "not found" });
  } catch (e) { console.error(e); send(res, 500, { error: "server error" }); }
});
server.listen(PORT, () => console.log("Promo Campaign on " + PUBLIC_URL));

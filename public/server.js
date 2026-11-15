/* Promo Campaign backend: real TikTok login + video analysis. No dependencies, Node 18+.
   Run: TIKTOK_CLIENT_KEY=... TIKTOK_CLIENT_SECRET=... PUBLIC_URL=https://your-domain ADMIN_TOKEN=... node server.js */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PC = require("./analysis.js");
const ICON_PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAYFBMVEX/W4AAAAAOECD/W4D0WHv/WIP/W4D/W4D/WoD/W4AtGSz/W4CROFTOTGy1RGJMIzn/YYb/RIb/W39pLER7MUuqQV7/AP+jPlv/Var/gID/W3/cUHFeKED/WX8AAAAAAADJwXu5AAAAIHRSTlP+AP/R+xJNrTCM/23/////CgV4////Af8DAtr//zwAABiOCAcAAAW0SURBVHja5Z3tVqs8EIU35IsQoKWt1arv/d/my7EeWz0tBWZCMsv926XzmNn5Ismg4JepbPDeOaWUBvSrUs55H2xlIvwxsEY+BO4URqTcAGKyBDDWj4b+DcPzQWDt4LkhwBC9w0I5BgYiwMk6DYK0s6eEAJUHg3yVBsAEBSapnVkdwASwKphVAYzXYJZeiIA8wv9A8GYVgN4jmnwfH8AqRJSykQGMQ2Q5ExGg32EFhT4WQNzsWZhHyCh7FuXRZIBKYUWpihsgYGUFVoA102dmGiG/9JmXRhMAjgGJFFgAjEcy+RMdwCgk1GMjIOv4ByMYGkCF5KooAJVOD6Cr5QAWWcguBcgk/nECZJ3/EwggIf4xJyNn/05xMjLt/yePB5AR/32C2wD9K7KT62cAeGQoPx3AIkvZqQAGmcpMAzi6XAHccRLADtlqNwWgQsaqHgPkNwJc67V/COCQtdwjAIvMZccB8k6gW1MKiOmB7vREkDGE3R/OIMnBt3wMUQ6+4WOIcvCnj093AHYQonAbwECMtjcBvByA3S2ALSCxCZDuKxiPC74AXiBKL/8ABFkA4SfAi5IFoH4CxBiE9Vv71DRP7ZuOOBz/BWBuAN1s6vJK9abRcZoA/Ath3R2+Bf8Fceg0//IY3IPY26Yc0fsb90bdJwDXXqjelw+017w5BM4M0odygg6aM4fAl0G6KSeKx9D+AtCzxF+Xk1WzEPRfAByDQDsj/oGg5RoKwLQU7sqZ6pgWxx8A9N/1VM7WM/2vHj8BqvXs+83KLP0QOCaiXblITxxTUjBYoC0XqmUwAegW0PVSAHJvevwAIFpAb8rF2miyCUAehgnxDzMjsglAXQp0JUkd1QQg7mctNwCLDY4DAG0e8VwS9Uw0ARGA2gDUJrADAMnDTUlWQ5tSgzSM0RuA2ARuAKB0QoeyTNsEagCg/ANqDoCakgIFTIpJEN+UaAub1sLUHKoQUs0irmZElMkECL2oLplEsKGHS55BpBxyFIANF8AmEUDNBVBTAFR6C1BMoH4zQMsH0BIAkq3FuMZinW4tw7hDlHYY4Nik+5UAT9JTqM3DxPi93WgmAxlBfACUuRCkT+YI2nMB7BMBPGfQi5K25fJYUkL2ot7mMJmgbatA+sYWEu/t0rYWQfxCydKRHmibu8mbgLq9nnxN0NAOUSN1E5A/MRGV/iNf4iYgfmZlOCqU/EM3We+pZhGfRw2QMok4DnukJCAft2E5Lpf6wFPCHaKO5cgZiw5rz4GuDv0l26VjODha8AHMPLjLc3TXcQLMPDq30WxHj/kIZiwO9oyHvxnVTUyjugPj8XuwXv2ZEn7DewGCV4/vcHDd38BrEQNgQHhf5QbN5RIQv3S3v30Nax/lGlYU6bapf2Z+q+NchIsn3bZdM6hrWx3xKqJQqb/3caFkAlyu4woFuFyIdrIbQCrA1aMAXmL8V0/OwUoEuHrgBpXsBiiwlRf/t0eeIHAo+/E8j7hu6OcDSUGwgz8ApLn4n0fCjoIdfL5L6eQ6+Axg5Tr4DGAEJxDPfWKkfq7TQuLzZlcAvVgDMD7LkOztbGT/Su2DF+Qh55HIMPJwthVqgMv7QvnvTbiXUQAr0sARHwlbrxwNJDyXPVbKBSLeuqwmFBExgqbQt5+sDSLjvwLI9tX+yaWMjMT4vz0anONg8LCuHfKuHaLmFVTbKnHx5/32ut/OLipYiek+8y+gsLSwZi4E4bi0tGkQ0XuO1aGxYtLnXikjq6X8++8Vk0rbF3GUuE5YSoGpyHiqirKzsme8qGASK4dTwVenfvWqytqbomAEWKkq/Zd2S8J/UJt1xdLcYVsU/ACDE1bJI2WXhv+4wPJLfARfFQRNKDIeFcHbU1FEBiiK/yJ5wRFSZxbAsNgM3M2gvDUFgzD5J01wuQU/D+BPO1ivyLEHvuBnA5xHaBu8U2oWyfDjyvlQsYZ+1v8FbFZhYHUnnQAAAABJRU5ErkJggg==", "base64");
const SW_JS = "self.addEventListener('install',e=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));" +
  "self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){d={title:'Promo Campaign',body:e.data?e.data.text():''}}" +
  "e.waitUntil(Promise.all([self.registration.showNotification(d.title||'Promo Campaign',{body:d.body||'',data:{url:d.url||'/'},icon:'/icon.png',badge:'/icon.png'}),self.clients.matchAll({type:'window'}).then(cs=>cs.forEach(c=>c.postMessage({push:1,title:d.title,body:d.body})))]))});" +
  "self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(cs=>{for(const c of cs){if('focus' in c)return c.focus()}return self.clients.openWindow(e.notification.data&&e.notification.data.url||'/')}))});";
const https = require("https");
// Phone alerts for the owner through a Telegram bot (optional: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID)
function notify(text) {
  try {
    const tk = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID; if (!tk || !chat) return;
    const body = JSON.stringify({ chat_id: chat, text: "Promo Campaign: " + text, disable_web_page_preview: true });
    const q = https.request({ hostname: "api.telegram.org", path: "/bot" + tk + "/sendMessage", method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } }, x => x.resume());
    q.on("error", () => {}); q.setTimeout(8000, () => q.destroy()); q.end(body);
  } catch (e) {}
}
/* ---- Web Push (no dependencies): VAPID + RFC 8291 payload encryption ---- */
const b64u = b => Buffer.from(b).toString("base64url");
function vapid() {
  if (!db.settings.vapid) {
    const kp = crypto.generateKeyPairSync("ec", { namedCurve: "prime256v1" }), j = kp.publicKey.export({ format: "jwk" }), d = kp.privateKey.export({ format: "jwk" });
    db.settings.vapid = { pub: b64u(Buffer.concat([Buffer.from([4]), Buffer.from(j.x, "base64url"), Buffer.from(j.y, "base64url")])), jwk: d }; saveDb();
  }
  return db.settings.vapid;
}
function pushEncrypt(sub, text) {
  const cPub = Buffer.from(sub.keys.p256dh, "base64url"), auth = Buffer.from(sub.keys.auth, "base64url");
  const ecdh = crypto.createECDH("prime256v1"); ecdh.generateKeys(); const sPub = ecdh.getPublicKey(), shared = ecdh.computeSecret(cPub), salt = crypto.randomBytes(16);
  const hk = (s, ikm, info, n) => Buffer.from(crypto.hkdfSync("sha256", ikm, s, info, n));
  const prk = hk(auth, shared, Buffer.concat([Buffer.from("WebPush: info\0"), cPub, sPub]), 32);
  const cek = hk(salt, prk, Buffer.from("Content-Encoding: aes128gcm\0"), 16), nonce = hk(salt, prk, Buffer.from("Content-Encoding: nonce\0"), 12);
  const c = crypto.createCipheriv("aes-128-gcm", cek, nonce), ct = Buffer.concat([c.update(Buffer.concat([Buffer.from(text), Buffer.from([2])])), c.final(), c.getAuthTag()]);
  const rs = Buffer.alloc(4); rs.writeUInt32BE(4096);
  return Buffer.concat([salt, rs, Buffer.from([sPub.length]), sPub, ct]);
}
function pushSend(sub, payload) {
  return new Promise(resolve => {
    try {
      const u = new URL(sub.endpoint), V = vapid();
      const head = b64u(JSON.stringify({ typ: "JWT", alg: "ES256" })), body = b64u(JSON.stringify({ aud: u.origin, exp: Math.floor(Date.now() / 1000) + 43200, sub: "mailto:admin@promo.local" }));
      const sig = crypto.sign("sha256", Buffer.from(head + "." + body), { key: crypto.createPrivateKey({ key: V.jwk, format: "jwk" }), dsaEncoding: "ieee-p1363" });
      const data = pushEncrypt(sub, JSON.stringify(payload));
      const q = https.request({ hostname: u.hostname, path: u.pathname + u.search, method: "POST", headers: { Authorization: "vapid t=" + head + "." + body + "." + b64u(sig) + ", k=" + V.pub, "Content-Encoding": "aes128gcm", "Content-Type": "application/octet-stream", "Content-Length": data.length, TTL: "86400" } }, x => { x.resume(); resolve(x.statusCode); });
      q.on("error", () => resolve(0)); q.setTimeout(10000, () => { q.destroy(); resolve(0); }); q.end(data);
    } catch (e) { resolve(0); }
  });
}
async function broadcast(audience, title, text, url) {
  db.settings.inbox = (db.settings.inbox || []).concat([{ id: uid8(), at: Date.now(), audience, title, text, url: url || "/" }]).slice(-30);
  const subs = db.settings.push || {}; let sent = 0;
  for (const [k, s] of Object.entries(subs)) {
    if (audience !== "all" && s.role !== audience) continue;
    const code = await pushSend(s.sub, { title, body: text, url: url || "/" });
    if (code === 404 || code === 410) delete subs[k]; else if (code >= 200 && code < 300) sent++;
  }
  saveDb(); return sent;
}
function classifyLink(u) {
  const h = (u.match(/^https?:\/\/([^\/?#]+)/i) || [, ""])[1].toLowerCase();
  if (/spotify\.com$|spotify\.link$/.test(h)) return "spotify";
  if (/soundcloud\.com$|snd\.sc$/.test(h)) return "soundcloud";
  if (/tiktok\.com$/.test(h)) return "tiktok";
  return "mp3";
}

const PORT = process.env.PORT || 3000;
const KEY = process.env.TIKTOK_CLIENT_KEY;
const SECRET = process.env.TIKTOK_CLIENT_SECRET;
const PUBLIC_URL = (process.env.PUBLIC_URL || "http://localhost:" + PORT).replace(/\/$/, "");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const REDIRECT = PUBLIC_URL + "/auth/tiktok/callback";
const SCOPES = "user.info.basic,user.info.profile,user.info.stats,video.list";
const DB_FILE = path.join(__dirname, "data.json");
const SB_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const HISTORY_DAYS = 200;           // how far back we load videos
const MAX_PAGES = 15;               // 20 videos per page
const REFRESH_EVERY = 30 * 60000;   // background refresh of views
const CATEGORIES = ["movies", "sports", "anime", "gym", "cars", "lyrics", "visual", "gaming", "cartoons", "celeb", "memes", "dancing", "kpop", "kdrama", "motivation", "irl", "beauty", "nature", "other"];

if (!KEY || !SECRET || !ADMIN_TOKEN) { console.error("Set TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET and ADMIN_TOKEN"); process.exit(1); }

/* All data lives in one object. With SUPABASE_URL + SUPABASE_SERVICE_KEY it is saved to the Supabase table `kv` (row key "db"),
   otherwise to data.json (lost on free hosting restarts). */
let db = {};
function normDb() {
  for (const k of ["users", "sessions", "byOpen", "producers", "psessions", "tracks", "requests", "topups", "admin", "snapshots", "settings"]) if (!db[k]) db[k] = {};
}
function sbHeaders(extra) {
  const h = Object.assign({ apikey: SB_KEY, "Content-Type": "application/json" }, extra || {});
  if (SB_KEY.startsWith("eyJ")) h.Authorization = "Bearer " + SB_KEY;      // legacy JWT keys need it, new secret keys do not
  return h;
}
async function loadDb() {
  if (SB_URL && SB_KEY) {
    const r = await fetch(SB_URL + "/rest/v1/kv?key=eq.db&select=value", { headers: sbHeaders() });
    if (!r.ok) throw new Error("supabase load " + r.status + " " + (await r.text()));
    const rows = await r.json();
    if (rows.length) db = rows[0].value;
    console.log("Storage: Supabase" + (rows.length ? " (loaded)" : " (empty, new)"));
  } else {
    try { db = JSON.parse(fs.readFileSync(DB_FILE, "utf8")); } catch (e) {}
    console.log("Storage: local file data.json (set SUPABASE_URL and SUPABASE_SERVICE_KEY for permanent storage)");
  }
  normDb();
}
/* payment screenshots live in their own rows so the main database stays small */
async function putProof(id, img) {
  if (SB_URL && SB_KEY) { const r = await fetch(SB_URL + "/rest/v1/kv?on_conflict=key", { method: "POST", headers: sbHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }), body: JSON.stringify({ key: "proof:" + id, value: { img }, updated_at: new Date().toISOString() }) }); if (!r.ok) throw new Error("proof save " + r.status); }
  else { fs.mkdirSync(path.join(__dirname, "proofs"), { recursive: true }); fs.writeFileSync(path.join(__dirname, "proofs", id + ".json"), JSON.stringify({ img }), { mode: 0o600 }); }
}
async function getProof(id) {
  if (SB_URL && SB_KEY) { const r = await fetch(SB_URL + "/rest/v1/kv?key=eq.proof:" + encodeURIComponent(id) + "&select=value", { headers: sbHeaders() }); if (!r.ok) return null; const rows = await r.json(); return rows.length ? rows[0].value.img : null; }
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, "proofs", id + ".json"), "utf8")).img; } catch (e) { return null; }
}
/* mp3 files: split into chunks of 600 KB so every database request stays small */
const CH = 600000;
async function putBlob(id, b64) {
  if (SB_URL && SB_KEY) {
    for (let i = 0, k = 0; i < b64.length; i += CH, k++) {
      const r = await fetch(SB_URL + "/rest/v1/kv?on_conflict=key", { method: "POST", headers: sbHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }), body: JSON.stringify({ key: "blob:" + id + ":" + String(k).padStart(4, "0"), value: { d: b64.slice(i, i + CH) }, updated_at: new Date().toISOString() }) });
      if (!r.ok) throw new Error("blob save " + r.status);
    }
  } else { fs.mkdirSync(path.join(__dirname, "blobs"), { recursive: true }); fs.writeFileSync(path.join(__dirname, "blobs", id + ".b64"), b64, { mode: 0o600 }); }
}
async function getBlob(id) {
  if (SB_URL && SB_KEY) {
    const r = await fetch(SB_URL + "/rest/v1/kv?key=like.blob:" + encodeURIComponent(id) + ":*&select=key,value&order=key.asc", { headers: sbHeaders() });
    if (!r.ok) return null; const rows = await r.json(); return rows.length ? rows.map(x => x.value.d).join("") : null;
  }
  try { return fs.readFileSync(path.join(__dirname, "blobs", id + ".b64"), "utf8"); } catch (e) { return null; }
}
function readRaw(req, max) { return new Promise((ok, fail) => { const ch = []; let n = 0; req.on("data", c => { n += c.length; if (n > max) { req.destroy(); return; } ch.push(c); }); req.on("end", () => ok(Buffer.concat(ch))); req.on("error", fail); }); }
let saveTimer = null, saving = false, dirty = false;
function saveDb() { dirty = true; if (!saveTimer) saveTimer = setTimeout(flushDb, 400); }
async function flushDb() {
  saveTimer = null;
  if (saving) { saveTimer = setTimeout(flushDb, 400); return; }
  if (!dirty) return;
  dirty = false; saving = true;
  try {
    if (SB_URL && SB_KEY) {
      const r = await fetch(SB_URL + "/rest/v1/kv?on_conflict=key", { method: "POST", headers: sbHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }),
        body: JSON.stringify({ key: "db", value: db, updated_at: new Date().toISOString() }) });
      if (!r.ok) throw new Error("supabase save " + r.status + " " + (await r.text()));
    } else fs.writeFileSync(DB_FILE, JSON.stringify(db), { mode: 0o600 });
  } catch (e) { console.error(e); dirty = true; }
  saving = false;
}
process.on("SIGTERM", async () => { try { dirty = true; await flushDb(); } finally { process.exit(0); } });

const pending = new Map();           // oauth state -> {exp, handle, uid}
const loginTries = new Map();        // ip -> [timestamps], simple brute-force limit
const sha = x => crypto.createHash("sha256").update(String(x)).digest();
function clientIp(req) { return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim(); }
function tooMany(ip, max) { const now = Date.now(), a = (loginTries.get(ip) || []).filter(t => now - t < 10 * 60000); loginTries.set(ip, a); return a.length >= (max || 8); }
function failTry(ip) { if (!loginTries.has(ip)) loginTries.set(ip, []); loginTries.get(ip).push(Date.now()); }
function newSid() { return crypto.randomBytes(24).toString("hex"); }
function setCookie(name, val, maxAge, strict) { return name + "=" + val + "; HttpOnly; Secure; SameSite=" + (strict ? "Strict" : "Lax") + "; Path=/; Max-Age=" + maxAge; }
function adminOk(req) {
  if (req.headers.authorization === "Bearer " + ADMIN_TOKEN) return true;
  const c = cookie(req, "adm"), exp = c && db.admin[c];
  if (exp && exp > Date.now()) return true;
  if (c && db.admin[c]) { delete db.admin[c]; saveDb(); }
  return false;
}
function hashPw(pw, salt) { return crypto.scryptSync(String(pw), salt, 32).toString("hex"); }
function producerOf(req) {
  const c = cookie(req, "psid"), s = c && db.psessions[c];
  if (!s || s.exp < Date.now()) return null;
  return db.producers[s.pid] || null;
}
const uid8 = () => crypto.randomBytes(6).toString("hex");

function send(res, code, body, headers) {
  res.writeHead(code, Object.assign({ "Content-Type": "application/json; charset=utf-8" }, headers || {}));
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}
function readBody(req, max) {
  return new Promise((ok, fail) => {
    let s = ""; req.on("data", c => { s += c; if (s.length > (max || 1e5)) req.destroy(); });
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
async function refreshAnalysis(acc) {
  const token = await freshToken(acc);
  acc.profile = await fetchProfile(token);
  acc.videos = await fetchVideos(token);
  acc.analysisAt = Date.now();
  const A = PC.analyze(acc.videos, Date.now());
  const snaps = db.snapshots[acc.open_id] || (db.snapshots[acc.open_id] = []);
  snaps.push({ t: Date.now(), total: A.total.views, v30: A.month.views, n30: A.month.videos });
  if (snaps.length > 500) snaps.splice(0, snaps.length - 500);
  saveDb();
}
const allAccounts = () => Object.values(db.users).flatMap(u => (u.accounts || []).map(a => { a._uid = u.id; return a; }));
function findAccAny(openId) { return allAccounts().find(a => a.open_id === openId) || null; }

/* ---- rating: stars 1..5 shown only to the owner. Manual stars override the automatic ones ---- */
function autoStars(acc) {
  const A = PC.analyze(acc.videos || [], Date.now());
  if (!A.accepted) return { stars: null, cpm: null };
  const cpm = acc.price && A.refAvg ? acc.price / A.refAvg * 1000 : null;
  let st = cpm === null ? 3 : Math.max(1, Math.min(5, 5 - (cpm - 0.02) / 0.03));
  if (A.status === "dormant") st -= 1;
  if (A.status === "active" && A.week.videos === 0) st -= 0.5;
  const mine = Object.values(db.requests).filter(r => r.openId === acc.open_id);
  const done = mine.filter(r => r.status === "completed").length, bad = mine.filter(r => r.status === "returned").length;
  if (done + bad > 0) { const q = done / (done + bad); st += q >= 0.9 ? 0.5 : (q < 0.5 ? -1 : 0); }
  return { stars: Math.round(Math.max(1, Math.min(5, st)) * 2) / 2, cpm };
}
function accView(acc) {
  const A = PC.analyze(acc.videos || [], Date.now());
  return { id: acc.open_id, handle: "@" + (acc.profile && acc.profile.username || ""), name: acc.profile && acc.profile.display_name,
    internalName: acc.internal_name || "", about: acc.about || "", categories: acc.categories || [], otherCategory: acc.other_category || "", discount: acc.discount || 0,
    analysis: A, price: acc.price || null, evaluation: PC.evaluate(A, acc.price), adminStatus: acc.adminStatus || "new", recommended: PC.recommend(A), analysisAt: acc.analysisAt,
    videos: (acc.videos || []).slice(0, 150).map(v => ({ id: v.id, created: v.created, views: v.views, likes: v.likes || 0, url: v.url })) };
}
function view(user) { return { accounts: (user.accounts || []).map(accView), categories: CATEGORIES, payout: payoutLabel(user), coins: COINS }; }
function accAdminView(acc) {
  const v = accView(acc), r = autoStars(acc);
  v.stars = { auto: r.stars, manual: acc.rating_manual == null ? null : acc.rating_manual, final: acc.rating_manual != null ? acc.rating_manual : r.stars };
  v.cpm = r.cpm;
  v.videos = v.videos.slice(0, 40);
  return v;
}
const FEE = 0.2;   // site commission, taken from every confirmed payment
const METHODS = ["paypal", "usdt", "card", "crypto"];
const COINS = ["solana", "tron", "ethereum", "litecoin", "ton"];
const PLATFORMS = ["tiktok", "instagram", "youtube"];
function payInfo() { const x = db.settings.pay || {}, c = x.crypto || {}; const o = { paypal: x.paypal || "", card: x.card || "", cardHolder: x.cardHolder || "", crypto: {} }; for (const k of COINS) o.crypto[k] = c[k] || ""; return o; }
const PKEY = () => crypto.scryptSync(ADMIN_TOKEN, "pc-payout-v1", 32);
function encObj(o) { const iv = crypto.randomBytes(12), c = crypto.createCipheriv("aes-256-gcm", PKEY(), iv), ct = Buffer.concat([c.update(JSON.stringify(o), "utf8"), c.final()]); return [iv, c.getAuthTag(), ct].map(x => x.toString("base64")).join("."); }
function decObj(str) { try { const [iv, tag, ct] = String(str).split(".").map(x => Buffer.from(x, "base64")), d = crypto.createDecipheriv("aes-256-gcm", PKEY(), iv); d.setAuthTag(tag); return JSON.parse(Buffer.concat([d.update(ct), d.final()]).toString("utf8")); } catch (e) { return null; } }
function maskVal(m, v) { v = String(v); return m === "card" ? "•••• " + v.replace(/\D/g, "").slice(-4) : (m === "paypal" ? v.replace(/^(.{2}).*(@.*)$/, "$1•••$2") : v.slice(0, 4) + "…" + v.slice(-4)); }
function payoutLabel(u) { return u.payout ? { set: true, method: u.payout.method, coin: u.payout.coin || "", label: u.payout.label } : { set: false }; }
const trackLeft = t => Math.max(0, Math.round(((t.budget || 0) - (t.spent || 0)) * 100) / 100);
function cleanCats(list) { return Array.isArray(list) ? CATEGORIES.filter(c => list.includes(c)) : []; }
function reqCost(r) { return Math.round(r.price * r.videos * (1 - (r.discount || 0) / 100) * 100) / 100; }
function videoIdOf(link) { const m = String(link || "").match(/tiktok\.com\/@([A-Za-z0-9._]{2,24})\/video\/(\d{8,25})/i); return m ? { user: m[1].toLowerCase(), id: m[2] } : null; }
function reqView(r, withAdmin) {
  const t = db.tracks[r.trackId] || {}, acc = findAccAny(r.openId);
  const links = (r.links || []).map(l => { const p = videoIdOf(l), v = p && acc && (acc.videos || []).find(x => x.id === p.id); return { url: l, views: v ? v.views : null }; });
  const o = { id: r.id, trackId: r.trackId, track: t.title || "(deleted)", artist: t.artist || "", openId: r.openId, handle: acc ? "@" + (acc.profile && acc.profile.username || "") : "",
    internalName: acc ? acc.internal_name || "" : "", price: r.price, videos: r.videos, discount: r.discount || 0, priority: r.priority || 0, cost: reqCost(r), status: r.status, links, created: r.created, completedAt: r.completedAt || 0, paid: !!r.paid, paidAt: r.paidAt || 0, eta: r.eta || "", hasProof: !!r.proof, approvedAt: r.approvedAt || 0,
    overdue: ["approved", "returned"].includes(r.status) && !!r.approvedAt && Date.now() - r.approvedAt > 16 * 86400000 };
  if (withAdmin) { const ou = Object.values(db.users).find(x => (x.accounts || []).some(a => a.open_id === r.openId)); if (ou && ou.payout) o.payout = decObj(ou.payout.enc); }
  if (withAdmin && acc) { const st = autoStars(acc); o.stars = acc.rating_manual != null ? acc.rating_manual : st.stars; o.categories = acc.categories || []; }
  return o;
}
async function refreshStale(max) {
  let n = 0;
  for (const a of allAccounts()) {
    if (n >= max) break;
    if (!a.refresh_token || (a.analysisAt && Date.now() - a.analysisAt < REFRESH_EVERY - 60000)) continue;
    n++; try { await refreshAnalysis(a); } catch (e) { console.error("refresh", a.open_id, String(e.message).slice(0, 200)); a.analysisAt = Date.now(); }
  }
}
function overview() {
  const accs = allAccounts(), reqs = Object.values(db.requests);
  const live = reqs.filter(r => ["approved", "submitted", "completed"].includes(r.status));
  const now = Date.now(), D30 = 30 * 86400000;
  let views30 = 0; accs.forEach(a => { views30 += PC.analyze(a.videos || [], now).month.views; });
  const byTrack = {}; let purchasedViews = 0, boughtVideos = 0, matched = 0;
  live.forEach(r => {
    const acc = findAccAny(r.openId), bt = byTrack[r.trackId] || (byTrack[r.trackId] = { views: 0, videos: 0 });
    if (now - r.created <= D30) { boughtVideos += r.videos; bt.videos += r.videos; }
    (r.links || []).forEach(l => { const p = videoIdOf(l), v = p && acc && (acc.videos || []).find(x => x.id === p.id); if (v && now - v.created <= D30) { purchasedViews += v.views; bt.views += v.views; matched++; } });
  });
  const paidReqs = reqs.filter(r => r.paid), paidSum = list => Math.round(list.reduce((x, r) => x + reqCost(r), 0) * 100) / 100;
  const okTopups = Object.values(db.topups).filter(t => !t.demo).filter(t => t.status === "confirmed"), topSum = list => Math.round(list.reduce((x, t) => x + t.amount, 0) * 100) / 100;
  return {
    stats: { accounts: accs.length, boughtVideos, purchasedViews, purchasedLinksCounted: matched, views30, byTrack,
      editorsPaidTotal: paidSum(paidReqs), editorsPaid30: paidSum(paidReqs.filter(r => now - (r.paidAt || 0) <= D30)), producersPaidTotal: topSum(okTopups), producersPaid30: topSum(okTopups.filter(t => now - (t.confirmedAt || t.created) <= D30)),
      pendingPayouts: reqs.filter(r => r.status === "completed" && !r.paid).length,
      pendingRequests: reqs.filter(r => r.status === "pending").length, pendingTopups: Object.values(db.topups).filter(t => t.status === "pending").length,
      refreshedAt: Math.max(0, ...accs.map(a => a.analysisAt || 0)) },
    requests: reqs.sort((x, y) => (y.priority || 0) - (x.priority || 0) || x.created - y.created).map(r => reqView(r, true)),
    tracks: Object.values(db.tracks).map(t => ({ message: t.message || "", id: t.id, title: t.title, artist: t.artist, link: t.link, producer: (db.producers[t.producerId] || {}).email, budget: t.budget, spent: t.spent, left: trackLeft(t), categories: t.categories, otherCategory: t.otherCategory || "", links: t.links || {}, platforms: t.platforms || ["tiktok"], descRule: !!t.descRule, hasMp3: !!t.mp3, producerName: (db.producers[t.producerId] || {}).name || "", pending: Object.values(db.topups).filter(x => x.trackId === t.id && x.status === "pending").length, status: t.status })),
    topups: Object.values(db.topups).filter(x => !x.demo).sort((x, y) => y.created - x.created).map(p => ({ id: p.id, producer: (db.producers[p.producerId] || {}).email, producerName: (db.producers[p.producerId] || {}).name, message: (db.tracks[p.trackId] || {}).message || "", track: (db.tracks[p.trackId] || {}).title, amount: p.amount, fee: p.fee || 0, hasProof: !!p.proof, method: p.method, coin: p.coin || "", status: p.status, created: p.created })),
    producers: Object.values(db.producers).sort((x, y) => y.created - x.created).map(p => { const ts = Object.values(db.tracks).filter(t => t.producerId === p.id && t.status !== "deleted");
      return { id: p.id, name: p.name || "", email: p.email, created: p.created, tracks: ts.map(t => ({ title: t.title, status: t.status, budget: t.budget, left: trackLeft(t) })),
        paid: Math.round(Object.values(db.topups).filter(x => x.producerId === p.id && x.status === "confirmed").reduce((q, x) => q + x.amount, 0) * 100) / 100 }; }),
    accounts: accs.map(accAdminView), categories: CATEGORIES
  };
}

/* ---- routes ---- */
const need = (res, cond, code, msg) => { if (!cond) { send(res, code, { error: msg }); return false; } return true; };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, PUBLIC_URL);
  const P = url.pathname, M = req.method;
  try {
    if (P === "/auth/tiktok") {                       // "Open in TikTok" button points here
      const state = crypto.randomBytes(16).toString("hex");
      const cu = sessionUser(req);
      pending.set(state, { exp: Date.now() + 10 * 60000, handle: (url.searchParams.get("u") || "").toLowerCase().replace(/^@/, ""), uid: cu ? cu.id : null });
      const q = new URLSearchParams({ client_key: KEY, scope: SCOPES, response_type: "code", redirect_uri: REDIRECT, state });
      res.writeHead(302, { Location: "https://www.tiktok.com/v2/auth/authorize/?" + q }); return res.end();
    }
    if (P === "/auth/tiktok/callback") {
      const state = url.searchParams.get("state"), code = url.searchParams.get("code");
      if (url.searchParams.get("error")) { res.writeHead(302, { Location: "/#signup?denied=1" }); return res.end(); }
      if (!code || !pending.has(state) || pending.get(state).exp < Date.now()) return send(res, 400, { error: "bad state" });
      const want = pending.get(state).handle, uid0 = pending.get(state).uid;
      pending.delete(state);
      const tok = await tokenRequest({ code, grant_type: "authorization_code", redirect_uri: REDIRECT });
      const owner = db.byOpen[tok.open_id];
      if (owner && uid0 && owner !== uid0) { res.writeHead(302, { Location: "/#signup?taken=1" }); return res.end(); }
      const uid = uid0 || owner || crypto.randomBytes(12).toString("hex");
      const user = db.users[uid] || (db.users[uid] = { id: uid, createdAt: Date.now(), accounts: [] });
      let acc = findAcc(user, tok.open_id);
      const isNew = !acc;
      if (!acc) { acc = { open_id: tok.open_id, createdAt: Date.now(), categories: [], discount: 0 }; user.accounts.push(acc); notify("new editor account connected, check Waiting for your decision"); }
      Object.assign(acc, { access_token: tok.access_token, refresh_token: tok.refresh_token, expires_at: Date.now() + tok.expires_in * 1000 });
      await refreshAnalysis(acc);
      if (want && (acc.profile.username || "").toLowerCase() !== want) {
        user.accounts = user.accounts.filter(x => x !== acc); saveDb();
        res.writeHead(302, { Location: "/#signup?mismatch=1" }); return res.end();
      }
      db.byOpen[tok.open_id] = uid;
      const headers = { Location: isNew ? "/#analysis" : "/#dashboard" };
      if (!uid0) { const sid = newSid(); db.sessions[sid] = uid; headers["Set-Cookie"] = setCookie("sid", sid, 2592000); }
      saveDb();
      res.writeHead(302, headers);
      return res.end();
    }

    /* ----- editor (creator) ----- */
    if (P === "/health" && M === "GET") return send(res, 200, { ok: true, storage: SB_URL && SB_KEY ? "supabase" : "local file (data is lost on restart)", tiktokKey: KEY ? "set" : "missing", adminPassword: ADMIN_TOKEN ? "set" : "missing", time: new Date().toISOString() });
    if (P === "/api/track/mp3" && M === "GET") {
      const t = db.tracks[url.searchParams.get("id") || ""], prod = producerOf(req);
      const allowed = t && t.mp3 && (adminOk(req) || (prod && prod.id === t.producerId) || (sessionUser(req) && t.status === "active"));
      if (!need(res, allowed, 404, "no file")) return;
      const b64 = await getBlob("m" + t.id); if (!need(res, b64, 404, "no file")) return;
      const buf = Buffer.from(b64, "base64"), name = String(t.title || "track").replace(/[^\w\- ]+/g, "").trim().slice(0, 60) || "track";
      res.writeHead(200, { "Content-Type": "audio/mpeg", "Content-Length": buf.length, "Content-Disposition": 'attachment; filename="' + name + '.mp3"', "Cache-Control": "private, no-store" }); return res.end(buf);
    }
    if (P === "/api/me" && M === "GET") {
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      return send(res, 200, view(u));
    }
    if (P === "/api/payout" && M === "GET") { const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" }); return send(res, 200, payoutLabel(u)); }
    if (P === "/api/payout" && M === "POST") {
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), m = b.method, v = String(b.value || "").trim(), h = String(b.holder || "").trim().slice(0, 60), coin = b.coin;
      let ok = false;
      if (m === "paypal") ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 120;
      else if (m === "crypto") ok = COINS.includes(coin) && /^[A-Za-z0-9]{20,100}$/.test(v);
      else if (m === "card") ok = /^\d{12,19}$/.test(v.replace(/\s/g, "")) && h.length >= 2;
      if (!need(res, ok, 400, "check the payment details")) return;
      const val = m === "card" ? v.replace(/\s/g, "") : v;
      u.payout = { method: m, coin: m === "crypto" ? coin : "", label: maskVal(m, val), enc: encObj({ method: m, coin: m === "crypto" ? coin : "", value: val, holder: m === "card" ? h : "" }) };
      saveDb(); return send(res, 200, payoutLabel(u));
    }
    if (P === "/api/reanalyze" && M === "POST") {
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), acc = findAcc(u, b.id); if (!acc) return send(res, 404, { error: "no such account" });
      await refreshAnalysis(acc); return send(res, 200, view(u));
    }
    if (P === "/api/price" && M === "POST") {
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), price = Number(b.price), acc = findAcc(u, b.id);
      if (!acc) return send(res, 404, { error: "no such account" });
      if (!(price >= 1 && price <= 200)) return send(res, 400, { error: "price 1..200" });
      acc.price = Math.round(price * 100) / 100; saveDb(); return send(res, 200, view(u));
    }
    if (P === "/api/account/update" && M === "POST") {   // internal name, categories, bulk discount (one account or all)
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), acc = findAcc(u, b.id); if (!acc) return send(res, 404, { error: "no such account" });
      if (b.internalName !== undefined) acc.internal_name = String(b.internalName).slice(0, 60);
      if (b.categories !== undefined) acc.categories = cleanCats(b.categories);
      if (b.otherCategory !== undefined) acc.other_category = String(b.otherCategory).slice(0, 60);
      if (b.about !== undefined) acc.about = String(b.about).trim().slice(0, 600);
      if (b.discount !== undefined) {
        const d = Math.round(Number(b.discount) || 0);
        if (d < 0 || d > 99) return send(res, 400, { error: "discount 0..99" });
        (b.discountAll ? u.accounts : [acc]).forEach(a => { a.discount = d; });
      }
      saveDb(); return send(res, 200, view(u));
    }
    if (P === "/api/account/delete" && M === "POST") {
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), acc = findAcc(u, b.id); if (!acc) return send(res, 404, { error: "no such account" });
      u.accounts = u.accounts.filter(x => x !== acc); delete db.byOpen[acc.open_id];
      Object.values(db.requests).forEach(r => { if (r.openId === acc.open_id && r.status === "pending") r.status = "cancelled"; });
      saveDb(); return send(res, 200, view(u));
    }
    if ((P === "/icon.png" || P === "/favicon.ico") && M === "GET") { res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" }); return res.end(ICON_PNG); }
    if (P === "/sw.js" && M === "GET") { res.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-cache" }); return res.end(SW_JS); }
    if (P === "/api/push/key" && M === "GET") return send(res, 200, { key: vapid().pub });
    if (P === "/api/push/subscribe" && M === "POST") {
      const b = await readBody(req), sub = b.sub; if (!need(res, sub && /^https:\/\//.test(sub.endpoint || "") && sub.keys && sub.keys.p256dh && sub.keys.auth, 400, "bad subscription")) return;
      const role = adminOk(req) ? "owner" : producerOf(req) ? "producers" : (sessionUser(req) ? "editors" : (b.role === "producers" ? "producers" : "editors"));
      db.settings.push = db.settings.push || {}; db.settings.push[crypto.createHash("sha1").update(sub.endpoint).digest("hex")] = { sub: { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } }, role, at: Date.now() };
      saveDb(); return send(res, 200, { ok: true });
    }
    if (P === "/api/inbox" && M === "GET") {
      const since = Number(new URL(req.url, "http://x").searchParams.get("since")) || 0;
      return send(res, 200, { now: Date.now(), items: (db.settings.inbox || []).filter(x => x.at > since).slice(-5).map(x => ({ id: x.id, at: x.at, audience: x.audience, title: x.title, text: x.text, url: x.url })) });
    }
    if (P === "/api/contacts" && M === "GET") { const c = db.settings.contacts || {}; return send(res, 200, { telegram: c.telegram || "", discord: c.discord || "" }); }
    if (P === "/api/tracks" && M === "GET") {            // catalog for editors: tracks that still have budget
      const u = sessionUser(req);
      const list = Object.values(db.tracks).filter(t => t.status === "active" && (!t.demo || adminOk(req)) && trackLeft(t) > 0 && (t.platforms || ["tiktok"]).includes("tiktok")).map(t => ({ id: t.id, title: t.title, artist: t.artist, link: t.link, links: t.links || {}, descRule: !!t.descRule, hasMp3: !!t.mp3, producerName: (db.producers[t.producerId] || {}).name || "", platforms: t.platforms || ["tiktok"], categories: t.categories || [], otherCategory: t.otherCategory || "" }));
      return send(res, 200, { tracks: list, signedIn: !!u });
    }
    if (P === "/api/requests" && M === "GET") {          // editor's own requests
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const mine = new Set((u.accounts || []).map(a => a.open_id));
      return send(res, 200, { requests: Object.values(db.requests).filter(r => mine.has(r.openId)).sort((x, y) => y.created - x.created).map(r => reqView(r, false)) });
    }
    if (P === "/api/request" && M === "POST") {          // Send Request: choose accounts, only matching categories allowed
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), t = db.tracks[b.trackId];
      if (!need(res, t && t.status === "active" && trackLeft(t) > 0 && (t.platforms || ["tiktok"]).includes("tiktok"), 404, "track not available")) return;
      const ids = Array.isArray(b.accountIds) ? b.accountIds : [];
      if (!need(res, ids.length > 0 && ids.length <= 50, 400, "choose accounts")) return;
      if (!need(res, u.payout, 403, "add your payment details first (Dashboard → Payment)")) return;
      const videos = Math.max(1, Math.min(100, Math.round(Number(b.videos) || 1)));
      const out = [];
      for (const id of ids) {
        const acc = findAcc(u, id); if (!need(res, acc, 404, "no such account")) return;
        const A = PC.analyze(acc.videos || [], Date.now());
        if (!need(res, A.accepted && acc.price > 0, 400, "account is not ready: " + (acc.profile && acc.profile.username))) return;
        if (!need(res, acc.adminStatus === "approved", 403, "account is waiting for the manager's approval: " + (acc.profile && acc.profile.username))) return;
        const okCat = !(t.categories || []).length || (t.categories || []).some(c => (acc.categories || []).includes(c));
        if (!need(res, okCat, 400, "category does not match: " + (acc.profile && acc.profile.username))) return;
        if (Object.values(db.requests).some(r => r.trackId === t.id && r.openId === acc.open_id && ["pending", "approved", "submitted"].includes(r.status))) continue;
        const disc = b.discount !== undefined && b.discount !== "" ? Math.round(Number(b.discount)) : (acc.discount || 0);
        if (!need(res, disc >= 0 && disc <= 99, 400, "discount 0..99")) return;
        const r = { id: uid8(), trackId: t.id, openId: acc.open_id, price: acc.price, videos, discount: disc, priority: disc > 0 ? 5 : 0, status: "pending", links: [], created: Date.now(), updated: Date.now() };
        db.requests[r.id] = r; out.push(reqView(r, false));
      }
      saveDb(); notify(out.length + " new request(s) from an editor"); return send(res, 200, { requests: out });
    }
    if (P === "/api/request/proof" && M === "GET") {      // the editor sees the screenshot of the payment sent to them
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const r = db.requests[url.searchParams.get("id") || ""];
      if (!need(res, r && r.proof && (u.accounts || []).some(a => a.open_id === r.openId), 404, "no screenshot")) return;
      return send(res, 200, { image: await getProof(r.id) });
    }
    if (P === "/api/request/links" && M === "POST") {    // editor sends the video link(s); we check they belong to the connected account
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), r = db.requests[b.id];
      if (!need(res, r && findAcc(u, r.openId), 404, "no such request")) return;
      if (!need(res, r.status === "approved" || r.status === "returned", 409, "request is not waiting for a link")) return;
      const acc = findAcc(u, r.openId), me = (acc.profile && acc.profile.username || "").toLowerCase();
      const links = (Array.isArray(b.links) ? b.links : String(b.links || "").split(/\s+/)).map(x => String(x).trim()).filter(Boolean);
      if (!need(res, links.length >= 1 && links.length <= r.videos, 400, "send 1.." + r.videos + " links")) return;
      for (const l of links) { const p = videoIdOf(l); if (!need(res, p && p.user === me, 400, "link must be a tiktok.com/@" + me + "/video/... link")) return; }
      r.links = links; r.status = "submitted"; r.updated = Date.now(); saveDb(); notify("an editor sent video links to check");
      return send(res, 200, { request: reqView(r, false) });
    }

    /* ----- producer ----- */
    if (P === "/api/producer/register" && M === "POST") {
      const ip = clientIp(req); if (tooMany(ip)) return send(res, 429, { error: "too many attempts" });
      const b = await readBody(req), email = String(b.email || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || String(b.password || "").length < 8) { failTry(ip); return send(res, 400, { error: "valid email and password of 8+ characters required" }); }
      if (Object.values(db.producers).some(p => p.email === email)) { failTry(ip); return send(res, 409, { error: "email already registered" }); }
      const salt = crypto.randomBytes(16).toString("hex"), p = { id: uid8(), email, name: String(b.name || "").trim().slice(0, 60), salt, hash: hashPw(b.password, salt), created: Date.now() };
      db.producers[p.id] = p;
      const sid = newSid(); db.psessions[sid] = { pid: p.id, exp: Date.now() + 30 * 86400000 }; saveDb();
      return send(res, 200, { ok: true }, { "Set-Cookie": setCookie("psid", sid, 2592000) });
    }
    if (P === "/api/producer/login" && M === "POST") {
      const ip = clientIp(req); if (tooMany(ip)) return send(res, 429, { error: "too many attempts" });
      const b = await readBody(req), email = String(b.email || "").trim().toLowerCase(), p = Object.values(db.producers).find(x => x.email === email);
      const ok = p && crypto.timingSafeEqual(Buffer.from(hashPw(b.password || "", p.salt), "hex"), Buffer.from(p.hash, "hex"));
      if (!ok) { failTry(ip); return send(res, 401, { error: "wrong email or password" }); }
      const sid = newSid(); db.psessions[sid] = { pid: p.id, exp: Date.now() + 30 * 86400000 }; saveDb();
      return send(res, 200, { ok: true }, { "Set-Cookie": setCookie("psid", sid, 2592000) });
    }
    if (P === "/api/producer/logout" && M === "POST") {
      const c = cookie(req, "psid"); if (c) { delete db.psessions[c]; saveDb(); }
      return send(res, 200, { ok: true }, { "Set-Cookie": setCookie("psid", "", 0) });
    }
    if (P.startsWith("/api/producer/")) {
      const p = producerOf(req); if (!p) return send(res, 401, { error: "not signed in" });
      const mine = () => Object.values(db.tracks).filter(t => t.producerId === p.id && t.status !== "deleted");
      const pview = () => ({ email: p.email, name: p.name || "", fee: FEE, pay: payInfo(), categories: CATEGORIES, tracks: mine().map(t => ({ id: t.id, title: t.title, artist: t.artist, link: t.link, budget: t.budget, spent: t.spent, left: trackLeft(t), categories: t.categories, otherCategory: t.otherCategory || "", created: t.created, status: t.status, hasMp3: !!t.mp3, links: t.links || {}, platforms: t.platforms || ["tiktok"], descRule: !!t.descRule,
        topups: Object.values(db.topups).filter(x => x.trackId === t.id && x.status === "pending").map(x => ({ id: x.id, amount: x.amount, method: x.method, coin: x.coin || "", proof: !!x.proof })),
        pendingTopup: Object.values(db.topups).filter(x => x.trackId === t.id && x.status === "pending").reduce((s, x) => s + x.amount, 0) })) });
      if (P === "/api/producer/me" && M === "GET") return send(res, 200, pview());
      if (P === "/api/producer/mp3" && M === "POST") {        // producer uploads the mp3 itself (max 8 MB)
        const t = db.tracks[url.searchParams.get("id") || ""];
        if (!need(res, t && t.producerId === p.id && t.status !== "deleted", 404, "no such track")) return;
        const buf = await readRaw(req, 8 * 1024 * 1024);
        const okMp3 = buf.length > 1000 && buf.length <= 8 * 1024 * 1024 && ((buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) || (buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0));
        if (!need(res, okMp3, 400, "this is not an mp3 file (max 8 MB)")) return;
        await putBlob("m" + t.id, buf.toString("base64")); t.mp3 = { size: buf.length, at: Date.now() }; saveDb(); return send(res, 200, pview());
      }
      if (P === "/api/producer/proof" && M === "POST") {      // producer attaches a screenshot of the payment he sent
        const b = await readBody(req, 8e5), tp = db.topups[b.id];
        if (!need(res, tp && tp.producerId === p.id && tp.status === "pending", 404, "no pending payment")) return;
        if (!need(res, /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(b.image || "") && b.image.length < 700000, 400, "bad image")) return;
        await putProof("t" + tp.id, b.image); tp.proof = true; saveDb(); notify("producer sent a payment screenshot, please check Payments"); return send(res, 200, pview());
      }
      if (P === "/api/producer/track" && M === "POST") {     // new track; the budget becomes a pending payment the owner confirms
        const b = await readBody(req), title = String(b.title || "").trim().slice(0, 120), budget = Number(b.budget);
        if (!need(res, title && budget >= 1 && budget <= 1000000, 400, "title and budget (1..1000000) required")) return;
        const L = {}, src = b.links && typeof b.links === "object" ? b.links : {};
        for (const k of ["spotify", "soundcloud", "tiktok", "mp3"]) { const v = String(src[k] || "").trim().slice(0, 400); if (v) { if (!need(res, /^https?:\/\/\S+\.\S+/i.test(v), 400, "link must start with https://")) return; const kk = classifyLink(v); if (!L[kk]) L[kk] = v; } }
        if (!need(res, Object.keys(L).length > 0 || b.willUpload, 400, "add at least one link or an mp3 file")) return;
        const plats = (Array.isArray(b.platforms) ? b.platforms : []).filter(x => PLATFORMS.includes(x));
        const cats = cleanCats(b.categories);
        const t = { id: uid8(), producerId: p.id, title, artist: String(b.artist || "").slice(0, 120), link: Object.values(L)[0] || "", links: L, budget: 0, spent: 0,
          platforms: plats.length ? plats : ["tiktok"], descRule: !!b.descRule, message: String(b.message || "").trim().slice(0, 600),
          categories: cats, otherCategory: cats.includes("other") ? String(b.otherCategory || "").slice(0, 60) : "", status: "review", created: Date.now() };
        db.tracks[t.id] = t;
        const tp = { id: uid8(), producerId: p.id, trackId: t.id, amount: Math.round(budget * 100) / 100, method: METHODS.includes(b.method) ? b.method : "paypal", coin: COINS.includes(b.coin) ? b.coin : "", status: "pending", created: Date.now() };
        db.topups[tp.id] = tp; saveDb(); notify("new track \""+t.title+"\" waits for your approval ("+tp.amount+" USD)"); return send(res, 200, pview());
      }
      if (P === "/api/producer/track/delete" && M === "POST") {  // track stays hidden but its data stays in the database
        const b = await readBody(req), t = db.tracks[b.id];
        if (!need(res, t && t.producerId === p.id, 404, "no such track")) return;
        t.status = "deleted"; Object.values(db.requests).forEach(r => { if (r.trackId === t.id && r.status === "pending") r.status = "cancelled"; });
        saveDb(); return send(res, 200, pview());
      }
      if (P === "/api/producer/topup" && M === "POST") {     // "Add budget": owner confirms the payment by hand
        const b = await readBody(req), t = db.tracks[b.trackId], amount = Number(b.amount);
        if (!need(res, t && t.producerId === p.id && t.status !== "deleted" && amount >= 1 && amount <= 1000000, 400, "track and amount (1..1000000) required")) return;
        const tp = { id: uid8(), producerId: p.id, trackId: t.id, amount: Math.round(amount * 100) / 100, method: METHODS.includes(b.method) ? b.method : "paypal", coin: COINS.includes(b.coin) ? b.coin : "", status: "pending", created: Date.now() };
        db.topups[tp.id] = tp; saveDb(); notify("budget top-up "+tp.amount+" USD for track \""+t.title+"\" waits for confirmation"); return send(res, 200, pview());
      }
      return send(res, 404, { error: "not found" });
    }

    /* ----- owner ----- */
    if (P === "/api/admin/login" && M === "POST") {
      const ip = "adm:" + clientIp(req);
      if (tooMany(ip, 30)) return send(res, 429, { error: "too many attempts, wait 10 minutes" });
      const b = await readBody(req);
      if (!crypto.timingSafeEqual(sha(b.password || ""), sha(ADMIN_TOKEN))) { failTry(ip); return send(res, 401, { error: "wrong password" }); }
      const sid = newSid(); db.admin[sid] = Date.now() + 12 * 3600000; saveDb();
      return send(res, 200, { ok: true }, { "Set-Cookie": setCookie("adm", sid, 43200, true) });
    }
    if (P === "/api/admin/logout" && M === "POST") {
      const c = cookie(req, "adm"); if (c) { delete db.admin[c]; saveDb(); }
      return send(res, 200, { ok: true }, { "Set-Cookie": setCookie("adm", "", 0, true) });
    }
    if (P.startsWith("/api/admin/")) {
      if (!adminOk(req)) return send(res, 401, { error: "unauthorized" });
      if (P === "/api/admin/overview" && M === "GET") { refreshStale(20).catch(() => {}); return send(res, 200, overview()); }
      if (P === "/api/admin/applicants" && M === "GET") return send(res, 200, allAccounts().map(accAdminView));
      const b = M === "POST" ? await readBody(req, P === "/api/admin/payout" ? 8e5 : 1e5) : {};
      if (P === "/api/admin/plan" && M === "POST") {   // suggests how many videos to buy from which accounts for one track
        const t = db.tracks[b.trackId]; if (!need(res, t && t.status === "active", 404, "track not active")) return;
        let rem = Math.round((Number(b.budget) > 0 ? Number(b.budget) : trackLeft(t)) * 100) / 100; const budget = rem;
        if (!need(res, rem > 0, 400, "no budget left on this track")) return;
        const busy = new Set(Object.values(db.requests).filter(r => r.trackId === t.id && ["pending", "approved", "submitted"].includes(r.status)).map(r => r.openId));
        const cands = [];
        for (const acc of allAccounts()) {
          if (acc.adminStatus !== "approved" || !(acc.price > 0) || busy.has(acc.open_id)) continue;
          const v = accAdminView(acc), A = v.analysis;
          if (!A.accepted || !A.month || A.month.views < 1000 || !A.refAvg) continue;
          if (v.evaluation && v.evaluation.decision === "risky") continue;
          if ((t.categories || []).length && !(t.categories || []).some(c => (acc.categories || []).includes(c))) continue;
          const unit = Math.round(acc.price * (1 - (acc.discount || 0) / 100) * 100) / 100; if (!(unit > 0)) continue;
          const stars = v.stars.final == null ? 3 : v.stars.final;
          cands.push({ id: v.id, handle: v.handle, unit, exp: A.refAvg, stars, discount: acc.discount || 0, price: acc.price, score: (A.refAvg / unit) * (0.6 + 0.4 * stars / 5) * ((acc.discount || 0) > 0 ? 1.05 : 1), n: 0 });
        }
        for (;;) {
          let best = null, bv = -1;
          for (const c of cands) { if (c.n >= 10 || c.unit > rem + 1e-9) continue; const val = c.score / (1 + c.n * 0.35); if (val > bv) { bv = val; best = c; } }
          if (!best) break; best.n++; rem = Math.round((rem - best.unit) * 100) / 100;
        }
        const plan = cands.filter(c => c.n > 0).sort((x, y) => y.n - x.n || y.score - x.score).map(c => ({ id: c.id, handle: c.handle, videos: c.n, price: c.price, discount: c.discount, unit: c.unit, cost: Math.round(c.n * c.unit * 100) / 100, expViews: Math.round(c.n * c.exp), stars: c.stars }));
        const spent = Math.round((budget - rem) * 100) / 100;
        return send(res, 200, { track: t.title, budget, spent, left: rem, videos: plan.reduce((x, p) => x + p.videos, 0), expViews: plan.reduce((x, p) => x + p.expViews, 0), plan, candidates: cands.length });
      }
      if (P === "/api/admin/contacts" && M === "POST") { const tg = String(b.telegram || "").trim().replace(/^https?:\/\/t\.me\//i, "").replace(/^@/, "").slice(0, 60), dc = String(b.discord || "").trim().slice(0, 200); db.settings.contacts = { telegram: tg, discord: dc }; saveDb(); return send(res, 200, db.settings.contacts); }
      if (P === "/api/admin/broadcast" && M === "POST") {
        const text = String(b.text || "").trim().slice(0, 300), title = String(b.title || "Promo Campaign").trim().slice(0, 80), aud = ["editors", "producers", "all"].includes(b.audience) ? b.audience : "editors";
        if (!need(res, text, 400, "write a message")) return;
        const n = Object.values(db.settings.push || {}).filter(x => aud === "all" || x.role === aud).length, sent = await broadcast(aud, title, text, "/");
        return send(res, 200, { ok: true, subscribers: n, delivered: sent });
      }
      if (P === "/api/admin/demo" && M === "POST") {    // test producer with a ready track, only for the owner's own checks
        const email = "demo-producer@promo.test", pw = crypto.randomBytes(5).toString("hex") + "Aa1";
        let p = Object.values(db.producers).find(x => x.email === email); const salt = crypto.randomBytes(16).toString("hex");
        if (!p) { p = { id: uid8(), email, name: "TEST producer", created: Date.now() }; db.producers[p.id] = p; }
        p.salt = salt; p.hash = hashPw(pw, salt);
        let t = Object.values(db.tracks).find(x => x.producerId === p.id && x.demo);
        if (!t) {
          t = { id: uid8(), producerId: p.id, title: "TEST track (demo)", artist: "Demo artist", link: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT", links: { spotify: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT", soundcloud: "https://soundcloud.com/discover", mp3: "https://example.com/demo.mp3" }, budget: 0, spent: 0, platforms: ["tiktok"], descRule: true, message: "Demo track for owner tests", categories: cleanCats(["anime", "gaming", "gym"]), otherCategory: "", status: "active", demo: true, created: Date.now() };
          db.tracks[t.id] = t;
        }
        t.budget = 80; t.spent = 0; t.status = "active";
        const tp = { id: uid8(), producerId: p.id, trackId: t.id, amount: 100, fee: 20, method: "paypal", coin: "", status: "confirmed", confirmedAt: Date.now(), created: Date.now(), demo: true };
        db.topups[tp.id] = tp; const sid = newSid(); db.psessions[sid] = { pid: p.id, exp: Date.now() + 12 * 3600000 }; saveDb(); return send(res, 200, { ok: true, track: t.title }, { "Set-Cookie": setCookie("psid", sid, 43200) });
      }
      if (P === "/api/admin/pay" && M === "GET") return send(res, 200, payInfo());
      if (P === "/api/admin/pay" && M === "POST") { const c = (o, k) => String((o || {})[k] || "").trim().slice(0, 140); const cr = {}; for (const k of COINS) cr[k] = c(b.crypto, k); db.settings.pay = { paypal: c(b, "paypal"), card: c(b, "card"), cardHolder: c(b, "cardHolder"), crypto: cr }; saveDb(); return send(res, 200, payInfo()); }
      if (P === "/api/admin/track" && M === "POST") {   // owner approves a track before the producer pays
        const t = db.tracks[b.id]; if (!need(res, t && t.status === "review", 404, "no track waiting for review")) return;
        if (b.status === "approved") t.status = "active"; else if (b.status === "rejected") t.status = "rejected"; else return send(res, 400, { error: "bad status" });
        saveDb(); return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/decision" && M === "POST") {
        if (!need(res, ["approved", "rejected", "new", "banned"].includes(b.status), 400, "bad status")) return;
        const a = findAccAny(b.id); if (!need(res, a, 404, "no such account")) return;
        a.adminStatus = b.status; saveDb(); return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/rating" && M === "POST") {       // manual stars 1..5 (null = back to automatic)
        const a = findAccAny(b.id); if (!need(res, a, 404, "no such account")) return;
        if (b.stars === null) delete a.rating_manual;
        else { const s = Number(b.stars); if (!need(res, s >= 1 && s <= 5, 400, "stars 1..5")) return; a.rating_manual = Math.round(s * 2) / 2; }
        saveDb(); return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/request" && M === "POST") {      // pending -> approved/rejected, submitted -> completed/returned
        const r = db.requests[b.id]; if (!need(res, r, 404, "no such request")) return;
        const st = b.status, from = r.status;
        const allowed = { pending: ["approved", "rejected"], submitted: ["completed", "returned"] };
        if (!need(res, (allowed[from] || []).includes(st), 409, "cannot change " + from + " to " + st)) return;
        if (st === "approved") {
          const t = db.tracks[r.trackId], cost = reqCost(r);
          if (!need(res, t && t.status === "active" && trackLeft(t) >= cost, 409, "not enough budget on the track")) return;
          t.spent = Math.round(((t.spent || 0) + cost) * 100) / 100; r.approvedAt = Date.now();
        }
        r.status = st; r.updated = Date.now(); if (st === "completed") r.completedAt = Date.now(); saveDb(); return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/eta" && M === "POST") {
        const r = db.requests[b.id]; if (!need(res, r, 404, "no such request")) return;
        r.eta = String(b.eta || "").trim().slice(0, 80); saveDb(); return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/proof" && M === "GET") { const img = await getProof(url.searchParams.get("id") || ""); return send(res, 200, { image: img }); }
      if (P === "/api/admin/payout" && M === "POST") {     // mark that the editor has been paid for a completed request
        const r = db.requests[b.id]; if (!need(res, r && r.status === "completed", 404, "no completed request")) return;
        r.paid = !!b.paid; r.paidAt = r.paid ? Date.now() : 0;
        if (b.image) { if (!need(res, /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(b.image) && b.image.length < 700000, 400, "bad image")) return; await putProof(r.id, b.image); r.proof = true; } saveDb(); return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/topup" && M === "POST") {        // confirm payment -> budget added to the track
        const tp = db.topups[b.id]; if (!need(res, tp && tp.status === "pending", 404, "no pending payment")) return;
        if (b.status === "confirmed" && !need(res, (db.tracks[tp.trackId] || {}).status === "active", 409, "approve the track first")) return;
        if (b.status === "confirmed") { const t = db.tracks[tp.trackId]; if (t) { tp.fee = Math.round(tp.amount * FEE * 100) / 100; t.budget = Math.round(((t.budget || 0) + tp.amount - tp.fee) * 100) / 100; } tp.status = "confirmed"; tp.confirmedAt = Date.now(); }
        else if (b.status === "rejected") tp.status = "rejected";
        else return send(res, 400, { error: "bad status" });
        saveDb(); return send(res, 200, { ok: true });
      }
      return send(res, 404, { error: "not found" });
    }

    /* static site */
    const file = path.join(__dirname, "public", P === "/" ? "index.html" : P);
    if (file.startsWith(path.join(__dirname, "public")) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".txt": "text/plain; charset=utf-8" };
      res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
      return fs.createReadStream(file).pipe(res);
    }
    send(res, 404, { error: "not found" });
  } catch (e) { console.error(e); send(res, 500, { error: "server error" }); }
});
loadDb().then(() => {
  server.listen(PORT, () => console.log("Promo Campaign on " + PUBLIC_URL));
  setInterval(() => refreshStale(30).catch(e => console.error(e)), REFRESH_EVERY);
}).catch(e => { console.error("Could not load the database:", e); process.exit(1); });

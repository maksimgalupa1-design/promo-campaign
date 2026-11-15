/* Promo Campaign backend: real TikTok login + video analysis. No dependencies, Node 18+.
   Run: TIKTOK_CLIENT_KEY=... TIKTOK_CLIENT_SECRET=... PUBLIC_URL=https://your-domain ADMIN_TOKEN=... node server.js */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PC = require("./analysis.js");
const ICON_PNG = Buffer.from("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", "base64");
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
const NTYPES = ["money", "orders", "campaigns", "accounts", "support"];
function inboxAdd(item) { db.settings.inbox = (db.settings.inbox || []).concat([Object.assign({ id: uid8(), at: Date.now() }, item)]).slice(-300); }
async function sendMail(to, subject, text) {   // optional: works when RESEND_API_KEY and MAIL_FROM are set in Render
  const key = process.env.RESEND_API_KEY, from = process.env.MAIL_FROM; if (!key || !from || !to) return false;
  try { const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], subject, text }) }); return r.ok; } catch (e) { return false; }
}
function mailList(audience, type) {
  const out = [], okT = o => (((o || {}).notif || {}).types || {})[type] !== false, addr = o => ((o || {}).notif || {}).email || "";
  if (audience !== "producers") Object.values(db.users).forEach(u => { if (addr(u) && okT(u) && !(u.accounts || []).every(a => a.demo)) out.push(addr(u)); });
  if (audience !== "editors") Object.values(db.producers).forEach(p => { const e = addr(p) || p.email; if (e && okT(p)) out.push(e); });   // producers signed up with an email: it is used by default
  return [...new Set(out)];
}
function inboxCounts(audience) {
  const ed = Object.values(db.users).filter(u => !(u.accounts || []).every(a => a.demo)).length, pr = Object.keys(db.producers).length;
  return { editors: audience === "producers" ? 0 : ed, producers: audience === "editors" ? 0 : pr };
}
async function broadcast(audience, title, text, url, type, withMail) {
  type = NTYPES.includes(type) ? type : "support";
  inboxAdd({ audience, title, text, url: url || "/", type });
  const subs = db.settings.push || {}; let sent = 0;
  for (const [k, s] of Object.entries(subs)) {
    if (audience !== "all" && s.role !== audience) continue;
    const code = await pushSend(s.sub, { title, body: text, url: url || "/" });
    if (code === 404 || code === 410) delete subs[k]; else if (code >= 200 && code < 300) sent++;
  }
  let mails = 0; if (withMail) for (const e of mailList(audience, type)) if (await sendMail(e, title, text)) mails++;
  saveDb(); return { sent, mails };
}
function edUserOfOpen(openId) { return Object.values(db.users).find(u => (u.accounts || []).some(a => a.open_id === openId)); }
const NT_EN = { ord_approved: 'Your order for "{t}" was approved. Send your video links within 16 days.', ord_rejected: 'Your order for "{t}" was not taken.', ord_completed: 'Your videos for "{t}" were accepted. Payment is on the way.', ord_returned: 'Your links for "{t}" were returned. Please fix and send again.', ord_cancelled: 'The order for "{t}" was cancelled.', money_paid: 'Payment sent: {a} for "{t}". Open My orders to see the receipt.', acc_approved: "Your account {h} is verified.", acc_rejected: "Your account {h} was not taken.", acc_banned: "Your account {h} was blocked.", price_ok: "The new price for {h} was approved: {p}.", price_no: "The manager kept the price {p} for {h}.", ord_reminder: 'Reminder: "{t}" — {d} left to send your video links.', price_suggest: "The manager suggests a new price for {h}: {p}. Open your dashboard to accept." };
NT_EN.ord_remind = 'Reminder: "{t}": {d} days passed since approval, {l} days left. Publish your videos and send the links.';
NT_EN.ord_last = 'LAST DAY for "{t}". If the videos are not sent today, we stop working with you and your account will be blocked.';
function ntText(key, v) { return String(NT_EN[key] || key).replace(/\{(\w+)\}/g, (m, k) => (v || {})[k] !== undefined ? v[k] : ""); }
function notifyUser(kind, user, type, key, vars) {   // a private message for one editor or producer (shown in the bell)
  if (!user) return; inboxAdd({ audience: kind, to: user.id, type, key, vars: vars || {}, title: "", text: "", url: "/" });
  const em = user.notif && user.notif.email && (user.notif.types || {})[type] !== false ? user.notif.email : "";
  if (em) sendMail(em, "Promo Campaign", ntText(key, vars)).catch(() => {});
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
function autoStars(acc) {   // automatic rating: 2.0 .. 5.0 in steps of 0.1
  const A = PC.analyze(acc.videos || [], Date.now());
  const cpm = acc.price && A.refAvg ? acc.price / A.refAvg * 1000 : null;
  if (!A.accepted) return { stars: A.status === "abandoned" ? 2.2 : 2.0, cpm };   // no views or no videos: 2.0, the lowest rating
  let st = (cpm === null ? 3.2 : 5 - (cpm - 0.02) / 0.03);
  if (A.status === "dormant") st -= 0.8;
  if (A.status === "active" && A.week && A.week.videos === 0) st -= 0.4;
  if (A.refAvg) st += Math.min(0.4, A.refAvg / 250000);
  const mine = Object.values(db.requests).filter(r => r.openId === acc.open_id);
  const done = mine.filter(r => r.status === "completed").length, bad = mine.filter(r => r.status === "returned").length;
  if (done + bad > 0) { const q = done / (done + bad); st += q >= 0.9 ? 0.4 : (q < 0.5 ? -0.6 : 0); }
  return { stars: Math.round(Math.max(2, Math.min(5, st)) * 10) / 10, cpm };
}
function accView(acc) {
  const A = PC.analyze(acc.videos || [], Date.now());
  return { id: acc.open_id, handle: "@" + (acc.profile && acc.profile.username || ""), name: acc.profile && acc.profile.display_name,
    avatar: (acc.profile && acc.profile.avatar_url) || "", suggestedPrice: acc.suggested || null, priceReq: acc.priceReq || null, tiers: acc.tiers || [], internalName: acc.internal_name || "", about: acc.about || "", categories: acc.categories || [], otherCategory: acc.other_category || "", discount: acc.discount || 0,
    analysis: A, price: acc.price || null, evaluation: (() => { const e = PC.evaluate(A, acc.price); if (!A.accepted) e.chance = A.status === "abandoned" ? 3 : 2; return e; })(), adminStatus: acc.adminStatus || "new", recommended: PC.recommend(A), analysisAt: acc.analysisAt,
    videos: (acc.videos || []).slice(0, 150).map(v => ({ id: v.id, created: v.created, views: v.views, likes: v.likes || 0, url: v.url })) };
}
function accPayoutRaw(user, acc) { return (acc && acc.payout) || (user && user.payout) || null; }   // every TikTok account can have its own payout details; the user-level ones are the fallback
function view(user) { return { accounts: (user.accounts || []).map(a => { const x = accView(a), p = accPayoutRaw(user, a); x.payout = p ? { set: true, method: p.method, coin: p.coin || "", label: p.label, own: !!a.payout } : { set: false }; return x; }), categories: CATEGORIES, payout: payoutLabel(user), coins: COINS }; }
function accAdminView(acc) {
  const v = accView(acc), r = autoStars(acc);
  v.stars = { auto: r.stars, manual: acc.rating_manual == null ? null : acc.rating_manual, final: acc.rating_manual != null ? acc.rating_manual : r.stars };
  v.cpm = r.cpm;
  { const ou = Object.values(db.users).find(x => (x.accounts || []).some(z => z.open_id === acc.open_id)), pp = accPayoutRaw(ou, acc); v.payout = pp ? decObj(pp.enc) : null; }
  v.videos = v.videos.slice(0, 40);
  return v;
}
const FEE = 0.2;   // site commission, taken from every confirmed payment
const RATES = { t: 0, live: false, v: { UAH: 41.5, USDT: 1, SOL: 0.0058, TRX: 3.4, ETH: 0.00032, LTC: 0.0105, TON: 0.42, BTC: 0.0000105 } };
const METHODS = ["paypal", "usdt", "card", "crypto"];
const COINS = ["solana", "tron", "ethereum", "litecoin", "ton"];
const PLATFORMS = ["tiktok", "instagram", "youtube"];
function payInfo() { const x = db.settings.pay || {}, c = x.crypto || {}; const o = { paypal: x.paypal || "", card: x.card || "", cardHolder: x.cardHolder || "", crypto: {} }; for (const k of COINS) o.crypto[k] = c[k] || ""; return o; }
const PKEY = () => crypto.scryptSync(ADMIN_TOKEN, "pc-payout-v1", 32);
function encObj(o) { const iv = crypto.randomBytes(12), c = crypto.createCipheriv("aes-256-gcm", PKEY(), iv), ct = Buffer.concat([c.update(JSON.stringify(o), "utf8"), c.final()]); return [iv, c.getAuthTag(), ct].map(x => x.toString("base64")).join("."); }
function decObj(str) { try { const [iv, tag, ct] = String(str).split(".").map(x => Buffer.from(x, "base64")), d = crypto.createDecipheriv("aes-256-gcm", PKEY(), iv); d.setAuthTag(tag); return JSON.parse(Buffer.concat([d.update(ct), d.final()]).toString("utf8")); } catch (e) { return null; } }
function maskVal(m, v) { v = String(v); return m === "card" ? "•••• " + v.replace(/\D/g, "").slice(-4) : (m === "paypal" ? v.replace(/^(.{2}).*(@.*)$/, "$1•••$2") : v.slice(0, 4) + "…" + v.slice(-4)); }
function payoutLabel(u) { return u.payout ? { set: true, method: u.payout.method, coin: u.payout.coin || "", label: u.payout.label } : { set: false }; }
function deadlineDays(s){
  s=String(s||"").trim().toLowerCase();if(!s)return null;
  var d=s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/),e=s.match(/^(\d{1,2})[.\/](\d{1,2})(?:[.\/](\d{2,4}))?$/),dt=null;
  if(d)dt=new Date(+d[1],+d[2]-1,+d[3]);else if(e){var y=e[3]?(+e[3]<100?2000+ +e[3]:+e[3]):new Date().getFullYear();dt=new Date(y,+e[2]-1,+e[1]);if(!e[3]&&dt<new Date())dt=new Date(y+1,+e[2]-1,+e[1])}
  if(dt&&!isNaN(dt))return (dt-Date.now())/86400000;
  var m=s.match(/(\d+(?:[.,]\d+)?)?\s*(week|нед|month|мес|year|год|лет|hour|час|hr|day|сут|д(?:ень|ня|ней|н))/);
  if(!m)return NaN;
  var q=m[1]?parseFloat(m[1].replace(",",".")):1,u=m[2],k=/^(week|нед)/.test(u)?7:/^(month|мес)/.test(u)?30:/^(year|год|лет)/.test(u)?365:/^(hour|час|hr)/.test(u)?1/24:1;
  return q*k;
}
function deadlineOk(s){var v=deadlineDays(s);return v===null||(!isNaN(v)&&v>=7-1e-9)}
/* the video was not made: the money goes back to the track budget */
/* bulk deals: a ladder per account, e.g. 3+ videos -5%, 6+ videos -10% */
function cleanTiers(list) {
  if (!Array.isArray(list)) return [];
  const out = []; list.slice(0, 6).forEach(t => { const m = Math.round(Number(t && t.min)), p = Math.round(Number(t && t.pct)); if (m >= 2 && m <= 500 && p >= 1 && p <= 99) out.push({ min: m, pct: p }); });
  out.sort((a, b) => a.min - b.min); return out.filter((t, i) => i === 0 || t.min !== out[i - 1].min);
}
function discountFor(acc, videos) {
  const ts = acc.tiers || []; if (!ts.length) return acc.discount || 0;
  let d = 0; ts.forEach(t => { if (videos >= t.min) d = Math.max(d, t.pct); }); return d;
}
function maxTier(acc) { return Math.max(acc.discount || 0, ...(acc.tiers || []).map(t => t.pct)); }
function refundReq(r) { const t = db.tracks[r.trackId]; if (t && r.approvedAt) t.spent = Math.max(0, Math.round(((t.spent || 0) - reqCost(r)) * 100) / 100); }
function expireOverdue() {
  let n = 0;
  Object.values(db.requests).forEach(r => { if (["approved", "returned"].includes(r.status) && r.approvedAt && Date.now() - r.approvedAt > 16 * 86400000) { refundReq(r); r.status = "cancelled"; r.updated = Date.now(); n++; } });
  if (n) { saveDb(); notify(n + " order(s) expired after 16 days. The money went back to the track budget."); }
}
function remindEditors() {   // a nudge every 3 days after approval, and a strong one on the last day (16-day deadline)
  let n = 0;
  Object.values(db.requests).forEach(r => {
    if (!["approved", "returned"].includes(r.status) || !r.approvedAt || r.demo) return;
    const el = Date.now() - r.approvedAt, left = 16 * 86400000 - el; if (left <= 0) return;
    const stage = left <= 86400000 ? 99 : Math.floor(el / (3 * 86400000)); if (stage < 1 || stage <= (r.remN || 0)) return;
    r.remN = stage; n++;
    const title = (db.tracks[r.trackId] || {}).title || "", days = Math.floor(el / 86400000), l = Math.max(1, Math.ceil(left / 86400000));
    if (stage === 99) notifyUser("editors", edUserOfOpen(r.openId), "orders", "ord_last", { t: title });
    else notifyUser("editors", edUserOfOpen(r.openId), "orders", "ord_remind", { t: title, d: days, l });
  });
  if (n) saveDb();
}
const HEX_AV = "data:image/jpeg;base64,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";
const PIN_AV = "data:image/svg+xml;base64," + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6a6c1"/><stop offset="1" stop-color="#7c5cff"/></linearGradient></defs><rect width="128" height="128" fill="url(#g)"/><circle cx="64" cy="64" r="34" fill="none" stroke="#fff" stroke-width="7" opacity=".9"/><circle cx="64" cy="64" r="12" fill="#fff" opacity=".9"/></svg>').toString("base64");
const trackLeft = t => Math.max(0, Math.round(((t.budget || 0) - (t.spent || 0)) * 100) / 100);
function cleanCats(list) { return Array.isArray(list) ? CATEGORIES.filter(c => list.includes(c)) : []; }
/* track cover: taken from the public oEmbed of the first link we know (Spotify, SoundCloud, TikTok); tried once, never blocks a request */
const COVER_BUSY = new Set();
function ensureCover(t) {
  if (t.cover || t.coverTried || COVER_BUSY.has(t.id)) return;
  const L = Object.assign({}, t.links || {}); if (t.link && !L.spotify && !L.soundcloud && !L.tiktok) L.other = t.link;
  const tries = []; if (L.spotify) tries.push("https://open.spotify.com/oembed?url=" + encodeURIComponent(L.spotify));
  if (L.soundcloud) tries.push("https://soundcloud.com/oembed?format=json&url=" + encodeURIComponent(L.soundcloud));
  if (L.tiktok) tries.push("https://www.tiktok.com/oembed?url=" + encodeURIComponent(L.tiktok));
  if (L.other) { if (/spotify\.com/.test(L.other)) tries.push("https://open.spotify.com/oembed?url=" + encodeURIComponent(L.other)); else if (/soundcloud\.com/.test(L.other)) tries.push("https://soundcloud.com/oembed?format=json&url=" + encodeURIComponent(L.other)); }
  if (!tries.length) { t.coverTried = Date.now(); return; }
  COVER_BUSY.add(t.id);
  (async () => {
    for (const u of tries) {
      try { const r = await fetch(u, { signal: AbortSignal.timeout(6000) }); if (!r.ok) continue; const j = await r.json(); if (j && /^https:\/\//.test(j.thumbnail_url || "")) { t.cover = String(j.thumbnail_url).slice(0, 500); break; } } catch (e) { }
    }
    t.coverTried = Date.now(); COVER_BUSY.delete(t.id); saveDb();
  })();
}
function reqCost(r) { return Math.round(r.price * r.videos * (1 - (r.discount || 0) / 100) * 100) / 100; }
function videoIdOf(link) { const m = String(link || "").match(/tiktok\.com\/@([A-Za-z0-9._]{2,24})\/video\/(\d{8,25})/i); return m ? { user: m[1].toLowerCase(), id: m[2] } : null; }
function reqView(r, withAdmin) {
  const t = db.tracks[r.trackId] || {}, acc = findAccAny(r.openId);
  const links = (r.links || []).map(l => { const p = videoIdOf(l), v = p && acc && (acc.videos || []).find(x => x.id === p.id); return { url: l, views: v ? v.views : null }; });
  const o = { id: r.id, trackId: r.trackId, track: t.title || "(deleted)", artist: t.artist || "", openId: r.openId, handle: acc ? "@" + (acc.profile && acc.profile.username || "") : "",
    internalName: acc ? acc.internal_name || "" : "", ack: r.ack === undefined ? null : !!r.ack, tdl: t.deadline || "", descRule: !!t.descRule, message: t.message || "", tcats: t.categories || [], tother: t.otherCategory || "", tlinks: t.links || {}, tlink: t.link || "", tcover: t.cover || "", tmp3: !!t.mp3, price: r.price, videos: r.videos, discount: r.discount || 0, priority: r.priority || 0, cost: reqCost(r), status: r.status, links, created: r.created, completedAt: r.completedAt || 0, paid: !!r.paid, paidBy: r.paidBy || "", paidAt: r.paidAt || 0, accepted: !!r.accepted, acceptedAt: r.acceptedAt || 0, eta: r.eta || "", hasProof: !!r.proof, approvedAt: r.approvedAt || 0,
    overdue: ["approved", "returned"].includes(r.status) && !!r.approvedAt && Date.now() - r.approvedAt > 16 * 86400000 };
  if (withAdmin) { const ou = Object.values(db.users).find(x => (x.accounts || []).some(a => a.open_id === r.openId)), pp = accPayoutRaw(ou, acc); if (pp) o.payout = decObj(pp.enc); }
  if (withAdmin && acc) { const A0 = PC.analyze(acc.videos || [], Date.now()); o.about = acc.about || ""; o.tiers = acc.tiers || []; o.bulk = maxTier(acc); o.avgViews = A0.refAvg || 0; o.accPrice = acc.price || 0; o.avatar = (acc.profile && acc.profile.avatar_url) || ""; const st = autoStars(acc); o.stars = acc.rating_manual != null ? acc.rating_manual : st.stars; o.categories = acc.categories || []; }
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
  const accs = allAccounts().filter(a => !a.demo), reqs = Object.values(db.requests).filter(r => !r.demo);
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
    tracks: Object.values(db.tracks).map(t => ({ deadline: t.deadline || "", message: t.message || "", id: t.id, title: t.title, artist: t.artist, link: t.link, producer: (db.producers[t.producerId] || {}).email, budget: t.budget, spent: t.spent, left: trackLeft(t), demo: !!t.demo, categories: t.categories, otherCategory: t.otherCategory || "", links: t.links || {}, platforms: t.platforms || ["tiktok"], descRule: !!t.descRule, hasMp3: !!t.mp3, producerName: (db.producers[t.producerId] || {}).name || "", pending: Object.values(db.topups).filter(x => x.trackId === t.id && x.status === "pending").length, status: t.status })),
    topups: Object.values(db.topups).filter(x => !x.demo).sort((x, y) => y.created - x.created).map(p => ({ id: p.id, producer: (db.producers[p.producerId] || {}).email, producerName: (db.producers[p.producerId] || {}).name, message: (db.tracks[p.trackId] || {}).message || "", deadline: (db.tracks[p.trackId] || {}).deadline || "", track: (db.tracks[p.trackId] || {}).title, amount: p.amount, cur: p.cur || "", orig: p.orig || 0, fee: p.fee || 0, hasProof: !!p.proof, method: p.method, coin: p.coin || "", status: p.status, created: p.created })),
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
      return send(res, 200, view(u), { "Set-Cookie": setCookie("sid", cookie(req, "sid"), 2592000) });   // signed in for 30 days after the last visit
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
      const rec = { method: m, coin: m === "crypto" ? coin : "", label: maskVal(m, val), enc: encObj({ method: m, coin: m === "crypto" ? coin : "", value: val, holder: m === "card" ? h : "" }) };
      const own = b.accountId ? findAcc(u, b.accountId) : null;
      if (b.accountId && !need(res, own, 404, "no such account")) return;
      if (own) { own.payout = rec; saveDb(); return send(res, 200, { set: true, method: rec.method, coin: rec.coin, label: rec.label, own: true }); }
      u.payout = rec;
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
      const np = Math.round(price * 100) / 100;
      acc.price = np; acc.priceReq = null;   // after the first approval the editor changes the price any time
      saveDb(); return send(res, 200, view(u));
    }
    if (P === "/api/account/update" && M === "POST") {   // internal name, categories, bulk discount (one account or all)
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), acc = findAcc(u, b.id); if (!acc) return send(res, 404, { error: "no such account" });
      const before = JSON.stringify([acc.categories || [], acc.other_category || "", acc.about || "", acc.tiers || []]);
      if (b.internalName !== undefined) acc.internal_name = String(b.internalName).slice(0, 60);
      if (b.categories !== undefined) acc.categories = cleanCats(b.categories);
      if (b.otherCategory !== undefined) acc.other_category = String(b.otherCategory).slice(0, 60);
      if (b.about !== undefined) { const ab = String(b.about).trim().slice(0, 300), wn = ab ? ab.split(/\s+/).length : 0; if (!need(res, !ab || (wn >= 3 && wn <= 8), 400, "Describe your account in 3 to 8 words")) return; acc.about = ab; }
      if (b.tiers !== undefined) {
        const ts = cleanTiers(b.tiers);
        (b.discountAll ? u.accounts : [acc]).forEach(a => { a.tiers = ts; a.discount = ts.length ? Math.max(...ts.map(t => t.pct)) : 0; });
      }
      if ((b.review || before !== JSON.stringify([acc.categories || [], acc.other_category || "", acc.about || "", acc.tiers || []])) && !acc.demo && (acc.adminStatus || "new") === "new") {
        acc.adminStatus = "new"; notify("An editor sent account @" + ((acc.profile || {}).username || "") + " for review. It is waiting for your decision.");
      }   // an approved account keeps its status: the editor can change topics, about, deals and price any time
      if (b.discount !== undefined) {
        const d = Math.round(Number(b.discount) || 0);
        if (d < 0 || d > 99) return send(res, 400, { error: "discount 0..99" });
        (b.discountAll ? u.accounts : [acc]).forEach(a => { a.discount = d; });
      }
      saveDb(); return send(res, 200, view(u));
    }
    if (P === "/api/account/review" && M === "POST") {   // the editor sends the account to the manager for a decision
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), acc = findAcc(u, b.id); if (!acc) return send(res, 404, { error: "no such account" });
      if (!need(res, acc.adminStatus !== "banned", 403, "This account is blocked")) return;
      if (!need(res, acc.price > 0, 400, "Set your price first")) return;
      if (!need(res, (acc.about || "").trim().split(/\s+/).filter(Boolean).length >= 3, 400, "Describe your account in at least 3 words first")) return;
      acc.adminStatus = "new"; acc.sentAt = Date.now(); notify("An editor sent account @" + ((acc.profile || {}).username || "") + " for review."); saveDb(); return send(res, 200, view(u));
    }
    if (P === "/api/account/suggest" && M === "POST") {
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req, 2e4), acc = findAcc(u, b.id); if (!need(res, acc && acc.suggested, 404, "no suggestion")) return;
      if (b.action === "accept") acc.price = acc.suggested; delete acc.suggested; saveDb(); return send(res, 200, view(u));
    }
    if (P === "/api/account/delete" && M === "POST") {
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req), acc = findAcc(u, b.id); if (!acc) return send(res, 404, { error: "no such account" });
      if (!need(res, !Object.values(db.requests).some(r => r.openId === acc.open_id && ["approved", "submitted", "returned"].includes(r.status)), 409, "You have open orders on this account. Finish them first.")) return;
      u.accounts = u.accounts.filter(x => x !== acc); delete db.byOpen[acc.open_id];
      Object.values(db.requests).forEach(r => { if (r.openId === acc.open_id && r.status === "pending") r.status = "cancelled"; });
      saveDb(); return send(res, 200, view(u));
    }
    if (/^\/google[0-9a-f]{8,32}\.html$/.test(P) && M === "GET") { res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); return res.end("google-site-verification: " + P.slice(1)); }   // any Google Search Console verification file name
    if (P === "/robots.txt" && M === "GET") { res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: " + (PUBLIC_URL || "") + "/sitemap.xml\n"); }
    if (P === "/sitemap.xml" && M === "GET") { res.writeHead(200, { "Content-Type": "application/xml; charset=utf-8" }); return res.end('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + (PUBLIC_URL || "") + '/</loc></url></urlset>\n'); }
    if ((P === "/icon.png" || P === "/favicon.ico") && M === "GET") { res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" }); return res.end(ICON_PNG); }
    if (P === "/sw.js" && M === "GET") { res.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-cache" }); return res.end(SW_JS); }
    if (P === "/api/push/key" && M === "GET") return send(res, 200, { key: vapid().pub });
    if (P === "/api/push/subscribe" && M === "POST") {
      const b = await readBody(req), sub = b.sub; if (!need(res, sub && /^https:\/\//.test(sub.endpoint || "") && sub.keys && sub.keys.p256dh && sub.keys.auth, 400, "bad subscription")) return;
      const role = adminOk(req) ? "owner" : producerOf(req) ? "producers" : (sessionUser(req) ? "editors" : (b.role === "producers" ? "producers" : "editors"));
      db.settings.push = db.settings.push || {}; db.settings.push[crypto.createHash("sha1").update(sub.endpoint).digest("hex")] = { sub: { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } }, role, at: Date.now() };
      saveDb(); return send(res, 200, { ok: true });
    }
    if (P === "/api/inbox" && M === "GET") {     // broadcasts + private messages for the signed-in editor or producer
      const wantP = new URL(req.url, "http://x").searchParams.get("role") === "producers", me = wantP ? producerOf(req) : sessionUser(req), aud = wantP ? "producers" : "editors";
      const items = (db.settings.inbox || []).filter(x => (x.audience === "all" || x.audience === aud) && (!x.to || (me && x.to === me.id))).slice(-80).map(x => ({ id: x.id, at: x.at, type: x.type || "support", title: x.title, text: x.text, key: x.key || "", vars: x.vars || {}, url: x.url }));
      return send(res, 200, { now: Date.now(), items, prefs: me ? { types: (me.notif || {}).types || {}, email: (me.notif || {}).email || "" } : null });
    }
    if (P === "/api/notif/prefs" && M === "POST") {
      const b = await readBody(req, 2e4), me = b.role === "producers" ? producerOf(req) : sessionUser(req); if (!me) return send(res, 401, { error: "not signed in" });
      const types = {}; for (const k of NTYPES) types[k] = b.types && b.types[k] === false ? false : true;
      const em = String(b.email || "").trim().slice(0, 120); if (!need(res, !em || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em), 400, "email looks wrong")) return;
      me.notif = { types, email: em }; saveDb(); return send(res, 200, { ok: true, prefs: me.notif });
    }
    if (P === "/api/price-ranges" && M === "GET") return send(res, 200, { ranges: db.settings.ranges || { visual: { min: 3, max: 5 } } });
    if (P === "/api/contacts" && M === "GET") { const c = db.settings.contacts || {}; return send(res, 200, { telegram: c.telegram || "", discord: c.discord || "", instagram: c.instagram || "", tiktok: c.tiktok || "" }); }
    if (P === "/api/tracks" && M === "GET") {            // catalog for editors: tracks that still have budget
      const u = sessionUser(req);
      const list = Object.values(db.tracks).filter(t => t.status === "active" && (!t.demo || adminOk(req)) && trackLeft(t) > 0 && (t.platforms || ["tiktok"]).includes("tiktok")).map(t => ({ cover: (ensureCover(t), t.cover || ""), id: t.id, title: t.title, artist: t.artist, link: t.link, links: t.links || {}, descRule: !!t.descRule, hasMp3: !!t.mp3, deadline: t.deadline || "", producerName: (db.producers[t.producerId] || {}).name || "", platforms: t.platforms || ["tiktok"], categories: t.categories || [], otherCategory: t.otherCategory || "" }));
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
      if (!need(res, ids.length > 0 && ids.length <= 1000, 400, "choose accounts")) return;
      const videos = Math.max(1, Math.min(100, Math.round(Number(b.videos) || 1))); // the manager decides the real number of videos
      const dmap = b.discounts && typeof b.discounts === "object" ? b.discounts : {};
      const out = [];
      for (const id of ids) {
        const acc = findAcc(u, id); if (!need(res, acc, 404, "no such account")) return;
        const A = PC.analyze(acc.videos || [], Date.now());
        if (!need(res, acc.price > 0, 400, "account is not ready: " + (acc.profile && acc.profile.username))) return;
        if (!need(res, acc.adminStatus === "approved", 403, "account is waiting for the manager's approval: " + (acc.profile && acc.profile.username))) return;
        if (!need(res, accPayoutRaw(u, acc), 403, "add payout details for @" + (acc.profile && acc.profile.username))) return;
        const okCat = !(t.categories || []).length || (t.categories || []).some(c => (acc.categories || []).includes(c));
        if (!need(res, okCat, 400, "category does not match: " + (acc.profile && acc.profile.username))) return;
        if (Object.values(db.requests).some(r => r.trackId === t.id && r.openId === acc.open_id && ["pending", "approved", "submitted"].includes(r.status))) continue;
        const disc = discountFor(acc, videos);
        if (!need(res, disc >= 0 && disc <= 99, 400, "discount 0..99")) return;
        const r = { id: uid8(), trackId: t.id, openId: acc.open_id, price: acc.price, videos, discount: disc, priority: maxTier(acc) > 0 ? 5 : 0, status: "pending", links: [], created: Date.now(), updated: Date.now() };
        db.requests[r.id] = r; out.push(reqView(r, false));
      }
      saveDb(); notify(out.length + " new request(s) from an editor"); return send(res, 200, { requests: out });
    }
    if (P === "/api/request/accept" && M === "POST") {    // the editor confirms: "I received the money"
      const u = sessionUser(req); if (!u) return send(res, 401, { error: "not signed in" });
      const b = await readBody(req, 2e4), r = db.requests[b.id || ""];
      if (!need(res, r && r.paid && (u.accounts || []).some(a => a.open_id === r.openId), 404, "no paid order")) return;
      if (!r.accepted) { r.accepted = true; r.acceptedAt = Date.now(); saveDb(); notify("editor accepted a payment receipt"); }
      return send(res, 200, { ok: true });
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
      if (!need(res, b.ack === true, 400, "Confirm the sound and description steps first")) return;
      r.ack = true; r.ackAt = Date.now();
      r.links = links; r.status = "submitted"; r.updated = Date.now(); saveDb(); notify("an editor sent video links to check");
      return send(res, 200, { request: reqView(r, false) });
    }

    /* ----- producer ----- */
    if (P === "/api/rates" && M === "GET") {      // live rates for the budget converter (cached 10 minutes)
      const now = Date.now();
      if (!RATES.t || now - RATES.t > 600000) {
        RATES.t = now;
        try {
          const r = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=USD"), j = await r.json(), x = (j && j.data && j.data.rates) || {}, o = {};
          for (const k of ["UAH", "USDT", "SOL", "TRX", "ETH", "LTC", "TON", "BTC"]) { const v = Number(x[k]); if (v > 0) o[k] = v; }
          if (o.UAH && o.SOL && o.ETH) { RATES.v = Object.assign({ USDT: 1 }, o); RATES.live = true; RATES.ok = now; }
        } catch (e) { /* keep the previous rates */ }
      }
      return send(res, 200, { rates: RATES.v, live: !!RATES.live && now - (RATES.ok || 0) < 3600000 * 6 });
    }
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
      if (P === "/api/producer/me" && M === "GET") { const c = cookie(req, "psid"); if (db.psessions[c]) db.psessions[c].exp = Date.now() + 30 * 86400000; return send(res, 200, pview(), { "Set-Cookie": setCookie("psid", c, 2592000) }); }
      if (P === "/api/producer/mp3" && M === "POST") {        // producer uploads the mp3 itself (max 8 MB)
        const t = db.tracks[url.searchParams.get("id") || ""];
        if (!need(res, t && t.producerId === p.id && t.status !== "deleted", 404, "no such track")) return;
        const buf = await readRaw(req, 8 * 1024 * 1024);
        const okMp3 = buf.length > 1000 && buf.length <= 8 * 1024 * 1024 && ((buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) || (buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0));
        if (!need(res, okMp3, 400, "this is not an mp3 file (max 8 MB)")) return;
        await putBlob("m" + t.id, buf.toString("base64")); t.mp3 = { size: buf.length, at: Date.now() }; saveDb(); return send(res, 200, pview());
      }
      if (P === "/api/producer/proof" && M === "POST") {      // producer attaches a screenshot of the payment he sent
        const b = await readBody(req, 2e6), tp = db.topups[b.id];
        if (!need(res, tp && tp.producerId === p.id && tp.status === "pending", 404, "no pending payment")) return;
        if (!need(res, /^data:(image\/(jpeg|png|webp)|application\/pdf);base64,[A-Za-z0-9+\/=]+$/.test(b.image || "") && b.image.length < 1500000, 400, "bad file (image or PDF, max 1 MB)")) return;
        await putProof("t" + tp.id, b.image); tp.proof = true; saveDb(); notify("producer sent a payment screenshot, please check Payments"); return send(res, 200, pview());
      }
      if (P === "/api/producer/track" && M === "POST") {     // new track; the budget becomes a pending payment the owner confirms
        const b = await readBody(req), title = String(b.title || "").trim().slice(0, 120), budget = Number(b.budget);
        if (!need(res, title && budget >= 100 && budget <= 1000000, 400, "minimum budget is $100")) return;
        const L = {}, src = b.links && typeof b.links === "object" ? b.links : {};
        for (const k of ["spotify", "soundcloud", "tiktok", "mp3"]) { const v = String(src[k] || "").trim().slice(0, 400); if (v) { if (!need(res, /^https?:\/\/\S+\.\S+/i.test(v), 400, "link must start with https://")) return; const kk = classifyLink(v); if (!L[kk]) L[kk] = v; } }
        if (!need(res, Object.keys(L).length > 0 || b.willUpload, 400, "add at least one link or an mp3 file")) return;
        const plats = (Array.isArray(b.platforms) ? b.platforms : []).filter(x => PLATFORMS.includes(x));
        if (!need(res, deadlineOk(b.deadline), 400, "The deadline must be at least 1 week (for example: 2 weeks, 1 month)")) return;
        const cats = cleanCats(b.categories);
        const t = { id: uid8(), producerId: p.id, title, artist: String(b.artist || "").slice(0, 120), link: Object.values(L)[0] || "", links: L, budget: 0, spent: 0,
          platforms: plats.length ? plats : ["tiktok"], descRule: !!b.descRule, message: String(b.message || "").trim().slice(0, 600), deadline: String(b.deadline || "").trim().slice(0, 60),
          categories: cats, otherCategory: cats.includes("other") ? String(b.otherCategory || "").slice(0, 60) : "", status: "review", created: Date.now() };
        db.tracks[t.id] = t;
        const tp = { id: uid8(), producerId: p.id, trackId: t.id, amount: Math.round(budget * 100) / 100, method: METHODS.includes(b.method) ? b.method : "paypal", coin: COINS.includes(b.coin) ? b.coin : "", status: "pending", created: Date.now() };
        if (["UAH", "USDT"].includes(b.cur) && Number(b.orig) > 0) { tp.cur = b.cur; tp.orig = Math.round(Number(b.orig) * 100) / 100; }
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
        if (!need(res, t && t.producerId === p.id && t.status !== "deleted" && amount >= 100 && amount <= 1000000, 400, "minimum budget is $100")) return;
        const tp = { id: uid8(), producerId: p.id, trackId: t.id, amount: Math.round(amount * 100) / 100, method: METHODS.includes(b.method) ? b.method : "paypal", coin: COINS.includes(b.coin) ? b.coin : "", status: "pending", created: Date.now() };
        if (["UAH", "USDT"].includes(b.cur) && Number(b.orig) > 0) { tp.cur = b.cur; tp.orig = Math.round(Number(b.orig) * 100) / 100; }
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
        const t = db.tracks[b.trackId]; if (!need(res, t && ["active", "archived"].includes(t.status), 404, "track not active")) return;
        let rem = Math.round((Number(b.budget) > 0 ? Number(b.budget) : trackLeft(t)) * 100) / 100; const budget = rem;
        if (!need(res, rem > 0, 400, "no budget left on this track")) return;
        const busy = new Set(Object.values(db.requests).filter(r => r.trackId === t.id && ["pending", "approved", "submitted"].includes(r.status)).map(r => r.openId));
        const cands = [];
        for (const acc of allAccounts()) {
          if (acc.demo || acc.adminStatus !== "approved" || !(acc.price > 0) || busy.has(acc.open_id)) continue;
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
      if (P === "/api/admin/price-ranges" && M === "POST") {
        const out = {}, src = b.ranges && typeof b.ranges === "object" ? b.ranges : {};
        for (const c of CATEGORIES) { const x = src[c] || {}, mn = Number(x.min), mx = Number(x.max); if (mn > 0 && mx >= mn && mx <= 200) out[c] = { min: Math.round(mn * 100) / 100, max: Math.round(mx * 100) / 100 }; }
        db.settings.ranges = out; saveDb(); return send(res, 200, { ranges: out });
      }
      if (P === "/api/admin/contacts" && M === "POST") { let tg = String(b.telegram || "").trim().slice(0, 200); if (tg && !/^https?:\/\//i.test(tg)) tg = "https://t.me/" + tg.replace(/^@/, "").replace(/^t\.me\//i, ""); if (tg && !/^https:\/\/(t|telegram)\.me\/\S+$/i.test(tg)) tg = ""; const dc = String(b.discord || "").trim().slice(0, 200); const link = (v, base, re) => { v = String(v || "").trim().slice(0, 200); if (!v) return ""; if (!/^https?:\/\//i.test(v)) v = base + v.replace(/^@/, ""); return re.test(v) ? v : ""; };
        const ig = link(b.instagram, "https://instagram.com/", /^https:\/\/(www\.)?instagram\.com\/\S+$/i), tk = link(b.tiktok, "https://www.tiktok.com/@", /^https:\/\/(www\.)?tiktok\.com\/\S+$/i);
        db.settings.contacts = { telegram: tg, discord: dc, instagram: ig, tiktok: tk }; saveDb(); return send(res, 200, db.settings.contacts); }
      if (P === "/api/admin/broadcast" && M === "POST") {
        const text = String(b.text || "").trim().slice(0, 300), title = String(b.title || "Promo Campaign").trim().slice(0, 80), aud = ["editors", "producers", "all"].includes(b.audience) ? b.audience : "editors";
        if (!need(res, text, 400, "write a message")) return;
        const n = Object.values(db.settings.push || {}).filter(x => aud === "all" || x.role === aud).length, r0 = await broadcast(aud, title, text, "/", b.type, !!b.email);
        return send(res, 200, { ok: true, inbox: inboxCounts(aud), subscribers: n, delivered: r0.sent, emails: r0.mails, mailTo: mailList(aud, NTYPES.includes(b.type) ? b.type : "support").length, mailReady: !!(process.env.RESEND_API_KEY && process.env.MAIL_FROM) });
      }
      if (P === "/api/admin/demo-editor" && M === "POST") {    // test editor with fake videos, only for the owner's own checks
        const uid = "demo-editor"; let u = db.users[uid];
        if (!u) u = db.users[uid] = { id: uid, createdAt: Date.now(), accounts: [] };
        const now = Date.now(), vids = Array.from({ length: 14 }, (_, i) => ({ id: "9" + String(1e17 + i * 7919).slice(1), created: now - i * 2 * 86400000 - 3600000, views: Math.round(12000 + ((i * 7331) % 9) * 4200), likes: Math.round(1500 + ((i * 313) % 7) * 400), url: "" }));
        const mkAcc = (oid, un, dn, av, price, cats, about, nm, mul) => {
          let a = u.accounts.find(z => z.open_id === oid);
          if (!a) { a = { open_id: oid, createdAt: now, categories: [], discount: 0, demo: true, profile: {} }; u.accounts.push(a); }
          a.profile = { username: un, display_name: dn, avatar_url: av };
          a.videos = vids.map(v => Object.assign({}, v, { views: Math.round(v.views * mul) })); a.price = price; a.categories = cats; a.about = about; a.adminStatus = "approved"; a.analysisAt = now;
          a.tiers = [{ min: 3, pct: 5 }, { min: 6, pct: 10 }, { min: 12, pct: 15 }]; a.discount = 15; a.internal_name = nm; return a;
        };
        const acc = mkAcc("demo_editor_acc", "hexen0478", "HEXEN", HEX_AV, 3, ["gaming", "anime"], "Gaming and anime edits, fast cuts, three videos a week", "Hex (test)", 1);
        mkAcc("demo_editor_acc2", "pinterest_vibes", "Pinterest vibes", PIN_AV, 2.5, ["visual", "memes"], "Soft aesthetic edits, moodboards and photo dumps", "Vibes (test)", 0.6);
        u.payout = { method: "paypal", coin: "", label: "d***@test.com", enc: encObj({ method: "paypal", coin: "", value: "demo@test.com", holder: "" }) };
        // a ready demo track and a few demo orders in every state, so the owner can click through the editor screens
        let dp = Object.values(db.producers).find(x => x.email === "demo-producer@promo.test");
        if (!dp) { dp = { id: uid8(), email: "demo-producer@promo.test", name: "TEST producer", created: now }; db.producers[dp.id] = dp; }
        let dt = Object.values(db.tracks).find(x => x.demoEd && x.status !== "deleted");
        if (!dt) { dt = { id: uid8(), producerId: dp.id, title: "TEST track for editors", artist: "Demo artist", link: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT", links: { spotify: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT" }, budget: 80, spent: 0, platforms: ["tiktok"], categories: [], otherCategory: "", status: "active", created: now, demo: true, demoEd: true }; db.tracks[dt.id] = dt; }
        dt.categories = (dt.categories || []).length ? dt.categories : ["gaming", "anime"]; dt.descRule = true; dt.message = dt.message || "Add #promo and the artist's name to the description.";
        dt.links = Object.assign({ spotify: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT", soundcloud: "https://soundcloud.com/", tiktok: "https://www.tiktok.com/music/" }, dt.links || {});
        Object.values(db.requests).forEach(r => { if (r.demo && r.openId === acc.open_id) delete db.requests[r.id]; });
        const D = 86400000, mk = (st, videos, extra) => { const r = Object.assign({ id: uid8(), trackId: dt.id, openId: acc.open_id, price: 3, videos, discount: 10, priority: 5, status: st, links: [], created: now - 3 * D, updated: now, demo: true }, extra || {}); db.requests[r.id] = r; return r; };
        mk("pending", 2, { created: now - 3600e3 }); mk("submitted", 2, { created: now - 4 * D, approvedAt: now - 3 * D });
        mk("approved", 4, { created: now - 2 * D, approvedAt: now - 2 * D + 3600e3 });
        mk("completed", 1, { created: now - 8 * D, approvedAt: now - 7 * D, completedAt: now - 5 * D, paid: true, paidAt: now - 4 * D });
        mk("completed", 3, { created: now - 6 * D, approvedAt: now - 5 * D, completedAt: now - 2 * D });
        dt.spent = Math.round(Object.values(db.requests).filter(r => r.trackId === dt.id && ["approved", "submitted", "completed"].includes(r.status)).reduce((s, r) => s + reqCost(r), 0) * 100) / 100;
        const sid = newSid(); db.sessions[sid] = u.id; saveDb();
        return send(res, 200, { ok: true }, { "Set-Cookie": setCookie("sid", sid, 43200) });
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
        a.adminStatus = b.status; saveDb();
        if (["approved", "rejected", "banned"].includes(b.status)) notifyUser("editors", edUserOfOpen(a.open_id), "accounts", "acc_" + b.status, { h: "@" + ((a.profile || {}).username || "") });
        return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/price-decision" && M === "POST") {   // the manager accepts or declines the price an editor asked for
        const a = findAccAny(b.id); if (!need(res, a && a.priceReq, 404, "no price request")) return;
        const ok = b.ok !== false, h = "@" + ((a.profile || {}).username || "");
        if (ok) a.price = a.priceReq; delete a.priceReq; saveDb();
        notifyUser("editors", edUserOfOpen(a.open_id), "accounts", ok ? "price_ok" : "price_no", { h, p: "$" + a.price });
        return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/suggest-price" && M === "POST") {   // the manager suggests a new price, the editor accepts or declines
        const a = findAccAny(b.id); if (!need(res, a, 404, "no such account")) return;
        const pr = Number(b.price);
        if (b.price === null || b.price === "" || b.price === undefined) { delete a.suggested; saveDb(); return send(res, 200, { ok: true }); }
        if (!need(res, pr >= 1 && pr <= 200, 400, "price 1..200")) return;
        a.suggested = Math.round(pr * 100) / 100; saveDb();
        notifyUser("editors", edUserOfOpen(a.open_id), "accounts", "price_suggest", { h: "@" + ((a.profile || {}).username || ""), p: "$" + a.suggested });
        return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/track/create" && M === "POST") {    // the owner adds a track himself (already approved, budget as he sets it)
        const title = String(b.title || "").trim().slice(0, 120); if (!need(res, title, 400, "write the track title")) return;
        const link = String(b.link || "").trim().slice(0, 400); if (!need(res, !link || /^https?:\/\/\S+\.\S+/i.test(link), 400, "the link must start with https://")) return;
        const budget = Math.max(0, Math.min(100000, Math.round(Number(b.budget) * 100) / 100 || 0));
        const t = { id: uid8(), producerId: "owner", title, artist: String(b.artist || "").trim().slice(0, 120), link, links: link ? { [classifyLink(link)]: link } : {}, budget, spent: 0, platforms: ["tiktok"], categories: cleanCats(b.categories), otherCategory: "", status: "active", created: Date.now() };
        db.tracks[t.id] = t; saveDb(); return send(res, 200, { ok: true, id: t.id });
      }
      if (P === "/api/admin/track/archive" && M === "POST") {    // finished tracks go to the archive; the owner can bring them back
        const t = db.tracks[b.id];
        if (b.archived === false) { if (!need(res, t && t.status === "archived", 404, "not in the archive")) return; t.status = "active"; t.archivedAt = 0; saveDb(); return send(res, 200, { ok: true }); }
        if (!need(res, t && t.status === "active", 404, "only an active track can be archived")) return;
        const open = Object.values(db.requests).filter(r => r.trackId === t.id && ["pending", "approved", "submitted", "returned"].includes(r.status)).length;
        if (!need(res, open === 0, 409, "This track has " + open + " open order(s). Finish or cancel them first.")) return;
        t.status = "archived"; t.archivedAt = Date.now(); saveDb(); return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/track/delete" && M === "POST") {    // the owner can delete any track; its data stays in the database
        const t = db.tracks[b.id]; if (!need(res, t && t.status !== "deleted", 404, "no such track")) return;
        const open = Object.values(db.requests).filter(r => r.trackId === t.id && ["approved", "submitted", "returned"].includes(r.status)).length;
        if (!need(res, open === 0, 409, "This track has " + open + " open order(s). Finish or cancel them first.")) return;
        t.status = "deleted"; Object.values(db.requests).forEach(r => { if (r.trackId === t.id && r.status === "pending") r.status = "cancelled"; });
        saveDb(); return send(res, 200, { ok: true, left: trackLeft(t) });
      }
      if (P === "/api/admin/rating" && M === "POST") {       // manual stars 1..5 (null = back to automatic)
        const a = findAccAny(b.id); if (!need(res, a, 404, "no such account")) return;
        if (b.stars === null) delete a.rating_manual;
        else { const s = Number(b.stars); if (!need(res, s >= 2 && s <= 5, 400, "stars 2.0..5.0")) return; a.rating_manual = Math.round(s * 10) / 10; }
        saveDb(); return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/request" && M === "POST") {      // pending -> approved/rejected, submitted -> completed/returned
        const r = db.requests[b.id]; if (!need(res, r, 404, "no such request")) return;
        const st = b.status, from = r.status;
        const allowed = { pending: ["approved", "rejected"], submitted: ["completed", "returned", "cancelled"], approved: ["cancelled"], returned: ["cancelled"] };
        if (!need(res, (allowed[from] || []).includes(st), 409, "cannot change " + from + " to " + st)) return;
        if (st === "approved") {
          const t = db.tracks[r.trackId], cost = reqCost(r);
          if (!need(res, t && t.status === "active" && trackLeft(t) >= cost, 409, "not enough budget on the track")) return;
          t.spent = Math.round(((t.spent || 0) + cost) * 100) / 100; r.approvedAt = Date.now();
        }
        if (st === "cancelled") refundReq(r);
        r.status = st; r.updated = Date.now(); if (st === "completed") r.completedAt = Date.now(); saveDb();
        notifyUser("editors", edUserOfOpen(r.openId), "orders", "ord_" + st, { t: (db.tracks[r.trackId] || {}).title || "" });
        return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/request-videos" && M === "POST") {   // the manager decides how many videos; the bulk discount follows automatically
        const r = db.requests[b.id]; if (!need(res, r && r.status === "pending", 404, "only a waiting request can be changed")) return;
        const v = Math.round(Number(b.videos)); if (!need(res, v >= 1 && v <= 500, 400, "videos 1..500")) return;
        const acc = findAccAny(r.openId); r.videos = v; r.discount = acc ? discountFor(acc, v) : 0; r.updated = Date.now(); saveDb();
        return send(res, 200, { ok: true, videos: r.videos, discount: r.discount, cost: reqCost(r) });
      }
      if (P === "/api/admin/eta" && M === "POST") {
        const r = db.requests[b.id]; if (!need(res, r, 404, "no such request")) return;
        r.eta = String(b.eta || "").trim().slice(0, 80); saveDb(); return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/proof" && M === "GET") { const img = await getProof(url.searchParams.get("id") || ""); return send(res, 200, { image: img }); }
      if (P === "/api/admin/payout" && M === "POST") {     // mark that the editor has been paid for a completed request
        const r = db.requests[b.id]; if (!need(res, r && ["approved","returned","submitted","completed"].includes(r.status), 404, "no such request")) return;
        r.paid = !!b.paid; r.paidAt = r.paid ? Date.now() : 0; if (r.paid && b.paidBy !== undefined) r.paidBy = String(b.paidBy).trim().slice(0, 60); if (r.paid) notifyUser("editors", edUserOfOpen(r.openId), "money", "money_paid", { a: "$" + reqCost(r), t: (db.tracks[r.trackId] || {}).title || "" });
        if (b.image) { if (!need(res, /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(b.image) && b.image.length < 700000, 400, "bad image")) return; await putProof(r.id, b.image); r.proof = true; } saveDb(); return send(res, 200, { ok: true });
      }
      if (P === "/api/admin/topup" && M === "POST") {        // confirm payment -> budget added to the track
        const tp = db.topups[b.id]; if (!need(res, tp && tp.status === "pending", 404, "no pending payment")) return;
        if (b.status === "confirmed" && !need(res, ["active", "archived"].includes((db.tracks[tp.trackId] || {}).status), 409, "approve the track first")) return;
        if (b.status === "confirmed") { const t = db.tracks[tp.trackId]; if (t && t.status === "archived") { t.status = "active"; t.archivedAt = 0; } if (t) { tp.fee = Math.round(tp.amount * FEE * 100) / 100; t.budget = Math.round(((t.budget || 0) + tp.amount - tp.fee) * 100) / 100; } tp.status = "confirmed"; tp.confirmedAt = Date.now(); }
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
  setInterval(() => { try { remindEditors(); } catch (e) { console.error(e); } }, 3600e3);
  setInterval(() => { try { expireOverdue(); } catch (e) { console.error(e); } }, 3600e3);
}).catch(e => { console.error("Could not load the database:", e); process.exit(1); });

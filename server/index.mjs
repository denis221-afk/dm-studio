import { createServer } from 'node:http';
import { serveStatic } from './static.mjs';
import { validateBrief, telegramText } from './validation.mjs';

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || `https://${process.env.RAILWAY_PUBLIC_DOMAIN || "dm-studio-production.up.railway.app"}`;
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || !ALLOWED_ORIGIN) throw new Error('Configure TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID and ALLOWED_ORIGIN');
if (new URL(ALLOWED_ORIGIN).origin !== ALLOWED_ORIGIN) throw new Error('ALLOWED_ORIGIN must contain only the origin');
const attempts = new Map();
// Only opaque IDs and delivery state; no form contents or Telegram credentials.
const deliveries = new Map();
const validRequestId = id => typeof id === "string" && /^[a-f0-9-]{36}$/i.test(id);
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of deliveries) if (entry.until < now) deliveries.delete(id);
  for (const [ip, entry] of attempts) if (entry.until < now) attempts.delete(ip);
}, 60000).unref();

const server = createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const reply = (code, body) => { res.writeHead(code, {'Content-Type':'application/json; charset=utf-8'}); res.end(JSON.stringify(body)); };
  if (req.url === '/health' && req.method === 'GET') return reply(200, {ok:true});
  const route = new URL(req.url, 'http://localhost');
  if (route.pathname === '/api/brief/status' && req.method === 'GET') {
    const id = route.searchParams.get('requestId');
    if (!validRequestId(id)) return reply(400, {ok:false});
    const entry = deliveries.get(id);
    // The unguessable ID reveals only status, never customer information.
    return reply(200, {ok:true, status:entry && entry.until > Date.now() ? entry.status : 'unknown'});
  }
  if (req.url !== '/api/brief') return serveStatic(req, res);
  if (req.headers.origin !== ALLOWED_ORIGIN) return reply(403, {ok:false});
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.writeHead(204); return res.end();
  }
  if (req.method !== 'POST') return reply(405, {ok:false});
  if (!req.headers['content-type']?.startsWith('application/json')) return reply(415, {ok:false});
  // Railway proxy supplies X-Forwarded-For. Limits are per instance and reset on restart.
  const ip = String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress).split(',').at(-1).trim();
  let entry = attempts.get(ip);
  if (!entry || entry.until < Date.now()) entry = {count:0, until:Date.now() + 600000};
  if (entry.count >= 5 || attempts.size >= 10000 && !attempts.has(ip)) return reply(429, {ok:false});
  entry.count++; attempts.set(ip, entry);
  const chunks = [];
  let size = 0;
  let delivery;
  try {
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 12000) return reply(413, {ok:false});
      chunks.push(chunk);
    }
    const input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const brief = validateBrief(input);
    if (input.requestId !== undefined) {
      if (!validRequestId(input.requestId)) return reply(400, {ok:false});
      const existing = deliveries.get(input.requestId);
      if (existing && existing.until > Date.now())
        return reply(existing.status === 'sent' ? 200 : 409, {ok:existing.status === 'sent'});
      if (deliveries.size >= 10000) return reply(503, {ok:false});
      delivery = {status:'pending', until:Date.now() + 1800000};
      deliveries.set(input.requestId, delivery);
    }
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id:TELEGRAM_CHAT_ID, text:telegramText(brief), link_preview_options:{is_disabled:true}}),
      signal:AbortSignal.timeout(20000)
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) {
      if (delivery) delivery.status = 'failed';
      return reply(502, {ok:false});
    }
    if (delivery) delivery.status = 'sent';
    return reply(200, {ok:true});
  } catch (error) {
    // Network timeouts are ambiguous: Telegram may already have accepted it.
    if (delivery) delivery.status = 'unknown';
    // Never log the bot token or customer data.
    return reply(error.message === 'invalid' || error instanceof SyntaxError ? 400 : 502, {ok:false});
  }
});
server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
process.on('SIGTERM', () => server.close(() => process.exit(0)));

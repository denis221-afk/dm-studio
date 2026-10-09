import { createServer } from 'node:http';
import { serveStatic } from './static.mjs';
import { validateBrief, telegramText } from './validation.mjs';

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || `https://${process.env.RAILWAY_PUBLIC_DOMAIN || "dm-studio-production.up.railway.app"}`;
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || !ALLOWED_ORIGIN) throw new Error('Configure TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID and ALLOWED_ORIGIN');
if (new URL(ALLOWED_ORIGIN).origin !== ALLOWED_ORIGIN) throw new Error('ALLOWED_ORIGIN must contain only the origin');
const attempts = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of attempts) if (entry.until < now) attempts.delete(ip);
}, 60000).unref();

const server = createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const reply = (code, body) => { res.writeHead(code, {'Content-Type':'application/json; charset=utf-8'}); res.end(JSON.stringify(body)); };
  if (req.url === '/health' && req.method === 'GET') return reply(200, {ok:true});
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
  try {
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 12000) return reply(413, {ok:false});
      chunks.push(chunk);
    }
    const brief = validateBrief(JSON.parse(Buffer.concat(chunks).toString('utf8')));
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id:TELEGRAM_CHAT_ID, text:telegramText(brief), link_preview_options:{is_disabled:true}}),
      signal:AbortSignal.timeout(10000)
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) return reply(502, {ok:false});
    return reply(200, {ok:true});
  } catch (error) {
    // Never log the bot token or customer data.
    return reply(error.message === 'invalid' || error instanceof SyntaxError ? 400 : 502, {ok:false});
  }
});
server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
process.on('SIGTERM', () => server.close(() => process.exit(0)));

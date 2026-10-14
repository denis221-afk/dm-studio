import { stat, readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { resolve, sep, extname } from 'node:path';
const root = resolve(new URL('../dist/', import.meta.url).pathname);
const types = {'.mjs':'text/javascript; charset=utf-8','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.mp4':'video/mp4','.ico':'image/x-icon'};
export async function serveStatic(req, res) {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (/\/404\.html$/.test(pathname)) throw new Error('missing');
    // Consolidate the Ukrainian alias and explicit index files into canonical URLs.
    let canonicalPath = pathname.replace(/^\/ua(?=\/|$)/, '') || '/';
    canonicalPath = canonicalPath.replace(/\/index\.html$/, '/').replace(/\/{2,}/g, '/');
    if (canonicalPath !== pathname) {
      const target = resolve(root, '.' + canonicalPath);
      if (!target.startsWith(root + sep) && target !== root) throw new Error('invalid');
      await stat(target);
      const search = new URL(req.url, 'http://localhost').search;
      res.writeHead(308, {Location:encodeURI(canonicalPath) + search}); res.end(); return;
    }
    if (pathname.startsWith('/demos/')) res.setHeader('X-Robots-Tag', 'noindex, follow');
    let path = resolve(root, '.' + pathname);
    if (!path.startsWith(root + sep) && path !== root) throw new Error('invalid');
    if ((await stat(path)).isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(308, {Location:encodeURI(pathname) + '/' + new URL(req.url, 'http://localhost').search}); res.end(); return; }
      path = resolve(path, 'index.html');
    }
    const info = await stat(path);
    if (!info.isFile()) throw new Error('missing');
    // Only Vite content-hashed resources are safe to cache permanently.
    const immutable = /^\/assets\/[^/]+-[A-Za-z0-9_-]{8}\.(?:js|css|woff2?)$/.test(pathname);
    const etag = `W/"${info.size.toString(16)}-${Math.trunc(info.mtimeMs).toString(16)}"`;
    const headers = {'Content-Type':types[extname(path)] ?? 'application/octet-stream',
      'Cache-Control':immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
      'ETag':etag, 'Last-Modified':info.mtime.toUTCString()};
    // Weak comparison is valid for GET/HEAD cache validation.
    const candidates = String(req.headers?.['if-none-match'] || '').split(',').map(v=>v.trim().replace(/^W\//,''));
    if (candidates.includes('*') || candidates.includes(etag.replace(/^W\//,''))) {
      res.writeHead(304,headers);res.end();return;
    }
    res.writeHead(200, {...headers, 'Content-Length':info.size});
    if (req.method === 'HEAD') res.end();
    else createReadStream(path).on('error', () => res.destroy()).pipe(res);
  } catch {
    // Missing pages keep HTTP 404; the error document is never a soft 200.
    let prefix = '';
    try { prefix = /^\/(en|pl)(?:\/|$)/.exec(new URL(req.url,'http://localhost').pathname)?.[1] || ''; } catch {}
    try {
      const body = await readFile(resolve(root, prefix, '404.html'));
      res.setHeader('X-Robots-Tag','noindex, follow');
      res.writeHead(404, {'Content-Type':'text/html; charset=utf-8','Content-Length':body.length,'Cache-Control':'no-cache'});
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end(req.method === 'HEAD' ? undefined : 'Not found');
    }
  }
}

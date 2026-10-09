import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { resolve, sep, extname } from 'node:path';
const root = resolve(new URL('../dist/', import.meta.url).pathname);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.mp4':'video/mp4','.ico':'image/x-icon'};
export async function serveStatic(req, res) {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let path = resolve(root, '.' + pathname);
    if (!path.startsWith(root + sep) && path !== root) throw new Error('invalid');
    if ((await stat(path)).isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(308, {Location:pathname + '/'}); res.end(); return; }
      path = resolve(path, 'index.html');
    }
    const info = await stat(path);
    if (!info.isFile()) throw new Error('missing');
    res.writeHead(200, {'Content-Type':types[extname(path)] ?? 'application/octet-stream','Content-Length':info.size,'Cache-Control':path.includes('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache'});
    if (req.method === 'HEAD') res.end();
    else createReadStream(path).on('error', () => res.destroy()).pipe(res);
  } catch { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end('Not found'); }
}

import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { serveStatic } from '../server/static.mjs';
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)];
const urls = entries.map(([,entry]) => entry.match(/<loc>([^<]+)<\/loc>/)[1]);
assert.equal(new Set(urls).size, urls.length);
const titles = new Set();
for (const [,entry] of entries) {
  const url = entry.match(/<loc>([^<]+)<\/loc>/)[1];
  const pathname = new URL(url).pathname;
  assert.ok(!pathname.startsWith('/ua/') && !pathname.startsWith('/demos/'));
  const html = await readFile(resolve('dist', '.'+pathname, 'index.html'), 'utf8');
  const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  assert.equal(canonical.length, 1, pathname);
  assert.equal(canonical[0][1], url);
  assert.equal((html.match(/<h1\b/g)||[]).length, 1, pathname);
  assert.ok(!/name="robots"[^>]*noindex/.test(html), pathname);
  const title = html.match(/<title>([^<]+)<\/title>/)[1];
  const titleKey = html.match(/<html lang="([^"]+)"/)[1] + ':' + title;
  assert.ok(!titles.has(titleKey), 'Duplicate title within language: '+title); titles.add(titleKey);
  assert.ok(/name="description"\s+content="[^"]+"/.test(html));
  for (const locale of ['uk','en','pl','x-default']) {
    const target = entry.match(new RegExp(`hreflang="${locale}" href="([^"]+)"`))?.[1];
    assert.ok(target && urls.includes(target), pathname+' '+locale);
    assert.ok(html.includes(`hreflang="${locale}" href="${target}"`));
    const sibling = await readFile(resolve('dist','.'+new URL(target).pathname,'index.html'),'utf8');
    assert.ok(sibling.includes(`href="${url}"`), 'Missing reciprocal language link');
  }
  for (const [,json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(json);
  for (const [,src] of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) {
    if (src.startsWith('/')) await stat(resolve('dist','.'+new URL(src,url).pathname));
  }
}
const robots = await readFile('dist/robots.txt','utf8');
assert.ok(robots.includes('Sitemap: '+new URL('/sitemap.xml',urls[0]).href));
async function request(url) {
 const headers={}; let code;
 const res={setHeader:(k,v)=>headers[k]=v,writeHead:(c,h={})=>{code=c;Object.assign(headers,h)},end:()=>{}};
 await serveStatic({method:'HEAD',url},res); return {code,headers};
}
for (const [from,to] of [['/ua/','/'],['/index.html?utm_source=test','/?utm_source=test'],['/en/index.html','/en/'],['/ua//en/','/en/']]) {
 const response=await request(from);assert.equal(response.code,308);assert.equal(response.headers.Location,to);
}
assert.equal((await request('/not-a-real-page/')).code,404);
assert.equal((await request('/demos/modera/')).headers['X-Robots-Tag'],'noindex, follow');
console.info(`SEO passed: ${urls.length} pages, unique titles, metadata, reciprocal hreflang, sitemap, images, JSON-LD, redirects and 404.`);

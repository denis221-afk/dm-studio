import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { serveStatic } from '../server/static.mjs';
async function request(url,headers={}){
 const result={headers:{}};
 await serveStatic({method:'HEAD',url,headers},{setHeader:(k,v)=>result.headers[k]=v,writeHead:(code,h={})=>{result.code=code;Object.assign(result.headers,h)},end:b=>result.body=b});
 return result;
}
const js=(await readdir('dist/assets')).find(p=>/^index-.*\.js$/.test(p));
const versioned=await request('/assets/'+js);
assert.equal(versioned.headers['Cache-Control'],'public, max-age=31536000, immutable');
for(const path of ['/','/demos/modera/assets/style.css','/images/denys.webp']){
 const first=await request(path);assert.equal(first.code,200);assert.equal(first.headers['Cache-Control'],'no-cache');assert.ok(first.headers.ETag);
 const cached=await request(path,{'if-none-match':first.headers.ETag});assert.equal(cached.code,304);assert.equal(cached.body,undefined);assert.equal(cached.headers['Content-Length'],undefined);
 const stale=await request(path,{'if-none-match':'W/"old"'});assert.equal(stale.code,200);
}
console.info('Passed: content-hashed asset caching, mutable demo freshness, ETag 304 and stale validator responses.');

import assert from 'node:assert/strict';
import { readFile,stat,readdir } from 'node:fs/promises';
import { blogPosts,postUi } from '../src/data/blog.js';
import { blogUi } from '../src/data/blog-client.js';
import blogTranslations from '../src/i18n/blog.js';
for(const lang of ['ua','en','pl']){
 assert.deepEqual(blogUi[lang],Object.assign({},...blogPosts.map(p=>postUi(p,lang,blogTranslations[lang].ui))));
 const prefix=lang==='ua'?'':lang+'/';const html=await readFile('dist/'+prefix+'index.html','utf8');
 assert.ok(html.includes('<style data-critical-css>'));
 const css=html.match(/<style data-critical-css>(.*?)<\/style>/s)[1];
 for(const selector of ['.header','.hero','.portrait','.button','.analytics-consent'])assert.ok(css.includes(selector),selector);
 assert.ok(/rel="stylesheet" media="print" onload=/.test(html));
 assert.ok(/<noscript><link[^>]*rel="stylesheet"/.test(html));
 const preload=html.match(/<link\b[^>]*imagesrcset="([^"]+)"[^>]*>/)[0];
 const portrait=html.match(/<img\b[^>]*class="portrait"[^>]*>/)[0];
 assert.ok(preload.includes('fetchpriority="high"'));
 assert.equal(preload.match(/imagesrcset="([^"]+)"/)[1],portrait.match(/srcset="([^"]+)"/)[1]);
 assert.equal(preload.match(/imagesizes="([^"]+)"/)[1],portrait.match(/sizes="([^"]+)"/)[1]);
 for(const [,path] of portrait.matchAll(/(\/images\/denys-\d+\.webp)/g))await stat('dist'+path);
}
const js=(await readdir('dist/assets')).find(p=>/^index-.*\.js$/.test(p));const bundle=await readFile('dist/assets/'+js,'utf8');
assert.ok(!bundle.includes(blogPosts[0].ua.sections[0].paragraphs[0]),'Full article must stay out of initial JS');
for(const w of [320,480,640,817])assert.ok((await stat(`public/images/denys-${w}.webp`)).size<(await stat('public/images/denys.webp')).size);
console.info('Passed: critical styles, no-JS stylesheet fallback, responsive preload, compact client metadata and smaller portrait resources.');

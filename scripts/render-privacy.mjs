import { mkdir, writeFile } from 'node:fs/promises';
import { renderAboutPage } from './render-about.mjs';
import { privacyContent } from '../src/data/privacy.js';
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderPrivacyPage(source, language, siteUrl='', base='/') {
  const content = privacyContent[language];
  const ui = content.ui;
  const prefix = language==='ua' ? '' : language+'/';
  const home = base+prefix;
  const body = `<article class="privacy-page container" data-privacy-page><a class="privacy-back" data-locale-href="#home" href="${home}#home">← ${escape(ui.privacyBack)}</a><header><p class="eyebrow">DM STUDIO</p><h1>${escape(ui.privacyTitle)}</h1><p class="privacy-date">${escape(ui.privacyUpdated)}</p><p class="privacy-lead">${escape(content.intro)}</p></header><div class="privacy-copy">${content.sections.map(([title,text],index)=>`<section aria-labelledby="privacy-${index}"><h2 id="privacy-${index}">${escape(title)}</h2><p>${escape(text)}</p></section>`).join('')}<section aria-labelledby="privacy-contact"><h2 id="privacy-contact">${escape(content.contact)}</h2><a href="mailto:denis.mazuryk@gmail.com">denis.mazuryk@gmail.com</a><a href="https://t.me/MazurykD">Telegram: @MazurykD</a></section><section aria-labelledby="privacy-providers"><h2 id="privacy-providers">${escape(content.providers)}</h2><a href="https://railway.com/legal/privacy">Railway</a><a href="https://telegram.org/privacy">Telegram</a><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub</a></section></div></article>`;
  let html = renderAboutPage(source,language,siteUrl,base).replace(/<main\b[^>]*>[\s\S]*?<\/main>/,`<main id="main">${body}</main>`);
  html=html.replace(/(<a\b[^>]*data-locale-href="about\/"[^>]*) class="is-current" aria-current="page"/g,'$1');
  html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(ui.privacyTitle)} — DM Studio</title>`);
  html=html.replace(/<meta\b[^>]*>/g,tag=>{
    const key=tag.match(/(?:name|property)="([^"]+)"/)?.[1];
    const value=['description','og:description','twitter:description'].includes(key)?ui.privacyMeta:['og:title','twitter:title'].includes(key)?ui.privacyTitle+' — DM Studio':key==='og:url'&&siteUrl?new URL(prefix+'privacy/',siteUrl).href:null;
    return value?tag.replace(/content="[^"]*"/,`content="${escape(value)}"`):tag;
  });
  html=html.replace(/<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/g,tag=>tag.replace(/about\//g,'privacy/'));
  html=html.replace(/<noscript[\s\S]*?<\/noscript>/g,block=>block.replace(/about\//g,'privacy/'));
  html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(tag,json)=>{
    const schema=JSON.parse(json);
    if(schema['@type']!=='ProfilePage') return tag;
    const page={'@context':'https://schema.org','@type':'WebPage',name:ui.privacyTitle,description:ui.privacyMeta,inLanguage:language==='ua'?'uk':language,dateModified:'2026-10-09',url:siteUrl?new URL(prefix+'privacy/',siteUrl).href:undefined};
    return '<script type="application/ld+json">'+JSON.stringify(page).replaceAll('<','\\u003c')+'</script>';
  });
  return html;
}
export async function writePrivacyPages(source,siteUrl,base) {
  for (const language of ['ua','en','pl']) {
    const path=(language==='ua'?'':language+'/')+'privacy/';
    await mkdir('dist/'+path,{recursive:true});
    await writeFile('dist/'+path+'index.html',renderPrivacyPage(source,language,siteUrl,base));
  }
}

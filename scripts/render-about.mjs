
import { mkdir, writeFile } from "node:fs/promises";
import { renderHtml } from "./render-html.mjs";
import { aboutContent } from "./about-template.mjs";
import { translations } from "../src/i18n/index.js";
const escape = value => String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
export function renderAboutPage(source, language, siteUrl = "", base = "/") {
  const prefix = language === "ua" ? "" : language + "/";
  const home = base + prefix;
  let html = source.replace(/<main\b[^>]*>[\s\S]*?<\/main>/, '<main id="main">' + aboutContent(base,language) + '</main>');
  html = html.replace(/<nav\b[^>]*id="navigation"[^>]*>[\s\S]*?<\/nav>/, nav => {
    let result = nav.replace(/\sclass="is-current"/g,"").replace(/\saria-current="[^"]*"/g,"");
    result = result.replace(/href="#([^"]+)"/g, (_,id) => 'href="' + home + (id === "cases" ? 'cases/' : '#' + id) + '" data-locale-href="' + (id === "cases" ? 'cases/' : '#' + id) + '"');
    return result.replace(/(<a\b[^>]*data-locale-href="about\/")/, '$1 class="is-current" aria-current="page"');
  });
  html = html.replace(/href="#home"/g, 'href="' + home + '#home" data-locale-href="#home"').replace(/href="#contact"/g, 'href="' + home + '#contact" data-locale-href="#contact"');
  html = html.replace(/<noscript[\s\S]*?<\/noscript>/g, block => block.includes("Мови:") ? '<noscript><p class="container">' + ["ua","en","pl"].map(lang => '<a href="' + base + (lang === "ua" ? "" : lang + "/") + 'about/">' + {ua:"Українська",en:"English",pl:"Polski"}[lang] + '</a>').join(" · ") + '</p></noscript>' : block);
  html = renderHtml(html,language,siteUrl);
  const t = translations[language].ui;
  html = html.replace(/<title>[\s\S]*?<\/title>/,'<title>' + escape(t.aboutMetaTitle) + '</title>');
  html = html.replace(/<meta\b[^>]*>/g, tag => {
    const key = tag.match(/(?:name|property)="([^"]+)"/)?.[1];
    const value = ["description","og:description","twitter:description"].includes(key) ? t.aboutMetaDescription : ["og:title","twitter:title"].includes(key) ? t.aboutMetaTitle : key === "og:url" && siteUrl ? new URL(prefix + "about/",siteUrl).href : null;
    return value ? tag.replace(/content="[^"]*"/,'content="' + escape(value) + '"') : tag;
  });
  if (siteUrl) {
    const url = new URL(prefix + "about/",siteUrl).href;
    html = html.replace(/<link rel="canonical" href="[^"]+">/,'<link rel="canonical" href="' + url + '">');
    html = html.replace(/<link rel="alternate" hreflang="([^"]+)" href="[^"]+">/g, (_,locale) => '<link rel="alternate" hreflang="' + locale + '" href="' + new URL((["en","pl"].includes(locale) ? locale + "/" : "") + "about/",siteUrl).href + '">');
    const schema = {"@context":"https://schema.org","@type":"ProfilePage",url,name:t.aboutMetaTitle,description:t.aboutMetaDescription,inLanguage:language === "ua" ? "uk" : language,mainEntity:{"@type":"Person","@id":new URL("about/#denys",siteUrl).href,name:"Denys",image:new URL("images/denys.webp",siteUrl).href,worksFor:{"@type":"Organization",name:"DM Studio",url:siteUrl},knowsAbout:["Web development","Telegram bots","Workflow automation","AI integrations"]}};
    html = html.replace("</head>",'<script type="application/ld+json">' + JSON.stringify(schema).replaceAll("<","\\u003c") + '</script></head>');
  }
  return html;
}
export async function writeAboutPages(source,siteUrl,base) {
  for (const language of ["ua","en","pl"]) {
    const path = (language === "ua" ? "" : language + "/") + "about/";
    await mkdir("dist/" + path,{recursive:true});
    await writeFile("dist/" + path + "index.html",renderAboutPage(source,language,siteUrl,base));
  }
}

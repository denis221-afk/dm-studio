
import { mkdir, writeFile } from "node:fs/promises";
import { renderHtml } from "./render-html.mjs";
import { casesOverview, caseDetail } from "./case-templates.mjs";
import { caseProjects } from "../src/data/cases.js";
import { translations } from "../src/i18n/index.js";
export const caseRoutes = ["cases/", ...caseProjects.map(item => "cases/" + item.slug + "/")];
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
export function renderCasePage(source, language, slug = "", siteUrl = "", base = "/") {
  const prefix = language === "ua" ? "" : language + "/";
  const home = base + prefix;
  const project = slug ? caseProjects.find(item => item.slug === slug) : null;
  if (slug && !project) throw new Error("Unknown case: " + slug);
  const path = "cases/" + (slug ? slug + "/" : "");
  const body = project ? caseDetail(project, base, language) : casesOverview(base, language);
  let html = source.replace(/<main\b[^>]*>[\s\S]*?<\/main>/, '<main id="main">' + body + '</main>');
  html = html.replace(/<nav\b[^>]*id="navigation"[^>]*>[\s\S]*?<\/nav>/, nav => {
    let result = nav.replace(/\sclass="is-current"/g, "").replace(/\saria-current="page"/g, "");
    result = result.replace(/(?<![-\w])href="#([^"]+)"/g, (_, id) => id === "cases" ? 'href="' + home + 'cases/" data-locale-href="cases/" class="is-current" aria-current="page"' : 'href="' + home + '#' + id + '" data-locale-href="#' + id + '"');
    result = result.replace(/(?<![-\w])href="[^"]*#blog" data-locale-href="#blog"/, 'href="' + home + 'blog/" data-locale-href="blog/"');
    return result;
  });
  html = html.replace(/(?<![-\w])href="#home"/g, 'href="' + home + '#home" data-locale-href="#home"');
  html = html.replace(/(?<![-\w])href="#contact"/g, 'href="' + home + '#contact" data-locale-href="#contact"');
  html = html.replace(/<noscript[\s\S]*?<\/noscript>/g, block => {
    if (!block.includes("Мови:")) return block;
    return '<noscript><p class="container">' + ["ua", "en", "pl"].map(lang => '<a href="' + base + (lang === "ua" ? "" : lang + "/") + path + '">' + {ua:"Українська",en:"English",pl:"Polski"}[lang] + '</a>').join(" · ") + '</p></noscript>';
  });
  html = renderHtml(html, language, siteUrl);
  const t = translations[language];
  const title = (project ? project.name : t.ui.navCases) + " — DM Studio";
  const description = project ? t.ui[project.descriptionKey] : t.ui.casesIntro;
  html = html.replace(/<title>[\s\S]*?<\/title>/, "<title>" + escape(title) + "</title>");
  html = html.replace(/<meta\b[^>]*>/g, tag => {
    const key = tag.match(/(?:name|property)="([^"]+)"/)?.[1];
    if (["description","og:description","twitter:description"].includes(key)) return tag.replace(/content="[^"]*"/, 'content="' + escape(description) + '"');
    if (["og:title","twitter:title"].includes(key)) return tag.replace(/content="[^"]*"/, 'content="' + escape(title) + '"');
    if (key === "og:url" && siteUrl) return tag.replace(/content="[^"]*"/, 'content="' + new URL(prefix + path, siteUrl).href + '"');
    return tag;
  });
  if (siteUrl) {
    html = html.replace(/<link rel="canonical" href="[^"]+">/, '<link rel="canonical" href="' + new URL(prefix + path,siteUrl).href + '">');
    html = html.replace(/<link rel="alternate" hreflang="([^"]+)" href="[^"]+">/g, (_, locale) => '<link rel="alternate" hreflang="' + locale + '" href="' + new URL((locale === "en" || locale === "pl" ? locale + "/" : "") + path,siteUrl).href + '">');
    const breadcrumbs = {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:t.ui.navHome,item:new URL(prefix,siteUrl).href},{"@type":"ListItem",position:2,name:t.ui.navCases,item:new URL(prefix + "cases/",siteUrl).href}]};
    if (project) breadcrumbs.itemListElement.push({"@type":"ListItem",position:3,name:project.name,item:new URL(prefix + path,siteUrl).href});
    html = html.replace("</head>",'<script type="application/ld+json">' + JSON.stringify(breadcrumbs).replaceAll("<","\\u003c") + '</script></head>');
  }
  return html;
}
export async function writeCasePages(source, siteUrl, base) {
  for (const language of ["ua","en","pl"]) {
    const prefix = language === "ua" ? "" : language + "/";
    for (const slug of ["", ...caseProjects.map(item => item.slug)]) {
      const path = prefix + "cases/" + (slug ? slug + "/" : "");
      await mkdir("dist/" + path, {recursive:true});
      await writeFile("dist/" + path + "index.html", renderCasePage(source,language,slug,siteUrl,base));
    }
  }
}

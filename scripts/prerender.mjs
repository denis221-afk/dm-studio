import { readFile, writeFile, mkdir } from "node:fs/promises";
import { renderHtml } from "./render-html.mjs";
import { writeCasePages, caseRoutes } from "./render-cases.mjs";
import { writeAboutPages } from "./render-about.mjs";
import { writeBlogPages, blogRoutes } from "./render-blog.mjs";
import { writePrivacyPages } from "./render-privacy.mjs";
import { servicePages } from "../src/data/service-pages.js";
import { writeServicePages, serviceRoutes } from "./render-services.mjs";
import { blogPreview } from "./blog-template.mjs";

let siteUrl = process.env.SITE_URL || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "https://dm-studio-production.up.railway.app");
if (siteUrl) {
  const url = new URL(siteUrl);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("SITE_URL must be an http(s) URL");
  siteUrl = `${url.origin}${url.pathname.replace(/\/$/, "")}/`;
}
const rawSource = await readFile("dist/index.html", "utf8");
const source = rawSource.replace(/<section\b[^>]*id="blog"[\s\S]*?<\/section>/, blogPreview(process.env.BASE_PATH || "/"));
for (const language of ["ua", "en", "pl"]) {
  let html = renderHtml(source, language, siteUrl);
  const prefix = language === "ua" ? "" : language + "/";
  const base = process.env.BASE_PATH || "/";
  const serviceLinks = `<nav class="seo-home-links container" aria-label="${language === "ua" ? "Послуги докладніше" : language === "pl" ? "Szczegóły usług" : "Explore services"}">${servicePages.map(p=>`<a href="${base}${prefix}services/${p.slug}/">${p[language].title} ↗</a>`).join("")}</nav>`;
  html = html.replace('<section class="sol', serviceLinks + '<section class="sol');

  if (siteUrl) {
    const locale = language === "ua" ? "uk" : language;
    const pageUrl = new URL(language === "ua" ? "" : language + "/", siteUrl).href;
    const schema = {"@context":"https://schema.org", "@type":"WebSite", "@id":pageUrl+"#website", url:pageUrl, name:"DM Studio", inLanguage:locale, publisher:{"@id":new URL("#organization",siteUrl).href}};
    html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
  }
  await mkdir(`dist/${language}`, { recursive: true });
  await writeFile(`dist/${language}/index.html`, html);
  if (language === "ua") await writeFile("dist/index.html", html);
}
await writeCasePages(source, siteUrl, process.env.BASE_PATH || "/");
await writeAboutPages(source, siteUrl, process.env.BASE_PATH || "/");
await writeBlogPages(source, siteUrl, process.env.BASE_PATH || "/");
await writePrivacyPages(source, siteUrl, process.env.BASE_PATH || "/");
await writeServicePages(source, siteUrl, process.env.BASE_PATH || "/");
if (siteUrl) {
  const routes = ["", ...caseRoutes, "about/", "privacy/", ...blogRoutes, ...serviceRoutes];
  const locales = [["uk", ""], ["en", "en/"], ["pl", "pl/"], ["x-default", ""]];
  const xmlEscape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const entries = routes.flatMap(route => ["", "en/", "pl/"].map(prefix => {
    const alternatives = locales.map(([locale, path]) => `<xhtml:link rel="alternate" hreflang="${locale}" href="${xmlEscape(new URL(path + route, siteUrl).href)}"/>`).join("");
    return `<url><loc>${xmlEscape(new URL(prefix + route, siteUrl).href)}</loc>${alternatives}</url>`;
  }));
  await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join("")}</urlset>`);
  await writeFile(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /health\nSitemap: ${siteUrl}sitemap.xml\n`,
  );
} else {
  await writeFile("dist/robots.txt", "User-agent: *\nAllow: /\n");
  console.info(
    "SITE_URL is unset: canonical, hreflang and sitemap will be generated when you supply your real domain.",
  );
}
console.info("Static HTML generated for Ukrainian, English and Polish.");

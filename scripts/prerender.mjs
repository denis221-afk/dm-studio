import { readFile, writeFile, mkdir } from "node:fs/promises";
import { renderHtml } from "./render-html.mjs";
import { writeCasePages, caseRoutes } from "./render-cases.mjs";
import { writeAboutPages } from "./render-about.mjs";

let siteUrl = process.env.SITE_URL || "";
if (siteUrl) {
  const url = new URL(siteUrl);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("SITE_URL must be an http(s) URL");
  siteUrl = `${url.origin}${url.pathname.replace(/\/$/, "")}/`;
}
const source = await readFile("dist/index.html", "utf8");
for (const language of ["ua", "en", "pl"]) {
  const html = renderHtml(source, language, siteUrl);
  await mkdir(`dist/${language}`, { recursive: true });
  await writeFile(`dist/${language}/index.html`, html);
  if (language === "ua") await writeFile("dist/index.html", html);
}
await writeCasePages(source, siteUrl, process.env.BASE_PATH || "/");
await writeAboutPages(source, siteUrl, process.env.BASE_PATH || "/");
if (siteUrl) {
  const urls = ["./", "en/", "pl/", ...["", "en/", "pl/"].flatMap(prefix => [...caseRoutes, "about/"].map(route => prefix + route))].map((path) => new URL(path, siteUrl).href);
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url.replaceAll("&", "&amp;")}</loc></url>`).join("")}</urlset>`,
  );
  await writeFile(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`,
  );
} else {
  await writeFile("dist/robots.txt", "User-agent: *\nAllow: /\n");
  console.info(
    "SITE_URL is unset: canonical, hreflang and sitemap will be generated when you supply your real domain.",
  );
}
console.info("Static HTML generated for Ukrainian, English and Polish.");

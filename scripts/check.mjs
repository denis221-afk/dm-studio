import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { translations } from "../src/i18n/index.js";
import { renderHtml } from "./render-html.mjs";

const source = await readFile("index.html", "utf8");
const keys = [...source.matchAll(/data-i18n="([^"]+)"/g)].map(
  (match) => match[1],
);
for (const language of ["ua", "en", "pl"]) {
  const t = translations[language];
  for (const key of keys)
    assert.equal(typeof t.ui[key], "string", `${language}: ${key}`);
  const html = renderHtml(source, language, "https://example.test");
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal(
    (html.match(/data-i18n="/g) || []).length,
    keys.length,
    "Localization must preserve every element",
  );
  assert.ok(html.includes(`lang="${language === "ua" ? "uk" : language}"`));
  assert.ok(html.includes('rel="canonical"'));
  assert.ok(html.includes('hreflang="uk"'));
  assert.ok(html.includes(`>${t.ui.hello}</h2>`));
  const descriptionTag = html.match(/<meta\b[^>]*name="description"[^>]*>/)[0];
  assert.ok(descriptionTag.includes(t.meta.description));
  const schema = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )[1];
  assert.equal(JSON.parse(schema).name, "DM Studio");
}
const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "Duplicate HTML ids");
for (const [, target] of source.matchAll(/href="#([^"]+)"/g))
  assert.ok(ids.includes(target), `Missing #${target}`);
const sprite = await readFile("public/icons.svg", "utf8");
for (const [, symbol] of source.matchAll(/\/icons\.svg#([^"\s]+)/g))
  assert.ok(sprite.includes(`id="${symbol}"`), `Missing icon: ${symbol}`);
console.info(
  "Passed: translations, static routes, schema, anchors and SVG symbols.",
);

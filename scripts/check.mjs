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

for (const language of ["ua", "en", "pl"]) {
  const t = translations[language];
  for (const category of ["restaurant", "booking", "leads"]) {
    assert.equal(t.solutions[category].length, 4, language + ": " + category);
    assert.ok(t.solutions[category].every(item => typeof item === "string" && item.length > 0));
    assert.ok(source.includes('data-solution="' + category + '"'));
    assert.ok(source.includes('data-solution-filter="' + category + '"'));
    assert.ok(source.includes('data-solution-open="' + category + '"'));
  }
  for (const [, key] of source.matchAll(/data-i18n-attr="[^:"]+:([^"]+)"/g)) {
    assert.equal(typeof t.ui[key], "string", language + ": accessible label " + key);
  }
  const translated = renderHtml(source, language, "https://example.test/dm-studio/");
  assert.ok(translated.includes(t.ui.solRestaurantTitle));
  assert.ok(translated.includes(t.ui.solBookingTitle));
  assert.ok(translated.includes(t.ui.solLeadsTitle));
}
assert.ok(source.indexOf('id="services"') < source.indexOf('id="solutions"'));
assert.ok(source.indexOf('id="solutions"') < source.indexOf('id="cases"'));
console.info("Passed: solution category markup, localized details, accessible labels and section order.");


const { renderCasePage } = await import("./render-cases.mjs");
const { caseProjects } = await import("../src/data/cases.js");
assert.equal(caseProjects.length, 2);
for (const language of ["ua","en","pl"]) {
 for (const slug of ["", ...caseProjects.map(project => project.slug)]) {
  const page = renderCasePage(source,language,slug,"https://example.test/dm-studio/","/dm-studio/");
  assert.equal((page.match(/<h1\b/g) || []).length,1);
  const route = (language === "ua" ? "" : language + "/") + "cases/" + (slug ? slug + "/" : "");
  assert.ok(page.includes('rel="canonical" href="https://example.test/dm-studio/' + route + '"'));
  assert.ok(page.includes(translations[language].ui.casesClient));
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length,new Set(ids).size);
  for (const [,key] of page.matchAll(/data-i18n="([^"]+)"/g)) assert.equal(typeof translations[language].ui[key],"string");
  assert.ok(!page.includes("undefined"));
 }
}
console.info("Passed: nine case routes, localization, client labels, canonicals and unique IDs.");

const { renderAboutPage } = await import("./render-about.mjs");
for (const language of ["ua","en","pl"]) {
  const page = renderAboutPage(source,language,"https://example.test/dm-studio/","/dm-studio/");
  assert.equal((page.match(/<h1\b/g) || []).length,1);
  const prefix = language === "ua" ? "" : language + "/";
  assert.ok(page.includes('rel="canonical" href="https://example.test/dm-studio/' + prefix + 'about/"'));
  assert.ok(page.includes(translations[language].ui.aboutMetaTitle));
  assert.ok(page.includes('data-locale-href="about/" class="is-current" aria-current="page"'));
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length,new Set(ids).size);
  for (const [,key] of page.matchAll(/data-i18n="([^"]+)"/g)) assert.equal(typeof translations[language].ui[key],"string");
  assert.ok(!page.includes("undefined"));
  const schemas = [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert.ok(schemas.some(schema => schema["@type"] === "ProfilePage" && schema.mainEntity["@type"] === "Person"));
}
console.info("Passed: three about routes, profile schema, localized metadata and active navigation.");

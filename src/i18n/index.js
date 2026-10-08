import ua from "./ua.js";
import pl from "./pl.js";
import en from "./en.js";

import serviceTranslations from "./services.js";
import solutionTranslations from "./solutions.js";
import caseTranslations from "./cases.js";

export const translations = Object.fromEntries(
  Object.entries({ ua, pl, en }).map(([language, translation]) => [language, {
    ...translation,
    ui: { ...translation.ui, ...serviceTranslations[language].ui, ...solutionTranslations[language].ui, ...caseTranslations[language].ui },
    services: serviceTranslations[language].details,
    solutions: solutionTranslations[language].details,
  }]),
);
const basePath = import.meta.env?.BASE_URL ?? "/";

export const supportedLanguages = ["ua", "pl", "en"];

export function getCurrentLanguage(pathname = window.location.pathname) {
  const relativePath = pathname.startsWith(basePath)
    ? pathname.slice(basePath.length)
    : pathname;
  const segment = relativePath.split("/").filter(Boolean)[0];
  return supportedLanguages.includes(segment) ? segment : "ua";
}

export function getTranslations(language = getCurrentLanguage()) {
  return translations[language] ?? translations.ua;
}

export function changeLanguage(language) {
  if (!supportedLanguages.includes(language)) return;
  const destination = new URL(window.location.href);
  const relativePath = destination.pathname.startsWith(basePath) ? destination.pathname.slice(basePath.length) : destination.pathname.slice(1);
  const parts = relativePath.split("/").filter(Boolean);
  if (supportedLanguages.includes(parts[0])) parts.shift();
  const suffix = parts.length ? parts.join("/") + "/" : "";
  destination.pathname = `${basePath}${language === "ua" ? "" : `${language}/`}${suffix}`;
  window.location.assign(destination.href);
}

/** Text is assigned safely; the HTML layout is never overwritten. */
export function applyTranslations(language = getCurrentLanguage()) {
  const t = getTranslations(language);
  document.documentElement.lang = language === "ua" ? "uk" : language;
  document.title = t.meta.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", t.meta.description);
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = t.ui[element.dataset.i18n];
    if (typeof value === "string") element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    const [attribute, key] = element.dataset.i18nAttr.split(":");
    const value = t.ui[key];
    if (typeof value === "string") element.setAttribute(attribute, value);
  });
  document.querySelectorAll("[data-locale-href]").forEach(element => {
    element.setAttribute("href", `${basePath}${language === "ua" ? "" : language + "/"}${element.dataset.localeHref}`);
  });
  const page = document.querySelector("[data-case-page]")?.dataset.casePage;
  if (page) {
    const title = page === "index" ? t.ui.navCases : page === "nfc-menu" ? "Restaurant NFC Menu" : "RHome Ohio";
    const description = page === "index" ? t.ui.casesIntro : page === "nfc-menu" ? t.ui.casesNfcDescription : t.ui.casesWpDescription;
    document.title = `${title} — DM Studio`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }
  const select = document.getElementById("language");
  if (select) select.value = language;
  return t;
}

import ua from "./ua.js";
import pl from "./pl.js";
import en from "./en.js";

export const translations = { ua, pl, en };
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
  destination.pathname = `${basePath}${language === "ua" ? "" : `${language}/`}`;
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
  const select = document.getElementById("language");
  if (select) select.value = language;
  return t;
}

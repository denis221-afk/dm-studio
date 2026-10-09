import { initAnalytics, trackEvent } from "./js/analytics.js";
import "./style.css";
import { applyTranslations, changeLanguage } from "./i18n/index.js";
import { initLoader } from "./js/loader.js";
import { initNavigation } from "./js/navigation.js";
import { initBrief } from "./js/brief.js";
import { initServices } from "./js/services.js";
import { initSolutions } from "./js/solutions.js";
import { initCases } from "./js/cases.js";
function initSite() {
  initLoader();
  const t = applyTranslations();
  initAnalytics();
  initServices(t);
  initSolutions(t);
  initCases(t);
  initNavigation(t);
  initBrief(t);
  document.getElementById("language")?.addEventListener("change", (event) => {
    trackEvent("language_change", { selected_language: event.target.value });
    changeLanguage(event.target.value);
  });
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite, { once: true });
} else {
  initSite();
}

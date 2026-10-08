import "./style.css";
import { applyTranslations, changeLanguage } from "./i18n/index.js";
import { initLoader } from "./js/loader.js";
import { initNavigation } from "./js/navigation.js";
import { initBrief } from "./js/brief.js";
import { initServices } from "./js/services.js";
function initSite() {
  initLoader();
  const t = applyTranslations();
  initNavigation(t);
  initBrief(t);
  document
    .getElementById("language")
    ?.addEventListener("change", (event) => changeLanguage(event.target.value));
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite, { once: true });
} else {
  initSite();
}

initServices();

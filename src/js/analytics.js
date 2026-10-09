const id = import.meta.env?.VITE_GA_MEASUREMENT_ID || "";
const enabled =
  /^G-[A-Z0-9]+$/.test(id) &&
  typeof location !== "undefined" &&
  location.hostname === "dm-studio-production.up.railway.app";
const key = "dm-analytics-consent-v1";
let accepted = false;
let started = false;
const lang =
  typeof document === "undefined" ? "uk" : document.documentElement.lang;
const copy =
  {
    uk: [
      "Аналітика сайту",
      "За вашою згодою Google Analytics допоможе зрозуміти, які сторінки й послуги корисні. Дані форми не передаємо в аналітику.",
      "Дозволити",
      "Відхилити",
      "Налаштування аналітики",
      "Політика конфіденційності",
    ],
    en: [
      "Website analytics",
      "With your consent, Google Analytics helps us understand useful pages and services. Form contents are never sent to analytics.",
      "Allow",
      "Decline",
      "Analytics preferences",
      "Privacy policy",
    ],
    pl: [
      "Analityka strony",
      "Za Twoją zgodą Google Analytics pomaga zrozumieć przydatność stron i usług. Treści formularza nie przesyłamy do analityki.",
      "Zezwól",
      "Odrzuć",
      "Ustawienia analityki",
      "Polityka prywatności",
    ],
  }[lang] || [];
function command() {
  window.dataLayer.push(arguments);
}
export function trackEvent(name, parameters = {}) {
  if (!enabled || !accepted || !started) return;
  command("event", name, { page_language: lang, ...parameters });
}
function start() {
  accepted = true;
  window[`ga-disable-${id}`] = false;
  if (started) return;
  started = true;
  window.dataLayer = window.dataLayer || [];
  // Consent is established before configuration; advertising stays disabled.
  command("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  command("js", new Date());
  command("config", id, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const cleanURL = location.origin + location.pathname;
  let referrer = "";
  try {
    if (document.referrer) {
      const url = new URL(document.referrer);
      referrer = url.origin + url.pathname;
    }
  } catch {
    /* No referrer. */
  }
  command("set", { page_location: cleanURL, page_referrer: referrer });
  trackEvent("page_view", {
    page_location: cleanURL,
    page_referrer: referrer,
    page_title: document.title,
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.append(script);
}
function clearCookies() {
  for (const entry of document.cookie.split(";")) {
    const name = entry.trim().split("=")[0];
    if (!/^_ga(?:_|$)/.test(name)) continue;
    const domains = ["", location.hostname, `.${location.hostname}`];
    for (const domain of domains)
      document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ""} SameSite=Lax`;
  }
}
export function initAnalytics() {
  if (!enabled || !copy.length) return;
  const panel = document.createElement("section");
  panel.className = "analytics-consent";
  panel.setAttribute("aria-label", copy[0]);
  const heading = document.createElement("h2");
  heading.textContent = copy[0];
  const text = document.createElement("p");
  text.textContent = copy[1];
  const policy = document.createElement("a");
  policy.textContent = copy[5];
  policy.href = `${lang === "uk" ? "/" : `/${lang}/`}privacy/`;
  const actions = document.createElement("div");
  actions.className = "analytics-consent__actions";
  function choose(value) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ value, expires: Date.now() + 180 * 86400000 }),
      );
    } catch {
      /* Choice still applies to this page. */
    }
    panel.hidden = true;
    if (value === "granted") start();
    else {
      accepted = false;
      window[`ga-disable-${id}`] = true;
      clearCookies();
      // Reload removes the already loaded tag and prevents further collection.
      if (started) location.reload();
    }
  }
  for (const [label, value] of [
    [copy[2], "granted"],
    [copy[3], "denied"],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => choose(value));
    actions.append(button);
  }
  panel.append(heading, text, policy, actions);
  document.body.append(panel);
  const settings = document.createElement("button");
  settings.type = "button";
  settings.className = "analytics-settings";
  settings.textContent = copy[4];
  settings.addEventListener("click", () => {
    panel.hidden = false;
    actions.querySelector("button").focus();
  });
  (document.querySelector(".footer-links") || document.body).append(settings);
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (
      saved?.expires > Date.now() &&
      ["granted", "denied"].includes(saved.value)
    ) {
      panel.hidden = true;
      if (saved.value === "granted") start();
    }
  } catch {
    /* Show choices when storage is unavailable. */
  }
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const contact = event.target.closest("[data-contact-channel]");
    if (
      contact &&
      ["telegram", "email", "instagram"].includes(
        contact.dataset.contactChannel,
      )
    )
      trackEvent("contact_click", {
        contact_channel: contact.dataset.contactChannel,
      });
    const arrow = event.target.closest(".svc-card__arrow");
    const service = arrow?.closest("[data-service]")?.dataset.service;
    if (["web", "bots", "automation", "ai"].includes(service))
      trackEvent("service_open", { service });
    const solution = event.target.closest("[data-solution-open]");
    if (solution && /^[a-z_]{1,24}$/.test(solution.dataset.solutionOpen))
      trackEvent("solution_open", { solution: solution.dataset.solutionOpen });
    const filter = event.target.closest(
      "[data-service-filter], [data-solution-filter], [data-case-filter]",
    );
    if (filter) {
      const value =
        filter.dataset.serviceFilter ||
        filter.dataset.solutionFilter ||
        filter.dataset.caseFilter;
      if (/^[a-z_]{1,24}$/.test(value))
        trackEvent("filter_select", {
          filter_type: filter.hasAttribute("data-service-filter")
            ? "service"
            : filter.hasAttribute("data-solution-filter")
              ? "solution"
              : "case",
          filter_value: value,
        });
    }
    const link = event.target.closest(".case-card__link, .blog-card__link");
    if (link)
      trackEvent("content_click", {
        content_path: new URL(link.href).pathname,
      });
    const nav = event.target.closest("#navigation a");
    if (nav)
      trackEvent("navigation_click", {
        destination: new URL(nav.href).pathname + new URL(nav.href).hash,
      });
  });
  const form = document.querySelector("#brief-form");
  let formStarted = false;
  form?.addEventListener("input", () => {
    if (accepted && !formStarted) {
      formStarted = true;
      trackEvent("form_start", { form_id: "brief" });
    }
  });
  const milestones = new Set();
  window.addEventListener(
    "scroll",
    () => {
      const distance = document.documentElement.scrollHeight - innerHeight;
      if (distance <= 0 || !accepted) return;
      const depth = Math.min(100, Math.round((scrollY / distance) * 100));
      for (const percent of [25, 50, 75, 90])
        if (depth >= percent && !milestones.has(percent)) {
          milestones.add(percent);
          trackEvent("scroll_depth", { percent_scrolled: percent });
        }
    },
    { passive: true },
  );
}

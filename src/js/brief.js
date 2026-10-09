
import { briefEndpoint } from "../data/forms.js";
import { studioContacts } from "../data/contacts.js";
const serviceLabels = {web:"ctWeb",bot:"ctBot",automation:"ctAutomation",ai:"ctAI",other:"ctElse"};

export function composeBrief(values, ui) {
  return [["ctService",ui[serviceLabels[values.service] ?? "ctElse"]],["ctName",values.name],["ctContact",values.contact],["ctTask",values.task],["ctBudget",values.budget],["ctDeadline",values.deadline]]
    .filter(([,value]) => value).map(([key,value]) => ui[key] + ": " + value).join("\n\n");
}
function contactUrl(channel,value) {
  if (!value) return null;
  if (channel === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "mailto:" + encodeURIComponent(value) : null;
  try {
    const url = new URL(value);
    const hosts = channel === "telegram" ? ["t.me","telegram.me"] : ["instagram.com","www.instagram.com"];
    return url.protocol === "https:" && hosts.includes(url.hostname) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export function initBrief(t) {
  const section = document.getElementById("contact");
  const form = document.getElementById("brief-form");
  const status = document.getElementById("form-status");
  if (!section || !form || !status || form.dataset.briefReady) return;
  const submit = form.querySelector('button[type="submit"]');
  const buttonLabel = submit?.querySelector("[data-i18n]");
  const draft = form.querySelector("#ct-draft");
  const draftWrapper = form.querySelector("[data-contact-draft]");
  if (!submit || !buttonLabel || !draft || !draftWrapper) return;
  const sendingEnabled = /^https:\/\//.test(briefEndpoint);
  if (sendingEnabled) {
    buttonLabel.textContent = t.ui.ctSend;
    buttonLabel.removeAttribute("data-i18n");
    const notice = form.querySelector('[data-i18n="ctPrivacy"]');
    if (notice) { notice.textContent = t.ui.ctSendPrivacy; notice.removeAttribute("data-i18n"); }
  }
  let telegramAvailable = false;
  let otherAvailable = false;
  for (const link of section.querySelectorAll("[data-contact-channel]")) {
    const channel = link.dataset.contactChannel;
    const url = contactUrl(channel,studioContacts[channel]);
    if (!url) continue;
    link.href = url;
    link.hidden = false;
    if (channel === "telegram") telegramAvailable = true;
    else otherAvailable = true;
  }
  section.querySelector("[data-contact-telegram-card]").hidden = !telegramAvailable;
  section.querySelector("[data-contact-prepare]").hidden = telegramAvailable;
  section.querySelector("[data-contact-other]").hidden = !otherAvailable;
  section.querySelector('a[href="#brief-form"]')?.addEventListener("click", () => form.querySelector("#ct-name").focus({preventScroll:true}));
  form.addEventListener("input", event => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) event.target.setCustomValidity("");
    status.textContent = "";
    draftWrapper.hidden = true;
  });
  form.addEventListener("submit",async event => {
    event.preventDefault();
    if (submit.disabled) return;
    for (const field of form.querySelectorAll("[required]")) field.setCustomValidity(field.value.trim() ? "" : t.ui.ctEmpty);
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const values = Object.fromEntries(["service","name","contact","task","budget","deadline"].map(key => [key,String(data.get(key) ?? "").trim()]));
    const text = composeBrief(values,t.ui);
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    buttonLabel.textContent = sendingEnabled ? t.ui.ctSending : t.ui.ctCopying;
    try {
      if (sendingEnabled) {
        const response = await fetch(briefEndpoint, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, language: document.documentElement.lang }),
          signal: AbortSignal.timeout(15000),
        });
        const result = await response.json();
        if (!response.ok || result.ok !== true) throw new Error("delivery-failed");
        status.textContent = t.ui.ctSent;
        form.reset();
      } else {
        await navigator.clipboard.writeText(text);
        status.textContent = t.ui.ctCopied;
      }
    } catch {
      draft.value = text;
      draftWrapper.hidden = false;
      status.textContent = sendingEnabled ? t.ui.ctSendError : t.ui.ctFallback;
      draft.focus();
      draft.select();
    } finally {
      submit.disabled = false;
      form.removeAttribute("aria-busy");
      buttonLabel.textContent = sendingEnabled ? t.ui.ctSend : t.ui.ctCopy;
    }
  });
  submit.disabled = false;
  form.dataset.briefReady = "true";
}


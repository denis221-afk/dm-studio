const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const root = document.documentElement;
const header = document.querySelector(".header");
const menu = document.querySelector(".mobile-menu");
const lightbox = document.querySelector(".lightbox");
const lock = () =>
  document.body.classList.toggle(
    "dialog-open",
    !!document.querySelector("dialog[open]"),
  );
const openDialog = (dialog) => {
  dialog.showModal();
  lock();
};
for (const dialog of [menu, lightbox]) {
  dialog.addEventListener("close", lock);
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [
      ...dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]',
      ),
    ].filter((element) => element.getClientRects().length);
    const first = focusable[0],
      last = focusable.at(-1);
    if (!first) {
      event.preventDefault();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
}
document
  .querySelector(".menu-toggle")
  .addEventListener("click", () => openDialog(menu));
document
  .querySelector(".menu-close")
  .addEventListener("click", () => menu.close());
menu
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => menu.close()));
matchMedia("(min-width: 801px)").addEventListener("change", (event) => {
  if (event.matches && menu.open) menu.close();
});

// One active panel, including keyboard navigation and native tab focus semantics.
const tabs = [...document.querySelectorAll("[data-direction]")];
function activateTab(tab, focus = false) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(item.getAttribute("aria-controls"));
    panel.hidden = !active;
    panel.classList.remove("is-switching");
    if (active && !reduced.matches) {
      void panel.offsetWidth;
      panel.classList.add("is-switching");
    }
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let target;
    if (["ArrowRight", "ArrowDown"].includes(event.key))
      target = (index + 1) % tabs.length;
    if (["ArrowLeft", "ArrowUp"].includes(event.key))
      target = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = tabs.length - 1;
    if (target !== undefined) {
      event.preventDefault();
      activateTab(tabs[target], true);
    }
  });
});
const tabList = document.querySelector(".direction-tabs");
const mobileTabs = matchMedia("(max-width: 560px)");
const setOrientation = () =>
  tabList.setAttribute(
    "aria-orientation",
    mobileTabs.matches ? "horizontal" : "vertical",
  );
mobileTabs.addEventListener("change", setOrientation);
setOrientation();

const works = [...document.querySelectorAll(".work")];
const filters = [...document.querySelectorAll("[data-filter]")];
filters.forEach((button) =>
  button.addEventListener("click", () => {
    filters.forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
    document
      .querySelector(".gallery")
      .classList.toggle("filtered", button.dataset.filter !== "all");
    let count = 0;
    works.forEach((work) => {
      work.hidden =
        button.dataset.filter !== "all" &&
        work.dataset.category !== button.dataset.filter;
      work.classList.remove("filter-enter");
      if (!work.hidden) {
        work.classList.add("is-visible");
        work.style.setProperty("--filter-delay", `${count * 65}ms`);
        if (!reduced.matches) {
          void work.offsetWidth;
          work.classList.add("filter-enter");
        }
        count++;
      }
    });
    document.querySelector("#gallery-status").textContent =
      `${String(count).padStart(2, "0")} ${count === 1 ? "робота" : count < 5 ? "роботи" : "робіт"}`;
    scheduleScroll();
  }),
);

let activeWork = 0;
function showWork(index) {
  activeWork = index;
  const work = works[index];
  const image = work.querySelector("img");
  const target = lightbox.querySelector("img");
  target.src = image.getAttribute("src");
  target.alt = image.alt;
  document.querySelector("#lightbox-title").textContent =
    work.querySelector("h3").textContent;
  document.querySelector("#lightbox-counter").textContent =
    `${String(index + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")} — WOODECO`;
}
works.forEach((work, index) =>
  work.querySelector("button").addEventListener("click", () => {
    showWork(index);
    openDialog(lightbox);
  }),
);
function navigateWork(direction) {
  const visible = works
    .map((work, index) => (work.hidden ? -1 : index))
    .filter((index) => index >= 0);
  showWork(
    visible[
      (visible.indexOf(activeWork) + direction + visible.length) %
        visible.length
    ],
  );
}
document
  .querySelector(".lightbox-close")
  .addEventListener("click", () => lightbox.close());
document
  .querySelector(".lightbox-prev")
  .addEventListener("click", () => navigateWork(-1));
document
  .querySelector(".lightbox-next")
  .addEventListener("click", () => navigateWork(1));
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    navigateWork(event.key === "ArrowRight" ? 1 : -1);
  }
});

const form = document.querySelector(".brief-form");
const output = document.querySelector(".brief-output");
document.querySelectorAll("[data-service]").forEach((link) =>
  link.addEventListener("click", () => {
    form.elements.service.value = link.dataset.service;
  }),
);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  output.textContent = `Запит WOODECO\nІм’я: ${String(data.get("name")).trim()}\nТелефон: ${String(data.get("phone")).trim()}\nНапрям: ${data.get("service")}\nІдея: ${String(data.get("idea")).trim() || "Обговорімо разом."}`;
  document.querySelector(".form-result").hidden = false;
  document.querySelector(".copy-status").textContent = "";
  output.focus({ preventScroll: true });
  output.scrollIntoView({
    behavior: reduced.matches ? "instant" : "smooth",
    block: "nearest",
  });
});
document.querySelector(".copy-brief").addEventListener("click", async () => {
  const status = document.querySelector(".copy-status");
  try {
    await navigator.clipboard.writeText(output.textContent);
    status.textContent = "Скопійовано. Дані нікуди не надсилалися.";
  } catch {
    const selection = getSelection();
    const range = document.createRange();
    range.selectNodeContents(output);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent =
      "Текст виділено. Скористайтеся командою «Копіювати» вашого пристрою.";
  }
});

const ticker = document.querySelector(".ticker");
const tickerButton = document.querySelector(".ticker-pause");
tickerButton.addEventListener("click", () => {
  const paused = ticker.classList.toggle("paused");
  tickerButton.setAttribute("aria-pressed", String(paused));
  tickerButton.setAttribute(
    "aria-label",
    paused ? "Продовжити рух рядка" : "Призупинити рух рядка",
  );
  tickerButton
    .querySelector("use")
    .setAttribute("href", paused ? "#play" : "#pause");
});

// Progressive enhancement: the document remains visible if animation is unavailable.
let revealObserver;
function setupReveal() {
  if (reduced.matches || !("IntersectionObserver" in window)) return;
  revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }),
    { threshold: 0.07, rootMargin: "0px 0px -25px 0px" },
  );
  document.querySelectorAll("[data-reveal]").forEach((element, index) => {
    element.style.setProperty("--delay", `${Math.min((index % 2) * 75, 75)}ms`);
    revealObserver.observe(element);
  });
  root.classList.add("motion-enabled");
}
try {
  setupReveal();
} catch {
  root.classList.remove("motion-enabled");
}
document.addEventListener("focusin", (event) => {
  const target = event.target.closest("[data-reveal]");
  if (target) {
    target.classList.add("is-visible");
    revealObserver?.unobserve(target);
  }
});
const statement = document.querySelector("[data-statement]");
// Wrap only text nodes; preserve the heading's emphasis and accessible text.
if (!reduced.matches) {
  const walker = document.createTreeWalker(statement, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((word) => {
      if (/^\s*$/.test(word)) fragment.append(document.createTextNode(word));
      else {
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = word;
        fragment.append(span);
      }
    });
    node.replaceWith(fragment);
  });
}
const words = [...statement.querySelectorAll(".word")];
const hero = document.querySelector(".hero");
const craft = document.querySelector(".craft");
let scheduled = false;
const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
function onScroll() {
  scheduled = false;
  const y = window.scrollY,
    height = window.innerHeight;
  const total = document.documentElement.scrollHeight - height;
  root.style.setProperty(
    "--progress",
    total > 0 ? String(clamp(y / total, 0, 1)) : "0",
  );
  header.classList.toggle("scrolled", y > 20);
  if (reduced.matches) return;
  const heroRect = hero.getBoundingClientRect();
  if (heroRect.bottom > 0) {
    hero.style.setProperty(
      "--hero-y",
      `${-3 + clamp(y / heroRect.height, 0, 1) * 8}%`,
    );
    hero.style.setProperty(
      "--seal-rotation",
      `${clamp(y / heroRect.height, 0, 1) * 45}deg`,
    );
  }
  const statementRect = statement.getBoundingClientRect();
  const progress = clamp(
    (height * 0.9 - statementRect.top) / (height * 0.55),
    0,
    1,
  );
  words.forEach((word, index) =>
    word.classList.toggle("lit", index / words.length < progress),
  );
  const craftRect = craft.getBoundingClientRect();
  if (craftRect.top < height && craftRect.bottom > 0)
    craft.style.setProperty(
      "--craft-y",
      `${-7 + clamp((height - craftRect.top) / (height + craftRect.height), 0, 1) * 10}%`,
    );
}
function scheduleScroll() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(onScroll);
  }
}
window.addEventListener("scroll", scheduleScroll, { passive: true });
window.addEventListener("resize", scheduleScroll, { passive: true });
window.addEventListener("load", scheduleScroll);
reduced.addEventListener("change", (event) => {
  if (event.matches) {
    root.classList.remove("motion-enabled");
    revealObserver?.disconnect();
    words.forEach((word) => word.classList.add("lit"));
  }
  scheduleScroll();
});
scheduleScroll();

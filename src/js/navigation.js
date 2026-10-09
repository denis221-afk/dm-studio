export function initNavigation(t) {
  const button = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("navigation");
  if (!button || !navigation) return;
  const header = document.querySelector(".header");
  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const targets = links.map(link => ({
    link, target: document.getElementById(link.hash.slice(1)),
  })).filter(item => item.target);
  let frame = 0;
  function updateCurrent() {
    frame = 0;
    const height = header?.getBoundingClientRect().height ?? 0;
    document.documentElement.style.setProperty("--sticky-header-height", `${height}px`);
    document.documentElement.style.setProperty("--viewport-width", `${document.documentElement.clientWidth}px`);
    const marker = height + 40;
    let active = targets[0];
    for (const item of targets) {
      const top = item.target.getBoundingClientRect().top;
      if (top <= marker && (!active || top > active.target.getBoundingClientRect().top)) {
        active = item;
      }
    }
    const last = targets.find(item => item.link.hash === "#contact");
    const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (last && atBottom) active = last;
    for (const item of targets) {
      const selected = item === active;
      item.link.classList.toggle("is-current", selected);
      if (selected) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    }
  }
  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(updateCurrent);
  }
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  const observer = new ResizeObserver(scheduleUpdate);
  if (header) observer.observe(header);
  targets.forEach(({ target }) => observer.observe(target));
  updateCurrent();

  function setOpen(open) {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? t.ui.closeMenu : t.ui.openMenu);
    navigation.classList.toggle("is-open", open);
  }

  button.addEventListener("click", () =>
    setOpen(button.getAttribute("aria-expanded") !== "true"),
  );
  navigation.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest("a");
    if (!link) return;
    setOpen(false);
    const href = link.getAttribute("href");
    if (!href?.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    const previous = target.getAttribute("tabindex");
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.addEventListener(
      "blur",
      () => {
        if (previous === null) target.removeAttribute("tabindex");
        else target.setAttribute("tabindex", previous);
      },
      { once: true },
    );
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      button.getAttribute("aria-expanded") === "true"
    ) {
      setOpen(false);
      button.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !button.contains(event.target))
      setOpen(false);
  });
  matchMedia("(min-width: 1101px)").addEventListener("change", () =>
    setOpen(false),
  );
}

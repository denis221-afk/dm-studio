export function initNavigation(t) {
  const button = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("navigation");
  if (!button || !navigation) return;

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
  matchMedia("(min-width: 781px)").addEventListener("change", () =>
    setOpen(false),
  );
}

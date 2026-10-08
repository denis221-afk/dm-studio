
export function initSolutions(t) {
  const section = document.getElementById("solutions");
  if (!section || section.dataset.solutionsReady) return;
  const filters = section.querySelector(".sol__filters");
  const grid = section.querySelector("#solutions-grid");
  const cards = [...section.querySelectorAll("[data-solution]")];
  const buttons = [...section.querySelectorAll("[data-solution-filter]")];
  const dialog = section.querySelector("#solution-dialog");
  const title = dialog?.querySelector("#solution-dialog-title");
  const description = dialog?.querySelector("#solution-dialog-description");
  const list = dialog?.querySelector(".sol-dialog__list");
  const status = section.querySelector("#solutions-status");
  if (!filters || !grid || !dialog || !title || !description || !list || !status) return;
  let opener = null;
  function select(category, announce = true) {
    if (category !== "all" && !cards.some(card => card.dataset.solution === category)) return;
    cards.forEach(card => { card.hidden = category !== "all" && card.dataset.solution !== category; });
    buttons.forEach(button => {
      const active = button.dataset.solutionFilter === category;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    grid.classList.toggle("is-filtered", category !== "all");
    if (announce) {
      const button = buttons.find(item => item.dataset.solutionFilter === category);
      status.textContent = category === "all" ? t.ui.solAllStatus : t.ui.solSelectedStatus + " " + button.textContent.trim();
    }
  }
  filters.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-solution-filter]");
    if (button && filters.contains(button)) select(button.dataset.solutionFilter);
  });
  filters.addEventListener("keydown", event => {
    const index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    const next = { ArrowRight: (index + 1) % buttons.length, ArrowLeft: (index - 1 + buttons.length) % buttons.length, Home: 0, End: buttons.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    buttons[next].focus();
  });
  section.querySelectorAll("[data-solution-open]").forEach(button => {
    const key = button.dataset.solutionOpen;
    const card = cards.find(item => item.dataset.solution === key);
    if (!card || !Array.isArray(t.solutions[key])) return;
    const heading = card.querySelector("h3").textContent.trim();
    button.setAttribute("aria-label", t.ui.solMore + ": " + heading);
    button.hidden = false;
    button.addEventListener("click", () => {
      opener = button;
      title.textContent = heading;
      description.textContent = card.querySelector(".sol-card__description").textContent.trim();
      list.replaceChildren(...t.solutions[key].map(text => {
        const li = document.createElement("li");
        li.textContent = text;
        return li;
      }));
      dialog.showModal();
      title.focus();
    });
  });
  dialog.querySelector("[data-solution-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => { if (opener?.isConnected && !opener.closest("[hidden]")) opener.focus({ preventScroll: true }); });
  dialog.querySelector("[data-solution-contact]").addEventListener("click", () => {
    dialog.close();
    const contact = document.getElementById("contact");
    if (!contact) return;
    contact.setAttribute("tabindex", "-1");
    contact.focus({ preventScroll: true });
    contact.addEventListener("blur", () => contact.removeAttribute("tabindex"), { once: true });
  });
  select("all", false);
  filters.hidden = false;
  section.dataset.solutionsReady = "true";
}

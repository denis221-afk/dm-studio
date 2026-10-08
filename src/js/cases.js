
export function initCases(t) {
 const page = document.querySelector('[data-case-page="index"]');
 if (!page || page.dataset.casesReady) return;
 const filters = page.querySelector(".cases-filters");
 const cards = [...page.querySelectorAll("[data-case-categories]")];
 const buttons = [...page.querySelectorAll("[data-case-filter]")];
 const status = page.querySelector("#cases-status");
 if (!filters || !status || !cards.length) return;
 function select(category, announce = true) {
   if (!buttons.some(button => button.dataset.caseFilter === category)) return;
   cards.forEach(card => { card.hidden = category !== "all" && !card.dataset.caseCategories.split(" ").includes(category); });
   buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.caseFilter === category)));
   if (announce) status.textContent = t.ui.casesShowing + " " + cards.filter(card => !card.hidden).length + ".";
 }
 filters.addEventListener("click", event => {
   if (!(event.target instanceof Element)) return;
   const button = event.target.closest("[data-case-filter]");
   if (button && filters.contains(button)) select(button.dataset.caseFilter);
 });
 filters.addEventListener("keydown", event => {
   const index = buttons.indexOf(document.activeElement);
   if (index < 0) return;
   const next = {ArrowRight:(index+1)%buttons.length,ArrowLeft:(index-1+buttons.length)%buttons.length,Home:0,End:buttons.length-1}[event.key];
   if (next === undefined) return;
   event.preventDefault();
   buttons[next].focus();
 });
 select("all", false);
 filters.hidden = false;
 page.dataset.casesReady = "true";
}

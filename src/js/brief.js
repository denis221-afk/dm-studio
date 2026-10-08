export function initBrief(t) {
  const form = document.getElementById("brief-form");
  const field = document.getElementById("brief");
  const status = document.getElementById("form-status");
  if (!form || !field || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = field.value.trim();
    if (!text) {
      status.textContent = t.ui.emptyBrief;
      field.focus();
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = t.ui.copySuccess;
    } catch {
      field.focus();
      field.select();
      status.textContent = t.ui.copyFallback;
    }
  });
}

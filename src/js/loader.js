// src/js/loader.js

const INTRO_DURATION = 3300;

export function initLoader() {
  const loader = document.getElementById("site-loader");

  if (!loader) return;

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const controller = new AbortController();

  let timer;
  let closed = false;

  function close() {
    if (closed) return;

    closed = true;

    window.clearTimeout(timer);
    controller.abort();
    loader.remove();
  }

  // Запобіжник: заставка не може зависнути.
  timer = window.setTimeout(close, INTRO_DURATION);

  // Поважаємо налаштування зменшеної анімації.
  if (motion.matches) {
    close();
    return;
  }

  // Показуємо щоразу, без перевірок sessionStorage.
  loader.hidden = false;

  loader.addEventListener(
    "animationend",
    (event) => {
      if (event.target === loader && event.animationName === "loader-exit") {
        close();
      }
    },
    { signal: controller.signal },
  );

  loader
    .querySelector(".loader__skip")
    ?.addEventListener("click", close, { signal: controller.signal });

  document.addEventListener("keydown", close, {
    signal: controller.signal,
  });

  document.addEventListener(
    "focusin",
    (event) => {
      if (!loader.contains(event.target)) {
        close();
      }
    },
    { signal: controller.signal },
  );

  motion.addEventListener(
    "change",
    (event) => {
      if (event.matches) close();
    },
    { signal: controller.signal },
  );
}

// src/js/services.js

const SERVICE_DETAILS = {
  web: {
    title: "Сайт, який працює на ваш бізнес",
    description:
      "Допомагаємо представити продукт, пояснити його цінність та зробити шлях до заявки простим.",
    items: [
      "Структура під вашу бізнес-задачу.",
      "Адаптивний дизайн для телефону та комп’ютера.",
      "Форми заявок і потрібні інтеграції.",
      "Базова SEO-підготовка та оптимізація швидкості.",
    ],
  },

  bots: {
    title: "Ваш бізнес — у Telegram",
    description:
      "Збирайте заявки, відповідайте на типові запитання й допомагайте клієнтам без постійної ручної роботи.",
    items: [
      "Зрозумілий сценарій взаємодії з клієнтом.",
      "Заявки, запис та повідомлення.",
      "Підключення таблиць і зовнішніх сервісів.",
      "Адміністрування та інструкція користування.",
    ],
  },

  automation: {
    title: "Менше ручної роботи щодня",
    description:
      "Поєднуємо ваші інструменти та автоматизуємо повторювані дії, щоб команда зосередилася на важливому.",
    items: [
      "Аналіз процесу та пошук зайвих ручних дій.",
      "Сценарії в n8n та інтеграції через API.",
      "Передавання даних і автоматичні сповіщення.",
      "Обробка помилок і документація сценарію.",
    ],
  },

  ai: {
    title: "AI для конкретної задачі",
    description:
      "Підбираємо застосування AI під ваш процес: підтримка, робота з текстами чи аналіз інформації.",
    items: [
      "Визначення задачі та меж роботи AI.",
      "Асистент із потрібними інструкціями.",
      "Інтеграція у ваш робочий процес.",
      "Перевірка результатів на реальних прикладах.",
    ],
  },
};

export function initServices() {
  // Знаходимо саме секцію послуг, а не елемент усередині hero.
  const section = document.querySelector("section.svc");

  if (!section || section.dataset.servicesReady === "true") {
    return;
  }

  const filters = section.querySelector(".svc__filters");
  const grid = section.querySelector(".svc__grid");
  const buttons = [...section.querySelectorAll("button[data-service-filter]")];
  const cards = [...section.querySelectorAll(".svc-card[data-service]")];

  if (!filters || !grid || !buttons.length || !cards.length) {
    console.error(
      "Не вдалося запустити перемикач послуг: перевір HTML секції.",
      { filters, grid, buttons, cards },
    );
    return;
  }

  // Якщо блок деталей випадково пропущений у HTML — створюємо його.
  let detail = section.querySelector(".svc-detail");

  if (!detail) {
    detail = document.createElement("aside");
    detail.className = "svc-detail";
    detail.id = "service-detail";
    detail.hidden = true;

    grid.append(detail);
  }

  let title = detail.querySelector("h3");

  if (!title) {
    title = document.createElement("h3");
    detail.append(title);
  }

  title.id = "service-detail-title";
  detail.setAttribute("aria-labelledby", title.id);

  let description = detail.querySelector(".svc-detail__description");

  if (!description) {
    description = document.createElement("p");
    description.className = "svc-detail__description";
    detail.append(description);
  }

  let list = detail.querySelector(".svc-detail__list");

  if (!list) {
    list = document.createElement("ul");
    list.className = "svc-detail__list";
    detail.append(list);
  }

  if (!detail.querySelector('a[href="#contact"]')) {
    const link = document.createElement("a");
    link.className = "button button--lime";
    link.href = "#contact";
    link.textContent = "Обговорити цю послугу →";
    detail.append(link);
  }

  let status = section.querySelector("#service-status");

  if (!status) {
    status = document.createElement("p");
    status.id = "service-status";
    status.className = "svc__sr-only";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    filters.after(status);
  }

  function selectService(service, announce = true) {
    const showAll = service === "all";

    if (
      !showAll &&
      !Object.prototype.hasOwnProperty.call(SERVICE_DETAILS, service)
    ) {
      return;
    }

    buttons.forEach((button) => {
      const selected = button.dataset.serviceFilter === service;

      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    cards.forEach((card) => {
      card.hidden = !showAll && card.dataset.service !== service;
    });

    grid.classList.toggle("is-filtered", !showAll);
    detail.hidden = showAll;

    if (!showAll) {
      const content = SERVICE_DETAILS[service];

      title.textContent = content.title;
      description.textContent = content.description;

      const fragment = document.createDocumentFragment();

      content.items.forEach((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        fragment.append(item);
      });

      list.replaceChildren(fragment);
    }

    if (announce) {
      const activeButton = buttons.find(
        (button) => button.dataset.serviceFilter === service,
      );

      status.textContent = showAll
        ? `Показано всі послуги: ${cards.length}.`
        : `Показано послугу: ${activeButton?.textContent.trim() ?? service}.`;
    }
  }

  filters.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest("button[data-service-filter]");

    if (!button || !buttons.includes(button)) return;

    selectService(button.dataset.serviceFilter);
  });

  filters.addEventListener("keydown", (event) => {
    const index = buttons.indexOf(document.activeElement);

    if (index === -1) return;

    let nextIndex;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % buttons.length;
        break;

      case "ArrowLeft":
        nextIndex = (index - 1 + buttons.length) % buttons.length;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = buttons.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();
    buttons[nextIndex].focus();
  });

  // Кнопки не повинні надсилати форму.
  buttons.forEach((button) => {
    button.type = "button";
    button.setAttribute("aria-controls", grid.id || "service-grid");
  });

  if (!grid.id) {
    grid.id = "service-grid";
  }

  selectService("all", false);

  cards.forEach((card) => {
    const arrow = card.querySelector(".svc-card__arrow");
    const service = card.dataset.service;

    if (!arrow || !SERVICE_DETAILS[service]) return;

    // Замінюємо посилання кнопкою: це перемикання, а не перехід.
    const button = document.createElement("button");

    button.type = "button";
    button.className = arrow.className;
    button.setAttribute("aria-controls", grid.id);
    button.setAttribute(
      "aria-label",
      `Детальніше про послугу: ${card.querySelector("h3")?.textContent.trim()}`,
    );

    button.append(...arrow.childNodes);
    arrow.replaceWith(button);

    button.addEventListener("click", () => {
      selectService(service);

      // Переносимо фокус до відкритого опису.
      title.setAttribute("tabindex", "-1");
      title.focus({ preventScroll: true });

      detail.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "nearest",
      });
    });
  });

  filters.hidden = false;
  section.dataset.servicesReady = "true";
}

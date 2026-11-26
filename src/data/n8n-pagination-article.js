export const n8nPaginationArticle = {
  "slug": "n8n-api-pagination",
  "date": "2026-11-26",
  "image": "images/n8n-pagination.svg",
  "serviceSlug": "business-automation",
  "paginationGuide": true,
  "ua": {
    "title": "n8n отримує лише першу сторінку API: як налаштувати пагінацію",
    "description": "Як налаштувати Pagination у HTTP Request: next URL, номер сторінки, cursor і перевірка повноти даних без пропусків та дублів.",
    "category": "Автоматизація",
    "coverCaption": "Схема переходу між сторінками API за посиланням або cursor",
    "serviceLabel": "Обговорити інтеграцію API та автоматизацію",
    "relatedLabel": "Як обмежити частоту API-запитів у n8n",
    "sourceLabel": "Офіційна документація n8n",
    "intro": "Workflow у n8n завершується без помилки, але отримує лише перші 100 записів? Часто API повертає довгий список частинами, а HTTP Request робить тільки один виклик. Рішення — налаштувати Pagination і передавати далі параметр, який визначає саме цей API: наступний URL, номер сторінки або cursor. Спершу перевірте одну відповідь, а вже потім будуйте цикл.",
    "sections": [
      {
        "id": "inspect",
        "title": "1. Спочатку подивіться на одну відповідь",
        "paragraphs": [
          "Не починайте з випадкового page=2 або limit=100. Виконайте один запит без пагінації та відкрийте повну відповідь. Знайдіть масив записів: він може називатися data, results, items або інакше. Окремо знайдіть метадані: next, next_page, next_cursor, has_more, total_pages чи поточний номер сторінки.",
          "З документації API випишіть п’ять речей: де лежать записи, як запитується наступна частина, з якого номера починається нумерація, який максимальний розмір сторінки дозволений і яке значення означає кінець списку. n8n читає фактичну структуру відповіді, а не універсальне поле з чужого прикладу."
        ]
      },
      {
        "id": "mode",
        "title": "2. Виберіть режим, який підтримує API",
        "paragraphs": [
          "Якщо API повертає повний URL наступної сторінки, у HTTP Request відкрийте Add Option → Pagination і виберіть Response Contains Next URL. У полі Next URL можна використати вираз {{ $response.body[\"next_page\"] }}. Замініть шлях на той, який реально повертає ваш endpoint. Не підставляйте початковий URL, коли next-посилання відсутнє: так workflow може знову завантажити першу сторінку.",
          "Якщо API очікує номер сторінки в query-параметрі, виберіть Update a Parameter in Each Request, Type = Query, Name = page. Для нумерації від одиниці використайте {{ $pageCount + 1 }}. У n8n $pageCount починається з нуля, тому перший запит отримає page=1. Якщо API починає з нуля, використовуйте {{ $pageCount }} без додавання одиниці.",
          "Для POST API параметр може передаватися в body: оберіть Type = Body і назву поля з документації. Якщо API використовує cursor, передавайте отриманий токен у відповідний query або body параметр, наприклад {{ $response.body.next_cursor }}. Не декодуйте й не змінюйте непрозорий токен без вимоги постачальника API."
        ]
      },
      {
        "id": "size",
        "title": "3. Розділіть номер сторінки та її розмір",
        "paragraphs": [
          "Параметр page визначає, яку частину списку запросити, а limit або page_size зазвичай визначає кількість записів у відповіді. Це різні налаштування. n8n дозволяє передати розмір сторінки у звичайних Query Parameters, окремо від Pagination. Вибирайте його в межах, які дозволяє API: завелике значення може бути відхилене або обрізане сервером.",
          "Деякі API використовують offset замість номера сторінки. Якщо документація визначає offset як кількість пропущених записів, а розмір сторінки незмінний і дорівнює 100, наступне значення можна обчислювати як {{ $pageCount * 100 }}. Це формула лише для такого контракту. Перевірте, чи offset рахує записи, чи сторінки."
        ]
      },
      {
        "id": "stop",
        "title": "4. Переконайтеся, що цикл знає, коли зупинитися",
        "paragraphs": [
          "Сигнал завершення має задавати API: відсутній next URL, порожній cursor, has_more=false або досягнута total_pages. Перевіряйте точний шлях до поля. Якщо метадані вкладені в meta, читання body.next_cursor замість body.meta.next_cursor дасть порожнє значення, хоча відповідь містить токен.",
          "Не вважайте, що коротка сторінка завжди остання або що відповідь обов’язково буде порожнім масивом. API може повертати об’єкт із data: [] та іншими метаданими. Не додавайте fallback, який повторно викликає початкову адресу, коли наступного посилання вже немає. Умова кінця має відповідати документації endpoint."
        ]
      },
      {
        "id": "test",
        "title": "5. Перевірте першу, другу й останню сторінки",
        "paragraphs": [
          "Перед підключенням запису в CRM, таблицю чи надсилання повідомлень зробіть обмежений read-only тест. Якщо API дозволяє, встановіть малий limit, наприклад 2 або 5 записів. Перегляньте першу відповідь, наступний запит і фінальну відповідь. URL, номер сторінки або cursor мають змінюватися саме так, як описано в документації.",
          "Порівняйте ID записів: чи немає повторів, чи не пропущено межу між сторінками, чи збігається кількість з окремим count endpoint, якщо він існує. Перевірте й останню сторінку. Зелений статус виконання сам по собі не доводить, що отримано весь набір даних."
        ]
      },
      {
        "id": "safe",
        "title": "6. Захистіть синхронізацію від дублів",
        "paragraphs": [
          "Offset-пагінація може пропускати або повторювати записи, якщо набір змінюється під час обходу: між запитами додаються або видаляються елементи, і межі сторінок зсуваються. Якщо API підтримує стабільний cursor або сортування за незмінним ID, розгляньте цей варіант для синхронізації. Остаточне рішення має відповідати контракту API.",
          "Розділіть отримання даних і побічні дії. Спочатку перевірте повноту сторінок, потім записуйте через upsert або перевірку стабільного ID. Для регулярної синхронізації зберігайте checkpoint лише після успішної обробки відповідної частини. Якщо виникає HTTP 429, окремо налаштуйте темп запитів: пагінація визначає наступну сторінку, а не швидкість викликів."
        ]
      }
    ]
  },
  "en": {
    "title": "n8n fetches only the first API page: how to configure pagination",
    "description": "Configure Pagination in HTTP Request: next-page URLs, page numbers, cursors, page size and checks that prevent missing or duplicate records.",
    "category": "Automation",
    "coverCaption": "Diagram of API pages connected by a next URL or cursor",
    "serviceLabel": "Discuss API integration and workflow automation",
    "relatedLabel": "How to control API request rates in n8n",
    "sourceLabel": "Official n8n documentation",
    "intro": "Your n8n workflow finishes successfully but returns only the first 100 records? Many APIs split long lists into pages, while an HTTP Request node makes just one call. Configure Pagination and pass on the value that this API uses: a next-page URL, page number or cursor. Inspect one response before building the sequence.",
    "sections": [
      {
        "id": "inspect",
        "title": "1. Inspect a single response first",
        "paragraphs": [
          "Do not start by guessing page=2 or limit=100. Make one request without pagination and inspect the full response. Find the records array: it may be called data, results, items or something else. Then locate the pagination metadata: next, next_page, next_cursor, has_more, total_pages or the current page number.",
          "Check the API documentation for five details: where the records live, how to request the next part, whether numbering starts at zero or one, the maximum page size, and the value that marks the end. n8n expressions read the actual response structure, not a universal field copied from another example."
        ]
      },
      {
        "id": "mode",
        "title": "2. Choose the mode your API supports",
        "paragraphs": [
          "If the API returns a full URL for the next page, open Add Option → Pagination in HTTP Request and choose Response Contains Next URL. The Next URL field can use an expression such as {{ $response.body[\"next_page\"] }}. Replace the property path with the one your endpoint really returns. Do not fall back to the original URL when the next link is missing, or the workflow may fetch page one again.",
          "If the API expects a page number in a query parameter, choose Update a Parameter in Each Request, set Type = Query and Name = page. For one-based numbering, use {{ $pageCount + 1 }}. In n8n, $pageCount starts at zero, so the first request sends page=1. If the API starts at zero, use {{ $pageCount }} without adding one.",
          "A POST API may expect the pagination parameter in the body: choose Type = Body and use the field name required by the documentation. If the API uses a cursor, pass the returned token into the documented query or body parameter, for example {{ $response.body.next_cursor }}. Do not decode or alter an opaque token unless the API provider requires it."
        ]
      },
      {
        "id": "size",
        "title": "3. Separate page number from page size",
        "paragraphs": [
          "The page parameter selects which part of the list to request; limit or page_size usually controls how many records come back. They are different settings. n8n lets you pass page size in regular Query Parameters, separately from Pagination. Keep it within the API's documented limits: a value that is too large may be rejected or capped by the server.",
          "Some APIs use offset instead of a page number. If the API defines offset as the number of records to skip and the page size stays at 100, the next value can be calculated as {{ $pageCount * 100 }}. This formula applies only to that contract. Confirm whether offset counts records or pages."
        ]
      },
      {
        "id": "stop",
        "title": "4. Make sure the sequence knows when to stop",
        "paragraphs": [
          "The API should define the terminal signal: no next URL, an empty cursor, has_more=false or a reached total_pages value. Read the exact property path. If metadata is nested under meta, reading body.next_cursor instead of body.meta.next_cursor returns an empty value even though the token is present.",
          "Do not assume a short page is always the last one, or that the response must be an empty array. An API may return an object containing data: [] alongside other metadata. Avoid a fallback that calls the original endpoint when the next link is absent. The end condition must match the endpoint's documentation."
        ]
      },
      {
        "id": "test",
        "title": "5. Check the first, second and final pages",
        "paragraphs": [
          "Before connecting a CRM write, spreadsheet update or message send, run a bounded read-only test. If the API allows it, use a small limit such as 2 or 5 records. Inspect the first response, the next request and the final response. The URL, page number or cursor should change as the API documentation describes.",
          "Compare record IDs: look for duplicates, gaps between pages and a mismatch with a separate count endpoint if one exists. Check the final-page case deliberately. A green execution status alone does not prove that the workflow collected the complete dataset."
        ]
      },
      {
        "id": "safe",
        "title": "6. Protect synchronisation from duplicates",
        "paragraphs": [
          "Offset pagination can skip or repeat records if the dataset changes while it is being traversed. Items may be inserted or deleted between requests, shifting page boundaries. If the API supports a stable cursor or ordering by an immutable ID, consider it for synchronisation. The final choice must follow that API's contract.",
          "Separate data retrieval from side effects. First validate the pages, then write records with an upsert or a check against a stable ID. For scheduled synchronisation, save a checkpoint only after the corresponding batch has been processed successfully. If HTTP 429 occurs too, configure request pacing separately: pagination selects the next page; it does not set the request rate."
        ]
      }
    ]
  },
  "pl": {
    "title": "n8n pobiera tylko pierwszą stronę API: jak skonfigurować paginację",
    "description": "Skonfiguruj Pagination w HTTP Request: next URL, numer strony, cursor, rozmiar strony i kontrolę brakujących oraz powielonych rekordów.",
    "category": "Automatyzacja",
    "coverCaption": "Schemat stron API połączonych adresem next URL lub kursorem",
    "serviceLabel": "Omów integrację API i automatyzację procesu",
    "relatedLabel": "Jak kontrolować tempo zapytań API w n8n",
    "sourceLabel": "Oficjalna dokumentacja n8n",
    "intro": "Workflow w n8n kończy się bez błędu, ale pobiera tylko pierwsze 100 rekordów? Wiele API dzieli długie listy na strony, a węzeł HTTP Request wykonuje tylko jedno wywołanie. Skonfiguruj Pagination i przekazuj wartość używaną przez dane API: adres następnej strony, numer strony albo cursor. Najpierw sprawdź jedną odpowiedź.",
    "sections": [
      {
        "id": "inspect",
        "title": "1. Najpierw sprawdź pojedynczą odpowiedź",
        "paragraphs": [
          "Nie zaczynaj od zgadywania page=2 lub limit=100. Wykonaj jedno żądanie bez paginacji i otwórz pełną odpowiedź. Znajdź tablicę rekordów: może nazywać się data, results, items albo inaczej. Osobno odszukaj metadane: next, next_page, next_cursor, has_more, total_pages lub aktualny numer strony.",
          "W dokumentacji API sprawdź pięć rzeczy: gdzie znajdują się rekordy, jak pobrać kolejną część, czy numeracja zaczyna się od zera czy od jedynki, jaki jest maksymalny rozmiar strony i jaka wartość oznacza koniec listy. Wyrażenia n8n odczytują rzeczywistą strukturę odpowiedzi, a nie uniwersalne pole z cudzego przykładu."
        ]
      },
      {
        "id": "mode",
        "title": "2. Wybierz tryb obsługiwany przez API",
        "paragraphs": [
          "Jeśli API zwraca pełny adres następnej strony, w HTTP Request otwórz Add Option → Pagination i wybierz Response Contains Next URL. W polu Next URL możesz użyć wyrażenia {{ $response.body[\"next_page\"] }}. Zastąp ścieżkę właściwością zwracaną przez Twój endpoint. Nie używaj początkowego adresu jako wartości zastępczej, gdy brakuje linku next, bo workflow może ponownie pobrać pierwszą stronę.",
          "Jeśli API oczekuje numeru strony w parametrze query, wybierz Update a Parameter in Each Request, ustaw Type na Query, a Name na page. Dla numeracji od jedynki użyj {{ $pageCount + 1 }}. W n8n $pageCount zaczyna się od zera, więc pierwsze żądanie wyśle page=1. Jeśli API zaczyna od zera, użyj {{ $pageCount }} bez dodawania jedynki.",
          "API korzystające z POST może oczekiwać parametru paginacji w body: wybierz Type = Body i wpisz nazwę pola zgodną z dokumentacją. Jeśli API używa kursora, przekaż otrzymany token do odpowiedniego parametru query lub body, na przykład {{ $response.body.next_cursor }}. Nie dekoduj ani nie zmieniaj nieprzezroczystego tokenu, jeśli dostawca API tego nie wymaga."
        ]
      },
      {
        "id": "size",
        "title": "3. Oddziel numer strony od jej rozmiaru",
        "paragraphs": [
          "Parametr page wskazuje, którą część listy pobrać, a limit lub page_size zwykle określa liczbę rekordów w odpowiedzi. To dwa różne ustawienia. n8n pozwala przekazać rozmiar strony w zwykłych Query Parameters, niezależnie od Pagination. Trzymaj się limitów opisanych przez API: zbyt duża wartość może zostać odrzucona albo ograniczona przez serwer.",
          "Niektóre API używają offset zamiast numeru strony. Jeśli dokumentacja definiuje offset jako liczbę pominiętych rekordów, a rozmiar strony pozostaje równy 100, kolejną wartość można obliczyć jako {{ $pageCount * 100 }}. To formuła tylko dla takiego kontraktu. Sprawdź, czy offset liczy rekordy, czy strony."
        ]
      },
      {
        "id": "stop",
        "title": "4. Ustal, kiedy sekwencja ma się zatrzymać",
        "paragraphs": [
          "Sygnał zakończenia powinno definiować API: brak next URL, pusty cursor, has_more=false albo osiągnięte total_pages. Odczytuj dokładną ścieżkę do pola. Jeśli metadane są zagnieżdżone w meta, odczyt body.next_cursor zamiast body.meta.next_cursor zwróci pustą wartość, mimo że token znajduje się w odpowiedzi.",
          "Nie zakładaj, że krótka strona zawsze jest ostatnia ani że odpowiedź musi być pustą tablicą. API może zwrócić obiekt zawierający data: [] oraz inne metadane. Nie dodawaj zastępczego wywołania początkowego endpointu, gdy brakuje linku next. Warunek końca musi odpowiadać dokumentacji konkretnego endpointu."
        ]
      },
      {
        "id": "test",
        "title": "5. Sprawdź pierwszą, drugą i ostatnią stronę",
        "paragraphs": [
          "Zanim podłączysz zapis do CRM, arkusza lub wysyłanie wiadomości, wykonaj ograniczony test tylko do odczytu. Jeśli API na to pozwala, ustaw mały limit, na przykład 2 lub 5 rekordów. Sprawdź pierwszą odpowiedź, kolejne żądanie i odpowiedź końcową. URL, numer strony lub cursor powinny zmieniać się zgodnie z dokumentacją.",
          "Porównaj identyfikatory rekordów: sprawdź duplikaty, luki na granicach stron i zgodność liczby z osobnym count endpoint, jeśli istnieje. Celowo przetestuj ostatnią stronę. Zielony status wykonania sam w sobie nie potwierdza, że workflow pobrał cały zbiór."
        ]
      },
      {
        "id": "safe",
        "title": "6. Zabezpiecz synchronizację przed duplikatami",
        "paragraphs": [
          "Paginacja offsetowa może pomijać lub powielać rekordy, jeśli zbiór zmienia się w trakcie pobierania. Elementy mogą być dodawane lub usuwane między żądaniami, przez co granice stron się przesuną. Jeśli API obsługuje stabilny cursor albo sortowanie po niezmiennym ID, rozważ tę metodę przy synchronizacji. Wybór nadal musi być zgodny z kontraktem API.",
          "Oddziel pobieranie danych od skutków ubocznych. Najpierw zweryfikuj strony, a dopiero potem zapisuj rekordy przez upsert lub sprawdzenie stabilnego ID. W cyklicznej synchronizacji zapisuj checkpoint dopiero po poprawnym przetworzeniu odpowiedniej partii. Jeśli pojawia się także HTTP 429, osobno skonfiguruj tempo żądań: paginacja wybiera następną stronę, ale nie ustala szybkości wywołań."
        ]
      }
    ]
  }
};

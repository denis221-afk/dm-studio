export const n8nRateLimitArticle = {
  "slug": "n8n-api-rate-limit-429",
  "date": "2026-11-23",
  "image": "images/n8n-rate-limit.svg",
  "serviceSlug": "business-automation",
  "rateLimitGuide": true,
  "ua": {
    "title": "Помилка 429 у n8n: як обмежити запити до API",
    "description": "Що робити, коли API повертає 429 у n8n: перевірка ліміту, Batching, Loop Over Items, Wait і межі Retry On Fail.",
    "category": "Автоматизація",
    "coverCaption": "Схема керованого потоку API-запитів із паузою та повтором",
    "serviceLabel": "Обговорити автоматизацію та інтеграцію API",
    "relatedLabel": "Як діагностувати вебхук n8n з помилкою 404",
    "sourceLabel": "Офіційна документація",
    "intro": "Вузол n8n зупиняється з повідомленням 429 Too Many Requests, а повторний запуск лише додає нові помилки? Не починайте з безкінечних повторів. Спершу з’ясуйте, який саме ліміт спрацював, потім зменште швидкість запитів і лише після цього налаштуйте обмежені повторні спроби.",
    "sections": [
      {
        "id": "meaning-of-429",
        "title": "1. Що означає 429 і чого він не пояснює",
        "paragraphs": [
          "HTTP 429 означає, що сервіс просить клієнта зменшити кількість запитів за певний проміжок часу. Але сам код не говорить, який саме ліміт спрацював: за хвилину, за добу, для API-ключа, облікового запису чи окремого endpoint. Це визначає постачальник API, тому перевірте його документацію та повний текст відповіді.",
          "Не плутайте 429 з 401 або 403 через авторизацію та з 404 через неправильний маршрут. Довша пауза не виправить неправильний токен чи URL. Якщо повідомлення вказує на вичерпаний баланс або квоту, повтори також не створять новий ліміт."
        ]
      },
      {
        "id": "inspect-execution",
        "title": "2. Знайдіть вузол і джерело надмірних запитів",
        "paragraphs": [
          "Відкрийте невдале виконання та визначте вузол, який звертається до зовнішнього сервісу. Зафіксуйте HTTP-метод, endpoint, кількість вхідних items, credential або ключ, а також чи запускаються паралельно інші workflow. Перевірте, чи один item створює один HTTP-запит і чи кілька сценаріїв не використовують спільний ліміт.",
          "Якщо вузол дозволяє переглянути статус і заголовки відповіді, перевірте їх без копіювання секретів. Не додавайте до журналів API-токени, паролі, email, телефони чи вміст реальної заявки. Для діагностики зазвичай достатньо часу, коду відповіді, назви вузла та технічного ID виконання."
        ]
      },
      {
        "id": "reduce-request-rate",
        "title": "3. Спершу зменште кількість і швидкість запитів",
        "paragraphs": [
          "Якщо API має пакетний endpoint або дозволяє отримати відфільтрований список за один виклик, використайте його замість запиту для кожного запису. У вузлі HTTP Request n8n можна додати опцію Batching: Items per Batch визначає кількість items у пакеті, а Batch Interval (ms) — паузу між пакетами. Значення потрібно вибирати за лімітом конкретного сервісу, а не за універсальним рецептом.",
          "Для інтеграційних вузлів, де немає власного Batching, документація n8n радить поєднати Loop Over Items і Wait. Це дозволяє обробляти менші порції та контролювати інтервал. Враховуйте сумарне навантаження від інших workflow з тим самим ключем: один сценарій може виглядати повільним, але разом вони все одно перевищать квоту."
        ]
      },
      {
        "id": "retry-on-fail",
        "title": "4. Коли достатньо Retry On Fail",
        "paragraphs": [
          "Для короткого тимчасового збою відкрийте вузол, перейдіть у Settings і ввімкніть Retry On Fail. Налаштуйте Max Tries та Wait Between Tries (ms). Це корисно, коли запит безпечно повторити, а сервіс відновлюється за короткий час.",
          "Є важливі межі: актуальна документація n8n вказує максимум п’ять спроб і паузу до 5000 мс. HTTP Request не дотримується заголовка Retry-After автоматично. Тому Retry On Fail не замінює керування швидкістю й не підходить для довгих квотних вікон. Не створюйте цикл без ліміту спроб і часу очікування."
        ]
      },
      {
        "id": "retry-after",
        "title": "5. Якщо API повертає Retry-After",
        "paragraphs": [
          "Деякі API додають до 429 заголовок Retry-After. Він може містити кількість секунд або HTTP-дату, раніше якої не варто повторювати запит. Це інструкція сервера, а не випадкова затримка, яку варто замінити на одну секунду.",
          "Оскільки HTTP Request у n8n не застосовує цей заголовок автоматично, для довшого очікування потрібна явна гілка: отримати статус і заголовки, перевірити, чи помилка повторювана, передати коректну затримку у Wait і повернутися до запиту з обмеженням кількості циклів. Якщо заголовка немає, використовуйте погоджену з документацією API паузу. Після вичерпання спроб переводьте item у гілку помилки, а не запускайте нескінченний повтор."
        ]
      },
      {
        "id": "protect-write-operations",
        "title": "6. Не повторюйте запис без захисту від дубля",
        "paragraphs": [
          "Повтор читання зазвичай не створює нового запису. Але POST, який створює замовлення, надсилає повідомлення або додає рядок у систему, може встигнути виконатися навіть тоді, коли відповідь загубилася. Сліпий повтор здатен створити дубль.",
          "Перед автоматичним повтором перевірте, чи підтримує API ключ ідемпотентності. Якщо ні, продумайте унікальний ID операції та перевірку, чи запис уже існує. Не припускайте, що будь-який сервіс підтримує Idempotency-Key: це потрібно підтвердити в документації саме вашого API."
        ]
      },
      {
        "id": "example-and-checklist",
        "title": "7. Приклад налаштування та критерії перевірки",
        "paragraphs": [
          "Умовний приклад: API документує ліміт 60 запитів за хвилину на один ключ, а workflow має обробити 120 items. Для одного ізольованого сценарію можна почати з Items per Batch = 1 і Batch Interval = 1100 ms. Це дає приблизно 54 запити за хвилину, а весь список оброблятиметься трохи довше двох хвилин. Це стартова конфігурація для прикладу, а не гарантія: якщо інші процеси використовують той самий ключ, швидкість потрібно зменшити.",
          "Після зміни перевірте на тестових даних: запити не йдуть щільним сплеском, повтори мають кінцеву кількість, успішні записи не дублюються, а остаточна помилка потрапляє в окрему гілку з технічним ID та часом. Якщо ліміт добовий або пов’язаний із балансом, Batching не усуне причину: доведеться зменшити кількість викликів або чекати на оновлення квоти."
        ]
      }
    ]
  },
  "en": {
    "title": "n8n 429 error: control API request rates",
    "description": "How to handle HTTP 429 in n8n: identify the limit, use Batching, Loop Over Items and Wait, and understand Retry On Fail.",
    "category": "Automation",
    "coverCaption": "A controlled API request flow with batching, a pause and a retry",
    "serviceLabel": "Discuss workflow automation and API integration",
    "relatedLabel": "How to diagnose an n8n webhook returning 404",
    "sourceLabel": "Official documentation",
    "intro": "An n8n node stops with a 429 Too Many Requests message, and running it again only creates more failures. Do not start with unlimited retries. First identify which limit was reached, then slow the requests down and add bounded retries only where they are safe.",
    "sections": [
      {
        "id": "meaning-of-429",
        "title": "1. What 429 means, and what it does not tell you",
        "paragraphs": [
          "HTTP 429 means that a service is asking the client to reduce the number of requests made within a period of time. The status alone does not tell you which limit was reached: per minute, per day, per API key, per account or per endpoint. The provider defines that policy, so check its API documentation and the full response message.",
          "Do not confuse 429 with 401 or 403 authentication errors, or a 404 caused by an incorrect route. A longer delay will not fix an invalid token or URL. If the response points to exhausted credits or a quota, retries will not create a new allowance."
        ]
      },
      {
        "id": "inspect-execution",
        "title": "2. Find the node and the source of excess requests",
        "paragraphs": [
          "Open the failed execution and identify the node that calls the external service. Record the HTTP method, endpoint, number of input items, credential or API key, and whether other workflows run at the same time. Check whether each item creates a separate HTTP request and whether several workflows share the same limit.",
          "If the node exposes response status and headers, inspect them without copying secrets. Do not put API tokens, passwords, email addresses, phone numbers or real enquiry contents into logs. A timestamp, response code, node name and technical execution ID are usually enough for diagnosis."
        ]
      },
      {
        "id": "reduce-request-rate",
        "title": "3. Reduce the number and rate of requests first",
        "paragraphs": [
          "If the API provides a bulk endpoint or lets you retrieve a filtered collection in one call, use it instead of making a request for every record. In n8n's HTTP Request node, add the Batching option: Items per Batch sets the number of items in each batch, while Batch Interval (ms) sets the pause between batches. Choose values from the specific provider's limits, not from a universal recipe.",
          "For integration nodes without their own Batching option, n8n documents a Loop Over Items and Wait pattern. It lets you process smaller groups and control the interval. Include traffic from other workflows using the same key: one workflow may look slow, while the combined traffic still exceeds the quota."
        ]
      },
      {
        "id": "retry-on-fail",
        "title": "4. When Retry On Fail is enough",
        "paragraphs": [
          "For a short temporary failure, open the node, go to Settings and enable Retry On Fail. Configure Max Tries and Wait Between Tries (ms). This is useful when repeating the request is safe and the service is expected to recover quickly.",
          "There are important limits: current n8n documentation specifies up to five tries and a wait of up to 5000 ms. The HTTP Request node does not automatically follow the Retry-After header. Retry On Fail therefore does not replace request pacing and is not suitable for long quota windows. Do not build a loop without a maximum number of attempts and a maximum wait."
        ]
      },
      {
        "id": "retry-after",
        "title": "5. When the API returns Retry-After",
        "paragraphs": [
          "Some APIs include a Retry-After header with a 429 response. Its value can be a number of seconds or an HTTP date before which the request should not be repeated. Treat it as the server's instruction, not as an arbitrary delay to replace with one second.",
          "Because n8n's HTTP Request node does not apply this header automatically, longer waits need an explicit branch: capture the response status and headers, decide whether the error is retryable, pass the correct delay to a Wait node, then return to the request with a limit on the number of cycles. If the header is absent, use a delay agreed with the API documentation. When attempts are exhausted, route the item to an error path instead of retrying forever."
        ]
      },
      {
        "id": "protect-write-operations",
        "title": "6. Do not retry writes without duplicate protection",
        "paragraphs": [
          "Repeating a read request usually does not create a new record. But a POST that creates an order, sends a message or adds a row may have completed even if its response was lost. A blind retry can create a duplicate.",
          "Before enabling automatic retries, check whether the API supports an idempotency key. If it does not, consider a unique operation ID and a lookup to see whether the record already exists. Do not assume every service supports Idempotency-Key: confirm this in the documentation for your specific API."
        ]
      },
      {
        "id": "example-and-checklist",
        "title": "7. Example settings and acceptance checks",
        "paragraphs": [
          "A hypothetical example: the API documents a limit of 60 requests per minute for one key, and the workflow needs to process 120 items. For one isolated workflow, you could start with Items per Batch = 1 and Batch Interval = 1100 ms. That is about 54 requests per minute, and the full list takes a little over two minutes. This is a starting configuration for the example, not a guarantee: if other processes share the key, reduce the rate.",
          "After the change, test with non-production data: requests are no longer sent in a burst, retries have a finite count, successful writes are not duplicated, and final failures reach a separate branch with a technical ID and timestamp. If the limit is daily or tied to account credits, Batching will not remove the cause: reduce the number of calls or wait for the quota to reset."
        ]
      }
    ]
  },
  "pl": {
    "title": "Błąd 429 w n8n: kontroluj tempo zapytań API",
    "description": "Jak obsłużyć HTTP 429 w n8n: rozpoznaj limit, użyj Batching, Loop Over Items i Wait oraz poznaj ograniczenia Retry On Fail.",
    "category": "Automatyzacja",
    "coverCaption": "Kontrolowany przepływ zapytań API z partiami, pauzą i ponowieniem",
    "serviceLabel": "Omów automatyzację procesu i integrację API",
    "relatedLabel": "Jak diagnozować webhook n8n zwracający 404",
    "sourceLabel": "Oficjalna dokumentacja",
    "intro": "Węzeł n8n zatrzymuje się z komunikatem 429 Too Many Requests, a ponowne uruchomienie tylko zwiększa liczbę błędów? Nie zaczynaj od nieograniczonych ponowień. Najpierw ustal, który limit został osiągnięty, następnie zmniejsz tempo zapytań i dodaj ograniczone ponowienia tylko tam, gdzie są bezpieczne.",
    "sections": [
      {
        "id": "meaning-of-429",
        "title": "1. Co oznacza 429 i czego nie wyjaśnia",
        "paragraphs": [
          "HTTP 429 oznacza, że usługa prosi klienta o ograniczenie liczby zapytań w określonym czasie. Sam kod nie mówi, który limit zadziałał: na minutę, na dobę, dla klucza API, konta lub endpointu. Zasady ustala dostawca, dlatego sprawdź jego dokumentację API i pełną treść odpowiedzi.",
          "Nie myl 429 z błędami autoryzacji 401 lub 403 ani z kodem 404 wynikającym z nieprawidłowej ścieżki. Dłuższa pauza nie naprawi błędnego tokenu ani URL. Jeśli odpowiedź wskazuje na wyczerpany limit środków lub kwotę, ponowienia nie zwiększą dostępnego limitu."
        ]
      },
      {
        "id": "inspect-execution",
        "title": "2. Znajdź węzeł i źródło nadmiarowych zapytań",
        "paragraphs": [
          "Otwórz nieudane wykonanie i wskaż węzeł wywołujący zewnętrzną usługę. Zapisz metodę HTTP, endpoint, liczbę wejściowych items, użyte dane uwierzytelniające lub klucz API oraz informację, czy inne workflow działają równolegle. Sprawdź, czy każdy item tworzy osobne zapytanie HTTP i czy kilka procesów nie korzysta ze wspólnego limitu.",
          "Jeśli węzeł udostępnia status i nagłówki odpowiedzi, sprawdź je bez kopiowania sekretów. Nie umieszczaj w logach tokenów API, haseł, adresów email, numerów telefonu ani treści prawdziwego zgłoszenia. Do diagnozy zwykle wystarczą czas, kod odpowiedzi, nazwa węzła i techniczny identyfikator wykonania."
        ]
      },
      {
        "id": "reduce-request-rate",
        "title": "3. Najpierw zmniejsz liczbę i tempo zapytań",
        "paragraphs": [
          "Jeśli API udostępnia endpoint zbiorczy lub pozwala pobrać filtrowaną kolekcję jednym wywołaniem, użyj go zamiast wysyłać osobne zapytanie dla każdego rekordu. W węźle HTTP Request n8n dodaj opcję Batching: Items per Batch określa liczbę elementów w partii, a Batch Interval (ms) przerwę między partiami. Wartości dobieraj według limitów konkretnej usługi, a nie uniwersalnego przepisu.",
          "Dla węzłów integracyjnych bez własnej opcji Batching dokumentacja n8n opisuje połączenie Loop Over Items i Wait. Pozwala ono przetwarzać mniejsze grupy i kontrolować odstępy. Uwzględnij ruch z innych workflow korzystających z tego samego klucza: pojedynczy proces może wyglądać na wolny, ale łączny ruch nadal przekracza limit."
        ]
      },
      {
        "id": "retry-on-fail",
        "title": "4. Kiedy wystarczy Retry On Fail",
        "paragraphs": [
          "Przy krótkim, tymczasowym błędzie otwórz węzeł, przejdź do Settings i włącz Retry On Fail. Ustaw Max Tries oraz Wait Between Tries (ms). To przydatne, gdy ponowienie zapytania jest bezpieczne, a usługa powinna szybko odzyskać sprawność.",
          "Istnieją ważne ograniczenia: aktualna dokumentacja n8n określa maksymalnie pięć prób i oczekiwanie do 5000 ms. Węzeł HTTP Request nie stosuje automatycznie nagłówka Retry-After. Retry On Fail nie zastępuje więc kontroli tempa i nie nadaje się do długich okien limitu. Nie buduj pętli bez maksymalnej liczby prób i maksymalnego czasu oczekiwania."
        ]
      },
      {
        "id": "retry-after",
        "title": "5. Gdy API zwraca Retry-After",
        "paragraphs": [
          "Niektóre API dodają nagłówek Retry-After do odpowiedzi 429. Może on zawierać liczbę sekund albo datę HTTP, przed którą nie należy ponawiać zapytania. Traktuj go jako instrukcję serwera, a nie przypadkowe opóźnienie, które można zastąpić jedną sekundą.",
          "Ponieważ HTTP Request w n8n nie obsługuje tego nagłówka automatycznie, dłuższe oczekiwanie wymaga jawnej gałęzi: odczytaj status i nagłówki, zdecyduj, czy błąd można ponowić, przekaż prawidłowe opóźnienie do Wait i wróć do zapytania z limitem liczby cykli. Jeśli nagłówka nie ma, zastosuj opóźnienie zgodne z dokumentacją API. Po wyczerpaniu prób skieruj element do ścieżki błędu zamiast ponawiać bez końca."
        ]
      },
      {
        "id": "protect-write-operations",
        "title": "6. Nie ponawiaj zapisów bez ochrony przed duplikatem",
        "paragraphs": [
          "Ponowienie odczytu zwykle nie tworzy nowego rekordu. Jednak POST tworzący zamówienie, wysyłający wiadomość lub dodający wiersz może zakończyć się powodzeniem, nawet jeśli odpowiedź zaginęła. Ślepe ponowienie może utworzyć duplikat.",
          "Przed włączeniem automatycznych ponowień sprawdź, czy API obsługuje klucz idempotencji. Jeśli nie, rozważ unikalny identyfikator operacji i sprawdzenie, czy rekord już istnieje. Nie zakładaj, że każda usługa obsługuje Idempotency-Key: potwierdź to w dokumentacji konkretnego API."
        ]
      },
      {
        "id": "example-and-checklist",
        "title": "7. Przykładowe ustawienia i kryteria odbioru",
        "paragraphs": [
          "Przykład hipotetyczny: dokumentacja API określa limit 60 zapytań na minutę dla jednego klucza, a workflow ma przetworzyć 120 items. Dla jednego odizolowanego procesu można zacząć od Items per Batch = 1 i Batch Interval = 1100 ms. To około 54 zapytań na minutę, a cała lista zajmie nieco ponad dwie minuty. To ustawienie początkowe w przykładzie, nie gwarancja: jeśli inne procesy korzystają z tego samego klucza, zmniejsz tempo.",
          "Po zmianie wykonaj test na danych nieprodukcyjnych: zapytania nie są wysyłane seriami, ponowienia mają ograniczoną liczbę, udane zapisy nie powielają się, a końcowe błędy trafiają do osobnej gałęzi z technicznym ID i znacznikiem czasu. Jeśli limit jest dobowy lub zależy od środków na koncie, Batching nie usunie przyczyny: trzeba ograniczyć liczbę wywołań albo poczekać na odnowienie limitu."
        ]
      }
    ]
  }
};

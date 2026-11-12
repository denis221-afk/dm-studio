const sections = (entries) => entries.map(([id, title, ...paragraphs]) => ({id, title, paragraphs}));

export const n8nWebhookArticle = {
  slug: 'n8n-webhook-404',
  date: '2026-11-09',
  image: 'images/webhook-route.svg',
  serviceSlug: 'business-automation',
  guide: true,
  ua: {
    title: 'Вебхук n8n повертає 404: що перевірити після тесту',
    description: 'Вебхук працює в редакторі n8n, але сайт отримує 404? Перевірте Production URL, публікацію процесу та метод запиту за коротким планом.',
    category: 'Автоматизація',
    coverCaption: 'Схема маршруту запиту від сайту до n8n',
    serviceLabel: 'Обговорити інтеграцію сайту з n8n',
    intro: 'Тестова заявка запускає процес у редакторі n8n, але після підключення сайт отримує 404. Спершу звірте три речі: яку адресу сайт викликає насправді, чи опубліковано процес і чи збігається метод запиту. Це допоможе локалізувати збій до того, як ви почнете перевіряти таблицю або сповіщення.',
    sections: sections([
      ['url', '1. Порівняйте фактичну адресу з Production URL',
       'У вузлі Webhook є окремі Test URL і Production URL. Тестова адреса призначена для сеансу прослуховування в редакторі; для постійного підключення джерела потрібна виробнича адреса опублікованого процесу. Скопіюйте повний Production URL із вузла. Не замінюйте фрагменти шляху навмання: важливі домен, префікс і весь шлях.',
       'Звірте адресу з налаштуванням, яке реально використовує відправник. Якщо браузер надсилає форму на сервер сайту, вкладка Network покаже лише цей перший запит. Адресу наступного запиту до n8n шукайте в конфігурації сервера або в його журналах. Перед передачею діагностики приберіть токени, заголовки авторизації та дані заявки.'],
      ['method', '2. Перевірте публікацію та HTTP-метод',
       'Відкрийте потрібний процес у тому самому середовищі n8n, на яке вказує адреса. Переконайтеся, що він опублікований і робоча версія містить потрібний вузол Webhook. Потім порівняйте HTTP Method у вузлі з методом, який надсилає сайт. Відкрити адресу в браузері означає зробити GET; це не перевірка вузла, налаштованого на POST.',
       'Умовний приклад: сайт має надсилати POST на шлях /webhook/lead-intake, а в конфігурації залишився /webhook-test/lead-intake. Після завершення тестового сеансу цей шлях не годиться для постійного приймання. Перенесіть у налаштування адресу з вкладки Production URL, потім звірте метод і публікацію. Це приклад конфігурації, а не опис інтеграції клієнта.'],
      ['verify', '3. Відокремте запуск процесу від його результату',
       'Використайте ізольовану копію процесу без відправлення повідомлень і без запису в робочу таблицю. Надішліть умовний запис із технічним ID; звірте час запиту, код відповіді та появу виконання в n8n. Так можна перевірити маршрут і метод без використання реальних контактів. Якщо журнал не показує виконання, перевірте його налаштування, а також чи запит доходить до правильного сервера: 404 може повернути й проксі перед n8n.',
       'Якщо виконання з’явилося, відкрийте його і знайдіть останній успішний крок. Відповідь вузла в режимі Immediately підтверджує старт процесу, але не запис у таблицю. Погодьте окремий критерій приймання для потрібної дії. Якщо маршрут не вдається відтворити, для діагностики підготуйте метод, очищений шлях, час і код відповіді — цього достатньо, щоб почати розбір без доступу до даних клієнтів.']
    ])
  },
  en: {
    title: 'n8n webhook returns 404: what to check after testing',
    description: 'Does your n8n webhook work in the editor but return 404 from the website? Check the Production URL, published workflow and HTTP method.',
    category: 'Automation',
    coverCaption: 'Illustration of a request travelling from a website to n8n',
    serviceLabel: 'Discuss connecting your website to n8n',
    intro: 'A test enquiry starts the workflow in the n8n editor, but the website gets a 404 once connected. First check the exact URL the sender calls, whether the workflow is published, and whether the request method matches. This helps locate the failure before you investigate the spreadsheet or notifications.',
    sections: sections([
      ['url', '1. Compare the actual address with the Production URL',
       'The Webhook node has separate Test and Production URLs. The test address is for a listening session in the editor; an ongoing integration needs the production address of the published workflow. Copy the full Production URL from the node. Avoid guessing parts of the address: the host, prefix and entire path matter.',
       'Compare the URL with the setting the sender actually uses. If the browser submits the form to your website server, the Network panel only shows that first request. Look for the next request to n8n in server configuration or logs. Remove tokens, authorization headers and enquiry data before sharing diagnostic details.'],
      ['method', '2. Check publishing and the HTTP method',
       'Open the workflow in the same n8n environment the URL points to. Verify that it is published and that the live version contains the right Webhook node. Compare the node’s HTTP Method with the method the website sends. Opening the address in a browser makes a GET request; it does not test a node configured for POST.',
       'Illustrative example: a website should POST to /webhook/lead-intake, but its configuration still uses /webhook-test/lead-intake. Once the test listening session ends, that path is unsuitable for ongoing use. Set the address shown under Production URL, then verify the method and publishing. This is a configuration example, not a client integration.'],
      ['verify', '3. Separate starting the workflow from completing the action',
       'Use an isolated workflow copy that sends no messages and does not write to the production sheet. Send a dummy record with a technical ID and match the request time and status code to an execution in n8n. This checks routing and method without real contact details. If no execution appears, check the logging settings and whether the request reaches the right server: a proxy in front of n8n can also return 404.',
       'If an execution appears, inspect it for the last successful step. The Immediately response mode confirms the workflow started; it does not confirm a spreadsheet write. Agree a separate acceptance criterion for the intended action. If you cannot reproduce the route, prepare the method, sanitized path, time and status code to start troubleshooting without customer data.']
    ])
  },
  pl: {
    title: 'Webhook n8n zwraca 404: co sprawdzić po teście',
    description: 'Webhook działa w edytorze n8n, ale strona otrzymuje 404? Sprawdź Production URL, opublikowany proces i metodę HTTP.',
    category: 'Automatyzacja',
    coverCaption: 'Schemat drogi żądania ze strony do n8n',
    serviceLabel: 'Omów integrację strony z n8n',
    intro: 'Testowe zgłoszenie uruchamia proces w edytorze n8n, ale po podłączeniu strona otrzymuje 404. Najpierw sprawdź rzeczywisty adres wywołania, publikację procesu i zgodność metody HTTP. To pozwoli zawęzić problem przed sprawdzaniem arkusza lub powiadomień.',
    sections: sections([
      ['url', '1. Porównaj rzeczywisty adres z Production URL',
       'Węzeł Webhook ma osobne adresy Test URL i Production URL. Adres testowy służy do sesji nasłuchiwania w edytorze; stałe połączenie wymaga adresu produkcyjnego opublikowanego procesu. Skopiuj cały Production URL z węzła. Nie zgaduj części adresu: znaczenie mają domena, prefiks i cała ścieżka.',
       'Porównaj adres z ustawieniem, z którego rzeczywiście korzysta nadawca. Jeśli przeglądarka wysyła formularz na serwer strony, karta Network pokaże tylko pierwsze żądanie. Kolejnego żądania do n8n szukaj w konfiguracji lub dziennikach serwera. Przed udostępnieniem diagnostyki usuń tokeny, nagłówki autoryzacji i dane zgłoszenia.'],
      ['method', '2. Sprawdź publikację i metodę HTTP',
       'Otwórz proces w tym samym środowisku n8n, na które wskazuje adres. Upewnij się, że proces jest opublikowany, a działająca wersja zawiera właściwy węzeł Webhook. Następnie porównaj HTTP Method w węźle z metodą wysyłaną przez stronę. Otwarcie adresu w przeglądarce wysyła GET; nie testuje węzła skonfigurowanego do obsługi POST.',
       'Przykład poglądowy: strona powinna wysyłać POST na /webhook/lead-intake, ale w konfiguracji pozostał /webhook-test/lead-intake. Po zakończeniu sesji testowej ta ścieżka nie nadaje się do stałego użycia. Wstaw do konfiguracji adres z pola Production URL, a następnie sprawdź metodę i publikację. To przykład konfiguracji, nie wdrożenie klienta.'],
      ['verify', '3. Odróżnij uruchomienie procesu od wykonania działania',
       'Użyj izolowanej kopii procesu, która nie wysyła wiadomości ani nie zapisuje w produkcyjnym arkuszu. Wyślij przykładowy rekord z technicznym ID i zestaw czas oraz kod odpowiedzi z wykonaniem w n8n. Tak sprawdzisz ścieżkę i metodę bez prawdziwych danych kontaktowych. Jeśli nie widać wykonania, sprawdź ustawienia zapisu historii i upewnij się, że żądanie dociera na właściwy serwer: 404 może też zwrócić proxy przed n8n.',
       'Jeśli wykonanie jest widoczne, znajdź ostatni udany krok. Tryb odpowiedzi Immediately potwierdza uruchomienie procesu, lecz nie zapis w arkuszu. Ustal osobne kryterium odbioru dla oczekiwanego działania. Jeśli nie możesz odtworzyć problemu, przygotuj metodę, oczyszczoną ścieżkę, czas i kod odpowiedzi. Od tego można zacząć diagnostykę bez danych klientów.']
    ])
  }
};

const acceptedButMissing = {
  ua: ['4. Що робити, якщо відповідь 2xx, але рядка немає',
    'Візьміть час і технічний ID одного звернення. Знайдіть відповідне виконання та відкрийте вузол, який мав записати дані. Якщо вузол не запускався, перевірте умову переходу до гілки. Якщо він завершився помилкою, перевірте повідомлення й доступ до таблиці. Якщо запис позначено успішним, звірте цільовий файл, вкладку та ID рядка. Ці три випадки потребують різних виправлень.',
    'Умовний приклад для ізольованої копії: вузол запису замінено контрольованим збоєм. За негайної відповіді відправник може вже отримати 2xx, а виконання згодом завершиться помилкою. Критерій приймання: оператор бачить збій і може знайти його за ID. У n8n для невдалих виконань можна призначити окремий процес із вузлом Error Trigger. Це засіб спостереження: він сам не відновлює запис і не помітить пропущену гілку, якщо весь процес завершився успішно.',
    'Перед повтором звірте, що вже встигло виконатися. Якщо рядок є, але зірвалося сповіщення, повторіть лише крок сповіщення через передбачений механізм. Якщо стан запису невідомий, спершу знайдіть заявку за тим самим ID. Не запускайте весь процес повторно, доки не зрозумієте, чи можуть повторитися зовнішні дії.'],
  en: ['4. What to do when the response is 2xx but no row appears',
    'Take the timestamp and technical ID of one enquiry. Find its execution and open the node that should have written the data. If it never ran, check the branch condition. If it failed, check the error and spreadsheet access. If the write reports success, verify the destination file, tab and row ID. Each outcome needs a different fix.',
    'Illustrative test for an isolated copy: replace the write node with a controlled failure. With an immediate response, the sender can receive 2xx before the execution fails. The acceptance criterion is that an operator can see the failure and locate it by ID. In n8n, you can assign a separate workflow starting with Error Trigger to handle failed executions. It helps surface failures; it does not restore the write or detect a skipped branch if the execution succeeds.',
    'Check what already ran before retrying. If the row exists but notification failed, retry only the notification through the mechanism provided for it. If the write status is unknown, first look up the same enquiry ID. Avoid rerunning the whole workflow until you know which external actions could repeat.'],
  pl: ['4. Co zrobić, gdy odpowiedź to 2xx, ale brakuje wiersza',
    'Weź czas i techniczny identyfikator jednego zgłoszenia. Znajdź wykonanie i otwórz węzeł odpowiedzialny za zapis. Jeśli węzeł się nie uruchomił, sprawdź warunek wyboru gałęzi. Jeśli zgłosił błąd, sprawdź komunikat i dostęp do arkusza. Jeśli zapis zakończył się sukcesem, zweryfikuj plik docelowy, kartę i identyfikator wiersza. Każdy z tych wyników wymaga innej poprawki.',
    'Przykład dla odizolowanej kopii: zastąp węzeł zapisu kontrolowanym błędem. Przy natychmiastowej odpowiedzi nadawca może dostać 2xx przed nieudanym zakończeniem procesu. Kryterium odbioru: operator widzi błąd i potrafi znaleźć go po identyfikatorze. W n8n można przypisać do obsługi nieudanych wykonań osobny proces rozpoczynający się od Error Trigger. Ułatwia on zauważenie błędów, ale sam nie odtwarza zapisu ani nie wykrywa pominiętej gałęzi, jeśli wykonanie zakończy się sukcesem.',
    'Przed ponowieniem sprawdź, co już się wykonało. Jeśli wiersz istnieje, lecz powiadomienie nie dotarło, ponów tylko krok powiadomienia przez przeznaczony do tego mechanizm. Jeśli stan zapisu jest nieznany, najpierw wyszukaj zgłoszenie po tym samym ID. Nie uruchamiaj ponownie całego procesu, dopóki nie ustalisz, które działania zewnętrzne mogą się powtórzyć.']
};
for (const [locale, entry] of Object.entries(acceptedButMissing)) {
  n8nWebhookArticle[locale].sections.push(...sections([['accepted-but-missing', ...entry]]));
}
n8nWebhookArticle.modified = '2026-11-12';

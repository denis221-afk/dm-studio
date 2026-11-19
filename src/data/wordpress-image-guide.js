export const wordpressImageGuide = {
  "slug": "elementor-image-sizing",
  "date": "2026-11-19",
  "image": "images/elementor-image-guide.svg",
  "serviceSlug": "wordpress-elementor",
  "imageGuide": true,
  "ua": {
    "title": "Зображення в Elementor: як підібрати розмір і не зіпсувати мобільний вигляд",
    "description": "Практичний розбір для WordPress та Elementor: розміри, пропорції, WebP/AVIF, srcset і lazy loading без розмиття та обрізаних деталей.",
    "category": "WordPress та Elementor",
    "coverCaption": "Нейтральна схема підготовки зображення для сторінки",
    "serviceLabel": "Правки зображень і сторінок WordPress та Elementor",
    "relatedLabel": "Як підготувати список правок для WordPress",
    "sourceLabel": "Офіційні технічні джерела",
    "intro": "Фото виглядає чітким на комп’ютері, але на телефоні стає розмитим, обрізає важливу деталь або завантажується довше, ніж очікує відвідувач. Не поспішайте встановлювати кілька плагінів оптимізації. Спершу з’ясуйте, який файл реально завантажується, скільки пікселів займає блок і як WordPress передає різні розміри зображення браузеру. Потім перевірте обрізання та спосіб завантаження на першому екрані.",
    "sections": [
      {
        "id": "find-the-image",
        "title": "1. Знайдіть конкретне зображення, яке створює проблему",
        "paragraphs": [
          "Відкрийте сторінку, де фото виглядає неправильно, і перевірте її в тому самому браузері та розмірі вікна, де виникає проблема. У вкладці Network відфільтруйте запити за зображеннями й подивіться на фактичний файл, його розмір у пікселях та обсяг переданих даних. Так можна відрізнити завеликий оригінал від ситуації, коли сайт завантажує надто маленьку мініатюру.",
          "Окремо перевірте, що саме не так: файл розмитий ще до завантаження, Elementor обрізає його невдалим способом чи блок має невідповідні пропорції. Для фонового зображення перевірка може відрізнятися від звичайного елемента Image. Не змінюйте всі фото сайту через одну проблему на одній сторінці."
        ]
      },
      {
        "id": "choose-size",
        "title": "2. Підберіть розмір під реальну ширину блока",
        "paragraphs": [
          "Якщо зображення займає близько 600 CSS-пікселів, немає сенсу без перевірки віддавати кожному телефону оригінал шириною 5000 пікселів. Але й файл рівно 600 пікселів може виглядати м’яким на екрані з високою щільністю пікселів. Почніть із розміру, близького до реального відображення, врахуйте можливий варіант приблизно у два рази ширший для Retina-екрана, а потім перевірте, який файл обрав браузер.",
          "WordPress уміє створювати кілька розмірів зображення та формувати атрибути srcset і sizes. Вони дають браузеру варіанти джерела для різних умов відображення. У віджеті Elementor перевірте вибраний Image Size: Full не завжди потрібен. Не вимикайте стандартні розміри медіатеки глобально, поки не з’ясували, які тема й плагіни їх використовують."
        ]
      },
      {
        "id": "format",
        "title": "3. Перевірте WebP або AVIF на своєму хостингу",
        "paragraphs": [
          "Сучасний формат може зменшити вагу фото, але сам напис WebP чи AVIF не гарантує кращого результату. WordPress підтримує WebP з версії 5.8, а AVIF — з 6.5 за умови підтримки формату серверним середовищем. Для AVIF відкрийте Інструменти → Стан сайту → Інформація → Обробка медіафайлів і перевірте можливості GD або Imagick.",
          "Після конвертації відкрийте сторінку як відвідувач і подивіться, який формат реально віддається браузеру. Перевірте прозорість PNG, дрібний текст на банерах і якість фотографій. Збережіть оригінали або резервну копію перед масовою обробкою. Не запускайте одночасно кілька інструментів конвертації без перевірки їхніх правил: можна отримати зайві копії або непередбачуваний результат."
        ]
      },
      {
        "id": "loading",
        "title": "4. Не застосовуйте lazy loading до головного фото навмання",
        "paragraphs": [
          "Відкладене завантаження корисне для зображень нижче першого екрана: браузер може завантажити їх ближче до моменту, коли відвідувач прокрутить сторінку. Але якщо так само відкласти головне зображення у верхній частині сторінки, воно може почати завантажуватися пізніше й погіршити Largest Contentful Paint.",
          "Для справді важливого LCP-зображення іноді доречний fetchpriority=\"high\", але не ставте високий пріоритет кожному фото. Elementor має налаштування Optimized Image Loading, яке керує пріоритетом важливого зображення та lazy loading для інших. Після зміни перевірте фактичні атрибути в HTML і поведінку сторінки, а не лише перемикач у панелі."
        ]
      },
      {
        "id": "crop-and-accessibility",
        "title": "5. Збережіть пропорції, важливі деталі й доступність",
        "paragraphs": [
          "Узгодьте співвідношення сторін окремо для картки, банера та мобільного блока. Якщо Elementor використовує object-fit: cover, частина фото може бути обрізана. Перевірте, чи не зникає обличчя, товар або текстова зона після зміни ширини. Іноді потрібні окремі кадрування, а не одна універсальна картинка для всіх блоків.",
          "Переконайтеся, що зображення має коректні width і height або інший спосіб резервування місця до завантаження. Це допомагає уникнути несподіваного зсуву вмісту. Для змістовного фото додайте короткий alt, який пояснює його роль; для суто декоративного зображення доречний порожній alt. Не перетворюйте alt на перелік ключових слів."
        ]
      },
      {
        "id": "verify",
        "title": "6. Порівняйте результат на тих самих умовах",
        "paragraphs": [
          "Перевірте одну й ту саму URL-адресу до та після змін на погоджених ширинах екрана. Порівняйте фактичний файл у Network, його вагу, різкість, кадрування та час появи головного зображення. Якщо користуєтеся PageSpeed Insights, відрізняйте лабораторні вимірювання від польових даних: вони описують різні умови й не зобов’язані змінюватися однаково.",
          "Очистіть кеш лише за узгодженим сценарієм і перевірте сторінку без входу в адмінку. На багатомовному сайті повторіть перевірку для мовних версій, бо довші тексти можуть змінити висоту або кадрування блока. Не оцінюйте результат лише за одним балом PageSpeed і не обіцяйте фіксовану оцінку до вимірювання."
        ]
      },
      {
        "id": "handoff",
        "title": "7. Що передати виконавцю для точного виправлення",
        "paragraphs": [
          "Надішліть адресу сторінки, назву блока, оригінальне фото та приклад бажаного кадру. Додайте ширину екрана, де помітна проблема, і поясніть, що не можна обрізати або змінювати. Якщо є кілька мовних версій, перелічіть їх. Перед масовою заміною файлів узгодьте резервну копію та спосіб повернення попередніх зображень.",
          "Якщо проблема стосується розміщення, розміру або адаптивного вигляду фото на готовому сайті, перегляньте послугу доопрацювання WordPress та Elementor. Для першої оцінки достатньо URL і короткого опису «що зараз не так → як має виглядати → де перевірити»."
        ]
      }
    ]
  },
  "en": {
    "title": "Elementor images: choose the right size without breaking mobile layouts",
    "description": "A practical WordPress and Elementor guide to image dimensions, cropping, WebP/AVIF, srcset and lazy loading without blur or lost details.",
    "category": "WordPress and Elementor",
    "coverCaption": "A neutral diagram for preparing an image for a page",
    "serviceLabel": "WordPress and Elementor image and page fixes",
    "relatedLabel": "How to prepare a WordPress change brief",
    "sourceLabel": "Official technical references",
    "intro": "A photo looks sharp on desktop but becomes blurry on a phone, loses an important detail to cropping or takes longer to load than visitors expect. Do not rush to install several optimization plugins. First find out which file is actually downloaded, how many pixels the block displays and how WordPress offers different image sizes to the browser. Then check cropping and loading behaviour above the fold.",
    "sections": [
      {
        "id": "find-the-image",
        "title": "1. Find the exact image causing the problem",
        "paragraphs": [
          "Open the page where the image looks wrong and reproduce the issue in the same browser and viewport. In the Network panel, filter image requests and inspect the actual file, its pixel dimensions and transferred size. This helps distinguish an oversized original from a case where the site downloads a thumbnail that is too small.",
          "Check what is actually wrong: the source file is blurry, Elementor crops it badly, or the container has the wrong aspect ratio. A background image may need a different check from an Image widget. Do not change every image on the site because one page has one visible problem."
        ]
      },
      {
        "id": "choose-size",
        "title": "2. Match the image size to the actual container",
        "paragraphs": [
          "If an image is displayed at about 600 CSS pixels wide, there is usually no reason to send a 5,000-pixel original to every phone without checking. But a file that is exactly 600 pixels wide may look soft on a high-density screen. Start with a source close to the rendered size, consider a version around twice as wide for a Retina display, then check which file the browser actually selects.",
          "WordPress can generate several image sizes and add srcset and sizes attributes. These give the browser source options for different display conditions. In the Elementor widget, review the selected Image Size: Full is not always necessary. Do not disable media sizes globally until you know which ones the theme and plugins use."
        ]
      },
      {
        "id": "format",
        "title": "3. Check WebP or AVIF support on your hosting",
        "paragraphs": [
          "A modern format can reduce image weight, but the label WebP or AVIF alone does not guarantee a better result. WordPress supports WebP from version 5.8 and AVIF from 6.5 when the server environment supports the format. For AVIF, open Tools → Site Health → Info → Media Handling and check the capabilities of GD or Imagick.",
          "After conversion, open the page as a visitor and inspect the format actually delivered to the browser. Check PNG transparency, small text in banners and photo quality. Keep the originals or a backup before bulk processing. Do not run several conversion tools at once without checking their rules: they may create extra copies or produce an unexpected result."
        ]
      },
      {
        "id": "loading",
        "title": "4. Do not apply lazy loading to the main image blindly",
        "paragraphs": [
          "Lazy loading is useful for images below the fold: the browser can fetch them closer to the moment a visitor scrolls towards them. But if the main image at the top of the page is delayed in the same way, its request may start later and hurt Largest Contentful Paint.",
          "For a genuine LCP image, fetchpriority=\"high\" may sometimes help, but do not give every photo high priority. Elementor provides an Optimized Image Loading setting that manages the priority of an important image and lazy loading for others. After changing it, inspect the actual HTML attributes and page behaviour, not just the toggle in the dashboard."
        ]
      },
      {
        "id": "crop-and-accessibility",
        "title": "5. Preserve proportions, important details and accessibility",
        "paragraphs": [
          "Agree on aspect ratios separately for a card, banner and mobile container. If Elementor uses object-fit: cover, part of the photo may be cropped. Check that a face, product or text area does not disappear when the viewport changes. Sometimes separate crops are better than one universal image for every container.",
          "Make sure the image has correct width and height attributes or another way to reserve space before it loads. This helps prevent unexpected layout shifts. Add concise alt text that explains the role of meaningful images; a purely decorative image can use an empty alt. Do not turn alt text into a list of keywords."
        ]
      },
      {
        "id": "verify",
        "title": "6. Compare the result under the same conditions",
        "paragraphs": [
          "Check the same URL before and after the change at agreed viewport widths. Compare the actual Network request, file size, sharpness, crop and the time when the main image appears. If you use PageSpeed Insights, distinguish lab measurements from field data: they describe different conditions and may not move in the same way.",
          "Clear the cache only as part of an agreed process and inspect the page while signed out. On a multilingual site, repeat the check for each language because longer copy can change the height or crop of a container. Do not judge the result by one PageSpeed score or promise a fixed score before measuring."
        ]
      },
      {
        "id": "handoff",
        "title": "7. What to give a developer for a precise fix",
        "paragraphs": [
          "Share the page URL, widget name, original image and an example of the desired crop. Add the viewport width where the issue appears and explain what must not be cropped or changed. List the language versions if there are several. Before replacing files in bulk, agree on a backup and a way to restore the previous images.",
          "If the issue is about image placement, sizing or responsive appearance on an existing site, see the WordPress and Elementor improvement service. For an initial estimate, a URL and a short note are enough: what is wrong now, what the result should look like and where to check it."
        ]
      }
    ]
  },
  "pl": {
    "title": "Obrazy w Elementorze: dobierz rozmiar bez psucia widoku mobilnego",
    "description": "Praktyczny poradnik WordPress i Elementor: wymiary, kadrowanie, WebP/AVIF, srcset i lazy loading bez rozmycia i utraty ważnych szczegółów.",
    "category": "WordPress i Elementor",
    "coverCaption": "Neutralny schemat przygotowania obrazu na stronę",
    "serviceLabel": "Poprawki obrazów i stron WordPress oraz Elementor",
    "relatedLabel": "Jak przygotować listę poprawek WordPress",
    "sourceLabel": "Oficjalne źródła techniczne",
    "intro": "Zdjęcie wygląda ostro na komputerze, ale na telefonie staje się rozmyte, traci ważny szczegół przez kadrowanie albo ładuje się dłużej, niż oczekuje odwiedzający. Nie instaluj od razu kilku wtyczek optymalizacyjnych. Najpierw ustal, który plik jest rzeczywiście pobierany, ile pikseli zajmuje blok i jak WordPress udostępnia przeglądarce różne rozmiary obrazu. Następnie sprawdź kadrowanie i sposób ładowania grafiki na pierwszym ekranie.",
    "sections": [
      {
        "id": "find-the-image",
        "title": "1. Znajdź konkretny obraz powodujący problem",
        "paragraphs": [
          "Otwórz stronę, na której zdjęcie wygląda nieprawidłowo, i odtwórz problem w tej samej przeglądarce oraz przy tej samej szerokości okna. W panelu Network odfiltruj żądania obrazów i sprawdź faktyczny plik, jego wymiary w pikselach oraz ilość przesłanych danych. Dzięki temu odróżnisz zbyt duży oryginał od sytuacji, w której strona pobiera za małą miniaturę.",
          "Osobno ustal, co dokładnie jest nie tak: sam plik jest rozmyty, Elementor źle go kadruje czy kontener ma niewłaściwe proporcje. Obraz tła może wymagać innej kontroli niż widżet Image. Nie zmieniaj wszystkich zdjęć w serwisie z powodu jednego problemu na jednej stronie."
        ]
      },
      {
        "id": "choose-size",
        "title": "2. Dopasuj rozmiar do rzeczywistej szerokości bloku",
        "paragraphs": [
          "Jeśli obraz jest wyświetlany na szerokości około 600 pikseli CSS, zwykle nie ma powodu, aby bez sprawdzenia wysyłać każdemu telefonowi oryginał o szerokości 5000 pikseli. Z drugiej strony plik o szerokości dokładnie 600 pikseli może wyglądać miękko na ekranie o dużej gęstości pikseli. Zacznij od źródła zbliżonego do rozmiaru wyświetlania, rozważ wariant około dwa razy szerszy dla ekranu Retina, a następnie sprawdź, który plik wybiera przeglądarka.",
          "WordPress potrafi tworzyć kilka rozmiarów obrazu i dodawać atrybuty srcset oraz sizes. Dzięki nim przeglądarka otrzymuje warianty źródła dla różnych warunków wyświetlania. W widżecie Elementor sprawdź ustawienie Image Size: wariant Full nie zawsze jest potrzebny. Nie wyłączaj globalnie rozmiarów biblioteki mediów, dopóki nie sprawdzisz, których używają motyw i wtyczki."
        ]
      },
      {
        "id": "format",
        "title": "3. Sprawdź obsługę WebP lub AVIF na hostingu",
        "paragraphs": [
          "Nowoczesny format może zmniejszyć wagę zdjęcia, ale sam napis WebP lub AVIF nie gwarantuje lepszego wyniku. WordPress obsługuje WebP od wersji 5.8, a AVIF od 6.5, jeśli środowisko serwera obsługuje dany format. W przypadku AVIF przejdź do Narzędzia → Stan witryny → Informacje → Obsługa mediów i sprawdź możliwości GD lub Imagick.",
          "Po konwersji otwórz stronę jako odwiedzający i sprawdź, jaki format faktycznie trafia do przeglądarki. Skontroluj przezroczystość PNG, drobny tekst na banerach i jakość zdjęć. Zachowaj oryginały lub kopię zapasową przed masową obróbką. Nie uruchamiaj kilku narzędzi konwertujących jednocześnie bez sprawdzenia ich zasad: mogą tworzyć dodatkowe kopie lub nieoczekiwane wyniki."
        ]
      },
      {
        "id": "loading",
        "title": "4. Nie włączaj lazy loading dla głównego zdjęcia bez sprawdzenia",
        "paragraphs": [
          "Lazy loading jest przydatny dla obrazów poniżej pierwszego ekranu: przeglądarka może pobrać je bliżej chwili, gdy odwiedzający przewinie stronę. Jeśli jednak w ten sam sposób opóźnisz główne zdjęcie u góry strony, jego pobieranie może rozpocząć się później i pogorszyć Largest Contentful Paint.",
          "Dla rzeczywistego obrazu LCP atrybut fetchpriority=\"high\" może czasem pomóc, ale nie ustawiaj wysokiego priorytetu dla każdego zdjęcia. Elementor udostępnia ustawienie Optimized Image Loading, które zarządza priorytetem ważnego obrazu i lazy loadingiem pozostałych. Po zmianie sprawdź faktyczne atrybuty HTML i zachowanie strony, a nie tylko przełącznik w panelu."
        ]
      },
      {
        "id": "crop-and-accessibility",
        "title": "5. Zachowaj proporcje, ważne szczegóły i dostępność",
        "paragraphs": [
          "Ustal proporcje osobno dla karty, banera i bloku mobilnego. Jeśli Elementor używa object-fit: cover, część zdjęcia może zostać przycięta. Sprawdź, czy po zmianie szerokości nie znika twarz, produkt lub obszar z tekstem. Czasem potrzebne są osobne kadry zamiast jednego uniwersalnego obrazu dla wszystkich bloków.",
          "Upewnij się, że obraz ma prawidłowe atrybuty width i height albo inny sposób rezerwowania miejsca przed załadowaniem. Pomaga to uniknąć nieoczekiwanych przesunięć układu. Do znaczącego zdjęcia dodaj krótki alt opisujący jego rolę; czysto dekoracyjny obraz może mieć pusty alt. Nie zamieniaj tekstu alt w listę słów kluczowych."
        ]
      },
      {
        "id": "verify",
        "title": "6. Porównaj wynik w takich samych warunkach",
        "paragraphs": [
          "Sprawdź ten sam adres URL przed zmianą i po niej przy uzgodnionych szerokościach ekranu. Porównaj faktyczne żądanie w Network, wagę pliku, ostrość, kadrowanie i moment pojawienia się głównego obrazu. Jeśli korzystasz z PageSpeed Insights, odróżniaj pomiary laboratoryjne od danych terenowych: opisują różne warunki i nie muszą zmieniać się w ten sam sposób.",
          "Wyczyść pamięć podręczną tylko w ramach uzgodnionej procedury i sprawdź stronę bez logowania do panelu. W serwisie wielojęzycznym powtórz kontrolę dla każdej wersji, ponieważ dłuższy tekst może zmienić wysokość lub kadrowanie bloku. Nie oceniaj wyniku wyłącznie na podstawie jednego wyniku PageSpeed i nie obiecuj stałej oceny przed pomiarem."
        ]
      },
      {
        "id": "handoff",
        "title": "7. Co przekazać wykonawcy, aby poprawka była precyzyjna",
        "paragraphs": [
          "Prześlij adres strony, nazwę widżetu, oryginalne zdjęcie i przykład oczekiwanego kadru. Dodaj szerokość ekranu, przy której widać problem, oraz wyjaśnij, czego nie wolno przycinać ani zmieniać. Wymień wersje językowe, jeśli jest ich kilka. Przed masową wymianą plików uzgodnij kopię zapasową i sposób przywrócenia poprzednich obrazów.",
          "Jeśli problem dotyczy umieszczenia, rozmiaru lub responsywnego wyglądu zdjęć w istniejącym serwisie, sprawdź usługę poprawek WordPress i Elementor. Do wstępnej wyceny wystarczy adres URL i krótki opis: co jest nie tak, jak ma wyglądać efekt i gdzie go sprawdzić."
        ]
      }
    ]
  }
};

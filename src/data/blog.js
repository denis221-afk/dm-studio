export const blogPosts = [
  {
    "slug": "nfc-food-ai",
    "date": "2026-10-09",
    "caseSlug": "nfc-menu",
    "image": "images/nfc-real.webp",
    "ua": {
      "title": "NFC Food AI: як поєднати сайт, AI та історію клієнтів",
      "description": "Розбір клієнтського проєкту: фото страви, приблизна оцінка КБЖВ, Telegram, SendPulse та Google Sheets в одному робочому процесі.",
      "category": "AI та автоматизація",
      "intro": "NFC Food AI — вебсервіс, у якому користувач завантажує фотографію страви та отримує приблизну оцінку її складу й харчової цінності. У цьому матеріалі розповідаю, які частини рішення я реалізував і як вони пов’язані між собою.",
      "sections": [
        {
          "id": "task",
          "title": "Задача: зробити аналіз страви простим",
          "paragraphs": [
            "Ключова ідея проєкту — короткий шлях від фотографії до результату. Користувачу потрібен зрозумілий вебінтерфейс: завантажити фото, надіслати його на аналіз і побачити результат.",
            "На цьому робота системи не закінчується. Для взаємодії з користувачами та збереження результатів проєкт поєднує вебсервіс, AI, інтеграції Telegram і SendPulse, а також Google Sheets. Це реальний клієнтський проєкт, у якому я працював і над інтерфейсом, і над передаванням даних між сервісами."
          ]
        },
        {
          "id": "flow",
          "title": "Шлях користувача: фото → аналіз → історія",
          "paragraphs": [
            "У вебінтерфейсі реалізовано завантаження фотографії та відображення результатів аналізу. Система передає запит на backend, обробляє його та повертає дані, які користувач може переглянути.",
            "КБЖВ — це калорії, білки, жири та вуглеводи. У цьому проєкті оцінка за фотографією є приблизною. Її не варто описувати як лабораторно точний вимір або гарантію визначення складу страви.",
            "Історія аналізів допомагає зібрати результати в межах роботи з клієнтом. Для цього в проєкті використовується Google Sheets: історія, список клієнтів і картка окремого клієнта."
          ]
        },
        {
          "id": "integrations",
          "title": "Навіщо потрібні Telegram, SendPulse і Google Sheets",
          "paragraphs": [
            "Інтеграції Telegram та SendPulse пов’язані з роботою з користувачами і їхніми результатами. Google Sheets використовується для клієнтських даних та історії аналізів. Backend API забезпечує передавання даних між частинами рішення.",
            "Цінність інтеграцій — у спільному процесі. Саме на зв’язках між сервісами важливо перевірити, що дані передаються коректно й опиняються в потрібному місці. Окремий інтерфейс ще не означає, що весь сценарій працює від початку до кінця."
          ]
        },
        {
          "id": "admin",
          "title": "Адмін-конструктор для змін без правок верстки",
          "paragraphs": [
            "Ще одна реалізована частина — адмін-конструктор. Він дозволяє змінювати тексти, зображення, кольори та параметри оформлення.",
            "Для замовника це можливість керувати виглядом інтерфейсу через передбачені налаштування. Межі такого редагування залежать від функцій конструктора: він не замінює розробку нових сценаріїв чи інтеграцій."
          ]
        },
        {
          "id": "delivery",
          "title": "Що я реалізував у проєкті",
          "paragraphs": [
            "Моя робота охоплювала вебінтерфейс, адмін-конструктор, інтеграції Telegram і SendPulse, клієнтські дані та історію в Google Sheets, backend API й деплой через GitHub та Railway.",
            "У кейсі важливо показати не лише екран застосунку, а й пов’язаний робочий процес. NFC Food AI демонструє досвід створення рішення з кількома сервісами та подальшого доопрацювання за побажаннями замовника."
          ]
        },
        {
          "id": "next",
          "title": "Що можна розвивати далі",
          "paragraphs": [
            "На основі такого рішення можна розглядати персональну історію харчування, додаткові рекомендації або розширений кабінет адміністратора. Це можливі наступні етапи, а не перелік функцій, які я вважаю вже реалізованими.",
            "Для нового проєкту я починаю з конкретної задачі: кому потрібен результат, які дані мають зберігатися та які інтеграції справді необхідні. Після цього можна визначити обсяг першого етапу й критерії його готовності."
          ]
        }
      ]
    },
    "en": {
      "title": "NFC Food AI: connecting a website, AI and customer history",
      "description": "A client project breakdown: food photos, approximate nutrition estimates, Telegram, SendPulse and Google Sheets in one workflow.",
      "category": "AI & automation",
      "intro": "NFC Food AI is a web service where users upload a food photo and receive an approximate estimate of its composition and nutritional value. This article explains the parts I delivered and how they fit together.",
      "sections": [
        {
          "id": "task",
          "title": "The goal: make food analysis simple",
          "paragraphs": [
            "The main idea is a short path from photo to result. Users need a clear web interface to upload a photo, submit it for analysis and view the response.",
            "The system also connects a web service, AI, Telegram and SendPulse integrations, and Google Sheets for user interaction and analysis history. This is a real client project where I worked on both the interface and data exchange between services."
          ]
        },
        {
          "id": "flow",
          "title": "The user journey: photo → analysis → history",
          "paragraphs": [
            "The web interface supports uploading photos and displaying analysis results. The system sends a request to the backend, processes it and returns information for the user to view.",
            "The nutrition figures cover calories, protein, fat and carbohydrates. Estimates from photos in this project are approximate. They should not be presented as laboratory measurements or a guarantee of identifying every ingredient.",
            "Analysis history brings results into the customer workflow. Google Sheets is used for the history, customer list and individual customer records."
          ]
        },
        {
          "id": "integrations",
          "title": "Why Telegram, SendPulse and Google Sheets?",
          "paragraphs": [
            "Telegram and SendPulse integrations support working with users and their results. Google Sheets holds customer data and analysis history. The backend API handles data exchange between the parts of the solution.",
            "The value of integrations lies in the complete workflow. Connections between services need checks to confirm that information is passed correctly and reaches the intended destination. A working interface alone does not prove that the entire journey works."
          ]
        },
        {
          "id": "admin",
          "title": "An admin builder for interface updates",
          "paragraphs": [
            "Another delivered component is an admin builder for editing text, images, colours and appearance settings.",
            "It gives the client control over the interface through the available settings. Its scope depends on the builder's features: it does not replace development of new workflows or integrations."
          ]
        },
        {
          "id": "delivery",
          "title": "What I delivered",
          "paragraphs": [
            "My work covered the web interface, admin builder, Telegram and SendPulse integrations, customer data and history in Google Sheets, the backend API, and deployment through GitHub and Railway.",
            "A case study should show the connected workflow as well as the app screen. NFC Food AI demonstrates experience building a solution with several services and improving it in response to client requests."
          ]
        },
        {
          "id": "next",
          "title": "Possible next steps",
          "paragraphs": [
            "Possible extensions include personal nutrition history, additional recommendations or a larger admin area. These are potential future stages, not features I claim are already delivered.",
            "For a new project, I start with the specific need: who uses the result, which data should be stored and which integrations are necessary. We can then define the first stage and its acceptance criteria."
          ]
        }
      ]
    },
    "pl": {
      "title": "NFC Food AI: strona, AI i historia klientów w jednym procesie",
      "description": "Omówienie projektu klienta: zdjęcia potraw, orientacyjne wartości odżywcze, Telegram, SendPulse i Google Sheets w jednym procesie.",
      "category": "AI i automatyzacja",
      "intro": "NFC Food AI to aplikacja internetowa, w której użytkownik przesyła zdjęcie potrawy i otrzymuje orientacyjną ocenę jej składu oraz wartości odżywczej. W tym artykule przedstawiam zrealizowane elementy i ich wzajemne powiązania.",
      "sections": [
        {
          "id": "task",
          "title": "Cel: uprościć analizę potraw",
          "paragraphs": [
            "Główna idea to krótka droga od zdjęcia do wyniku. Użytkownik potrzebuje czytelnego interfejsu, aby przesłać zdjęcie, uruchomić analizę i zobaczyć wynik.",
            "System łączy aplikację internetową, AI, integracje Telegram i SendPulse oraz Google Sheets do pracy z użytkownikami i ich historią. To rzeczywisty projekt klienta, w którym pracowałem zarówno nad interfejsem, jak i wymianą danych między usługami."
          ]
        },
        {
          "id": "flow",
          "title": "Droga użytkownika: zdjęcie → analiza → historia",
          "paragraphs": [
            "Interfejs umożliwia przesyłanie zdjęć i wyświetlanie wyników analizy. System wysyła zapytanie do backendu, przetwarza je i zwraca dane do wyświetlenia użytkownikowi.",
            "Dane żywieniowe obejmują kalorie, białko, tłuszcze i węglowodany. Ocena na podstawie zdjęcia w tym projekcie jest orientacyjna. Nie należy przedstawiać jej jako pomiaru laboratoryjnego ani gwarancji identyfikacji wszystkich składników.",
            "Historia analiz łączy wyniki z pracą z klientem. Google Sheets jest wykorzystywane do historii, listy klientów i kart poszczególnych klientów."
          ]
        },
        {
          "id": "integrations",
          "title": "Po co Telegram, SendPulse i Google Sheets?",
          "paragraphs": [
            "Integracje Telegram i SendPulse służą do pracy z użytkownikami i ich wynikami. Google Sheets przechowuje dane klientów oraz historię analiz. Backend API obsługuje wymianę danych między częściami rozwiązania.",
            "Wartość integracji wynika ze wspólnego procesu. Połączenia między usługami wymagają sprawdzenia, czy informacje są prawidłowo przekazywane i trafiają we właściwe miejsce. Sam działający interfejs nie potwierdza działania całej ścieżki."
          ]
        },
        {
          "id": "admin",
          "title": "Panel edycji interfejsu",
          "paragraphs": [
            "Kolejnym zrealizowanym elementem jest panel umożliwiający edycję tekstów, zdjęć, kolorów i ustawień wyglądu.",
            "Daje on klientowi kontrolę nad interfejsem poprzez dostępne ustawienia. Zakres edycji zależy od funkcji panelu: nie zastępuje on tworzenia nowych scenariuszy lub integracji."
          ]
        },
        {
          "id": "delivery",
          "title": "Co zrealizowałem",
          "paragraphs": [
            "Moja praca obejmowała interfejs, panel edycji, integracje Telegram i SendPulse, dane klientów i historię w Google Sheets, backend API oraz wdrożenie przez GitHub i Railway.",
            "Opis projektu powinien pokazywać powiązany proces, a nie tylko ekran aplikacji. NFC Food AI pokazuje doświadczenie w budowie rozwiązania łączącego kilka usług oraz jego ulepszaniu zgodnie z uwagami klienta."
          ]
        },
        {
          "id": "next",
          "title": "Możliwe kolejne etapy",
          "paragraphs": [
            "Można rozważyć osobistą historię żywienia, dodatkowe rekomendacje lub rozbudowany panel administratora. Są to możliwości rozwoju, a nie funkcje, które uznaję za już zrealizowane.",
            "Nowy projekt zaczynam od konkretnej potrzeby: kto korzysta z wyniku, jakie dane należy przechowywać i jakie integracje są potrzebne. Następnie ustalamy pierwszy etap i kryteria jego odbioru."
          ]
        }
      ]
    }
  }
];

export function readingMinutes(post,language) {
  const content = post[language];
  const words = [content.intro,...content.sections.flatMap(section => [section.title,...section.paragraphs])].join(" ").trim().split(/\s+/).length;
  return Math.max(1,Math.ceil(words/200));
}
export function postTranslationKeys(post) {
  const prefix = "blog_" + post.slug.replaceAll("-","_") + "_";
  return Object.fromEntries(["title","description","category","date","reading"].map(key=>[key,prefix+key]));
}
export function postUi(post,language,ui) {
  const keys = postTranslationKeys(post);
  const values = {...post[language],date:new Intl.DateTimeFormat({ua:"uk-UA",en:"en-GB",pl:"pl-PL"}[language],{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(post.date+"T12:00:00Z")),reading:readingMinutes(post,language)+" "+ui.blogMinutes};
  return Object.fromEntries(Object.entries(keys).map(([key,label])=>[label,values[key]]));
}

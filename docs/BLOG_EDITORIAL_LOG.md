# Редакційний журнал

## 23.11.2026 — помилка 429 у n8n: обмеження запитів до API

Намір: інформаційна діагностика для власника n8n-workflow, який отримує HTTP 429 від зовнішнього API й хоче зменшити частоту запитів без нескінченних повторів та дублів. Slug: `n8n-api-rate-limit-429`. Планований URL: https://dm-studio-production.up.railway.app/blog/n8n-api-rate-limit-429/ та мовні версії `/en/blog/n8n-api-rate-limit-429/`, `/pl/blog/n8n-api-rate-limit-429/`. Дата статті: 23.11.2026. Повні UA/EN/PL. Комерційний власник — `/services/business-automation/`; внутрішній перехід на попередню статтю про 404 вебхука. Тема не дублює статті про 404 webhook, 2xx без рядка, облік заявок у Sheets або форму → Telegram.

Тема перевірена вебпошуком 23.11.2026. Офіційний матеріал n8n від 18.09.2026 пояснює API rate limiting, 429, Retry-After, batching і pacing: https://blog.n8n.io/api-rate-limiting/ . Поточна документація n8n окремо описує Retry On Fail, межі п’яти спроб / 5000 мс, Loop Over Items + Wait і Batching: https://docs.n8n.io/integrations/builtin/handle-rate-limits/ . Довідка HTTP Request описує 429 і доступні Batching / Retry On Fail: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/common-issues/ . MDN підтверджує семантику Retry-After та два формати значення (секунди або HTTP-date): https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After .

Комерційний контекст перевірено 23.11.2026: https://maximorum.com/uk/services/business-automation (сторінка автоматизації n8n та API/webhook інтеграцій), https://devicoo.com/n8n-automation (опис логування й сповіщень про помилки), https://kalyna.pro/automation-n8n/ (опис retry-логіки та error handling). Це самоописи постачальників і якісні приклади пропозицій, не доказ їхніх результатів або обсягу ринку. Пошук не дає підстав заявляти частотність, позиції чи кількість запитів; їх не вигадували. Новий матеріал відповідає вузькому інформаційному питанню 429, а не створює ще одну комерційну сторінку n8n.

Умовний приклад 60 запитів/хв і 120 items явно позначено як ілюстрацію, а не конфігурацію реального клієнта. Ніякий досвід впровадження n8n чи виконаний кейс DM Studio не приписується. Тестові зовнішні API-виклики не запускалися; жодних повідомлень, форм або реальних заявок не надсилали.

Публікація, commit та перевірки будуть доповнені після CI на окремій гілці й оновлення main. HTTP read-back сайту перед змінами недоступний: середовище не розв’язує Railway-домен; попередній commit main має Railway status success. Це не підтвердження поточного HTML або індексації.

## 19.11.2026 — зображення в Elementor: розмір, формат і мобільне кадрування

Намір: інформаційний запит власника готового WordPress/Elementor-сайту, у якого фото розмите, завелике або обрізається на телефоні. Slug: `elementor-image-sizing`; запланований live URL: https://dm-studio-production.up.railway.app/blog/elementor-image-sizing/ та мовні версії `/en/blog/elementor-image-sizing/`, `/pl/blog/elementor-image-sizing/`. Дата статті: 19.11.2026. Повні тексти UA/EN/PL; новий URL не конкурує з посадковою правок WordPress. Комерційний CTA веде на `/services/wordpress-elementor/`, без заяв про повний performance-аудит чи гарантії PageSpeed.

Тема перевірена вебпошуком 19.11.2026. Публічні приклади задач: https://freelancehunt.com/ua/project/optimizatsiya-wordpress-saytu-produktivnist-mobilnoyi-versiyi/1635213.html (15.06.2026 у результаті пошуку), https://freelancehunt.com/ua/project/trebuetsya-optimizatsiya-shvidkosti-zavantazhennya-saytu-na/1630076.html та https://freelancehunt.com/ua/project/zmenshiti-vagu-zobrazhen-bez-vtrati-yakosti/1566735.html. Конкурентний приклад широкої пропозиції: https://id13.dev/wordpress-optymizaciya. Це лише приклади формулювання проблем/пропозицій, не вимір частотності чи поточного обсягу попиту.

Технічні джерела, перевірені 19.11.2026:
- https://developer.wordpress.org/apis/responsive-images/ — `srcset`, `sizes` і автоматичні розміри WordPress.
- https://make.wordpress.org/core/2021/06/07/wordpress-5-8-adds-webp-support/ — WebP у WordPress 5.8.
- https://make.wordpress.org/core/2024/02/23/wordpress-6-5-adds-avif-support/ — AVIF у WordPress 6.5 за підтримки хостингу.
- https://elementor.com/help/image-loading-optimization/ — Optimized Image Loading, пріоритет важливого зображення й lazy loading.
- https://web.dev/articles/optimize-lcp та https://web.dev/learn/design/responsive-images — не lazy-load LCP-зображення; обережно використовувати fetch priority.
- https://web.dev/articles/optimize-cls — width/height або зарезервований aspect ratio зменшує несподіваний зсув макета.

Власний приклад або клієнтський кейс не заявляється. Стаття пояснює загальні механізми WordPress/Elementor та навчальні перевірки; вона не стверджує, що DM Studio вже виконувала оптимізацію медіатеки чи досягла конкретних показників. Коміт реалізації: `868854a88d251b8e2dcd843d33ae1e1c4ca2c94f` — https://github.com/denis221-afk/dm-studio/commit/868854a88d251b8e2dcd843d33ae1e1c4ca2c94f. Перевірки на цьому коміті: GitHub Actions run https://github.com/denis221-afk/dm-studio/actions/runs/44472062004 — `npm ci` success, `npm run check` success, `npm run build` success, `node scripts/check-seo.mjs` success (66 сторінок, canonical/hreflang/sitemap/JSON-LD/404), `node --test server/*.test.mjs` success (11/11). Перший branch-run з помилкою регулярного виразу виправлено до цього успішного коміту; помилковий варіант не потрапив у main. `npm ci` показав одну high-severity dependency audit warning; залежності не змінювалися, щоб не розширювати SEO-завдання. Live URL до змін не вдалося прочитати через недоступність Railway-домену з web/container egress; після merge потрібна окрема перевірка Railway status і live read-back. Main merge commit: `20fee5f0f6be9731b2fa17bd453240d56a25b222` — https://github.com/denis221-afk/dm-studio/commit/20fee5f0f6be9731b2fa17bd453240d56a25b222. Railway commit status `supportive-consideration - dm-studio` для цього commit перевірено 19.11.2026: `success`. Перевірка живої HTML-відповіді за всіма трьома URL не вдалася: web gateway повідомляє, що Railway-домен недоступний, а container egress не розв’язує домен. Тому статус Railway підтверджує завершення deploy-процесу, але незалежний read-back title/H1/HTML не підтверджений у цьому запуску. GitHub Pages workflow також success, але це окремий деплой і не використовується як доказ Railway. Не робити висновок про індексацію.


## 16.11.2026 — межі правки шаблону Elementor

Намір K4: відрізнити локальну правку від спільного шаблону й задати критерії приймання. Доповнення UA/EN/PL, навчальний приклад. Джерело: https://elementor.com/help/conditions/ (16.11). URL: https://dm-studio-production.up.railway.app/blog/wordpress-change-brief/#elementor-template-scope. Коміт в історії запису. Перевірки: build/check/SEO/локальні серверні тести й HTML трьох мов; Railway та живі URL після коміту.

## 12.11.2026 — n8n повертає 2xx, але рядка немає

Доповнення до наявного матеріалу A3, без дублювання URL. UA/EN/PL: пошук виконання за ID, три причини відсутності рядка, умовний приклад часткового збою та межі Error Trigger. Джерела: https://docs.n8n.io/flow-logic/error-handling/ і https://docs.n8n.io/workflows/executions/all-executions/ (12.11). URL: https://dm-studio-production.up.railway.app/blog/n8n-webhook-404/#accepted-but-missing. Коміт в історії запису. Перевірки: build, check, SEO, серверні тести, HTML трьох мов; після оновлення main — статус Railway та живі URL. Власне впровадження n8n не заявлено, реальні заявки не надсилалися.

## 09.11.2026 — вебхук n8n повертає 404 після тесту

Намір A3: діагностика маршруту, публікації та методу HTTP. Окрема тема від матеріалів про доставку в Telegram та облік у Sheets. UA/EN/PL, нейтральна SVG-схема, умовний приклад конфігурації. Офіційне джерело перевірено 09.11: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/. Стаття не заявляє клієнтського впровадження чи тесту на робочому n8n. URL: https://dm-studio-production.up.railway.app/blog/n8n-webhook-404/ та відповідні /en/ і /pl/. Коміт — в історії цього запису. Перед комітом: build, check, SEO, локальні серверні тести та перевірка HTML усіх мов. Після коміту: окреме підтвердження Railway і живих URL. GA4/GSC не запитувалися; заявок не надсилали.

## 05.11.2026 — горизонтальне прокручування на мобільному

Доповнено WordPress-статтю UA/EN/PL: діагностика переповнення сторінки й критерії приймання. Це інформаційне доповнення до наявної теми адаптивності, без нового URL. Приклад навчальний. Джерело: https://www.w3.org/WAI/WCAG21/Understanding/reflow (перевірено 05.11). URL: https://dm-studio-production.up.railway.app/blog/wordpress-change-brief/#mobile-horizontal-scroll. Коміт у git history. Перевірки перед публікацією: build/check/SEO/серверні тести; після — Railway та HTML трьох мов.

## 02.11.2026 — облік заявок у Google Sheets

Доповнення /blog/website-form-telegram-delivery/#sheets-lead-ledger замість дублюючої статті. Намір A2 з актуальної карти: структура обліку, відповідальний і наступна дія. Перечитано main 86295e4aeab99ae6c4016dd0cc87f19660eea601, blog.js, статтю, карту та журнал. Повні UA/EN/PL; навчальний приклад відокремлено від власної форми, інтеграцію Sheets у DM Studio не заявлено. Джерело перевірено вебпошуком та відкрито 02.11: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append. Рекомендації обліку — редакційний приклад, не гарантія exactly-once. Початкова дата 27.10 збережена, dateModified=02.11.2026. Живий URL: https://dm-studio-production.up.railway.app/blog/website-form-telegram-delivery/ та /en/, /pl/. Коміт — у git history цього запису. Build/check/SEO та серверні тести виконуються перед комітом, Railway і живий текст перевіряються після; до read-back публікацію не вважати підтвердженою. GA4/GSC не запитувалися, форма не надсилалася.

## 29.10.2026 — доповнення WordPress-статті

Намір: допомогти описати й прийняти виправлення мобільного меню Elementor. Через значний перетин з існуючим brief доповнено /blog/wordpress-change-brief/ замість нового URL. Повні UA/EN/PL: відтворення, визначення компонента, breakpoint, довгі назви, keyboard/focus і межі діагностики. Навчальний приклад позначений; новий досвід або метрики не заявляються. Джерела перевірено вебпошуком 29.10: https://elementor.com/help/nav-menu-widget-pro/, https://elementor.com/help/the-menu-widget/, https://elementor.com/help/troubleshooting-issues-with-mobiles/. Посилання responsive-editing у статті збережене. Первинна дата 25.10 збережена, schema dateModified=29.10. Коміт у git history. Перевірки: build/check/SEO60/11 тестів; Railway й live після коміту. GA4/GSC не запитувалися. Учорашній коміт документації мав Railway failure; причина без логів не встановлена, чинний сайт доступний. Новий контент не вважати живим до read-back.

## 27.10.2026 — етап 13, публікація

«Форма сайту → Telegram: як перевіряти відправлення і не створювати дублікати». Намір: зрозуміти підтвердження API-відправлення та невизначені результати. Власна форма DM Studio; повні UA/EN/PL, нейтральна SVG, дата 27.10.2026. Джерела: src/js/brief-delivery.js, server/index.mjs, локальні тести, https://core.telegram.org/bots/api#sendmessage (повторно відкрито 27.10). URL: https://dm-studio-production.up.railway.app/blog/website-form-telegram-delivery/ та /en/, /pl/. Коміт — у git history. Build/check/SEO60 та 11 тестів успішні; responsive перевірено за HTML/CSS без фізичного телефону. Підтвердження живого тексту й Railway відбувається після коміту; до нього публікація не підтверджена. Наступне — етап 14, без нової статті до завершення плану.

## 26.10.2026 — підготовка, етап 12

Тема: «Форма сайту → Telegram: як перевіряти відправлення і не створювати дублікати». Намір — пояснити підтвердження доставки й межі рішення на власному коді DM Studio; не дублює WP-brief або NFC-кейс. Чернетка docs/FORM_TELEGRAM_ARTICLE_DRAFT.md містить кодові джерела й офіційний Telegram Bot API, перевірений 26.10.2026. Статус: український текст готовий, не опублікований; URL ще немає. Коміт — у git history. EN/PL, обкладинка та інтеграція блогу залишені етапу 13. Метрики не вигадувалися; живих повідомлень не надсилали.

## 25.10.2026 — публікація, етап 11

Тема й намір збережені з чернетки: підготувати список правок WordPress, а не дублювати комерційну посадкову. Повні UA/EN/PL тексти, нейтральна авторська SVG-обкладинка, посилання на послугу й RHome Ohio, офіційні джерела WordPress/Elementor. Джерела повторно відкрито 25.10.2026. URL: https://dm-studio-production.up.railway.app/blog/wordpress-change-brief/ та відповідні /en/, /pl/. Дата 25.10.2026; коміт — у git history цього запису. Збірка, check, SEO57 і 11 тестів успішні. Підтвердження Railway та живого тексту — після оновлення main; до нього публікацію не вважати підтвердженою. GA4/GSC не запитувалися. Наступний матеріал — окрема підготовка власної форми → Telegram.

## 24.10.2026 — підготовка, етап 10

Тема: «Доопрацювання WordPress-сайту: як підготувати список правок і оцінити обсяг». Інформаційний намір: підготувати завдання виконавцю. Наявний блог містить NFC Food AI; тема не дублюється. Чернетка: docs/WORDPRESS_ARTICLE_DRAFT.md. Джерела та метадані наведено в чернетці; технічні джерела перевірено вебпошуком 24.10.2026. Частотність і метрики не отримувалися.

Статус: підготовлено український текст; публікація й EN/PL переклади — етап 11. Живого URL поки немає. Коміт — у git history цього запису. Перевірки репозиторію записуються в SEO_PROGRESS_2026-10.md. Не додавати чернетку в sitemap до публікації.

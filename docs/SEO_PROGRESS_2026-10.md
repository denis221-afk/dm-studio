# SEO-прогрес DM Studio — жовтень 2026

## Поточний стан
- Остання робота: 2026-10-15, етап 1.
- Наступний етап: 2 — GA4, органічні переходи, contact_click, generate_lead та згода на аналітику.
- Етап 1: доступні перевірки виконано; точна індексація/виключення залишаються неперевіреними через обмеження конектора. Не повторювати весь аудит замість етапу 2.
- Етапи 2–14: ще не виконано.
- Сайт: https://dm-studio-production.up.railway.app/
- Репозиторій: https://github.com/denis221-afk/dm-studio
- Перевірений вихідний main: 582bfedba4ee09f5dc2e4e8986815808fdfa8f83.
- Супровідні фактичні дані: docs/seo-baseline-2026-10-15.json.

## 2026-10-15 — Етап 1: Search Console і технічна доступність

### Доступ і показники
Windsor.ai get_connectors підтвердив Search Console property https://dm-studio-production.up.railway.app/ і GA4 DM Studio 558903268. GA4-метрики сьогодні не запитувалися: це наступний етап.

Після get_fields/get_options виконано два запити Search Analytics за 2026-09-17 — 2026-10-14:
1. date, clicks, impressions, ctr, position;
2. page, clicks, impressions, position.
Обидва повернули result: []. Тому clicks/impressions/CTR/position = невідомо, НЕ 0. Показники ще можуть накопичуватися/оброблятися; конкретну причину порожньої відповіді конектор не повідомив. Висновків про ефективність немає.

Окремий запит таблиці Sitemaps:
- path: https://dm-studio-production.up.railway.app/sitemap.xml
- last_submitted: 2026-10-14T12:58:05.625Z
- last_downloaded: 2026-10-14T12:58:11.080Z
- errors: 0
- warnings: 0
- submitted: 108 (сире значення Windsor, не число проіндексованих сторінок).

Завантажений живий sitemap містить 54 унікальні loc. Причина розбіжності з submitted=108 у агрегованій відповіді конектора не підтверджена; не використовувати 108 як кількість сторінок або індексації. Схема конектора пропонує deprecated indexed, але немає актуального URL Inspection / звіту Page Indexing із причинами виключення. Застарілий indexed не використовувався. Sitemap завантажено Google, але це не означає, що всі його URL проіндексовано.

### Живі HTTP-перевірки
- Головна: 200, text/html, cache-control no-cache.
- /sitemap.xml: 200, application/xml; 54 унікальні URL.
- Усі 54 sitemap URL: HTTP 200, рівно один self-canonical, відсутній noindex у meta robots, присутні uk/en/pl/x-default alternate.
- Мови: по 18 URL uk, en, pl.
- /robots.txt: 200, Allow /; Disallow /api/ і /health; точне посилання на sitemap.
- /services/wordpress-elementor/: 200, text/html.
- Випадковий неіснуючий шлях /seo-audit-not-found-20261015/: справжній HTTP 404, X-Robots-Tag: noindex, follow.
- Підтверджених блокувальних технічних SEO-проблем у цих перевірках не знайдено. Це не повний зовнішній аудит і не підтвердження індексації.

### Перевірки актуального коду
Виконано на чистому checkout вказаного main:
- npm ci --ignore-scripts --no-audit --no-fund;
- npm run build — пройшло;
- npm run check — пройшло;
- node scripts/check-seo.mjs — пройшло: 54 сторінки, metadata, canonical, reciprocal hreflang, schema, sitemap, redirects і 404;
- node --test server/*.test.mjs — 7/7.

Позитивних заявок через production-форму не надсилалося; інтеграційний тест Telegram використовує локальну заглушку.

### Зміни й межі
Створено тільки журнал і фактичний baseline у docs. Контент, дизайн, motion, код форми та налаштування аналітики не змінювалися. Дані з приватних акаунтів збережені лише як дозволений агрегований SEO-baseline без відвідувачів/персональних даних. Після коміту перевірити Railway status та live URL; точний коміт цього журналу доступний у його git history.

### Наступні дії
Продовжити етап 2, перевірити доступні GA4 дані та consent/lead events. Індексацію перевірити повторно лише коли доступні відповідні дані; відсутність звіту не блокує дослідження запитів і наступні корисні етапи.

## Узгоджена послідовність
1. Search Console / baseline — виконано доступну частину 2026-10-15, індексація невідома.
2. GA4 та заявки.
3. Комерційні українські запити WordPress/Elementor.
4. Запити Telegram-ботів та автоматизації.
5. Конкуренти й прогалини.
6. Сторінка WordPress/Elementor.
7. Кейс RHome Ohio.
8. Сторінка Telegram-ботів.
9. Кейс NFC Food AI та внутрішні посилання.
10. Підготовка WordPress-статті.
11. Публікація WordPress-статті.
12. Підготовка статті форма → Telegram.
13. Публікація другої статті, адаптивність і CTA.
14. Порівняння із baseline і наступні пріоритети.

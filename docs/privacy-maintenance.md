# Privacy page maintenance

Localized content is in src/data/privacy.js. The build generates /privacy/, /en/privacy/ and /pl/privacy/ through scripts/render-privacy.mjs. Form and footer links are localized and the pages are included in sitemap.xml.

The notice describes the present implementation: enquiries sent to the operator's Telegram chat through Railway, no enquiry database, no application logging of briefs, an in-memory IP rate limiter and no analytics code. It also explains the copy-only GitHub Pages version.

Update this content when adding analytics, cookies, a CRM, different providers or retention automation. No automatic enquiry deletion job exists: requests to access, correct or delete data require the operator to handle the relevant Telegram messages. Do not treat the page as an implementation of automated deletion or as a legal compliance certification.

Mobile QA covered 192 route/viewport combinations. See docs/mobile-audit-2026-10-09.md for scope, fixes and browser-emulation limits.

# Production QA — 2026-10-09

Target: https://dm-studio-production.up.railway.app/

## Verified

- 21 HTML routes: home, cases list, both client cases, about, blog list and article in Ukrainian, English and Polish. HTTP 200, one H1, unique IDs, correct canonical, description and local anchor targets.
- 33 resource/linked-route checks passed. Unknown URL returns HTTP 404. robots.txt references the Railway sitemap. Homepage hreflang and Open Graph URLs use the Railway domain.
- All five service filters, all four service arrows, all four solution filters, opening a solution dialog, Escape dismissal and focus return.
- Sticky navigation and active Contact section after smooth scrolling settles.
- UA/EN/PL service details and form labels; switching language preserves the article route; article table of contents resolves all six targets.
- Live browser form: invalid contact blocked, valid test enquiry confirmed by Telegram, success announced in role=status, form reset and submit enabled again.
- Loaded homepage/article images have natural dimensions. No website JavaScript warnings/errors seen; one browser-extension error excluded.
- Read-only computed contrast sample of visible Polish homepage headings, paragraphs, buttons, links and labels found no failures against applicable 3:1 / 4.5:1 thresholds. This is a sample, not WCAG certification.
- Existing source checks and backend validation tests pass. Combined server fixture checks cover homepage delivery, health endpoint, source-file isolation and invalid form rejection.

## Fixed

The sticky header background used 100vw, including scrollbar width. This added approximately eight pixels of horizontal overflow on a desktop article. Navigation now publishes the actual document client width to CSS, and the background uses that width.

## Limits

Responsive breakpoints were reviewed in source. This browser session provides a fixed desktop viewport; mobile-device rendering, touch interaction, reduced-motion emulation and no-JavaScript rendering are not claimed as tested. No load test or exhaustive security assessment was performed. Timing through this environment's network proxy is not a reliable customer performance measurement.

## Additional runtime finding

The prerenderer matched the href substring inside data-locale-href when that data attribute preceded href. Runtime translation then doubled the locale prefix on case breadcrumbs, contact CTAs and next-case links. The render-html matcher now targets only the real href attribute. Regression checks cover both attribute orders in all three languages. Case filters were verified: Websites shows both projects (both include website work), AI shows NFC Food AI, All shows both.

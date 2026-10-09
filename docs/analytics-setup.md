# Google Analytics 4

Production domain stays https://dm-studio-production.up.railway.app/.

1. Create a GA4 property and a Web data stream for this domain. Copy its Measurement ID (G-…).
2. Set Railway service variable `VITE_GA_MEASUREMENT_ID` to that ID and rebuild/redeploy. Vite reads it during build. It is public, not a password. No Analytics tag or consent panel appears without a valid ID.
3. In the stream settings turn OFF Enhanced measurement. This implementation sends its own sanitized page views, form events and scroll milestones. Automatic form tracking must not count failed submissions. Disable Google Signals, advertising personalization and user-provided data collection. Set event data retention to 2 months.
4. Mark `generate_lead` as a key event. It fires only after `/api/brief` confirms delivery, never on a click or clipboard copy.
5. Custom event-scoped dimensions: `page_language`, `contact_channel`, `filter_type`, `filter_value`, `content_path`, `destination`, `service`, `solution`, `selected_language`. Optional numeric custom metric: `percent_scrolled`.
6. Accept analytics on the production site, then check Realtime. Verify a real successful enquiry separately. Decline/revoke and confirm no new Google tag requests. Ad blockers and denied consent naturally reduce measured traffic.

Events: page_view, generate_lead, form_start, contact_click, filter_select, service_open, solution_open, content_click, navigation_click, language_change, scroll_depth.

No form name/contact/task/budget/deadline is sent. URL query strings and referrer queries are removed from manually sent page views. This also means UTM campaigns are not currently attributed; add vetted campaign support separately if needed. Choices persist locally for 180 days. Google tag loads only after consent, advertising consent stays denied. Revoke disables collection, removes accessible _ga cookies and reloads the page.

Google docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events and https://developers.google.com/tag-platform/security/guides/consent.

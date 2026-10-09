# Mobile browser QA — 2026-10-09

Tested the current production build in Chromium mobile/touch emulation. Browser requests were served from the built dist/ files under the production origin; the submit API was mocked for the browser interaction test, so no extra Telegram messages were sent.

- 120 route/viewport checks: all 24 localized routes at 320, 360, 390, 430 and 768 pixels.
- No document horizontal overflow, missing H1, broken loaded image or JavaScript page error in that matrix.
- Menu opens and closes after choosing a section.
- Selected service details and the solution dialog work on a narrow viewport.
- Invalid contact blocks submission; a successful mocked response announces success and resets the form.
- Screenshots of the 390-pixel homepage and privacy page visually reviewed.

These are emulated browser checks, not physical iOS Safari or Android-device tests. Existing live Telegram delivery was verified separately before this change.

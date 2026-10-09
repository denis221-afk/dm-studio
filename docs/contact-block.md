# Contact block

The homepage contact section is localized into Ukrainian, English and Polish.

## Public contact details

Set `telegram`, `email` and `instagram` in `src/data/contacts.js`. Telegram and Instagram values must be full HTTPS profile URLs. The email value is a plain address. Empty or invalid channels are hidden; a brief preparation card remains available.

## Form behaviour

The form assembles a plain-text brief and copies it to the clipboard. It does not send a request to a server or store form data. If clipboard access fails, a read-only textarea exposes the selected brief for manual copying. A real submission endpoint must be implemented separately before changing the button to a send action.

## Files

- `index.html`: semantic markup, native radio inputs and FAQ details.
- `src/styles/contact.css`: scoped responsive styles.
- `src/js/brief.js`: validation, brief composition and clipboard fallback.
- `src/i18n/contact.js`: user-facing translations.

Run `npm run check` and `npm run build` before publishing.

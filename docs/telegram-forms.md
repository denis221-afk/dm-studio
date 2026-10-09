# Telegram enquiries

The website remains on GitHub Pages. Deploy `server/` as a separate Railway service from this repository. No npm dependencies or frontend build are required for the server.

## Activation

1. Create a dedicated bot with https://t.me/BotFather using `/newbot`. Store its token only in Railway variables. Never commit it or put it in `VITE_*` variables.
2. Open your new bot in Telegram and press Start. Obtain your numeric Telegram user/chat ID. For a private chat, `@MazurykD` cannot replace the numeric chat ID. The bot must be able to message that chat.
3. In Railway create a service from `denis221-afk/dm-studio`. Set Root Directory to `/server`, Start Command to `npm start`, and Healthcheck Path to `/health`. Generate a public HTTPS domain.
4. Set variables:
   - `TELEGRAM_BOT_TOKEN`: your dedicated bot token.
   - `TELEGRAM_CHAT_ID`: your numeric private chat ID.
   - `ALLOWED_ORIGIN`: `https://denis221-afk.github.io` (no trailing slash or path).
   Railway supplies `PORT` automatically. Deploy the variable changes.
5. Set `briefEndpoint` in `src/data/forms.js` to `https://YOUR-SERVICE.up.railway.app/api/brief` and publish the site.
6. Submit a test enquiry in each language. Confirm the actual Telegram message and on-page success. Test failure with the backend unavailable: the fields and copyable brief must remain available.

Until an endpoint is configured, the existing copy-brief behaviour is preserved. This avoids advertising delivery before the server is working.

## Behaviour and limits

- Success is returned only after Telegram confirms `sendMessage`.
- Server validates lengths, required fields, service, email or Telegram username.
- Fixed origin, JSON requests, 12 KB body limit and five attempts per ten minutes per IP.
- Rate limiting is in memory per server instance; it resets on restart. For significant traffic add persistent rate limiting and bot protection.
- No customer data or bot token is logged. Messages are stored in the recipient's Telegram chat; the server has no database.
- A timeout after Telegram accepts a message can leave delivery uncertain. There are no automatic retries to avoid duplicate messages.
- Update the allowed origin if the website moves to a custom domain. Keep one instance until adding shared rate limiting.

References: https://core.telegram.org/bots/api#sendmessage and https://docs.railway.com/variables

## Combined Railway deployment

The root railway.json now builds the complete website and runs npm start, serving dist/ and /api/brief from one process. For this mode leave Railway Root Directory empty (repository root). Remove a manually overridden static start command if set. The public domain is dm-studio-production.up.railway.app. ALLOWED_ORIGIN defaults to this Railway origin. The frontend enables automatic delivery only on this domain; the GitHub Pages deployment retains copy-brief mode. Configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in this service, then redeploy. Test actual delivery after deployment.

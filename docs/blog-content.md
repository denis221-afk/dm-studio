# Blog authoring

Add articles to `src/data/blog.js`. Every post needs a unique lowercase slug, a real publication date, cover image, related case slug and Ukrainian, English and Polish content. Each localized entry has a title, description, category, intro and sections. Section IDs must be unique within the article.

`src/i18n/blog.js` holds shared labels. `scripts/blog-template.mjs` renders the homepage preview, index and article. `scripts/render-blog.mjs` generates localized routes with canonical URLs, hreflang, breadcrumbs and BlogPosting schema. Articles are rendered into static HTML, so JavaScript is not required to read them or use the contents links.

The production build refreshes the homepage blog preview from the article data and adds all blog routes to the sitemap. Language changes preserve the current article route.

Run `npm run check` and `npm run build` before publishing. Do not invent outcomes, client quotes, author credentials or publication dates.

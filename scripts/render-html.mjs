import { translations } from "../src/i18n/index.js";

const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export function renderHtml(source, language, siteUrl = "") {
  const t = translations[language];
  const locale = language === "ua" ? "uk" : language;
  // Re-rendering must not inherit canonical/alternate tags from another route.
  source = source.replace(/<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/g, "")
    .replace(/<meta\b[^>]*property="og:url"[^>]*>/g, "");
  let html = source.replace(/<html lang="[^"]*">/, `<html lang="${locale}">`);
  html = html.replace(
    /<([\w-]+)([^>]*\bdata-i18n="([^"]+)"[^>]*)>[\s\S]*?<\/\1\s*>/g,
    (match, tag, attrs, key) => {
      const value = t.ui[key];
      return typeof value === "string"
        ? `<${tag}${attrs}>${escape(value).replaceAll("\n", "<br>")}</${tag}>`
        : match;
    },
  );
  html = html.replace(
    /<([\w-]+)([^>]*\bdata-i18n-attr="([^:"]+):([^"]+)"[^>]*)>/g,
    (match, tag, attrs, attribute, key) => {
      const value = t.ui[key];
      if (typeof value !== "string") return match;
      const pattern = new RegExp(`\\b${attribute}="[^"]*"`);
      return `<${tag}${attrs.replace(pattern, `${attribute}="${escape(value)}"`)}>`;
    },
  );
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escape(t.meta.title)}</title>`,
  );
  const metaValues = {
    description: t.meta.description,
    "og:title": t.meta.title,
    "twitter:title": t.meta.title,
    "og:description": t.meta.description,
    "twitter:description": t.meta.description,
    "og:locale": { ua: "uk_UA", en: "en_US", pl: "pl_PL" }[language],
  };
  html = html.replace(/<meta\b[^>]*name="robots"[^>]*>/g,
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">');
  html = html.replace(/<meta\b[^>]*>/g, (tag) => {
    const key = tag.match(/(?:name|property)="([^"]+)"/)?.[1];
    const value = metaValues[key];
    return value
      ? tag.replace(/content="[^"]*"/, `content="${escape(value)}"`)
      : tag;
  });
  html = html.replace(
    /<option value="(ua|en|pl)"(?: selected)?>/g,
    (_, value) =>
      `<option value="${value}"${value === language ? " selected" : ""}>`,
  );
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DM Studio",
    "@id": siteUrl ? new URL("#organization", siteUrl).href : undefined,
    email: "denis.mazuryk@gmail.com",
    logo: siteUrl ? new URL("favicon.svg", siteUrl).href : undefined,
    sameAs: ["https://github.com/denis221-afk/dm-studio", "https://t.me/MazurykD"],
    description: t.meta.description,
    knowsAbout: [
      "Web development",
      "Telegram bots",
      "Workflow automation",
      "AI assistants",
    ],
  };
  if (siteUrl)
    schema.url = new URL(
      language === "ua" ? "./" : `${language}/`,
      siteUrl,
    ).href;
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`,
  );
  if (siteUrl) {
    const pageUrl = new URL(language === "ua" ? "./" : `${language}/`, siteUrl)
      .href;
    const links = [
      ["uk", "./"],
      ["en", "en/"],
      ["pl", "pl/"],
      ["x-default", "./"],
    ]
      .map(
        ([lang, path]) =>
          `<link rel="alternate" hreflang="${lang}" href="${new URL(path, siteUrl).href}">`,
      )
      .join("\n");
    html = html.replace(
      "</head>",
      `<link rel="canonical" href="${pageUrl}">\n<meta property="og:url" content="${pageUrl}">\n${links}\n</head>`,
    );
    html = html.replaceAll(
      `content="${new URL(siteUrl).pathname}images/og-image.jpg"`,
      `content="${new URL("images/og-image.jpg", siteUrl).href}"`,
    );
  }
  const base = siteUrl ? new URL(siteUrl).pathname : process.env.BASE_PATH || "/";
  html = html.replace(/<a\b[^>]*data-locale-href="([^"]*)"[^>]*>/g, (tag, path) => tag.replace(/(?<![-\w])href="[^"]*"/, 'href="' + base + (language === "ua" ? "" : language + "/") + path + '"'));
  html = html.replace(/<img\b[^>]*src="([^"]*images\/)nfc-real\.webp"[^>]*>/g, (tag, prefix) => {
    if (tag.includes('srcset=')) return tag;
    return tag.replace(`src="${prefix}nfc-real.webp"`, `src="${prefix}nfc-320.webp" srcset="${prefix}nfc-160.webp 160w, ${prefix}nfc-320.webp 320w, ${prefix}nfc-real.webp 459w" sizes="(max-width: 780px) 75vw, 215px"`);
  });
  const serviceLabel = {ua:"Усі послуги", en:"All services", pl:"Wszystkie usługi"}[language];
  html = html.replace(/(<div class="footer-links">)/, `$1<a href="${base}${language === "ua" ? "" : language + "/"}services/" data-locale-href="services/">${serviceLabel}</a>`);
  return html;
}

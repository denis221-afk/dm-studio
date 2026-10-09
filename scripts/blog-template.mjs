
import { blogPosts, readingMinutes, postTranslationKeys } from "../src/data/blog.js";
import blogLocales from "../src/i18n/blog.js";
import { caseVisual } from "./case-templates.mjs";
export const escape = value => String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const text = (key,language) => '<span data-i18n="' + key + '">' + escape(blogLocales[language].ui[key]) + '</span>';
function dateLabel(post,language) {
  return new Intl.DateTimeFormat({ua:"uk-UA",en:"en-GB",pl:"pl-PL"}[language],{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(post.date + "T12:00:00Z"));
}
function metadata(post,language) {
  return '<div class="blog-meta"><span data-i18n="' + postTranslationKeys(post).category + '">' + escape(post[language].category) + '</span><time datetime="' + post.date + '" data-i18n="' + postTranslationKeys(post).date + '">' + escape(dateLabel(post,language)) + '</time><span data-i18n="' + postTranslationKeys(post).reading + '">' + readingMinutes(post,language) + ' ' + escape(blogLocales[language].ui.blogMinutes) + '</span></div>';
}
function cover(base,language) {
  return caseVisual({type:"nfc"},base);
}
export function blogCard(post,base,language) {
  const home = base + (language === "ua" ? "" : language + "/");
  const content = post[language];
  return '<article class="blog-card"><a class="blog-card__link" href="' + home + 'blog/' + post.slug + '/" data-locale-href="blog/' + post.slug + '/"><div class="blog-card__image">' + cover(base,language) + '</div><div class="blog-card__copy">' + metadata(post,language) + '<h3 data-i18n="' + postTranslationKeys(post).title + '">' + escape(content.title) + '</h3><p data-i18n="' + postTranslationKeys(post).description + '">' + escape(content.description) + '</p><span class="blog-read">' + text("blogRead",language) + '<span aria-hidden="true">↗</span></span></div></a></article>';
}
export function blogPreview(base="%BASE_URL%",language="ua") {
  const home = base + (language === "ua" ? "" : language + "/");
  return '<section class="blog-preview container" id="blog" aria-labelledby="blog-preview-title"><header class="blog-section-header"><div><p class="eyebrow">' + text("blogEyebrow",language) + '</p><h2 id="blog-preview-title">' + text("blogTitle",language) + '<br><span>' + text("blogAccent",language) + '</span></h2><p class="blog-intro">' + text("blogIntro",language) + '</p></div><a class="button button--light" href="' + home + 'blog/" data-locale-href="blog/">' + text("blogAll",language) + ' →</a></header><div class="blog-list">' + blogPosts.slice(0,3).map(post=>blogCard(post,base,language)).join("") + '</div></section>';
}
export function blogOverview(base,language) {
  const home = base + (language === "ua" ? "" : language + "/");
  return '<div class="blog-page container" data-blog-page="index"><nav class="case-breadcrumb" aria-label="Breadcrumb"><a href="' + home + '" data-locale-href="">' + (language==="ua"?"Головна":language==="en"?"Home":"Strona główna") + '</a><span aria-hidden="true">/</span><span aria-current="page">' + text("navBlog",language) + '</span></nav><header class="blog-section-header"><div><p class="eyebrow">' + text("blogEyebrow",language) + '</p><h1>' + text("blogTitle",language) + '<br><span>' + text("blogAccent",language) + '</span></h1><p class="blog-intro">' + text("blogIntro",language) + '</p></div></header><div class="blog-list">' + blogPosts.map(post=>blogCard(post,base,language)).join("") + '</div></div>';
}
export function blogArticle(post,base,language) {
  const home = base + (language === "ua" ? "" : language + "/");
  const c = post[language];
  return '<article class="blog-article container" data-blog-page="' + post.slug + '"><nav class="case-breadcrumb" aria-label="Breadcrumb"><a href="' + home + 'blog/" data-locale-href="blog/">' + text("blogBack",language) + '</a><span aria-hidden="true">/</span><span aria-current="page">' + escape(c.category) + '</span></nav><header class="blog-article__header">' + metadata(post,language) + '<h1>' + escape(c.title) + '</h1><p class="blog-article__lead">' + escape(c.intro) + '</p><a class="blog-author" href="' + home + 'about/" data-locale-href="about/"><img src="' + base + 'images/denys.webp" alt="" width="48" height="48"><span><strong>' + text("blogAuthor",language) + '</strong><small>' + text("blogAuthorRole",language) + '</small></span></a></header><figure class="blog-cover">' + cover(base,language) + '<figcaption>' + text("blogCoverCaption",language) + '</figcaption></figure><div class="blog-reading"><nav class="blog-toc" aria-labelledby="blog-toc-title"><h2 id="blog-toc-title">' + text("blogToc",language) + '</h2><ol>' + c.sections.map(section=>'<li><a href="#' + section.id + '">' + escape(section.title) + '</a></li>').join("") + '</ol></nav><div class="blog-prose">' + c.sections.map(section=>'<section aria-labelledby="' + section.id + '"><h2 id="' + section.id + '">' + escape(section.title) + '</h2>' + section.paragraphs.map(p=>'<p>' + escape(p) + '</p>').join("") + '</section>').join("") + '<a class="button button--dark" href="' + home + 'cases/' + post.caseSlug + '/" data-locale-href="cases/' + post.caseSlug + '/">' + text("blogCase",language) + ' ↗</a></div></div><section class="blog-cta" aria-labelledby="blog-cta-title"><div><h2 id="blog-cta-title">' + text("blogCta",language) + '</h2><p>' + text("blogCtaText",language) + '</p></div><a class="button button--lime" href="' + home + '#contact" data-locale-href="#contact">' + text("blogDiscuss",language) + ' ↗</a></section></article>';
}

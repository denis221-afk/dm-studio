
import { mkdir, writeFile } from "node:fs/promises";
import { renderHtml } from "./render-html.mjs";
import { blogOverview, blogArticle, escape } from "./blog-template.mjs";
import { blogPosts } from "../src/data/blog.js";
import { translations } from "../src/i18n/index.js";
export const blogRoutes = ["blog/",...blogPosts.map(post=>"blog/"+post.slug+"/")];

export function renderBlogPage(source,language,slug="",siteUrl="",base="/") {
  const prefix = language === "ua" ? "" : language + "/";
  const home = base + prefix;
  const post = slug ? blogPosts.find(post=>post.slug===slug) : null;
  if (slug && !post) throw new Error("Unknown article: "+slug);
  const path = "blog/" + (post ? post.slug + "/" : "");
  const content = post?.[language];
  let html = source.replace(/<main\b[^>]*>[\s\S]*?<\/main>/,'<main id="main">' + (post ? blogArticle(post,base,language) : blogOverview(base,language)) + '</main>');
  html = html.replace(/<nav\b[^>]*id="navigation"[^>]*>[\s\S]*?<\/nav>/,nav=>{
    let result = nav.replace(/\sclass="is-current"/g,"").replace(/\saria-current="[^"]*"/g,"");
    result = result.replace(/(?<![-\w])href="#([^"]+)"/g,(_,id)=>'href="'+home+(["cases","blog"].includes(id)?id+"/":"#"+id)+'" data-locale-href="'+(["cases","blog"].includes(id)?id+"/":"#"+id)+'"');
    return result.replace(/(<a\b[^>]*data-locale-href="blog\/")/,'$1 class="is-current" aria-current="page"');
  });
  html = html.replace(/(?<![-\w])href="#home"/g,'href="'+home+'#home" data-locale-href="#home"').replace(/(?<![-\w])href="#contact"/g,'href="'+home+'#contact" data-locale-href="#contact"');
  html = html.replace(/<noscript[\s\S]*?<\/noscript>/g,block=>block.includes("Мови:") ? '<noscript><p class="container">'+["ua","en","pl"].map(lang=>'<a href="'+base+(lang==="ua"?"":lang+"/")+path+'">'+{ua:"Українська",en:"English",pl:"Polski"}[lang]+'</a>').join(" · ")+'</p></noscript>' : block);
  html = renderHtml(html,language,siteUrl);
  const ui = translations[language].ui;
  const title = post ? content.title+" — DM Studio" : ui.blogIndexMeta;
  const description = post ? content.description : ui.blogMetaDescription;
  html = html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(title)+'</title>');
  html = html.replace(/<meta\b[^>]*>/g,tag=>{
    const key = tag.match(/(?:name|property)="([^"]+)"/)?.[1];
    const value = ["description","og:description","twitter:description"].includes(key) ? description : ["og:title","twitter:title"].includes(key) ? title : key==="og:url"&&siteUrl ? new URL(prefix+path,siteUrl).href : key==="og:type"&&post ? "article" : null;
    return value ? tag.replace(/content="[^"]*"/,'content="'+escape(value)+'"') : tag;
  });
  if (siteUrl) {
    const url = new URL(prefix+path,siteUrl).href;
    html = html.replace(/<link rel="canonical" href="[^"]+">/,'<link rel="canonical" href="'+url+'">');
    html = html.replace(/<link rel="alternate" hreflang="([^"]+)" href="[^"]+">/g,(_,locale)=>'<link rel="alternate" hreflang="'+locale+'" href="'+new URL((["en","pl"].includes(locale)?locale+"/":"")+path,siteUrl).href+'">');
    const crumbs = {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:ui.navHome,item:new URL(prefix,siteUrl).href},{"@type":"ListItem",position:2,name:ui.navBlog,item:new URL(prefix+"blog/",siteUrl).href}]};
    if (post) crumbs.itemListElement.push({"@type":"ListItem",position:3,name:content.title,item:url});
    const schema = post ? {"@context":"https://schema.org","@type":"BlogPosting","@id":url+"#article",mainEntityOfPage:{"@type":"WebPage","@id":url},headline:content.title,description,datePublished:post.date,inLanguage:language==="ua"?"uk":language,image:new URL(post.image,siteUrl).href,author:{"@type":"Person",name:ui.blogAuthor,url:new URL(prefix+"about/",siteUrl).href},publisher:{"@type":"Organization",name:"DM Studio",url:siteUrl},articleSection:content.category,articleBody:[content.intro,...content.sections.flatMap(section=>[section.title,...section.paragraphs])].join("\n\n")} : {"@context":"https://schema.org","@type":"Blog",name:ui.blogIndexMeta,description,url,inLanguage:language==="ua"?"uk":language,blogPost:blogPosts.map(item=>({"@type":"BlogPosting",headline:item[language].title,url:new URL(prefix+"blog/"+item.slug+"/",siteUrl).href,datePublished:item.date}))};
    html = html.replace("</head>",[crumbs,schema].map(item=>'<script type="application/ld+json">'+JSON.stringify(item).replaceAll("<","\\u003c")+'</script>').join("")+'</head>');
  }
  return html;
}
export async function writeBlogPages(source,siteUrl,base) {
  for (const language of ["ua","en","pl"]) {
    const prefix = language==="ua"?"":language+"/";
    for (const slug of ["",...blogPosts.map(post=>post.slug)]) {
      const path = prefix+"blog/"+(slug?slug+"/":"");
      await mkdir("dist/"+path,{recursive:true});
      await writeFile("dist/"+path+"index.html",renderBlogPage(source,language,slug,siteUrl,base));
    }
  }
}

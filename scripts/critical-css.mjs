import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
// Use the CSS parser already required by Vite; no extra runtime dependency.
const viteRequire=createRequire(require.resolve('vite'));
const postcss=viteRequire('postcss');
export function criticalCss(css,html){
 const end=html.search(/<section\b[^>]*class="[^"]*\bsvc\b/);
 const firstScreen=end<0?html:html.slice(0,end);
 const classes=new Set([...firstScreen.matchAll(/class="([^"]+)"/g)].flatMap(([,names])=>names.split(/\s+/)));
 const root=postcss.parse(css);
 const relevant=selector=>{
   const names=[...selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(([,name])=>name);
   return !names.length || names.some(name=>classes.has(name)||/^(analytics-|system-|morph-|service-|orbit-)/.test(name));
 };
 function filter(container){
  for(const node of [...container.nodes||[]]){
   if(node.type==='rule' && !relevant(node.selector))node.remove();
   else if(node.type==='atrule' && ['media','supports','layer','container'].includes(node.name)){
    filter(node);if(!node.nodes?.length)node.remove();
   }
  }
 }
 filter(root);return root.toString();
}
export function deferHomeStyles(html,css){
 const critical=criticalCss(css,html);
 return html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g,tag=>{
  const deferred=tag.replace('rel="stylesheet"','rel="stylesheet" media="print" onload="this.onload=null;this.media=\'all\'"');
  return `<style data-critical-css>${critical}</style>${deferred}<noscript>${tag}</noscript>`;
 });
}

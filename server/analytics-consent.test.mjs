import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

// Isolated DOM doubles: no browser, Google requests or real enquiries.
async function setup(saved, existingTag = false) {
  class Node {
    constructor(tag) { this.tag = tag; this.children = []; this.listeners = {}; }
    setAttribute() {}
    append(...nodes) { this.children.push(...nodes); }
    addEventListener(name, fn) { this.listeners[name] = fn; }
    querySelector() { return this.children.find(n => n.tag === 'button'); }
    focus() {}
  }
  const head = new Node('head'), body = new Node('body'), footer = new Node('footer');
  globalThis.window = {dataLayer:[],addEventListener() {}};
  globalThis.location = {hostname:'dm-studio-production.up.railway.app',origin:'https://dm-studio-production.up.railway.app',pathname:'/',reload() { this.reloaded = true; }};
  globalThis.localStorage = {getItem:() => saved ? JSON.stringify({value:saved,expires:Date.now()+60000}) : null,setItem() {}};
  globalThis.document = {documentElement:{lang:'uk'},referrer:'https://example.com/ref?private=secret',cookie:'',head,body,
    createElement:tag => new Node(tag),addEventListener() {},
    querySelector:selector => selector === '.footer-links' ? footer : existingTag && selector.startsWith('script[') ? {} : null};
  const api = await import('../src/js/analytics.js?test='+Math.random());
  api.initAnalytics();
  const panel = body.children[0], actions = panel.children.at(-1);
  return {api,head,grant:() => actions.children[0].listeners.click(),deny:() => actions.children[1].listeners.click(), commands:() => window.dataLayer.map(args => [...args])};
}

test('unknown choice and saved denial do not activate analytics or inject another tag', async () => {
  for (const choice of [undefined,'denied']) {
    const env = await setup(choice);
    env.api.trackEvent('generate_lead',{form_id:'brief'});
    assert.equal(env.head.children.length,0);
    assert.equal(window['ga-disable-G-74120JP105'],true);
    assert.equal(env.commands().filter(c => ['event','config'].includes(c[0])).length,0);
  }
});

test('consent starts one config, one clean page view and one tag, including repeated grant', async () => {
  const env = await setup();
  env.grant(); env.grant();
  const commands = env.commands();
  assert.equal(env.head.children.length,1);
  assert.match(env.head.children[0].src,/gtag\/js\?id=G-74120JP105/);
  assert.equal(commands.filter(c => c[0]==='config').length,1);
  const views = commands.filter(c => c[0]==='event' && c[1]==='page_view');
  assert.equal(views.length,1);
  assert.equal(views[0][2].page_referrer,'https://example.com/ref');
  assert.equal(commands.find(c => c[0]==='config')[2].send_page_view,false);
  env.api.trackEvent('generate_lead',{form_id:'brief'});
  assert.deepEqual(env.commands().at(-1),['event','generate_lead',{page_language:'uk',form_id:'brief'}]);
  env.deny();
  const before = env.commands().length;
  env.api.trackEvent('contact_click',{contact_channel:'telegram'});
  assert.equal(env.commands().length,before);
  assert.equal(window['ga-disable-G-74120JP105'],true);
  assert.equal(location.reloaded,true);
});

test('saved consent starts analytics; HTML blocks measurement before the Search Console tag loads', async () => {
  const env = await setup('granted');
  assert.equal(env.head.children.length,1);
  const html = await fs.readFile(new URL('../index.html',import.meta.url),'utf8');
  const disabled = html.indexOf("window['ga-disable-G-74120JP105'] = true");
  const external = html.indexOf('src="https://www.googletagmanager.com/gtag/js?id=G-74120JP105"');
  assert.ok(disabled >= 0 && external > disabled);
  assert.match(html,/send_page_view: false/);
});


test('an existing head tag is reused but consent still configures and sends one page view', async () => {
  const env = await setup(undefined,true);
  env.grant();
  assert.equal(env.head.children.length,0);
  assert.equal(env.commands().filter(c => c[0]==='config').length,1);
  assert.equal(env.commands().filter(c => c[0]==='event' && c[1]==='page_view').length,1);
});

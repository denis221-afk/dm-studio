import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('server retains confirmed delivery and rejects a repeated ID without contacting Telegram twice', async () => {
  const child = spawn(process.execPath, ['--input-type=module', '-e', `
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      if (calls > 1) throw new Error('duplicate delivery');
      return {ok:true,json:async () => ({ok:true})};
    };
    await import('./server/index.mjs');
  `], {env:{...process.env,PORT:'31987',TELEGRAM_BOT_TOKEN:'test-only',TELEGRAM_CHAT_ID:'test-only',ALLOWED_ORIGIN:'http://localhost:31987'},stdio:'ignore'});
  const base = 'http://localhost:31987';
  try {
    let ready = false;
    for (let n = 0; n < 50; n++) {
      try { ready = (await fetch(base+'/health')).ok; } catch {}
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve,20));
    }
    assert.equal(ready,true);
    const requestId = 'd9aa8559-8bba-4b6f-88c0-d9d590169cb3';
    const body = {requestId,name:'Test',contact:'qa@example.com',task:'Test enquiry',service:'web'};
    const submit = () => fetch(base+'/api/brief',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify(body)});
    assert.deepEqual(await (await submit()).json(),{ok:true});
    assert.deepEqual(await (await fetch(base+'/api/brief/status?requestId='+requestId)).json(),{ok:true,status:'sent'});
    assert.deepEqual(await (await submit()).json(),{ok:true});
    assert.equal((await fetch(base+'/api/brief/status?requestId=bad')).status,400);
  } finally {
    const closed = once(child,'exit');
    child.kill('SIGTERM');
    await closed;
  }
});

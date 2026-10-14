import test from 'node:test';
import assert from 'node:assert/strict';
import { sendBrief } from '../src/js/brief-delivery.js';
const requestId = 'd9aa8559-8bba-4b6f-88c0-d9d590169cb3';
const response = (body, ok = true) => ({ok, json:async () => body});
test('confirmed POST requires no status request', async () => {
  let calls = 0;
  await sendBrief('/api/brief', {}, {requestId, fetchImpl:async () => {calls++; return response({ok:true});}});
  assert.equal(calls, 1);
});
test('lost acknowledgement recovers from sent status without another POST', async () => {
  const methods = [];
  await sendBrief('/api/brief', {}, {requestId, pause:async () => {}, fetchImpl:async (url, options) => {
    methods.push(options.method || 'GET');
    if (options.method === 'POST') throw new Error('connection lost after delivery');
    assert.match(url, /status\?requestId=/);
    return response({status:'sent'});
  }});
  assert.deepEqual(methods, ['POST','GET']);
});
test('pending becomes sent and genuine failures stay failures', async () => {
  let calls = 0;
  await sendBrief('/api/brief', {}, {requestId, pause:async () => {}, fetchImpl:async () => {
    calls++;
    return calls === 1 ? response({ok:false},false) : response({status:calls === 2 ? 'pending' : 'sent'});
  }});
  assert.equal(calls, 3);
  await assert.rejects(sendBrief('/api/brief', {}, {requestId, fetchImpl:async (_, options) =>
    response(options.method === 'POST' ? {ok:false} : {status:'failed'},false)}));
});
test('unknown status never fabricates success or resends the enquiry', async () => {
  let posts = 0;
  await assert.rejects(sendBrief('/api/brief', {}, {requestId, pause:async () => {}, fetchImpl:async (_, options) => {
    if (options.method === 'POST') posts++;
    return response({status:'unknown'},false);
  }}));
  assert.equal(posts, 1);
});

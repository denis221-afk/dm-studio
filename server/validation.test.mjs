import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBrief, telegramText } from './validation.mjs';
const valid = {name:' Денис ', contact:'@MazurykD',task:'Потрібен сайт',service:'web'};
test('validates and normalizes Ukrainian brief', () => {
  const brief = validateBrief(valid);
  assert.equal(brief.name, 'Денис');
  assert.equal(brief.language, 'uk');
  assert.match(telegramText(brief), /Контакт: @MazurykD/);
});
test('accepts email and rejects missing or oversized data', () => {
  assert.equal(validateBrief({...valid,contact:'denis@example.com'}).contact,'denis@example.com');
  for (const change of [{name:''},{contact:'bad'},{task:'x'.repeat(2201)},{service:'unknown'},{task:[]},{name:'a\u0000'}]) assert.throws(() => validateBrief({...valid,...change}));
});

const limits = { name: 100, contact: 200, task: 2200, budget: 100, deadline: 100 };
export function validateBrief(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('invalid');
  const result = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (input[key] !== undefined && typeof input[key] !== 'string') throw new Error('invalid');
    const value = (input[key] ?? '').trim();
    if (value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error('invalid');
    result[key] = value;
  }
  if (!result.name || !result.task || !/^(?:[^\s@]+@[^\s@]+\.[^\s@]+|@[a-zA-Z][a-zA-Z0-9_]{4,31})$/.test(result.contact)) throw new Error('invalid');
  if (!['web','bot','automation','ai','other'].includes(input.service)) throw new Error('invalid');
  result.service = input.service;
  result.language = ['uk','en','pl'].includes(input.language) ? input.language : 'uk';
  return result;
}
export function telegramText(brief) {
  const services = {web:'Сайт',bot:'Telegram-бот',automation:'Автоматизація',ai:'AI-рішення',other:'Інше'};
  return ['Нова заявка — DM Studio', `Послуга: ${services[brief.service]}`, `Ім’я: ${brief.name}`, `Контакт: ${brief.contact}`, `Задача: ${brief.task}`, brief.budget && `Бюджет: ${brief.budget}`, brief.deadline && `Термін: ${brief.deadline}`, `Мова: ${brief.language}`].filter(Boolean).join('\n\n');
}

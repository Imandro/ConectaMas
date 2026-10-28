import assert from 'node:assert/strict';
import {
  buildProviderMessages,
  selectVerseForMessage,
} from '../app/lib/ai/prompts';

const verse = selectVerseForMessage('Me siento con ansiedad y miedo');
assert.equal(verse.reference, 'Filipenses 4:6');
assert.ok(verse.text.length > 10);

const messages = buildProviderMessages({
  firstName: 'Mario',
  language: 'es',
  mode: 'struggle',
  contextEnabled: true,
  activeStruggles: [{ title: 'Ansiedad', status: 'ACTIVE', currentDay: 3 }],
  verse,
}, [], 'Ayúdame con esto');

assert.equal(messages[0].role, 'system');
assert.match(messages[0].content, /Mario/);
assert.match(messages[0].content, /Ansiedad/);
assert.match(messages[0].content, /Filipenses 4:6/);
assert.equal(messages.at(-1)?.role, 'user');
assert.equal(messages.at(-1)?.content, 'Ayúdame con esto');

const privateMessages = buildProviderMessages({
  firstName: 'Mario',
  language: 'es',
  mode: 'companion',
  contextEnabled: false,
  activeStruggles: [{ title: 'Privado', status: 'ACTIVE', currentDay: 1 }],
  verse,
}, [], 'Hola');
assert.doesNotMatch(privateMessages[0].content, /Privado/);
assert.doesNotMatch(privateMessages[0].content, /Mario/);

console.log('AI chat prompt passed');

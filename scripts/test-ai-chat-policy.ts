import assert from 'node:assert/strict';
import {
  AI_CHAT_LIMIT,
  AI_CHAT_WINDOW_MS,
  MAX_MESSAGE_LENGTH,
  firstName,
  getQuotaState,
  isAiChatMode,
  isCrisisSignal,
  normalizeMessage,
} from '../app/lib/ai/policy';

assert.equal(firstName('Mario Alejandro Ruiz'), 'Mario');
assert.equal(firstName('  '), 'amigo');
assert.equal(normalizeMessage('  Hola Llami  '), 'Hola Llami');
assert.equal(normalizeMessage('x'.repeat(MAX_MESSAGE_LENGTH + 1)), null);
assert.equal(isAiChatMode('companion'), true);
assert.equal(isAiChatMode('admin'), false);
assert.equal(isCrisisSignal('Siento que quiero suicidarme'), true);
assert.equal(isCrisisSignal('Hoy me siento cansado'), false);

const now = new Date('2026-10-27T12:00:00.000Z');
const timestamps = Array.from({ length: AI_CHAT_LIMIT }, (_, index) => ({
  createdAt: new Date(now.getTime() - index * 10 * 60 * 1000),
}));
const quota = getQuotaState(timestamps, now);
assert.equal(quota.used, AI_CHAT_LIMIT);
assert.equal(quota.remaining, 0);
assert.equal(quota.resetAt?.toISOString(), new Date(now.getTime() - 40 * 60 * 1000 + AI_CHAT_WINDOW_MS).toISOString());

console.log('AI chat policy passed');

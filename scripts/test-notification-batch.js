/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');

process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'CommonJS', moduleResolution: 'Node' });
require('ts-node/register/transpile-only');

const {
  normalizeNotificationBatchLimit,
  normalizeNotificationConcurrency,
  takeNotificationBatch,
} = require('../app/lib/notificationBatch');

assert.equal(normalizeNotificationBatchLimit(undefined), 100);
assert.equal(normalizeNotificationBatchLimit('999'), 500);
assert.equal(normalizeNotificationBatchLimit('0'), 1);
assert.equal(normalizeNotificationConcurrency('999'), 25);
assert.deepEqual(takeNotificationBatch([{ id: 'a' }, { id: 'b' }], 1), {
  items: [{ id: 'a' }],
  hasMore: true,
  nextCursor: 'a',
});
assert.deepEqual(takeNotificationBatch([{ id: 'a' }], 1), {
  items: [{ id: 'a' }],
  hasMore: false,
  nextCursor: null,
});

console.log('notification batch: ok (limits, concurrency, cursor)');

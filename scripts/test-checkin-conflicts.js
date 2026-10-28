const assert = require('node:assert/strict');
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'CommonJS', moduleResolution: 'Node' });
require('ts-node/register/transpile-only');

const { decideCheckin } = require('../app/lib/conflicts/checkin');

const todayKey = '2026-10-27';
const basePayload = {
    userId: 'user-a',
    idempotencyKey: 'request-1',
    dayKey: todayKey,
};

assert.deepEqual(
    decideCheckin(basePayload, [], todayKey),
    { decision: 'apply', dayKey: todayKey, idempotencyKey: 'request-1' },
);

assert.deepEqual(
    decideCheckin(
        basePayload,
        [{ userId: 'user-a', idempotencyKey: 'request-1', dayKey: todayKey }],
        todayKey,
    ),
    { decision: 'duplicate', reason: 'idempotent-retry', dayKey: todayKey },
);

assert.deepEqual(
    decideCheckin(
        { ...basePayload, idempotencyKey: 'request-2' },
        [{ userId: 'user-a', idempotencyKey: 'request-1', dayKey: todayKey }],
        todayKey,
    ),
    { decision: 'duplicate', reason: 'same-day', dayKey: todayKey },
);

assert.deepEqual(
    decideCheckin(
        { ...basePayload, dayKey: '2026-02-30' },
        [],
        todayKey,
    ),
    { decision: 'reject', reason: 'invalid-day-key' },
);

assert.deepEqual(
    decideCheckin(
        { ...basePayload, dayKey: '20261027' },
        [],
        todayKey,
    ),
    { decision: 'reject', reason: 'invalid-day-key' },
);

assert.deepEqual(
    decideCheckin(
        { ...basePayload, dayKey: '2026-10-28' },
        [],
        todayKey,
    ),
    { decision: 'reject', reason: 'future-day' },
);

const lateReplay = { ...basePayload, dayKey: '2026-10-26', idempotencyKey: 'late-request' };
assert.deepEqual(
    decideCheckin(lateReplay, [], todayKey),
    { decision: 'apply', dayKey: '2026-10-26', idempotencyKey: 'late-request' },
);

assert.equal(
    decideCheckin(
        basePayload,
        [{ userId: 'user-b', idempotencyKey: 'request-1', dayKey: todayKey }],
        todayKey,
    ).decision,
    'apply',
);

console.log('check-in conflicts: ok');

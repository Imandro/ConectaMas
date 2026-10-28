const assert = require('node:assert/strict');

process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'CommonJS', moduleResolution: 'Node' });
require('ts-node/register/transpile-only');

const { mergeProgress } = require('../app/lib/conflicts/progress');

const initial = {
    status: 'ACTIVE',
    currentDay: 1,
    completedDays: '',
};

assert.deepEqual(
    mergeProgress(
        { status: 'ACTIVE', currentDay: 2, completedDays: '2,1,2' },
        { action: 'ADVANCE', dayNumber: 2 },
    ),
    {
        decision: 'ignore',
        data: { status: 'ACTIVE', currentDay: 2, completedDays: '1,2' },
    },
    'duplicate advances normalize without changing progress',
);

const day2ThenDay1 = mergeProgress(
    mergeProgress(initial, { action: 'ADVANCE', dayNumber: 2 }).data,
    { action: 'ADVANCE', dayNumber: 1 },
).data;
const day1ThenDay2 = mergeProgress(
    mergeProgress(initial, { action: 'ADVANCE', dayNumber: 1 }).data,
    { action: 'ADVANCE', dayNumber: 2 },
).data;

assert.deepEqual(day2ThenDay1, day1ThenDay2, 'advance order does not change the normalized result');
assert.deepEqual(day2ThenDay1, {
    status: 'ACTIVE',
    currentDay: 3,
    completedDays: '1,2',
});

assert.deepEqual(
    mergeProgress(
        { status: 'ACTIVE', currentDay: 8, completedDays: '1,3' },
        { action: 'ADVANCE', dayNumber: 2 },
    ).data,
    {
        status: 'ACTIVE',
        currentDay: 8,
        completedDays: '1,2,3',
    },
    'an older advance cannot regress currentDay',
);

assert.deepEqual(
    mergeProgress(initial, { action: 'ADVANCE', dayNumber: 21 }),
    {
        decision: 'apply',
        data: { status: 'ACTIVE', currentDay: 21, completedDays: '21' },
    },
    'progress is capped at day 21',
);

const overcome = mergeProgress(
    { status: 'ACTIVE', currentDay: 8, completedDays: '1,2,3' },
    { action: 'OVERCOME' },
);
assert.deepEqual(overcome, {
    decision: 'apply',
    data: { status: 'vencido', currentDay: 21, completedDays: '1,2,3' },
});
assert.deepEqual(
    mergeProgress(overcome.data, { action: 'ADVANCE', dayNumber: 9 }),
    {
        decision: 'ignore',
        data: { status: 'vencido', currentDay: 21, completedDays: '1,2,3' },
    },
    'OVERCOME dominates stale advances',
);

for (const action of [{ action: 'START' }, { action: 'RESET' }]) {
    assert.deepEqual(
        mergeProgress({ status: 'ACTIVE', currentDay: 2, completedDays: '2,1,2' }, action),
        {
            decision: 'blocked',
            data: { status: 'ACTIVE', currentDay: 2, completedDays: '1,2' },
        },
        `${action.action} remains blocked offline`,
    );
}

console.log('progress conflicts: ok');

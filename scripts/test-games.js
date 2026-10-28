const assert = require('assert');
require('ts-node/register/transpile-only');

const { memoryPairs } = require('../app/data/games/memoryData');
const { characterEvents } = require('../app/data/games/characterEventData');
const { bibleOrderChallenges } = require('../app/data/games/bibleOrderData');
const { scoreGameTurn, isValidTurnAction } = require('../app/lib/games/gameRules');
const actions = require('fs').readFileSync('app/dashboard/games/actions.ts', 'utf8');
const localeFiles = ['es', 'en', 'pt', 'ro'].map((lang) => require('fs').readFileSync(`app/locales/${lang}.ts`, 'utf8'));

const unique = (items) => new Set(items).size === items.length;

assert.equal(memoryPairs.length, 8, 'memory must have 8 pairs');
assert(unique(memoryPairs.map((item) => item.id)), 'memory IDs must be unique');
assert.equal(characterEvents.length, 12, 'character-event must have 12 pairs');
assert(unique(characterEvents.map((item) => item.id)), 'character-event IDs must be unique');
assert.equal(bibleOrderChallenges.length, 12, 'bible-order must have 12 challenges');
assert(bibleOrderChallenges.every((item) => item.items.length === 4), 'bible-order challenges need 4 items');
assert(bibleOrderChallenges.every((item) => item.orderedIds.length === item.items.length), 'bible-order answers need matching lengths');

assert.deepEqual(
    scoreGameTurn('MEMORY', { kind: 'MEMORY', cardIds: ['memory-01-front', 'memory-01-back'] }, {
        pairIdByCard: { 'memory-01-front': 'memory-01', 'memory-01-back': 'memory-01' },
    }),
    { correct: true, points: 10 }
);
assert.deepEqual(
    scoreGameTurn('CHARACTER_EVENT', { kind: 'CHARACTER_EVENT', optionId: 'character-01' }, { correctOptionId: 'character-01' }),
    { correct: true, points: 10 }
);
assert.deepEqual(
    scoreGameTurn('BIBLE_ORDER', { kind: 'BIBLE_ORDER', orderedIds: ['a', 'b'] }, { orderedIds: ['b', 'a'] }),
    { correct: false, points: 0 }
);
assert(isValidTurnAction('MEMORY', { kind: 'MEMORY', cardIds: ['a', 'b'] }));
assert(!isValidTurnAction('MEMORY', { kind: 'MEMORY', cardIds: ['a', 'a'] }));
assert(!isValidTurnAction('CHARACTER_EVENT', { kind: 'CHARACTER_EVENT', optionId: '' }));
assert(!isValidTurnAction('BIBLE_ORDER', { kind: 'BIBLE_ORDER', orderedIds: [] }));
assert(!isValidTurnAction('MEMORY', { kind: 'BIBLE_ORDER', orderedIds: ['a', 'b'] }));
assert.match(actions, /Room not found/, 'invalid rooms must be rejected');
assert.match(actions, /Not your turn/, 'wrong turns must be rejected');
assert.match(actions, /Question expired/, 'stale questions must be rejected');
assert.match(actions, /currentTurnUserId: session\.user\.id/, 'room turns must validate the current player');
assert.match(actions, /activeQuestionId: expectedQuestionId/, 'room turns must reject stale questions');
assert.match(actions, /prisma\.\$transaction/, 'room turns must commit atomically');
for (const locale of localeFiles) assert.match(locale, /game_ui:/, 'all locales need game UI copy');

console.log('games: ok');

/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'CommonJS', moduleResolution: 'Node' });
require('ts-node/register/transpile-only');

const { getOfflineRoutePolicy, snapshotKey, isOfflineWriteBlocked, OFFLINE_CONTENT_VERSION } = require('../app/lib/offline');
const { isPollingAllowed } = require('../app/lib/networkPolicy');
const { getSnapshot, saveSnapshot } = require('../app/lib/offlineStore');

assert.equal(getOfflineRoutePolicy('/dashboard/bible').kind, 'static');
assert.equal(getOfflineRoutePolicy('/dashboard/devotionals').kind, 'static');
assert.equal(getOfflineRoutePolicy('/dashboard/games/verse-order').kind, 'static');
assert.equal(getOfflineRoutePolicy('/dashboard/checkin').kind, 'snapshot');
assert.equal(getOfflineRoutePolicy('/dashboard/forums').kind, 'online-only');
assert.equal(getOfflineRoutePolicy('/dashboard/groups').kind, 'online-only');
assert.equal(getOfflineRoutePolicy('/dashboard/games/abc123').kind, 'online-only');
assert.equal(getOfflineRoutePolicy('/dashboard/leagues').kind, 'online-only');
assert.notEqual(snapshotKey('/dashboard', 'user-a'), snapshotKey('/dashboard', 'user-b'));
assert.notEqual(snapshotKey('/dashboard', 'user-a'), snapshotKey('/dashboard/profile', 'user-a'));
assert.equal(snapshotKey('/dashboard', 'user-a').split(':')[0], OFFLINE_CONTENT_VERSION);
assert.equal(isOfflineWriteBlocked('POST', false), true);
assert.equal(isOfflineWriteBlocked('GET', false), false);
assert.equal(isPollingAllowed(true, false), true);
assert.equal(isPollingAllowed(false, false), false);
assert.equal(isPollingAllowed(true, true), false);

(async () => {
    assert.equal(await saveSnapshot('/dashboard', 'user-a', { ok: true }), false);
    assert.equal(await getSnapshot('/dashboard', 'user-a'), null);
    console.log('offline policy: ok');
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

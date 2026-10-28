const assert = require('node:assert/strict');
require('ts-node/register/transpile-only');

const { MOBILE_NAV_HREFS, isMobilePrimaryNav } = require('../app/lib/designNavigation');

assert.deepEqual(MOBILE_NAV_HREFS, [
    '/dashboard',
    '/dashboard/devotionals',
    '/dashboard/bible',
    '/dashboard/prayer',
    '/dashboard/games',
]);
assert.equal(isMobilePrimaryNav('/dashboard/games/verse-order'), true);
assert.equal(isMobilePrimaryNav('/dashboard/support'), false);

console.log('design navigation: ok');

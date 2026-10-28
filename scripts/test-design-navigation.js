const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('ts-node/register/transpile-only');

const { MOBILE_NAV_HREFS, isMobilePrimaryNav } = require('../app/lib/designNavigation');
const dashboardNav = fs.readFileSync(path.join(__dirname, '../app/components/DashboardNav.tsx'), 'utf8');

assert.deepEqual(MOBILE_NAV_HREFS, [
    '/dashboard',
    '/dashboard/devotionals',
    '/dashboard/bible',
    '/dashboard/prayer',
    '/dashboard/games',
    '/dashboard/chat',
]);
assert.equal(isMobilePrimaryNav('/dashboard/games/verse-order'), true);
assert.equal(isMobilePrimaryNav('/dashboard/chat'), true);
assert.equal(isMobilePrimaryNav('/dashboard/support'), false);
assert.match(dashboardNav, /name: "Habla con Llami", shortName: 'Llami', href: '\/dashboard\/chat', icon: Sparkles/);

console.log('design navigation: ok');

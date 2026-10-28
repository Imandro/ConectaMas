/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

require('ts-node/register/transpile-only');

const root = path.resolve(__dirname, '..');
const { getOfflineRoutePolicy } = require(path.join(root, 'app/lib/offline'));
const nextConfig = fs.readFileSync(path.join(root, 'next.config.js'), 'utf8');
const worker = fs.readFileSync(path.join(root, 'worker/index.js'), 'utf8');
const offlinePolicy = fs.readFileSync(path.join(root, 'app/lib/offline.ts'), 'utf8');
const sosPage = fs.readFileSync(path.join(root, 'app/dashboard/sos/page.tsx'), 'utf8');
const sosAction = fs.readFileSync(path.join(root, 'app/dashboard/sos/actions.ts'), 'utf8');
const dailyVerse = fs.readFileSync(path.join(root, 'app/dashboard/components/DailyVerse.tsx'), 'utf8');

const matrix = [
  {
    kind: 'static',
    routes: [
      '/dashboard/bible',
      '/dashboard/devotionals',
      '/dashboard/devotionals/1',
      '/dashboard/sos',
      '/dashboard/challenge',
      '/dashboard/games/verse-order',
      '/dashboard/games/speed-quiz',
      '/dashboard/games/fill-blank',
      '/dashboard/games/book-sort',
      '/dashboard/games/book-match',
    ],
  },
  {
    kind: 'snapshot',
    routes: [
      '/dashboard',
      '/dashboard/profile',
      '/dashboard/luchas/struggle-1',
      '/dashboard/llami',
      '/dashboard/mascot',
      '/dashboard/prayer',
      '/dashboard/checkin',
    ],
  },
  {
    kind: 'online-only',
    routes: [
      '/dashboard/forums',
      '/dashboard/forums/category-1',
      '/dashboard/groups',
      '/dashboard/groups/group-1',
      '/dashboard/friends',
      '/dashboard/qa/question-1',
      '/dashboard/trivia',
      '/dashboard/games',
      '/dashboard/games/room-1',
      '/api/bible',
      '/api/devotionals',
    ],
  },
];

let policyChecks = 0;
for (const entry of matrix) {
  for (const route of entry.routes) {
    assert.equal(getOfflineRoutePolicy(route).kind, entry.kind, route);
    policyChecks += 1;
  }
}

const expectedLocalSources = [
  ['app/dashboard/bible/page.tsx', /\/bible\/es_rvr\.json/, 'Bible JSON'],
  ['app/dashboard/bible/page.tsx', /versesData/, 'Bible helper verses'],
  ['app/dashboard/devotionals/page.tsx', /getDevotionals/, 'localized devotional list'],
  ['app/dashboard/devotionals/[id]/page.tsx', /getDevotionals/, 'localized devotional detail'],
  ['app/dashboard/challenge/page.tsx', /challengeData/, 'challenge questions'],
  ['app/dashboard/sos/SOSClient.tsx', /sosData/, 'SOS content'],
  ['app/dashboard/games/verse-order/page.tsx', /data\/games\/verseOrderData/, 'verse-order questions'],
  ['app/dashboard/games/speed-quiz/page.tsx', /data\/games\/speedQuizData/, 'speed-quiz questions'],
  ['app/dashboard/games/fill-blank/page.tsx', /data\/games\/fillBlankData/, 'fill-blank questions'],
  ['app/dashboard/games/book-sort/page.tsx', /data\/games\/bookSortData/, 'book-sort questions'],
  ['app/dashboard/games/book-match/page.tsx', /data\/games\/bookMatchData/, 'book-match questions'],
];

for (const [relativeFile, pattern, label] of expectedLocalSources) {
  const file = path.join(root, relativeFile);
  assert.ok(fs.existsSync(file), relativeFile);
  assert.match(fs.readFileSync(file, 'utf8'), pattern, `${label}: ${relativeFile}`);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const relative = path.relative(root, absolute).replaceAll(path.sep, '/');
      if (relative === 'app/api' || relative.startsWith('app/api/')) return [];
      if (relative === 'app/graphify-out' || relative.startsWith('app/graphify-out/')) return [];
      return walk(absolute);
    }
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [absolute] : [];
  });
}

const uiFiles = [...walk(path.join(root, 'app')), ...walk(path.join(root, 'components'))];
const localContentApiPattern = /\/api\/(?:bible|devotionals)(?=['"`?])/g;
const localContentApiConsumers = uiFiles.flatMap((file) => {
  const source = fs.readFileSync(file, 'utf8');
  return [...source.matchAll(localContentApiPattern)].map(() => path.relative(root, file));
});

assert.deepEqual(localContentApiConsumers, [], 'local content APIs must not be called by UI screens');
assert.ok(fs.existsSync(path.join(root, 'app/api/bible/route.ts')));
assert.ok(fs.existsSync(path.join(root, 'app/api/devotionals/route.ts')));

assert.doesNotMatch(sosPage, /\bauth\s*\(|\bprisma\b|redirect\(/);
assert.match(sosPage, /getSnapshot/);
assert.match(sosPage, /saveSnapshot/);
assert.match(sosAction, /select:\s*\{\s*leaderPhone:\s*true\s*\}/s);
assert.doesNotMatch(dailyVerse, /unsplash/i);
assert.doesNotMatch(nextConfig, /urlPattern:\s*\/\\\/\.\*\//);
assert.match(nextConfig, /method:\s*'GET'/);
assert.match(nextConfig, /X-Conecta-Offline-Snapshot/);
assert.match(nextConfig, /private, no-store, must-revalidate/);
assert.match(worker, /request\.method !== 'GET'/);
assert.match(worker, /pathname\.startsWith\('\/api\/'\)/);
assert.match(worker, /X-Conecta-Offline-Snapshot/);

for (const relativeFile of [
  'app/dashboard/profile/ProfileView.tsx',
  'app/dashboard/components/StruggleTracker.tsx',
  'app/dashboard/luchas/[id]/StrugglePlanContent.tsx',
  'app/dashboard/mascot/MascotCustomizer.tsx',
  'app/dashboard/prayer/PrayerWallView.tsx',
  'app/dashboard/checkin/page.tsx',
]) {
  const source = fs.readFileSync(path.join(root, relativeFile), 'utf8');
  assert.match(source, /getSnapshot/, `${relativeFile}: snapshot read`);
  assert.match(source, /saveSnapshot/, `${relativeFile}: snapshot write`);
}

function parseRouteList(source, name) {
  const match = source.match(new RegExp(`(?:const|let) ${name} = \\[([\\s\\S]*?)\\]`));
  assert.ok(match, `${name} must exist`);
  return [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((entry) => entry[1]);
}

assert.deepEqual(parseRouteList(worker, 'STATIC_ROUTES'), [
  '/dashboard/bible',
  '/dashboard/devotionals',
  '/dashboard/sos',
  '/dashboard/challenge',
  '/dashboard/games/verse-order',
  '/dashboard/games/speed-quiz',
  '/dashboard/games/fill-blank',
  '/dashboard/games/book-sort',
  '/dashboard/games/book-match',
]);
assert.deepEqual(parseRouteList(worker, 'SNAPSHOT_ROUTES'), [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/luchas',
  '/dashboard/llami',
  '/dashboard/mascot',
  '/dashboard/prayer',
  '/dashboard/checkin',
]);
assert.deepEqual(parseRouteList(offlinePolicy, 'staticRoutes'), parseRouteList(worker, 'STATIC_ROUTES'));
assert.deepEqual(parseRouteList(offlinePolicy, 'snapshotRoutes'), parseRouteList(worker, 'SNAPSHOT_ROUTES'));

console.log(`offline routes: ok (${policyChecks} policy entries; local content API consumers: 0)`);

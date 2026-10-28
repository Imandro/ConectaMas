const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const files = [
    'app/dashboard/bible/page.tsx',
    'app/dashboard/devotionals/page.tsx',
    'app/dashboard/forums/page.tsx',
    'app/dashboard/friends/page.tsx',
    'app/dashboard/leagues/LeagueRankingView.tsx',
    'app/dashboard/support/page.tsx',
    'app/dashboard/luchas/page.tsx',
    'app/dashboard/games/page.tsx',
];

for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.match(source, /ui-page-header/, `${file} needs a shared page header`);
}

console.log('secondary shell: ok');

const fs = require('fs');
const assert = require('assert');

const redesign = fs.readFileSync('app/styles/redesign.scss', 'utf8');
const utilities = fs.readFileSync('app/styles/utilities.scss', 'utf8');
const files = [
  'app/dashboard/games/page.tsx',
  'app/dashboard/games/book-match/page.tsx',
  'app/dashboard/games/book-sort/page.tsx',
  'app/dashboard/games/fill-blank/page.tsx',
  'app/dashboard/games/speed-quiz/page.tsx',
  'app/dashboard/games/verse-order/page.tsx',
  'app/dashboard/games/components/HotPotatoView.tsx',
  'app/components/TriviaGame.tsx',
  'app/dashboard/llami/page.tsx',
];

for (const file of files) {
  assert.match(fs.readFileSync(file, 'utf8'), /ui-game-shell/, `${file} needs shared game shell`);
}

assert.match(redesign, /\.ui-game-shell \.bg-white,[\s\S]*\.ui-game-shell \.game-card\s*\{[\s\S]*color:\s*#0B1B32;/, 'light game surfaces must keep readable text in dark mode');
for (const utility of ['bg-white-10', 'bg-white-20', 'bg-warning-30', 'text-white-60', 'text-white-70', 'text-white-80']) {
  assert.match(utilities, new RegExp(`\\.${utility}\\s*\\{`), `${utility} must be a valid utility class`);
}

console.log('game shells: ok');

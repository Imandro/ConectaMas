const fs = require('fs');
const assert = require('assert');

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

console.log('game shells: ok');

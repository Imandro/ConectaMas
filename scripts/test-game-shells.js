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

assert.match(redesign, /\.ui-game-shell \.bg-white,[\s\S]*\.ui-game-shell \.game-card\s*\{[\s\S]*color:\s*var\(--ink-strong/, 'game surfaces must use readable theme text');
for (const utility of ['bg-white-10', 'bg-white-20', 'bg-warning-30', 'text-white-60', 'text-white-70', 'text-white-80']) {
  assert.match(utilities, new RegExp(`\\.${utility}\\s*\\{`), `${utility} must be a valid utility class`);
}

for (const file of files) {
  assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /transition\s*:\s*all/, `${file} must use targeted transitions`);
}

assert.match(fs.readFileSync('app/dashboard/games/page.tsx', 'utf8'), /<Link href=\{game\.href\}/, 'game catalog cards must be semantic links');
assert.match(fs.readFileSync('app/dashboard/games/page.tsx', 'utf8'), /role="dialog"/, 'create room modal must expose dialog semantics');
assert.match(fs.readFileSync('app/dashboard/games/actions.ts', 'utf8'), /submitGameTurn/, 'new rooms need server-side turn submission');
assert.match(fs.readFileSync('app/dashboard/games/components/NewGameViews.tsx', 'utf8'), /GameShell/, 'new local games need shared shell');
assert.match(fs.readFileSync('app/dashboard/games/components/NewGameRoomView.tsx', 'utf8'), /GameShell/, 'new room games need shared shell');

console.log('game shells: ok');

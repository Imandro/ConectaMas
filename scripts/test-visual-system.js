const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const redesign = fs.readFileSync(path.join(root, 'app/styles/redesign.scss'), 'utf8');
const utilities = fs.readFileSync(path.join(root, 'app/styles/utilities.scss'), 'utf8');
const secondary = fs.readFileSync(path.join(root, 'app/components/SecondaryUI.module.scss'), 'utf8');

for (const className of ['ui-surface', 'ui-surface-elevated', 'ui-surface-glass', 'ui-page-header', 'ui-state', 'ui-game-shell']) {
    assert.match(redesign, new RegExp(`\\.${className}\\b`), `${className} must be defined`);
}

for (const token of ['--surface-page', '--surface-card', '--surface-elevated', '--ink-strong', '--ink-muted', '--accent-gold']) {
    assert.match(redesign, new RegExp(`${token}\\s*:`), `${token} must be defined`);
}

assert.match(redesign, /@media \(forced-colors: active\)[\s\S]*\.ui-surface/, 'forced-colors must cover semantic surfaces');
assert.doesNotMatch(redesign, /\[data-design\][^{]*\{[^}]*\.bg-glass|\.bg-glass,\s*\.glass-card/, 'legacy glass classes must not receive global glass styling');
assert.match(utilities, /overscroll-behavior:\s*contain/, 'scrollable utilities must contain overscroll');
assert.match(secondary, /transition:\s*transform 150ms ease-out/, 'shared buttons need explicit transitions');

console.log('visual system: ok');

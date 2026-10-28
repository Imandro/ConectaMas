const fs = require('fs');
const assert = require('assert');

const read = (file) => fs.readFileSync(file, 'utf8');
const dashboard = read('app/dashboard/page.tsx');
const verse = read('app/dashboard/components/DailyVerse.tsx');
const challenge = read('app/dashboard/components/ChallengeCard.tsx');
const tracker = read('app/dashboard/components/StruggleTracker.tsx');
const utilities = read('app/styles/utilities.scss');

assert.match(dashboard, /className="dashboard-header[^"`]*ui-page-header[^"`]*ui-surface-glass/, 'dashboard header must use shared glass header');
assert.match(dashboard, /id="tour-checkin" className="[^"]*ui-surface-glass/, 'check-in must use shared glass surface');
assert.match(dashboard, /className="card ui-surface-elevated/, 'tracking summary must use elevated shared surface');
assert.match(verse, /daily-verse-card[^"`]*ui-surface/, 'daily verse must expose shared opaque surface contract');
assert.match(challenge, /challenge-card[^"`]*ui-surface/, 'challenge must expose shared opaque surface contract');
assert.match(tracker, /className="ui-surface/, 'struggle tracker must use shared opaque surface contract');
assert.doesNotMatch(dashboard, /tour-(games|leagues)[^"`]*glass-surface/, 'secondary dashboard cards must not use glass');
assert.doesNotMatch(dashboard, /<h1[^>]*text-truncate/, 'dashboard greeting must not truncate on small phones');
assert.match(dashboard, /id="tour-checkin" className="dashboard-checkin-card/, 'check-in must expose compact mobile layout hook');
assert.match(utilities, /@media \(max-width: 575\.98px\)[\s\S]*?\.mobile-nav-label-full\s*\{\s*display:\s*none/, 'mobile dock must use short labels below 576px');
assert.match(utilities, /@media \(max-width: 375px\)[\s\S]*?\.dashboard-checkin-card[\s\S]*?padding:\s*0\.5rem/, 'check-in must compact below 376px to avoid dock overlap');

console.log('dashboard visual contract: ok');

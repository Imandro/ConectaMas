const fs = require('fs');
const assert = require('assert');

const files = {
  bible: 'app/dashboard/bible/page.tsx',
  devotionals: 'app/dashboard/devotionals/page.tsx',
  devotionalDetail: 'app/dashboard/devotionals/[id]/page.tsx',
  prayer: 'app/dashboard/prayer/PrayerWallView.tsx',
  forums: 'app/dashboard/forums/page.tsx',
  forumCategory: 'app/dashboard/forums/[categoryId]/page.tsx',
  friends: 'app/dashboard/friends/page.tsx',
  groups: 'app/dashboard/groups/page.tsx',
  leagues: 'app/dashboard/leagues/LeagueRankingView.tsx',
  profile: 'app/dashboard/profile/ProfileView.tsx',
};

const source = Object.fromEntries(Object.entries(files).map(([name, file]) => [name, fs.readFileSync(file, 'utf8')]));

for (const name of ['bible', 'devotionals', 'devotionalDetail', 'prayer', 'forums', 'forumCategory', 'friends', 'groups', 'leagues', 'profile']) {
  assert.match(source[name], /ui-page-header|ui-surface/, `${files[name]} needs a shared content surface`);
}
assert.match(source.prayer, /ui-state/, 'prayer empty state must use shared state surface');
assert.match(source.groups, /ui-state/, 'groups empty state must use shared state surface');
assert.match(source.devotionals, /ui-surface-glass/, 'devotional picker must use functional glass overlay');
assert.match(source.forumCategory, /ui-surface/, 'forum category content must use shared surface');

console.log('content surfaces: ok');

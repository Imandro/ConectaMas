/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

const auth = read('app/lib/auth.ts');
const apiAuth = read('app/lib/api-auth.ts');
const prisma = read('app/lib/prisma.ts');
const sessionRefresher = read('app/components/SessionRefresher.tsx');
const worker = read('scripts/run-notifications-worker.ts');
const nextConfig = read('next.config.js');
const appConfig = read('app/lib/config.ts');
const checkin = read('app/api/checkin/route.ts');
const push = read('app/components/PushNotificationManager.tsx');
const prompt = read('app/components/NotificationPrompt.tsx');
const categoryApi = read('app/api/forums/categories/route.ts');
const prayerApi = read('app/api/daily-prayer/route.ts');
const versesApi = read('app/api/verses/route.ts');
const bibleApi = read('app/api/bible/route.ts');
const triviaApi = read('app/api/trivia/daily/route.ts');
const triviaSubmitApi = read('app/api/trivia/submit/route.ts');
const notificationCountApi = read('app/api/notifications/count/route.ts');
const forumNotificationsApi = read('app/api/notifications/forum/route.ts');
const bibleRoute = read('app/api/bible/route.ts');
const heartbeatRoute = read('app/api/mascot/heartbeat/route.ts');
const qaRoute = read('app/api/notifications/qa-count/route.ts');
const qaAction = read('app/dashboard/actions/notifications.ts');
const dashboardNav = read('app/components/DashboardNav.tsx');
const billingProducts = read('app/api/billing/products/route.ts');
const billingMe = read('app/api/billing/me/route.ts');
const billingCheckout = read('app/api/billing/checkout/[provider]/route.ts');
const biblePage = read('app/dashboard/bible/page.tsx');
const dashboardPage = read('app/dashboard/page.tsx');
const supportFundingAd = read('app/dashboard/components/SupportFundingAd.tsx');
const premiumPage = read('app/dashboard/premium/page.tsx');
const packageJson = read('package.json');
const idOnlyRoutes = [
    read('app/api/challenge/complete/route.ts'),
    triviaApi,
    triviaSubmitApi,
    notificationCountApi,
    forumNotificationsApi,
    read('app/api/forums/mark-read/route.ts'),
    read('app/api/notifications/forum/mark-read/route.ts'),
    read('app/api/notifications/subscribe/route.ts'),
    read('app/api/struggles/[id]/route.ts'),
    read('app/api/struggles/toggle/route.ts'),
    read('app/api/struggles/create/route.ts'),
    read('app/api/devotionals/complete/route.ts'),
    read('app/api/onboarding/route.ts'),
    read('app/api/forums/posts/route.ts'),
    read('app/api/forums/posts/[id]/route.ts'),
    read('app/api/forums/posts/[id]/replies/route.ts'),
    read('app/api/auth/mobile/friends/route.ts'),
    read('app/api/auth/mobile/notifications/register/route.ts'),
];

assert.doesNotMatch(auth, /console\.log/);
assert.match(apiAuth, /export async function getApiUserId/);
assert.match(auth, /select:\s*\{[\s\S]*passwordHash:\s*true/);
assert.match(prisma, /process\.env\.NODE_ENV\s*===\s*'production'\s*\?\s*\['error'\]/);
assert.match(sessionRefresher, /SESSION_REFRESH_TTL/);
assert.match(sessionRefresher, /sessionStorage/);
assert.match(worker, /NOTIFICATIONS_BATCH_SIZE/);
assert.match(worker, /event:\s*'notification_batch'/);
assert.match(worker, /durationMs/);
assert.doesNotMatch(nextConfig, /urlPattern:\s*\/\\\/\.\*\//);
assert.doesNotMatch(appConfig, /VAPID_PRIVATE_KEY\s*\|\|\s*["'][^"']+["']/);
assert.doesNotMatch(checkin, /console\.log/);
assert.match(checkin, /getApiUserId/);
assert.doesNotMatch(`${appConfig}\n${push}\n${prompt}`, /BGBZ1Q1LwyPolkAPnsh/);
for (const source of [categoryApi, prayerApi, versesApi, bibleApi]) {
    assert.match(source, /Cache-Control/);
    assert.match(source, /public/);
}
assert.match(prayerApi, /getDailyPrayerForDate/);
assert.doesNotMatch(prayerApi, /@\/app\/lib\/prisma|prisma\./);
assert.match(versesApi, /versesData/);
assert.doesNotMatch(versesApi, /@\/app\/lib\/prisma|prisma\./);
assert.match(versesApi, /slice\(0, 10\)/);
assert.match(apiAuth, /WeakMap<Request/);
assert.match(billingCheckout, /getApiUser\(request/);
assert.doesNotMatch(billingCheckout, /getApiUserId/);
assert.match(triviaApi, /TRIVIA_QUESTION_SELECT/);
assert.doesNotMatch(triviaApi, /SELECT \* FROM ["']TriviaQuestion["']/);
assert.match(triviaSubmitApi, /select:\s*\{[\s\S]*correctIndex: true/);
assert.match(triviaSubmitApi, /mascot\.updateMany/);
assert.doesNotMatch(notificationCountApi, /lastForumCheck/);
assert.match(forumNotificationsApi, /post:\s*\{[\s\S]*id:\s*true/);
assert.match(bibleRoute, /BIBLE_DATA_CACHE/);
assert.match(bibleRoute, /readFileSync[\s\S]*BIBLE_DATA_CACHE/);
assert.match(heartbeatRoute, /updateMany/);
assert.match(heartbeatRoute, /updatedAt:\s*\{\s*lt:/);
assert.match(biblePage, /HEARTBEAT_TTL/);
assert.match(biblePage, /sessionStorage/);
assert.match(qaRoute, /getApiUserId/);
assert.match(qaRoute, /private, no-store/);
assert.match(qaAction, /userId\?:\s*string/);
assert.match(dashboardNav, /QA_COUNT_TTL/);
assert.match(dashboardNav, /sessionStorage/);
assert.match(billingProducts, /Cache-Control/);
assert.match(billingProducts, /public/);
assert.match(billingMe, /private, no-store/);
assert.match(dashboardPage, /DASHBOARD_STATS_TTL/);
assert.match(dashboardPage, /sessionStorage/);
assert.match(dashboardPage, /document\.hidden/);
assert.match(supportFundingAd, /BILLING_ME_TTL/);
assert.match(supportFundingAd, /sessionStorage/);
assert.match(premiumPage, /BILLING_ME_TTL/);
assert.match(premiumPage, /sessionStorage/);
assert.match(packageJson, /"build":\s*"prisma generate && next build"/);
assert.doesNotMatch(packageJson, /"build"[^\n]*prisma db push/);
for (const source of idOnlyRoutes) {
    assert.match(source, /getApiUserId/);
    assert.doesNotMatch(source, /from ['"]@\/app\/lib\/auth['"]/);
}

console.log('scalability guards: ok (auth payloads, route identity, session refresh, worker metrics, PWA cache)');

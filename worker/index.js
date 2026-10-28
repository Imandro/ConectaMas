const PAGE_CACHE_PREFIX = 'offline-pages-v1-';
const USER_CACHE_NAME = 'offline-user-v1';
const USER_MARKER_URL = '/__offline-user';
const MAX_CACHED_PAGES = 12;
const MAX_PAGE_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const CACHED_AT_HEADER = 'X-Conecta-Offline-Cached-At';
const OFFLINE_SNAPSHOT_HEADER = 'X-Conecta-Offline-Snapshot';

const STATIC_ROUTES = [
    '/dashboard/bible',
    '/dashboard/devotionals',
    '/dashboard/sos',
    '/dashboard/challenge',
    '/dashboard/games/verse-order',
    '/dashboard/games/speed-quiz',
    '/dashboard/games/fill-blank',
    '/dashboard/games/book-sort',
    '/dashboard/games/book-match',
    '/dashboard/games/memory',
    '/dashboard/games/character-event',
    '/dashboard/games/bible-order',
];

const SNAPSHOT_ROUTES = [
    '/dashboard',
    '/dashboard/profile',
    '/dashboard/luchas',
    '/dashboard/llami',
    '/dashboard/mascot',
    '/dashboard/prayer',
  '/dashboard/checkin',
];

let offlineUserKey = 'guest';
let offlineLanguage = 'es';
let offlineUserVersion = 0;
let userKeyLoaded = false;

function matchesRoute(pathname, route) {
    return pathname === route || (route !== '/dashboard' && pathname.startsWith(`${route}/`));
}

function isCacheableNavigation(request) {
    if (request.method !== 'GET' || request.mode !== 'navigate') return false;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin || url.search || url.pathname.startsWith('/api/')) return false;

    return STATIC_ROUTES.some((route) => matchesRoute(url.pathname, route)) ||
        SNAPSHOT_ROUTES.some((route) => matchesRoute(url.pathname, route));
}

function normalizeUserKey(value) {
    return value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || 'guest';
}

function normalizeLanguage(value) {
    return ['es', 'en', 'pt', 'ro'].includes(value) ? value : 'es';
}

async function getOfflineUserKey() {
    if (!userKeyLoaded) {
        const version = offlineUserVersion;
        try {
            const userCache = await caches.open(USER_CACHE_NAME);
            const marker = await userCache.match(USER_MARKER_URL);
            if (version === offlineUserVersion && marker) {
                const [storedKey, storedLanguage] = (await marker.text()).split('|');
                offlineUserKey = normalizeUserKey(storedKey);
                offlineLanguage = normalizeLanguage(storedLanguage);
            }
        } catch {
            // The guest key remains the safe fallback when storage is unavailable.
        }
        userKeyLoaded = true;
    }

    return offlineUserKey;
}

async function deleteOtherUserCaches(userKey) {
    const keys = await caches.keys();
    await Promise.all(
        keys
            .filter((key) => key.startsWith(PAGE_CACHE_PREFIX) && !key.startsWith(`${PAGE_CACHE_PREFIX}${userKey}-`))
            .map((key) => caches.delete(key))
    );
}

async function offlinePageFallback() {
    return (await caches.match('/offline')) || (await caches.match('/offline.html')) || new Response(
        '<h1>Sin conexión</h1><p>Conecta internet para cargar esta pantalla.</p>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
}

function canCacheResponse(response) {
    if (response.status !== 200) return false;
    const cacheControl = response.headers.get('Cache-Control') || '';
    const isOfflineSnapshot = response.headers.get(OFFLINE_SNAPSHOT_HEADER) === '1';
    return isOfflineSnapshot || !/\b(?:private|no-store)\b/i.test(cacheControl);
}

async function prunePageCache(cache) {
    const entries = [];
    const now = Date.now();

    for (const request of await cache.keys()) {
        const response = await cache.match(request);
        const cachedAt = Number(response?.headers.get(CACHED_AT_HEADER));
        if (!cachedAt || now - cachedAt > MAX_PAGE_AGE_MS) {
            await cache.delete(request);
            continue;
        }
        entries.push({ request, cachedAt });
    }

    entries.sort((a, b) => b.cachedAt - a.cachedAt);
    await Promise.all(entries.slice(MAX_CACHED_PAGES).map(({ request }) => cache.delete(request)));
}

async function cachePage(cache, request, response) {
    const cachedResponse = response.clone();
    const headers = new Headers(cachedResponse.headers);
    headers.set(CACHED_AT_HEADER, String(Date.now()));
    await cache.put(request, new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers,
    }));
    await prunePageCache(cache);
}

self.addEventListener('message', (event) => {
    if (event.data?.type !== 'OFFLINE_USER' || typeof event.data.key !== 'string') return;

    const nextKey = normalizeUserKey(event.data.key);
    const nextLanguage = normalizeLanguage(event.data.language);
    offlineUserKey = nextKey;
    offlineLanguage = nextLanguage;
    offlineUserVersion += 1;
    userKeyLoaded = true;
    const version = offlineUserVersion;

    event.waitUntil((async () => {
        try {
            const userCache = await caches.open(USER_CACHE_NAME);
            if (version !== offlineUserVersion) return;
            await userCache.put(USER_MARKER_URL, new Response(`${nextKey}|${nextLanguage}`));
            await deleteOtherUserCaches(nextKey);
        } catch {
            // Network requests still work if the browser rejects cache storage.
        }
    })());
});

self.addEventListener('fetch', (event) => {
    if (!isCacheableNavigation(event.request)) return;

    event.respondWith((async () => {
        const userKey = await getOfflineUserKey();
        const userVersion = offlineUserVersion;
        const cache = await caches.open(`${PAGE_CACHE_PREFIX}${userKey}-${offlineLanguage}`);

        try {
            const response = await fetch(event.request);
            if (userVersion !== offlineUserVersion) return offlinePageFallback();
            if (canCacheResponse(response)) {
                try {
                    await cachePage(cache, event.request, response);
                } catch {
                    // A cache quota error must not replace a valid network response.
                }
            }
            return response;
        } catch {
            if (userVersion !== offlineUserVersion) return offlinePageFallback();
            try {
                await prunePageCache(cache);
            } catch {
                // A pruning failure must not prevent the normal offline fallback.
            }
            return (await cache.match(event.request)) || (await offlinePageFallback());
        }
    })());
});

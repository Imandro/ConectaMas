// Conecta+ Service Worker
// This file is auto-generated during `next build` by next-pwa.
// Development fallback for PWA installability.

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).catch(() => {
                return new Response('Offline', { status: 503 });
            });
        })
    );
});

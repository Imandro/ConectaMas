/* eslint-disable @typescript-eslint/no-require-imports */

const isLocalStaticImage = ({ url, request }) =>
    request.method === 'GET' &&
    url.origin === self.location.origin &&
    !url.search &&
    /^\/(?:assets|images)\/.+\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url.pathname);

const isLocalBibleContent = ({ url, request }) =>
    request.method === 'GET' &&
    url.origin === self.location.origin &&
    !url.search &&
    url.pathname === '/bible/es_rvr.json';

const isStaticAsset = ({ url, request }) =>
    request.method === 'GET' &&
    url.origin === self.location.origin &&
    !url.search &&
    url.pathname.startsWith('/_next/static/') &&
    /\.(?:js|css)$/i.test(url.pathname);

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    dynamicStartUrl: false,
    fallbacks: {
        document: '/offline',
    },
    runtimeCaching: [
        {
            urlPattern: isLocalStaticImage,
            handler: 'CacheFirst',
            method: 'GET',
            options: {
                cacheName: 'static-images',
                expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
        },
        {
            urlPattern: isLocalBibleContent,
            handler: 'CacheFirst',
            method: 'GET',
            options: {
                cacheName: 'offline-content-v1',
                expiration: { maxEntries: 5, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
        },
        {
            urlPattern: isStaticAsset,
            handler: 'StaleWhileRevalidate',
            method: 'GET',
            options: {
                cacheName: 'static-assets',
                expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
        },
    ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: ['./app'],
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'ui-avatars.com'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    async headers() {
        return [
            {
                source: '/bible/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
            },
            {
                source: '/assets/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
            },
            {
                source: '/.well-known/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate'
                    }
                ]
            },
            {
                source: '/dashboard/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'private, no-store, must-revalidate' },
                    { key: 'X-Conecta-Offline-Snapshot', value: '1' },
                ]
            },
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
                    },
                    {
                        key: 'Service-Worker-Allowed',
                        value: '/'
                    }
                ]
            }
        ];
    },
};

module.exports = withPWA(nextConfig);

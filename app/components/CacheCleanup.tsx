"use client";

import { useEffect } from 'react';

const APP_VERSION = '2026-06-09-v2';
const VERSION_KEY = 'conectaplus_cache_version';

export default function CacheCleanup() {
  useEffect(() => {
    const prevVersion = localStorage.getItem(VERSION_KEY);
    if (prevVersion === APP_VERSION) return;

    const run = async () => {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }

      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      }

      localStorage.setItem(VERSION_KEY, APP_VERSION);
    };

    run();
  }, []);

  return null;
}

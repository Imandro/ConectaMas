"use client";

import { useEffect } from 'react';

const APP_VERSION = 'offline-v2-legal';
const VERSION_KEY = 'conectaplus_cache_version';
const LEGACY_CACHE_NAMES = ['pages', 'bible-api', 'bible-static-file', 'unsplash-images', 'offline-pages-v1'];

export default function CacheCleanup() {
  useEffect(() => {
    const prevVersion = localStorage.getItem(VERSION_KEY);
    if (prevVersion === APP_VERSION) return;

    const run = async () => {
      await clearLegacyCaches();

      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      }

      localStorage.setItem(VERSION_KEY, APP_VERSION);
    };

    run();
  }, []);

  return null;
}

export async function clearLegacyCaches() {
  if (!('caches' in window)) return;
  const keys = await caches.keys();
  await Promise.all(
    keys.filter((key) => LEGACY_CACHE_NAMES.some((legacy) => key === legacy || key.startsWith(`${legacy}-legacy`)))
      .map((key) => caches.delete(key))
  );
}

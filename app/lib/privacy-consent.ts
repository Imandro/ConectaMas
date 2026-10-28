export const ANALYTICS_CONSENT_KEY = 'conecta.analytics.consent';

export type AnalyticsConsent = 'accepted' | 'declined';

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === 'accepted' || value === 'declined' ? value : null;
}

export function setAnalyticsConsent(value: AnalyticsConsent) {
  if (typeof window !== 'undefined') window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
}

export async function clearClientPrivateData() {
  if (typeof window === 'undefined') return;
  window.localStorage.clear();
  window.sessionStorage.clear();
  if (window.indexedDB) await new Promise<void>((resolve) => {
    const request = window.indexedDB.deleteDatabase('conecta-plus-offline');
    request.onsuccess = request.onerror = request.onblocked = () => resolve();
  });
  if ('caches' in window) {
    const keys = await window.caches.keys();
    await Promise.all(keys
      .filter((key) => key === 'offline-user-v1' || key === 'offline-pages-v1' || key.startsWith('offline-pages-v1-'))
      .map((key) => window.caches.delete(key)));
  }
}

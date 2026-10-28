export type OfflineRouteKind = 'static' | 'snapshot' | 'online-only';

export type OfflineRoutePolicy = {
  kind: OfflineRouteKind;
  writes: boolean;
};

export type SnapshotEnvelope<T> = {
  key: string;
  route: string;
  userId: string;
  version: string;
  updatedAt: string;
  payload: T;
};

export const OFFLINE_CONTENT_VERSION = 'offline-v1';

const staticRoutes = [
  '/dashboard/bible',
  '/dashboard/devotionals',
  '/dashboard/sos',
  '/dashboard/challenge',
  '/dashboard/games/verse-order',
  '/dashboard/games/speed-quiz',
  '/dashboard/games/fill-blank',
  '/dashboard/games/book-sort',
  '/dashboard/games/book-match',
];

const snapshotRoutes = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/luchas',
  '/dashboard/llami',
  '/dashboard/mascot',
  '/dashboard/prayer',
  '/dashboard/checkin',
];

const onlineRoutes = [
  '/dashboard/forums',
  '/dashboard/groups',
  '/dashboard/friends',
  '/dashboard/notifications',
  '/dashboard/qa',
  '/dashboard/trivia',
  '/dashboard/games',
  '/api',
];

const matches = (pathname: string, route: string) =>
  pathname === route || (route !== '/dashboard' && pathname.startsWith(`${route}/`));

export function getOfflineRoutePolicy(pathname: string): OfflineRoutePolicy {
  if (staticRoutes.some((route) => matches(pathname, route))) {
    return { kind: 'static', writes: false };
  }
  if (onlineRoutes.some((route) => matches(pathname, route))) {
    return { kind: 'online-only', writes: false };
  }
  if (snapshotRoutes.some((route) => matches(pathname, route))) {
    return { kind: 'snapshot', writes: true };
  }
  return { kind: 'online-only', writes: false };
}

export function snapshotKey(pathname: string, userId = 'guest') {
  return [OFFLINE_CONTENT_VERSION, userId, pathname].map(encodeURIComponent).join(':');
}

export function isOfflineWriteBlocked(method: string, online: boolean) {
  return !online && !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());
}

import {
  OFFLINE_CONTENT_VERSION,
  SnapshotEnvelope,
  snapshotKey,
} from './offline';

export const OFFLINE_DB_NAME = 'conecta-plus-offline';
export const OFFLINE_DB_VERSION = 2;
export const SNAPSHOT_STORE_NAME = 'snapshots';
export const MUTATION_STORE_NAME = 'mutations';

export function openOfflineDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    let request: IDBOpenDBRequest;
    try {
      request = window.indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);
    } catch (error) {
      reject(error);
      return;
    }
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(SNAPSHOT_STORE_NAME)) {
        database.createObjectStore(SNAPSHOT_STORE_NAME, { keyPath: 'key' });
      }
      if (!database.objectStoreNames.contains(MUTATION_STORE_NAME)) {
        const mutations = database.createObjectStore(MUTATION_STORE_NAME, { keyPath: 'id' });
        mutations.createIndex('byUserId', 'userId', { unique: false });
        mutations.createIndex('byUserIdAndIdempotencyKey', ['userId', 'idempotencyKey'], { unique: true });
      }
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => reject(request.error || new Error('IndexedDB unavailable'));
  });
}

export async function saveSnapshot<T>(pathname: string, userId: string, data: T): Promise<boolean> {
  let database: IDBDatabase | null = null;
  try {
    database = await openOfflineDatabase();
    if (!database) return false;

    const envelope: SnapshotEnvelope<T> = {
      key: snapshotKey(pathname, userId),
      route: pathname,
      userId,
      version: OFFLINE_CONTENT_VERSION,
      updatedAt: new Date().toISOString(),
      payload: data,
    };

    await new Promise<void>((resolve, reject) => {
      const transaction = database!.transaction(SNAPSHOT_STORE_NAME, 'readwrite');
      const request = transaction.objectStore(SNAPSHOT_STORE_NAME).put(envelope);
      request.onerror = () => reject(request.error || new Error('Snapshot write failed'));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('Snapshot write failed'));
      transaction.onabort = () => reject(transaction.error || new Error('Snapshot write aborted'));
    });
    return true;
  } catch {
    return false;
  } finally {
    database?.close();
  }
}

function isSnapshotFor<T>(
  value: unknown,
  pathname: string,
  userId: string,
  key: string,
): value is SnapshotEnvelope<T> {
  if (!value || typeof value !== 'object') return false;
  const envelope = value as Partial<SnapshotEnvelope<T>>;
  return envelope.key === key &&
    envelope.route === pathname &&
    envelope.userId === userId &&
    envelope.version === OFFLINE_CONTENT_VERSION &&
    typeof envelope.updatedAt === 'string' &&
    Object.prototype.hasOwnProperty.call(envelope, 'payload');
}

export async function getSnapshot<T>(pathname: string, userId: string): Promise<SnapshotEnvelope<T> | null> {
  const key = snapshotKey(pathname, userId);
  let database: IDBDatabase | null = null;
  try {
    database = await openOfflineDatabase();
    if (!database) return null;

    const value = await new Promise<unknown>((resolve, reject) => {
      const request = database!.transaction(SNAPSHOT_STORE_NAME, 'readonly').objectStore(SNAPSHOT_STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('Snapshot read failed'));
    });
    return isSnapshotFor<T>(value, pathname, userId, key) ? value : null;
  } catch {
    return null;
  } finally {
    database?.close();
  }
}

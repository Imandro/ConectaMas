/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');

process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'CommonJS', moduleResolution: 'Node' });
require('ts-node/register/transpile-only');

class FakeRequest {
  constructor() {
    this.result = undefined;
    this.error = null;
    this.onsuccess = null;
    this.onerror = null;
  }

  succeed(result) {
    this.result = result;
    queueMicrotask(() => this.onsuccess?.({ target: this }));
  }
}

class FakeTransaction {
  constructor(database, mode) {
    this.database = database;
    this.mode = mode;
    this.oncomplete = null;
    this.onerror = null;
    this.onabort = null;
    this.failed = false;
  }

  objectStore(name) {
    return new FakeObjectStore(this, this.database.stores.get(name));
  }

  complete() {
    setTimeout(() => {
      if (!this.failed) this.oncomplete?.({ target: this });
    }, 0);
  }
}

class FakeIndex {
  constructor(store, definition) {
    this.store = store;
    this.definition = definition;
  }

  get(key) {
    const request = new FakeRequest();
    setTimeout(() => {
      request.succeed([...this.store.records.values()].find((value) => {
        const actual = this.keyFor(value);
        return JSON.stringify(actual) === JSON.stringify(key);
      }));
    }, 0);
    return request;
  }

  getAll(key) {
    const request = new FakeRequest();
    setTimeout(() => {
      const values = [...this.store.records.values()].filter((value) => {
        if (key === undefined) return true;
        return JSON.stringify(this.keyFor(value)) === JSON.stringify(key);
      });
      request.succeed(values.map((value) => structuredClone(value)));
    }, 0);
    return request;
  }

  keyFor(value) {
    return Array.isArray(this.definition.keyPath)
      ? this.definition.keyPath.map((field) => value[field])
      : value[this.definition.keyPath];
  }
}

class FakeObjectStore {
  constructor(transaction, store) {
    this.transaction = transaction;
    this.store = store;
  }

  createIndex(name, keyPath, options = {}) {
    this.store.indexes.set(name, { keyPath, unique: options.unique === true });
    return this.index(name);
  }

  index(name) {
    return new FakeIndex(this.store, this.store.indexes.get(name));
  }

  add(value) {
    return this.write(value, false);
  }

  put(value) {
    return this.write(value, true);
  }

  write(value, replace) {
    const request = new FakeRequest();
    setTimeout(() => {
      const key = value[this.store.keyPath];
      if (!replace && this.store.records.has(key)) {
        request.error = Object.assign(new Error('ConstraintError'), { name: 'ConstraintError' });
        request.onerror?.({ target: request, preventDefault() {} });
        return;
      }
      for (const definition of this.store.indexes.values()) {
        if (!definition.unique) continue;
        const candidate = JSON.stringify(new FakeIndex(this.store, definition).keyFor(value));
        const duplicate = [...this.store.records.values()].some((current) => {
          if (replace && current[this.store.keyPath] === key) return false;
          return JSON.stringify(new FakeIndex(this.store, definition).keyFor(current)) === candidate;
        });
        if (duplicate) {
          request.error = Object.assign(new Error('ConstraintError'), { name: 'ConstraintError' });
          request.onerror?.({ target: request, preventDefault() {} });
          return;
        }
      }
      this.store.records.set(key, structuredClone(value));
      request.succeed(key);
      this.transaction.complete();
    }, 0);
    return request;
  }

  get(key) {
    const request = new FakeRequest();
    setTimeout(() => {
      request.succeed(structuredClone(this.store.records.get(key)));
    }, 0);
    return request;
  }

  delete(key) {
    const request = new FakeRequest();
    setTimeout(() => {
      this.store.records.delete(key);
      request.succeed(undefined);
      this.transaction.complete();
    }, 0);
    return request;
  }
}

class FakeDatabase {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.stores = new Map();
    this.objectStoreNames = { contains: (storeName) => this.stores.has(storeName) };
  }

  createObjectStore(name, options) {
    const store = { keyPath: options.keyPath, records: new Map(), indexes: new Map() };
    this.stores.set(name, store);
    return new FakeObjectStore(new FakeTransaction(this, 'versionchange'), store);
  }

  transaction(storeName, mode) {
    return new FakeTransaction(this, mode);
  }

  close() {}
}

function createIndexedDB() {
  const databases = new Map();
  return {
    open(name, version) {
      const request = new FakeRequest();
      setTimeout(() => {
        let database = databases.get(name);
        const needsUpgrade = !database || version > database.version;
        if (!database) database = new FakeDatabase(name, version);
        if (needsUpgrade) {
          database.version = version;
          databases.set(name, database);
          request.result = database;
          request.onupgradeneeded?.({ target: request });
        }
        request.succeed(database);
      }, 0);
      return request;
    },
  };
}

global.window = { indexedDB: createIndexedDB() };

const { syncQueue } = require('../app/lib/syncQueue');
const { enqueueOfflineMutation, drainSyncQueue } = require('../app/lib/syncQueueProcessor');
const { getSnapshot, saveSnapshot } = require('../app/lib/offlineStore');

(async () => {
  const userA = `queue-user-a-${Date.now()}`;
  const userB = `queue-user-b-${Date.now()}`;
  const payload = { nested: { values: [1, 2, 3] }, enabled: true };

  const created = await syncQueue.enqueue({
    userId: userA,
    operation: 'create',
    route: '/api/example',
    payload,
    idempotencyKey: 'same-key',
  });

  assert.equal(created.status, 'pending');
  assert.equal(created.attempts, 0);
  assert.equal(created.lastError, null);
  assert.equal(typeof created.createdAt, 'string');
  assert.deepEqual((await syncQueue.list(userA))[0].payload, payload);

  assert.equal(await saveSnapshot('/dashboard', userA, { cached: true }), true);
  assert.deepEqual((await getSnapshot('/dashboard', userA)).payload, { cached: true });
  assert.equal(await saveSnapshot('/dashboard/sos', userA, { leaderPhone: '+50588880000' }), true);
  assert.deepEqual((await getSnapshot('/dashboard/sos', userA)).payload, { leaderPhone: '+50588880000' });
  assert.equal(await getSnapshot('/dashboard/sos', userB), null);
  assert.equal(await getSnapshot('/dashboard/sos', 'guest'), null);

  const duplicate = await syncQueue.enqueue({
    userId: userA,
    operation: 'create',
    route: '/api/example',
    payload: { changed: true },
    idempotencyKey: 'same-key',
  });
  assert.equal(duplicate.id, created.id);
  assert.equal((await syncQueue.list(userA)).length, 1);

  const otherUser = await syncQueue.enqueue({
    userId: userB,
    operation: 'create',
    route: '/api/example',
    payload: { owner: userB },
    idempotencyKey: 'same-key',
  });
  assert.notEqual(otherUser.id, created.id);
  assert.deepEqual((await syncQueue.list(userA)).map((item) => item.userId), [userA]);
  assert.deepEqual((await syncQueue.list(userB)).map((item) => item.userId), [userB]);

  const processing = await syncQueue.updateStatus(userA, created.id, 'processing');
  assert.equal(processing.status, 'processing');
  assert.equal(processing.attempts, 1);

  const failed = await syncQueue.updateStatus(userA, created.id, 'failed', 'network unavailable');
  assert.equal(failed.status, 'failed');
  assert.equal(failed.lastError, 'network unavailable');

  const done = await syncQueue.updateStatus(userA, created.id, 'done');
  assert.equal(done.status, 'done');
  assert.equal(done.lastError, null);

  assert.equal(await syncQueue.updateStatus(userB, created.id, 'done'), null);

  const retryUser = `queue-retry-user-${Date.now()}`;
  const queued = await enqueueOfflineMutation({
    userId: retryUser,
    operation: 'CHECK_IN',
    route: '/api/checkin',
    payload: { mood: '😄', dayKey: '2026-10-27' },
    idempotencyKey: 'retry-key',
  });
  assert.equal(queued.status, 'pending');

  let attempts = 0;
  const retryingFetch = async (_route, options) => {
    attempts += 1;
    assert.equal(options.headers['Idempotency-Key'], 'retry-key');
    if (attempts === 1) throw new TypeError('offline');
    return { ok: true, status: 201, json: async () => ({ message: 'ok' }) };
  };

  await drainSyncQueue(retryUser, { fetch: retryingFetch, sleep: async () => {} });
  assert.equal(attempts, 1);
  assert.equal((await syncQueue.list(retryUser, 'pending')).length, 1);
  await drainSyncQueue(retryUser, { fetch: retryingFetch, sleep: async () => {} });
  assert.equal(attempts, 2);
  assert.equal((await syncQueue.list(retryUser)).length, 0);

  console.log('sync queue: ok (serialization, states, user keys, snapshot isolation, deduplication, offline retry)');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

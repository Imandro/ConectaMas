import {
  MUTATION_STORE_NAME,
  openOfflineDatabase,
} from './offlineStore';

export type OfflineMutationStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface OfflineMutation<T = unknown> {
  id: string;
  userId: string;
  operation: string;
  route: string;
  payload: T;
  idempotencyKey: string;
  createdAt: string;
  status: OfflineMutationStatus;
  attempts: number;
  lastError: string | null;
}

type OfflineMutationInput<T> = Pick<
  OfflineMutation<T>,
  'userId' | 'operation' | 'route' | 'payload' | 'idempotencyKey'
>;

export interface syncQueue {
  enqueue<T>(mutation: OfflineMutationInput<T>): Promise<OfflineMutation<T>>;
  list<T = unknown>(userId: string, status?: OfflineMutationStatus): Promise<OfflineMutation<T>[]>;
  get<T = unknown>(userId: string, id: string): Promise<OfflineMutation<T> | null>;
  updateStatus<T = unknown>(
    userId: string,
    id: string,
    status: OfflineMutationStatus,
    lastError?: string | null,
  ): Promise<OfflineMutation<T> | null>;
  remove(userId: string, id: string): Promise<boolean>;
}

let idSequence = 0;

function required(value: string, name: string) {
  if (!value) throw new TypeError(`${name} is required`);
}

function validStatus(status: OfflineMutationStatus) {
  if (!['pending', 'processing', 'done', 'failed'].includes(status)) {
    throw new TypeError('status is invalid');
  }
}

function createId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
  idSequence += 1;
  return `${Date.now()}-${idSequence}`;
}

async function openQueueDatabase(): Promise<IDBDatabase> {
  const database = await openOfflineDatabase();
  if (!database) throw new Error('IndexedDB unavailable');
  return database;
}

function close(database: IDBDatabase) {
  database.close();
}

const queue = {
  async enqueue<T>(mutation: OfflineMutationInput<T>): Promise<OfflineMutation<T>> {
    required(mutation.userId, 'userId');
    required(mutation.operation, 'operation');
    required(mutation.route, 'route');
    required(mutation.idempotencyKey, 'idempotencyKey');

    const record: OfflineMutation<T> = {
      ...mutation,
      id: createId(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      attempts: 0,
      lastError: null,
    };
    const database = await openQueueDatabase();
    try {
      return await new Promise<OfflineMutation<T>>((resolve, reject) => {
        const transaction = database.transaction(MUTATION_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(MUTATION_STORE_NAME);
        const existingRequest = store.index('byUserIdAndIdempotencyKey').get([
          record.userId,
          record.idempotencyKey,
        ]);
        let settled = false;
        let added = false;
        const fail = (error: Event | Error | null) => {
          if (!settled) {
            settled = true;
            reject(error instanceof Error ? error : new Error('Mutation write failed'));
          }
        };

        existingRequest.onerror = () => fail(existingRequest.error);
        existingRequest.onsuccess = () => {
          if (existingRequest.result) {
            settled = true;
            resolve(existingRequest.result as OfflineMutation<T>);
            return;
          }

          const addRequest = store.add(record);
          addRequest.onerror = () => fail(addRequest.error);
          addRequest.onsuccess = () => { added = true; };
        };
        transaction.oncomplete = () => {
          if (added && !settled) {
            settled = true;
            resolve(record);
          }
        };
        transaction.onerror = () => fail(transaction.error);
        transaction.onabort = () => fail(transaction.error || new Error('Mutation write aborted'));
      });
    } finally {
      close(database);
    }
  },

  async list<T = unknown>(userId: string, status?: OfflineMutationStatus): Promise<OfflineMutation<T>[]> {
    required(userId, 'userId');
    const database = await openQueueDatabase();
    try {
      return await new Promise<OfflineMutation<T>[]>((resolve, reject) => {
        const request = database
          .transaction(MUTATION_STORE_NAME, 'readonly')
          .objectStore(MUTATION_STORE_NAME)
          .index('byUserId')
          .getAll(userId);
        request.onerror = () => reject(request.error || new Error('Mutation read failed'));
        request.onsuccess = () => {
          const records = (request.result as OfflineMutation<T>[])
            .filter((record) => !status || record.status === status)
            .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
          resolve(records);
        };
      });
    } finally {
      close(database);
    }
  },

  async get<T = unknown>(userId: string, id: string): Promise<OfflineMutation<T> | null> {
    required(userId, 'userId');
    required(id, 'id');
    const database = await openQueueDatabase();
    try {
      return await new Promise<OfflineMutation<T> | null>((resolve, reject) => {
        const request = database.transaction(MUTATION_STORE_NAME, 'readonly')
          .objectStore(MUTATION_STORE_NAME)
          .get(id);
        request.onerror = () => reject(request.error || new Error('Mutation read failed'));
        request.onsuccess = () => {
          const record = request.result as OfflineMutation<T> | undefined;
          resolve(record?.userId === userId ? record : null);
        };
      });
    } finally {
      close(database);
    }
  },

  async updateStatus<T = unknown>(
    userId: string,
    id: string,
    status: OfflineMutationStatus,
    lastError?: string | null,
  ): Promise<OfflineMutation<T> | null> {
    required(userId, 'userId');
    required(id, 'id');
    validStatus(status);
    const database = await openQueueDatabase();
    try {
      return await new Promise<OfflineMutation<T> | null>((resolve, reject) => {
        const transaction = database.transaction(MUTATION_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(MUTATION_STORE_NAME);
        const getRequest = store.get(id);
        let result: OfflineMutation<T> | null = null;
        getRequest.onerror = () => reject(getRequest.error || new Error('Mutation read failed'));
        getRequest.onsuccess = () => {
          const current = getRequest.result as OfflineMutation<T> | undefined;
          if (!current || current.userId !== userId) {
            resolve(null);
            return;
          }

          const updated: OfflineMutation<T> = {
            ...current,
            status,
            attempts: status === 'processing' ? current.attempts + 1 : current.attempts,
            lastError: status === 'processing' || status === 'done'
              ? null
              : lastError === undefined ? current.lastError : lastError,
          };
          result = updated;
          const putRequest = store.put(updated);
          putRequest.onerror = () => reject(putRequest.error || new Error('Mutation update failed'));
          putRequest.onsuccess = () => {};
        };
        transaction.oncomplete = () => {
          resolve(result);
        };
        transaction.onerror = () => reject(transaction.error || new Error('Mutation update failed'));
        transaction.onabort = () => reject(transaction.error || new Error('Mutation update aborted'));
      });
    } finally {
      close(database);
    }
  },

  async remove(userId: string, id: string): Promise<boolean> {
    const record = await this.get(userId, id);
    if (!record) return false;
    const database = await openQueueDatabase();
    try {
      return await new Promise<boolean>((resolve, reject) => {
        const transaction = database.transaction(MUTATION_STORE_NAME, 'readwrite');
        const request = transaction.objectStore(MUTATION_STORE_NAME).delete(id);
        request.onerror = () => reject(request.error || new Error('Mutation delete failed'));
        let deleted = false;
        request.onsuccess = () => { deleted = true; };
        transaction.oncomplete = () => resolve(deleted);
        transaction.onerror = () => reject(transaction.error || new Error('Mutation delete failed'));
        transaction.onabort = () => reject(transaction.error || new Error('Mutation delete aborted'));
      });
    } finally {
      close(database);
    }
  },
} satisfies syncQueue;

export const syncQueue: syncQueue = queue;

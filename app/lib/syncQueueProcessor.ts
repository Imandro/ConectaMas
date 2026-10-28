import { syncQueue, type OfflineMutation } from './syncQueue';

export const SYNC_STATUS_EVENT = 'conecta:sync-status';

export type SyncStatus = 'queued' | 'syncing' | 'done' | 'permanent-error';

export type SyncStatusDetail = {
    userId: string;
    status: SyncStatus;
    operation: string;
    message: string;
};

type EnqueueInput<T> = Pick<OfflineMutation<T>, 'userId' | 'operation' | 'route' | 'payload'> & { idempotencyKey?: string };
type ProcessorOptions = {
    fetch?: typeof fetch;
    sleep?: (milliseconds: number) => Promise<void>;
};

const drains = new Map<string, Promise<void>>();

export function createIdempotencyKey() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function announceSyncStatus(detail: SyncStatusDetail) {
    if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
    window.dispatchEvent(new CustomEvent<SyncStatusDetail>(SYNC_STATUS_EVENT, { detail }));
}

function assertQueueable(input: EnqueueInput<unknown>) {
    if (input.route === '/api/checkin' && input.operation === 'CHECK_IN') return;
    if (input.route === '/api/struggles/progress' && input.operation === 'STRUGGLE_PROGRESS') {
        const action = (input.payload as { action?: unknown } | null)?.action;
        if (action === 'ADVANCE' || action === 'OVERCOME') return;
    }
    throw new Error('Mutation is not supported by the offline sync queue');
}

export async function enqueueOfflineMutation<T>(input: EnqueueInput<T>) {
    assertQueueable(input as EnqueueInput<unknown>);
    const record = await syncQueue.enqueue({
        ...input,
        idempotencyKey: input.idempotencyKey || createIdempotencyKey(),
    });
    announceSyncStatus({
        userId: record.userId,
        status: 'queued',
        operation: record.operation,
        message: 'Guardado sin conexión. Se sincronizará al recuperar internet.',
    });
    return record;
}

function methodFor(record: OfflineMutation) {
    if (record.route === '/api/checkin') return 'POST';
    if (record.route === '/api/struggles/progress') return 'PATCH';
    throw new Error('Mutation route is not supported by the offline sync queue');
}

function isRetryable(status: number, body: unknown) {
    return (body as { retryable?: unknown } | null)?.retryable === true ||
        status === 408 || status === 425 || status === 429 || status >= 500;
}

async function readResponseBody(response: Response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

function messageFrom(body: unknown, fallback: string) {
    const message = (body as { message?: unknown } | null)?.message;
    return typeof message === 'string' && message ? message : fallback;
}

async function drainUser(userId: string, options: ProcessorOptions) {
    const request = options.fetch || fetch;
    const sleep = options.sleep || ((milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));
    const records = await syncQueue.list(userId);

    for (const record of records) {
        if (record.status === 'processing') {
            await syncQueue.updateStatus(userId, record.id, 'pending');
        }
    }

    for (const record of records.filter((item) => item.status === 'pending' || item.status === 'processing')) {
        if (typeof navigator !== 'undefined' && navigator.onLine === false) return;

        if (record.attempts > 0) {
            await sleep(Math.min(30000, 1000 * 2 ** Math.min(record.attempts - 1, 4)));
        }

        const processing = await syncQueue.updateStatus(userId, record.id, 'processing');
        if (!processing) continue;

        announceSyncStatus({
            userId,
            status: 'syncing',
            operation: record.operation,
            message: 'Sincronizando cambios guardados…',
        });

        try {
            const payload = record.payload as Record<string, unknown>;
            const response = await request(record.route, {
                method: methodFor(record),
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': record.idempotencyKey,
                    'X-Sync-Queue': '1',
                },
                body: JSON.stringify({ ...payload, idempotencyKey: record.idempotencyKey, offline: true }),
            });
            const body = await readResponseBody(response);

            if (response.ok) {
                await syncQueue.updateStatus(userId, record.id, 'done');
                await syncQueue.remove(userId, record.id);
                announceSyncStatus({
                    userId,
                    status: 'done',
                    operation: record.operation,
                    message: 'Cambios sincronizados.',
                });
                continue;
            }

            const message = messageFrom(body, `Error HTTP ${response.status}`);
            if (isRetryable(response.status, body)) {
                await syncQueue.updateStatus(userId, record.id, 'pending', message);
                announceSyncStatus({
                    userId,
                    status: 'queued',
                    operation: record.operation,
                    message: 'No se pudo conectar. Se reintentará automáticamente.',
                });
                return;
            }

            await syncQueue.updateStatus(userId, record.id, 'failed', message);
            announceSyncStatus({
                userId,
                status: 'permanent-error',
                operation: record.operation,
                message: `No se pudo sincronizar: ${message}`,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error de red';
            await syncQueue.updateStatus(userId, record.id, 'pending', message);
            announceSyncStatus({
                userId,
                status: 'queued',
                operation: record.operation,
                message: 'No se pudo conectar. Se reintentará automáticamente.',
            });
            return;
        }
    }
}

export function drainSyncQueue(userId: string, options: ProcessorOptions = {}) {
    if (!userId) return Promise.resolve();
    const active = drains.get(userId);
    if (active) return active;

    const current = drainUser(userId, options).finally(() => {
        if (drains.get(userId) === current) drains.delete(userId);
    });
    drains.set(userId, current);
    return current;
}

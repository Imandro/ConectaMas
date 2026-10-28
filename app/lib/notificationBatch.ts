export const DEFAULT_NOTIFICATION_BATCH_SIZE = 100;
export const MAX_NOTIFICATION_BATCH_SIZE = 500;
export const DEFAULT_NOTIFICATION_CONCURRENCY = 10;

export function normalizeNotificationBatchLimit(value?: string | number) {
    const parsed = typeof value === 'number' ? value : Number(value);

    if (!Number.isFinite(parsed)) return DEFAULT_NOTIFICATION_BATCH_SIZE;

    return Math.min(
        MAX_NOTIFICATION_BATCH_SIZE,
        Math.max(1, Math.floor(parsed)),
    );
}

export function normalizeNotificationConcurrency(value?: string | number) {
    const parsed = typeof value === 'number' ? value : Number(value);

    if (!Number.isFinite(parsed)) return DEFAULT_NOTIFICATION_CONCURRENCY;

    return Math.min(25, Math.max(1, Math.floor(parsed)));
}

export function takeNotificationBatch<T extends { id: string }>(items: T[], limit: number) {
    const hasMore = items.length > limit;
    const batch = items.slice(0, limit);

    return {
        items: batch,
        hasMore,
        nextCursor: hasMore ? batch[batch.length - 1]?.id ?? null : null,
    };
}

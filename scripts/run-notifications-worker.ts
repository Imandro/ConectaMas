import { prisma } from '../app/lib/prisma';
import { sendStoredNotifications } from '../app/lib/notifications';

async function main() {
    const startedAt = Date.now();
    const limit = process.env.NOTIFICATIONS_BATCH_SIZE;
    const concurrency = process.env.NOTIFICATIONS_CONCURRENCY;
    let cursor: string | undefined;
    let batches = 0;
    let sent = 0;
    let failed = 0;
    let expired = 0;
    let processed = 0;

    do {
        const batchStartedAt = Date.now();
        const result = await sendStoredNotifications({ cursor, limit, concurrency });
        if (!result.success) throw new Error(result.error);

        batches += 1;
        sent += result.sent;
        failed += result.failed;
        expired += result.expired;
        processed += result.processed;
        cursor = result.nextCursor || undefined;

        console.log(JSON.stringify({
            event: 'notification_batch',
            batch: batches,
            sent: result.sent,
            failed: result.failed,
            processed: result.processed,
            expired: result.expired,
            hasMore: result.hasMore,
            durationMs: Date.now() - batchStartedAt,
        }));
    } while (cursor);

    console.log(JSON.stringify({
        event: 'notification_worker_complete',
        complete: true,
        batches,
        sent,
        failed,
        expired,
        processed,
        durationMs: Date.now() - startedAt,
    }));
}

main()
    .catch((error) => {
        console.error(JSON.stringify({
            event: 'notification_worker_error',
            message: error instanceof Error ? error.message : String(error),
        }));
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

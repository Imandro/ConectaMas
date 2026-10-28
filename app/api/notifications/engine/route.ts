import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sendStoredNotifications } from '@/app/lib/notifications';
import { normalizeNotificationBatchLimit } from '@/app/lib/notificationBatch';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Endpoint de producción para disparar el motor de notificaciones.
 * Puede ser llamado por Vercel Cron o un servicio externo.
 * Usa Authorization: Bearer NOTIFICATIONS_ENGINE_SECRET.
 */
export async function GET(req: NextRequest) {
    const configuredSecret = process.env.NOTIFICATIONS_ENGINE_SECRET || process.env.CRON_SECRET;
    if (!configuredSecret) {
        return NextResponse.json({ error: "Notification worker is not configured" }, {
            status: 503,
            headers: { 'Cache-Control': 'no-store' },
        });
    }

    const providedSecret = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
        || req.headers.get('x-notifications-engine-secret');
    if (!providedSecret || !sameSecret(providedSecret, configuredSecret)) {
        return NextResponse.json({ error: "Unauthorized" }, {
            status: 401,
            headers: { 'Cache-Control': 'no-store' },
        });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor') || undefined;
    const rawLimit = searchParams.get('limit') || undefined;
    if (cursor && !/^[a-zA-Z0-9_-]{1,128}$/.test(cursor)) {
        return NextResponse.json({ error: "Invalid cursor" }, {
            status: 400,
            headers: { 'Cache-Control': 'no-store' },
        });
    }

    const result = await sendStoredNotifications({
        cursor,
        limit: normalizeNotificationBatchLimit(rawLimit),
    });

    if (result.success) {
        return NextResponse.json({
            message: "Notificaciones enviadas con éxito",
            sent: result.sent,
            failed: result.failed,
            processed: result.processed,
            expired: result.expired,
            hasMore: result.hasMore,
            nextCursor: result.nextCursor,
        }, { headers: { 'Cache-Control': 'no-store' } });
    } else {
        return NextResponse.json({
            error: "Error al enviar notificaciones",
        }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
    }
}

function sameSecret(provided: string, expected: string) {
    const providedBytes = Buffer.from(provided);
    const expectedBytes = Buffer.from(expected);

    return providedBytes.length === expectedBytes.length
        && timingSafeEqual(providedBytes, expectedBytes);
}

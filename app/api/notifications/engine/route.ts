import { NextRequest, NextResponse } from 'next/server';
import { sendStoredNotifications } from '@/app/lib/notifications';

/**
 * Endpoint de producción para disparar el motor de notificaciones.
 * Puede ser llamado por Vercel Cron o un servicio externo.
 * 
 * Uso: GET /api/notifications/engine?key=YOUR_NEXTAUTH_SECRET
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    // Seguridad básica: Comparar con el secreto de la app
    if (key !== process.env.NEXTAUTH_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendStoredNotifications();

    if (result.success) {
        return NextResponse.json({
            message: "Notificaciones enviadas con éxito",
            sent: result.sent
        });
    } else {
        return NextResponse.json({
            error: "Error al enviar notificaciones",
            details: result.error
        }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/app/lib/prisma";
import { getApiUserId } from '@/app/lib/api-auth';

/**
 * Recibe señales de actividad (latidos) para otorgar puntos de llama.
 * Se llama desde la página de Biblia cada minuto de lectura activa.
 */
export async function POST(req: NextRequest) {
    try {
        const userId = await getApiUserId(req);
        if (!userId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { type } = await req.json(); // type: "BIBLE_READING"

        if (type === "BIBLE_READING") {
            const minimumHeartbeatTime = new Date(Date.now() - 50000);
            const updated = await prisma.mascot.updateMany({
                where: { userId, updatedAt: { lt: minimumHeartbeatTime } },
                data: {
                    flamePoints: { increment: 1 }
                }
            });

            if (updated.count === 0) {
                return NextResponse.json({ success: false, error: "Frecuencia demasiado alta" });
            }

            // Actualizar el "seguimiento" de lectura bíblica
            const { updateBibleReadingProgress } = await import("@/app/dashboard/bible/actions");
            await updateBibleReadingProgress(userId);

            return NextResponse.json({ success: true, pointsEarned: 1 });
        }

        return NextResponse.json({ success: false, error: "Tipo de actividad no reconocido" });
    } catch (error) {
        console.error("Error in Mascot Heartbeat:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

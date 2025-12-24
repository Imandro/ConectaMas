import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

/**
 * Recibe señales de actividad (latidos) para otorgar puntos de llama.
 * Se llama desde la página de Biblia cada minuto de lectura activa.
 */
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { type } = await req.json(); // type: "BIBLE_READING"

        if (type === "BIBLE_READING") {
            const prismaAny = prisma as any;

            // --- OPTIMIZACIÓN DE RECURSOS (RATE LIMITING) ---
            // Solo permitir 1 latido por minuto (50s margen)
            const mascot = await prismaAny.mascot.findUnique({
                where: { userId },
                select: { lastActivity: true, updatedAt: true } // Usaremos updatedAt como proxy si no hay lastHeartbeat
            });

            if (mascot && mascot.updatedAt) {
                const now = new Date().getTime();
                const last = new Date(mascot.updatedAt).getTime();
                if (now - last < 50000) { // 50 segundos
                    return NextResponse.json({ success: false, error: "Frecuencia demasiado alta" });
                }
            }
            // ------------------------------------------------

            // Otorgar 1 punto de llama por cada latido (minuto de lectura)
            await prismaAny.mascot.update({
                where: { userId },
                data: {
                    flamePoints: { increment: 1 }
                }
            });

            // Actualizar el "seguimiento" de lectura bíblica
            const { updateBibleReadingProgress } = await import("@/app/dashboard/bible/actions");
            await updateBibleReadingProgress();

            return NextResponse.json({ success: true, pointsEarned: 1 });
        }

        return NextResponse.json({ success: false, error: "Tipo de actividad no reconocido" });
    } catch (error) {
        console.error("Error in Mascot Heartbeat:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

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
            // Otorgar 1 punto de llama por cada latido (minuto de lectura)
            await (prisma as any).mascot.update({
                where: { userId },
                data: {
                    flamePoints: { increment: 1 }
                }
            });

            return NextResponse.json({ success: true, pointsEarned: 1 });
        }

        return NextResponse.json({ success: false, error: "Tipo de actividad no reconocido" });
    } catch (error) {
        console.error("Error in Mascot Heartbeat:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

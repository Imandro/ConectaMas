"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Obtiene o crea un ítem de seguimiento para la lectura bíblica
 */
export async function getBibleReadingStruggle() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const userId = (session.user as { id: string }).id;
    const title = "Lectura Bíblica";

    let struggle = await prisma.userStruggle.findUnique({
        where: { userId_title: { userId, title } }
    });

    if (!struggle) {
        struggle = await (prisma.userStruggle as any).create({
            data: {
                userId,
                title,
                status: "ACTIVE",
                currentDay: 1,
                completedDays: "",
                gravity: 1, // Baja gravedad para seguimiento positivo
            }
        });
    }

    return JSON.parse(JSON.stringify(struggle));
}

/**
 * Actualiza el progreso de lectura bíblica
 * Se basa en "Flame Points" o "Latidos" para avanzar días si se lee lo suficiente
 */
export async function updateBibleReadingProgress(providedUserId?: string) {
    let userId = providedUserId;

    if (!userId) {
        const session = await auth();
        if (!session?.user?.id) return;
        userId = (session.user as { id: string }).id;
    }
    const title = "Lectura Bíblica";

    const mascot = await (prisma as any).mascot.findUnique({ where: { userId } });
    if (!mascot) return;

    // Supongamos que cada 15 puntos de llama (15 min de lectura) equivalen a un "día" de progreso en el tracker
    // Esto es simbólico para dar feedback en el seguimiento
    const currentDay = Math.min(Math.floor(mascot.flamePoints / 15) + 1, 7);

    await (prisma.userStruggle as any).upsert({
        where: { userId_title: { userId, title } },
        update: {
            currentDay: currentDay >= 7 ? 7 : currentDay
        },
        create: {
            userId,
            title,
            status: "ACTIVE",
            currentDay: currentDay >= 7 ? 7 : currentDay,
            startDate: new Date(),
            gravity: 1
        }
    });

    revalidatePath("/dashboard");
}

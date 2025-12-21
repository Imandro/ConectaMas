"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Obtiene o crea la mascota del usuario actual
 */
export async function getOrCreateMascot() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const userId = (session.user as any).id;

    let mascot = await (prisma as any).mascot.findUnique({
        where: { userId }
    });

    if (!mascot) {
        mascot = await (prisma as any).mascot.create({
            data: {
                userId,
                name: "Llami",
                level: 1,
                experience: 0,
                flamePoints: 10, // Puntos iniciales de cortesía
            }
        });
    }

    return mascot;
}

/**
 * Alimenta a Llami usando puntos de llama
 */
export async function feedMascot() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    const userId = (session.user as any).id;
    const mascot = await (prisma as any).mascot.findUnique({ where: { userId } });

    if (!mascot || mascot.flamePoints < 5) {
        return { success: false, error: "No tienes suficientes Puntos de Llama. ¡Lee la Biblia para ganar más!" };
    }

    const xpToAdd = 20;
    let newExp = mascot.experience + xpToAdd;
    let newLevel = mascot.level;

    // Lógica simple de niveles (100 XP por nivel)
    if (newExp >= 100) {
        newLevel += 1;
        newExp -= 100;
    }

    await (prisma as any).mascot.update({
        where: { userId },
        data: {
            experience: newExp,
            level: newLevel,
            flamePoints: mascot.flamePoints - 5,
            lastFed: new Date(),
            mood: "FELIZ"
        }
    });

    revalidatePath("/dashboard/llami");
    return { success: true, levelUp: newLevel > mascot.level };
}

/**
 * Agrega experiencia por completar actividades
 */
export async function addMascotXP(amount: number) {
    const session = await auth();
    if (!session?.user?.id) return;

    const userId = (session.user as any).id;
    const mascot = await getOrCreateMascot();

    if (!mascot) return;

    let newExp = mascot.experience + amount;
    let newLevel = mascot.level;

    if (newExp >= 100) {
        newLevel += 1;
        newExp -= 100;
    }

    await (prisma as any).mascot.update({
        where: { userId },
        data: {
            experience: newExp,
            level: newLevel
        }
    });

    revalidatePath("/dashboard/llami");
}

/**
 * Agrega puntos de llama por lectura
 */
export async function addFlamePoints(amount: number) {
    const session = await auth();
    if (!session?.user?.id) return;

    const userId = (session.user as any).id;
    const mascot = await getOrCreateMascot();

    if (!mascot) return;

    await (prisma as any).mascot.update({
        where: { userId },
        data: {
            flamePoints: mascot.flamePoints + amount
        }
    });

    revalidatePath("/dashboard/llami");
}

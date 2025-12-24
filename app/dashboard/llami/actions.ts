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
        where: { userId },
        include: {
            user: {
                select: {
                    hasSeenLlamiTutorial: true
                }
            }
        }
    });

    if (!mascot) {
        mascot = await (prisma as any).mascot.create({
            data: {
                userId,
                name: "Llami",
                level: 1,
                experience: 0,
                flamePoints: 10,
            },
            include: {
                user: {
                    select: {
                        hasSeenLlamiTutorial: true
                    }
                }
            }
        });
    }

    return mascot;
}

/**
 * Marca el tutorial de Llami como completado para el usuario
 */
export async function completeLlamiTutorial() {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    const userId = (session.user as any).id;

    await prisma.user.update({
        where: { id: userId },
        data: { hasSeenLlamiTutorial: true }
    });

    revalidatePath("/dashboard/llami");
    return { success: true };
}

/**
 * Actualiza el nombre de la mascota
 */
export async function updateMascotName(newName: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    if (!newName || newName.trim().length < 2 || newName.trim().length > 15) {
        return { success: false, error: "El nombre debe tener entre 2 y 15 caracteres." };
    }

    const userId = (session.user as any).id;

    await (prisma as any).mascot.update({
        where: { userId },
        data: {
            name: newName.trim()
        }
    });

    revalidatePath("/dashboard/llami");
    revalidatePath("/dashboard"); // Update dashboard widget too
    return { success: true };
}

/**
 * Alimenta a Llami usando puntos de llama
 */
export async function feedMascot() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    const userId = (session.user as any).id;
    const mascot = await (prisma as any).mascot.findUnique({ where: { userId } });

    if (!mascot) return { success: false, error: "No se encontró a Llami" };

    // --- COOLDOWN (OPTIMIZACIÓN) ---
    const lastFed = new Date(mascot.lastFed);
    const now = new Date();
    const hoursSinceLastFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastFed < 4) {
        const remainingHours = Math.ceil(4 - hoursSinceLastFed);
        return { success: false, error: `Llami está lleno. Intenta alimentarlo en ${remainingHours} ${remainingHours === 1 ? 'hora' : 'horas'}.` };
    }

    if (mascot.flamePoints < 5) {
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

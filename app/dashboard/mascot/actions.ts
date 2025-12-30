"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateMascotOutfit(outfitId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    const userId = session.user.id;
    const allowedOutfits = ["none", "glasses", "bow", "cap", "scarf", "headphones"];

    if (!allowedOutfits.includes(outfitId)) {
        return { success: false, error: "Outfit inválido" };
    }

    let mascot = await prisma.mascot.findUnique({
        where: { userId }
    });

    // Auto-create if not exists (migrating existing users)
    if (!mascot) {
        mascot = await prisma.mascot.create({
            data: {
                userId,
                name: session.user.name || "Llami",
                outfit: "none",
                // Set lastChange to creation time minus 15 days so they can pick their first outfit immediately
                lastOutfitChange: new Date(Date.now() - (15 * 24 * 60 * 60 * 1000))
            }
        });
    }

    // Check 14 days cooldown
    const now = new Date();
    const lastChange = new Date(mascot.lastOutfitChange);

    // Calculate unlock date
    const cooldownPeriod = 14 * 24 * 60 * 60 * 1000; // 14 days in ms
    const unlockDate = new Date(lastChange.getTime() + cooldownPeriod);

    // Strict 14-day rule check
    // If we are currently BEFORE the unlock date
    if (now < unlockDate) {
        // Allow change ONLY if the current outfit is 'none' (first time setup scenario logic, 
        // though we handled it via date backdating above, this double checks).
        // Actually, if we backdated, now > unlockDate so this block won't run.
        // If they already changed it recently, this block runs.

        const daysLeft = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { success: false, error: `¡Llami está descansando! Espera ${daysLeft} días para cambiar su look.` };
    }

    await prisma.mascot.update({
        where: { userId },
        data: {
            outfit: outfitId,
            lastOutfitChange: new Date()
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/mascot"); // Ensure specific path revalidates
    return { success: true };
}

export async function getMascotData() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const mascot = await prisma.mascot.findUnique({
        where: { userId: session.user.id }
    });

    return mascot;
}

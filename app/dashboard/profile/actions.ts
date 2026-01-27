"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function resetAccount() {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    // Reset onboarding flag and maybe clear struggles for demo purposes
    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            hasCompletedOnboarding: false,
            spiritualLevel: "EXPLORING"
        }
    });

    revalidatePath("/dashboard");
}

export async function deleteAccount() {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.user.delete({
        where: { email: session.user.email }
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    redirect("/auth/login");
}

export async function updateProfileImage(base64Image: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    // --- OPTIMIZACIÓN DE RECURSOS (NEON DB PROT) ---
    // Limitar imagen a ~100KB (base64 length is approx 1.33 * bytes)
    if (base64Image.length > 200000) { // Increased limit slightly
        throw new Error("Imagen demasiado pesada. Máximo 150KB aprox.");
    }
    // ------------------------------------------------

    await prisma.user.update({
        where: { email: session.user.email },
        data: { image: base64Image }
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/profile');
}

export async function updateLeaderPhone(phone: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.user.update({
        where: { email: session.user.email },
        data: { leaderPhone: phone }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/sos");
}

export async function completeTutorialTour() {
    const session = await auth();
    if (!session?.user?.email) return;

    await prisma.user.update({
        where: { email: session.user.email },
        data: { hasSeenTutorialTour: true }
    });

    revalidatePath("/dashboard");
}

export async function updateUsername(newUsername: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, errorKey: "unauthorized" };

    if (!newUsername || newUsername.trim().length < 3 || newUsername.trim().length > 20) {
        return { success: false, errorKey: "username_length_error" };
    }

    // Simple format check (alphanumeric)
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
        return { success: false, errorKey: "username_format_error" };
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { lastUsernameChange: true }
    });

    // Check 3-day cooldown
    if (user?.lastUsernameChange) {
        const lastChange = new Date(user.lastUsernameChange);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        if (lastChange > threeDaysAgo) {
            const daysLeft = 3 - Math.floor((new Date().getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
            return { success: false, errorKey: "username_cooldown", errorParams: [daysLeft] };
        }
    }

    // Check uniqueness
    const existing = await prisma.user.findUnique({
        where: { username: newUsername }
    });
    if (existing && existing.id !== userId) {
        return { success: false, errorKey: "username_taken" };
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            username: newUsername,
            lastUsernameChange: new Date()
        }
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
}

export async function updateName(newName: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, errorKey: "unauthorized" };

    if (!newName || newName.trim().length < 2 || newName.trim().length > 50) {
        return { success: false, errorKey: "name_length_error" };
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { name: newName }
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
}

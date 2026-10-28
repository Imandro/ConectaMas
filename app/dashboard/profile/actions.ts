"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { isLanguage, type Language } from "@/app/lib/languages";
import { deleteUserAccount } from "@/app/lib/account/data-rights";
import { hasCurrentLegalConsent } from "@/app/lib/legal/consent";

async function requireCurrentLegalUser() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    if (!await hasCurrentLegalConsent(session.user.id)) throw new Error("LEGAL_CONSENT_REQUIRED");
    return session.user.id;
}

export async function updatePreferredLanguage(language: Language) {
    if (!isLanguage(language)) return { success: false, error: "Invalid language" };

    const userId = await requireCurrentLegalUser();

    await prisma.user.update({
        where: { id: userId },
        data: { preferredLanguage: language },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/profile");
    return { success: true };
}

export async function resetAccount() {
    const userId = await requireCurrentLegalUser();

    // Reset onboarding flag and maybe clear struggles for demo purposes
    await prisma.user.update({
        where: { id: userId },
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

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    if (!user) throw new Error("User not found");
    await deleteUserAccount(user.id);

    revalidatePath("/");
    revalidatePath("/dashboard");
}



export async function updateLeaderPhone(phone: string) {
    const userId = await requireCurrentLegalUser();

    await prisma.user.update({
        where: { id: userId },
        data: { leaderPhone: phone }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/sos");
}

export async function completeTutorialTour() {
    const session = await auth();
    if (!session?.user?.id || !await hasCurrentLegalConsent(session.user.id)) return;

    await prisma.user.update({
        where: { id: session.user.id },
        data: { hasSeenTutorialTour: true }
    });

    revalidatePath("/dashboard");
}

export async function updateUsername(newUsername: string) {
    const userId = await requireCurrentLegalUser();

    if (!newUsername || newUsername.trim().length < 3 || newUsername.trim().length > 20) {
        return { success: false, errorKey: "username_length_error" };
    }

    // Simple format check (alphanumeric)
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
        return { success: false, errorKey: "username_format_error" };
    }

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
    const userId = await requireCurrentLegalUser();

    if (!newName || newName.trim().length < 2 || newName.trim().length > 50) {
        return { success: false, errorKey: "name_length_error" };
    }

    await prisma.user.update({
        where: { id: userId },
        data: { name: newName }
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
}

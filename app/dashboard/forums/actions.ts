"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markCommunityTutorialSeen() {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    const userId = (session.user as any).id;

    await (prisma as any).user.update({
        where: { id: userId },
        data: { hasSeenCommunityTutorial: true }
    });

    revalidatePath("/dashboard/forums");
    return { success: true };
}

export async function getCommunityTutorialStatus() {
    const session = await auth();
    if (!session?.user?.id) return false;

    // Use any to bypass type check if schema update isn't picked up yet by editor, though we ran generate
    const user = await (prisma as any).user.findUnique({
        where: { id: (session.user as any).id },
        select: { hasSeenCommunityTutorial: true }
    });

    return user?.hasSeenCommunityTutorial ?? false;
}

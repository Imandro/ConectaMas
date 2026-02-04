"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPrayerRequest(content: string, isAnonymous: boolean, isGlobal: boolean = true) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const request = await prisma.prayerRequest.create({
            data: {
                userId: session.user.id,
                content,
                isAnonymous,
                isGlobal,
            }
        });

        revalidatePath("/dashboard/prayer");
        return { success: true, request };
    } catch (error) {
        console.error("Error creating prayer request:", error);
        return { success: false, error: "Failed to create request" };
    }
}

export async function getGlobalPrayers() {
    try {
        const prayers = await prisma.prayerRequest.findMany({
            where: { isGlobal: true },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { name: true }
                },
                _count: {
                    select: { prayers: true }
                }
            },
            take: 20
        });

        return { success: true, prayers };
    } catch (error) {
        console.error("Error fetching prayers:", error);
        return { success: false, error: "Failed to fetch prayers" };
    }
}

export async function prayForRequest(requestId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        // Check if already prayed
        const existing = await prisma.prayerUpdate.findFirst({
            where: {
                userId: session.user.id,
                requestId
            }
        });

        if (existing) return { success: false, error: "Already prayed" };

        await prisma.prayerUpdate.create({
            data: {
                userId: session.user.id,
                requestId
            }
        });

        await prisma.prayerRequest.update({
            where: { id: requestId },
            data: {
                prayCount: { increment: 1 }
            }
        });

        revalidatePath("/dashboard/prayer");
        return { success: true };
    } catch (error) {
        console.error("Error praying for request:", error);
        return { success: false, error: "Failed to record prayer" };
    }
}

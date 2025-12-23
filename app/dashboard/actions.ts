"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";

const prismaAny = prisma as any;

export async function getStrugglePlan(title: string) {
    try {
        const plan = await prismaAny.strugglePlan.findFirst({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive'
                }
            },
            include: {
                days: {
                    orderBy: {
                        dayNumber: 'asc'
                    }
                }
            }
        });
        return plan;
    } catch (error) {
        console.error("Error fetching struggle plan:", error);
        return null;
    }
}

export async function advanceStruggleDay(userStruggleId: string, completedDay: number) {
    try {
        const session = await auth();
        if (!session?.user) throw new Error("Unauthorized");

        const userStruggle = await prismaAny.userStruggle.findUnique({
            where: { id: userStruggleId }
        });

        if (!userStruggle) throw new Error("Struggle not found");

        // Update completed days string (comma separated)
        let completedDaysArray = userStruggle.completedDays ? userStruggle.completedDays.split(',') : [];
        if (!completedDaysArray.includes(completedDay.toString())) {
            completedDaysArray.push(completedDay.toString());
        }

        // Calculate next currentDay
        const nextDay = Math.min(completedDay + 1, 7);

        const updated = await prismaAny.userStruggle.update({
            where: { id: userStruggleId },
            data: {
                completedDays: completedDaysArray.join(','),
                currentDay: nextDay
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/luchas");
        return { success: true, struggle: updated };
    } catch (error) {
        console.error("Error advancing struggle day:", error);
        return { success: false, error: "Failed to update progress" };
    }
}

export async function markStruggleAsOvercome(userStruggleId: string) {
    try {
        const session = await auth();
        if (!session?.user) throw new Error("Unauthorized");

        const updated = await prismaAny.userStruggle.update({
            where: { id: userStruggleId },
            data: {
                status: "vencido",
                currentDay: 7 // Ensure it's marked as finished
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/luchas");
        return { success: true, struggle: updated };
    } catch (error) {
        console.error("Error marking struggle as overcome:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function toggleStruggleStatus(id: string, status: string) {
    try {
        const session = await auth();
        if (!session?.user) throw new Error("Unauthorized");

        const updated = await prismaAny.userStruggle.update({
            where: { id },
            data: { status }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/luchas");
        return { success: true, struggle: updated };
    } catch (error) {
        console.error("Error toggling struggle status:", error);
        return { success: false };
    }
}

export async function startStrugglePlan(id: string) {
    try {
        const session = await auth();
        if (!session?.user) throw new Error("Unauthorized");

        const updated = await prismaAny.userStruggle.update({
            where: { id },
            data: {
                isStarted: true,
                startDate: new Date()
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/luchas");
        return { success: true, struggle: updated };
    } catch (error) {
        console.error("Error starting struggle plan:", error);
        return { success: false };
    }
}

export async function createStruggle(title: string) {
    try {
        const session = await auth();
        if (!session?.user) throw new Error("Unauthorized");

        const userId = (session.user as any).id;

        const struggle = await prismaAny.userStruggle.create({
            data: {
                userId,
                title,
                status: "ACTIVE",
                currentDay: 1,
                completedDays: "",
                isStarted: false
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/luchas");
        return { success: true, struggle };
    } catch (error) {
        console.error("Error creating struggle:", error);

        return { success: false };
    }
}

export async function updateAge(age: number) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const userId = (session.user as any).id;

    await prismaAny.user.update({
        where: { id: userId },
        data: { age }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
}

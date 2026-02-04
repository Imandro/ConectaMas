"use server"

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLeagueRanking() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { league: true }
        });

        if (!user) return { success: false, error: "User not found" };

        const ranking = await prisma.user.findMany({
            where: { league: user.league },
            orderBy: [
                { weeklyXP: "desc" },
                { totalXP: "desc" }
            ],
            select: {
                id: true,
                name: true,

                weeklyXP: true,
                league: true
            },
            take: 50
        });

        return { success: true, ranking, userLeague: user.league };
    } catch (e) {
        return { success: false, error: "Database error" };
    }
}

export async function awardXP(amount: number, reason: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                weeklyXP: { increment: amount },
                totalXP: { increment: amount }
            }
        });

        // Possibly log the reason if we had an XPLog table

        revalidatePath("/dashboard/leagues");
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function resetWeeklyLeagues() {
    // This would normally be called by a CRON job every Sunday at midnight
    // For now, we provide it as a manually triggerable action for admins
    const session = await auth();
    // if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    try {
        const leagues = ["BRONZE", "SILVER", "GOLD", "DIAMOND", "LEGEND"];

        for (const leagueName of leagues) {
            const users = await prisma.user.findMany({
                where: { league: leagueName },
                orderBy: { weeklyXP: "desc" },
                select: { id: true, weeklyXP: true }
            });

            if (users.length === 0) continue;

            // Promotion (Top 3) - except for LEGEND
            if (leagueName !== "LEGEND") {
                const nextLeague = leagues[leagues.indexOf(leagueName) + 1];
                const top3 = users.slice(0, 3);
                await prisma.user.updateMany({
                    where: { id: { in: top3.map((u: any) => u.id) } },
                    data: { league: nextLeague }
                });
            }

            // Demotion (Bottom 3) - except for BRONZE
            if (leagueName !== "BRONZE") {
                const prevLeague = leagues[leagues.indexOf(leagueName) - 1];
                const bottom3 = users.length > 5 ? users.slice(-3) : [];
                await prisma.user.updateMany({
                    where: { id: { in: bottom3.map((u: any) => u.id) } },
                    data: { league: prevLeague }
                });
            }
        }

        // Reset all weekly XP
        await prisma.user.updateMany({
            data: { weeklyXP: 0 }
        });

        revalidatePath("/dashboard/leagues");
        return { success: true };
    } catch (e) {
        console.error("Failed to reset leagues:", e);
        return { success: false };
    }
}

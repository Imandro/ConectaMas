"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function saveGameScore(
    gameType: string,
    score: number,
    maxScore: number | null,
    timeSpent: number | null
) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const userId = session.user.id;

        const gameScore = await prisma.gameScore.create({
            data: {
                userId,
                gameType,
                score,
                maxScore,
                timeSpent,
            },
        });

        // Update totalXP and weeklyXP
        const xpGained = Math.round((score / Math.max(maxScore || 1, 1)) * 10) + (timeSpent ? Math.max(0, 10 - Math.floor(timeSpent / 30)) : 0);
        await prisma.user.update({
            where: { id: userId },
            data: {
                totalXP: { increment: xpGained },
                weeklyXP: { increment: xpGained },
            },
        });

        // Get user's best score for this game type
        const bestScore = await prisma.gameScore.findFirst({
            where: { userId, gameType },
            orderBy: { score: "desc" },
        });

        const isNewRecord = bestScore ? score >= bestScore.score : true;

        return {
            success: true,
            xpGained,
            isNewRecord,
            gameScore: { id: gameScore.id, score: gameScore.score },
        };
    } catch (error) {
        console.error("Error saving game score:", error);
        return { success: false, error: "Failed to save score" };
    }
}

export async function getBestScores(gameType: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const bestScore = await prisma.gameScore.findFirst({
            where: { userId: session.user.id, gameType },
            orderBy: { score: "desc" },
        });

        const recentScores = await prisma.gameScore.findMany({
            where: { userId: session.user.id, gameType },
            orderBy: { createdAt: "desc" },
            take: 5,
        });

        return {
            success: true,
            bestScore: bestScore?.score ?? 0,
            totalGames: recentScores.length,
            recentScores,
        };
    } catch (error) {
        console.error("Error getting best scores:", error);
        return { success: false, error: "Failed to get scores" };
    }
}

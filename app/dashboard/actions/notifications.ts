"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function getUnreadQACount() {
    const session = await auth();
    if (!session?.user?.id) return 0;

    try {
        // Count questions created in the last 24 hours that the user hasn't viewed
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const newQuestionsCount = await prisma.question.count({
            where: {
                createdAt: { gte: oneDayAgo },
                userId: { not: session.user.id } // Don't count user's own questions
            }
        });

        // Count new answers to user's questions
        const newAnswersCount = await prisma.answer.count({
            where: {
                createdAt: { gte: oneDayAgo },
                question: {
                    userId: session.user.id
                },
                userId: { not: session.user.id } // Don't count user's own answers
            }
        });

        return newQuestionsCount + newAnswersCount;
    } catch (error) {
        console.error("Error getting unread Q&A count:", error);
        return 0;
    }
}

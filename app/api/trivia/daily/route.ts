import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const userId = session.user.id;
        const prismaAny = prisma as any;

        // 1. Get failed attempts (isCorrect === false)
        const failedAttempts = await prismaAny.userTriviaAttempt.findMany({
            where: { userId, isCorrect: false },
            include: { question: true },
            take: 5
        });

        const questionsFromFailed = failedAttempts.map((a: any) => a.question);

        let selectedQuestions = [...questionsFromFailed];

        // 2. If we need more questions, get new ones (never attempted or correct but different day)
        if (selectedQuestions.length < 5) {
            const excludedIds = selectedQuestions.map(q => q.id);

            // Get already correctly answered IDs to deprioritize them
            const correctAttempts = await prismaAny.userTriviaAttempt.findMany({
                where: { userId, isCorrect: true },
                select: { questionId: true }
            });
            const correctIds = correctAttempts.map((a: any) => a.questionId);
            excludedIds.push(...correctIds);

            const remainingNeeded = 5 - selectedQuestions.length;

            // Fetch new questions
            const newQuestions = await prismaAny.triviaQuestion.findMany({
                where: {
                    id: { notIn: excludedIds }
                },
                take: remainingNeeded
            });

            selectedQuestions.push(...newQuestions);
        }

        // 3. Fallback: If still less than 5 (user answered everything correctly), pick random ones
        if (selectedQuestions.length < 5) {
            const excludedIds = selectedQuestions.map(q => q.id);
            const remainingNeeded = 5 - selectedQuestions.length;

            const recycledQuestions = await prismaAny.triviaQuestion.findMany({
                where: {
                    id: { notIn: excludedIds }
                },
                take: remainingNeeded
            });

            selectedQuestions.push(...recycledQuestions);
        }

        // Final slice just in case
        const finalQuestions = selectedQuestions.slice(0, 5).map(q => ({
            ...q,
            options: JSON.parse(q.options) // Parse JSON string back to array
        }));

        return NextResponse.json(finalQuestions);
    } catch (error: any) {
        console.error("Error fetching daily trivia:", error);
        return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
    }
}

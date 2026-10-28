import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';

export async function POST(req: Request) {
    try {
        const userId = await getApiUserId(req);
        if (!userId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { questionId, selectedIndex } = await req.json();

        const question = await prisma.triviaQuestion.findUnique({
            where: { id: questionId },
            select: {
                correctIndex: true,
                explanation: true,
                reference: true,
            },
        });

        if (!question) {
            return NextResponse.json({ error: "Pregunta no encontrada" }, { status: 404 });
        }

        const isCorrect = question.correctIndex === selectedIndex;

        // --- OPTIMIZACIÓN RECURSOS & ANTI-CHEAT ---
        // Verificar si ya respondió bien antes para no dar XP doble
        const previousAttempt = await prisma.userTriviaAttempt.findUnique({
            where: {
                userId_questionId: { userId, questionId }
            },
            select: { isCorrect: true },
        });

        const alreadyCorrect = previousAttempt?.isCorrect === true;
        // ------------------------------------------

        // 1. Record the attempt (Upsert: update if exists, create if not)
        await prisma.userTriviaAttempt.upsert({
            where: {
                userId_questionId: {
                    userId,
                    questionId
                }
            },
            update: {
                isCorrect,
                attemptDate: new Date()
            },
            create: {
                userId,
                questionId,
                isCorrect
            }
        });

        // 2. If correct AND NOT already correctly answered before, reward Llami
        if (isCorrect && !alreadyCorrect) {
            await prisma.mascot.updateMany({
                where: { userId },
                data: {
                    experience: { increment: 5 },
                    flamePoints: { increment: 2 },
                    lastFed: new Date(), // Alimentar a Llami
                }
            });

            // Award XP to user for ranking
            await prisma.user.update({
                where: { id: userId },
                data: {
                    weeklyXP: { increment: 5 },
                    totalXP: { increment: 5 }
                }
            });
        }

        return NextResponse.json({
            isCorrect,
            correctIndex: question.correctIndex,
            explanation: question.explanation,
            reference: question.reference
        });
    } catch (error: unknown) {
        console.error("Error submitting trivia:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Error interno",
        }, { status: 500 });
    }
}

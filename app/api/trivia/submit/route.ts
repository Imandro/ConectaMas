import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { questionId, selectedIndex } = await req.json();
        const userId = session.user.id;
        const prismaAny = prisma as any;

        const question = await prismaAny.triviaQuestion.findUnique({
            where: { id: questionId }
        });

        if (!question) {
            return NextResponse.json({ error: "Pregunta no encontrada" }, { status: 404 });
        }

        const isCorrect = question.correctIndex === selectedIndex;

        // 1. Record the attempt (Upsert: update if exists, create if not)
        await prismaAny.userTriviaAttempt.upsert({
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

        // 2. If correct, reward Llami
        if (isCorrect) {
            const mascot = await prismaAny.mascot.findUnique({
                where: { userId }
            });

            if (mascot) {
                await prismaAny.mascot.update({
                    where: { userId },
                    data: {
                        experience: { increment: 5 },
                        flamePoints: { increment: 2 },
                        lastFed: new Date() // Alimentar a Llami
                    }
                });
            }
        }

        return NextResponse.json({
            isCorrect,
            correctIndex: question.correctIndex,
            explanation: question.explanation,
            reference: question.reference
        });
    } catch (error: any) {
        console.error("Error submitting trivia:", error);
        return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
    }
}

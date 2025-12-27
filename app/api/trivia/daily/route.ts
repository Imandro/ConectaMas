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

            // Fetch new questions - RANDOMIZED
            // Use safer query approach for potential DB differences
            const excludedIdsList = excludedIds.length ? excludedIds : ['NONE'];

            let newQuestions: any[] = [];
            try {
                // Try randomized fetch via raw query
                newQuestions = await prisma.$queryRaw`
                    SELECT * FROM "TriviaQuestion" 
                    WHERE "id" NOT IN (${excludedIdsList}) 
                    ORDER BY RANDOM() 
                    LIMIT ${remainingNeeded}
                ` as any[];
            } catch (rawError) {
                console.error("Raw query failed, falling back to findMany:", rawError);
                // Fallback if raw query fails
                newQuestions = await prisma.triviaQuestion.findMany({
                    where: { id: { notIn: excludedIds } },
                    take: remainingNeeded
                });
            }

            selectedQuestions.push(...newQuestions);
        }

        // 3. Fallback: If still less than 5, pick random ones
        if (selectedQuestions.length < 5) {
            const excludedIds = selectedQuestions.map(q => q.id);
            const remainingNeeded = 5 - selectedQuestions.length;

            const recycledQuestions = await prismaAny.triviaQuestion.findMany({
                where: { id: { notIn: excludedIds } },
                take: remainingNeeded
            });

            selectedQuestions.push(...recycledQuestions);
        }

        // Final slice and safe parsing
        const finalQuestions = selectedQuestions.slice(0, 5).map(q => {
            // Raw queries might return lowercase field names in some DB providers
            const questionData = {
                id: q.id || q.ID,
                question: q.question || q.QUESTION,
                options: q.options || q.OPTIONS,
                correctIndex: q.correctIndex !== undefined ? q.correctIndex : q.correctindex,
                explanation: q.explanation || q.EXPLANATION,
                reference: q.reference || q.REFERENCE,
                difficulty: q.difficulty || q.DIFFICULTY
            };

            let parsedOptions = [];
            try {
                parsedOptions = typeof questionData.options === 'string'
                    ? JSON.parse(questionData.options)
                    : questionData.options;
            } catch (pError) {
                console.error("Error parsing options for question:", questionData.id, pError);
                parsedOptions = ["Opción 1", "Opción 2", "Opción 3", "Opción 4"];
            }

            return {
                ...questionData,
                options: Array.isArray(parsedOptions) ? parsedOptions : ["Error", "Error", "Error", "Error"]
            };
        });

        return NextResponse.json(finalQuestions);
    } catch (error: any) {
        console.error("Error fetching daily trivia:", error);
        return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
    }
}

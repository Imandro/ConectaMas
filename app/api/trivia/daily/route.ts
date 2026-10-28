import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';

const TRIVIA_QUESTION_SELECT = {
    id: true,
    question: true,
    options: true,
    correctIndex: true,
    explanation: true,
    reference: true,
    difficulty: true,
};

type TriviaQuestionRow = {
    id: string;
    question: string;
    options: string;
    correctIndex: number;
    explanation: string | null;
    reference: string | null;
    difficulty: string;
};

export async function GET() {
    try {
        const userId = await getApiUserId();
        if (!userId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // 1. Get failed attempts (isCorrect === false)
        const failedAttempts = await prisma.userTriviaAttempt.findMany({
            where: { userId, isCorrect: false },
            select: { question: { select: TRIVIA_QUESTION_SELECT } },
            take: 5
        });

        const questionsFromFailed = failedAttempts.map((a: { question: TriviaQuestionRow }) => a.question);

        const selectedQuestions = [...questionsFromFailed];

        // 2. If we need more questions, get new ones (never attempted or correct but different day)
        if (selectedQuestions.length < 5) {
            const excludedIds = selectedQuestions.map(q => q.id);

            // Get already correctly answered IDs to deprioritize them
            const correctAttempts = await prisma.userTriviaAttempt.findMany({
                where: { userId, isCorrect: true },
                select: { questionId: true }
            });
            const correctIds = correctAttempts.map((a) => a.questionId);
            excludedIds.push(...correctIds);

            const remainingNeeded = 5 - selectedQuestions.length;

            // Fetch new questions - RANDOMIZED
            // Use safer query approach for potential DB differences
            const excludedIdsList = excludedIds.length ? excludedIds : ['NONE'];

            let newQuestions: TriviaQuestionRow[] = [];
            try {
                // Try randomized fetch via raw query
                newQuestions = await prisma.$queryRaw<TriviaQuestionRow[]>`
                    SELECT "id", "question", "options", "correctIndex", "explanation", "reference", "difficulty"
                    FROM "TriviaQuestion"
                    WHERE "id" NOT IN (${excludedIdsList}) 
                    ORDER BY RANDOM() 
                    LIMIT ${remainingNeeded}
                `;
            } catch (rawError) {
                console.error("Raw query failed, falling back to findMany:", rawError);
                // Fallback if raw query fails
                newQuestions = await prisma.triviaQuestion.findMany({
                    where: { id: { notIn: excludedIds } },
                    select: TRIVIA_QUESTION_SELECT,
                    take: remainingNeeded,
                }) as TriviaQuestionRow[];
            }

            selectedQuestions.push(...newQuestions);
        }

        // 3. Fallback: If still less than 5, pick random ones
        if (selectedQuestions.length < 5) {
            const excludedIds = selectedQuestions.map(q => q.id);
            const remainingNeeded = 5 - selectedQuestions.length;

            const recycledQuestions = await prisma.triviaQuestion.findMany({
                where: { id: { notIn: excludedIds } },
                select: TRIVIA_QUESTION_SELECT,
                take: remainingNeeded,
            });

            selectedQuestions.push(...recycledQuestions);
        }

        // Final slice and safe parsing
        const finalQuestions = selectedQuestions.slice(0, 5).map((questionData: TriviaQuestionRow) => {
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
    } catch (error: unknown) {
        console.error("Error fetching daily trivia:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Error interno",
        }, { status: 500 });
    }
}

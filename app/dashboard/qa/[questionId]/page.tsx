import { getQuestionDetails } from "../actions";
import QuestionDetailView from "./QuestionDetailView";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        questionId: string;
    }
}

export async function generateMetadata({ params }: PageProps) {
    const question = await getQuestionDetails(params.questionId);
    if (!question) return { title: "Pregunta no encontrada" };
    return {
        title: `${question.title} | Conecta+`,
    };
}

export default async function QuestionDetailPage({ params }: PageProps) {
    const question = await getQuestionDetails(params.questionId);

    if (!question) {
        notFound();
    }

    return <QuestionDetailView question={question} />;
}

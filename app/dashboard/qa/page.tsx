import { getQuestions } from "./actions";
import QAView from "./QAView";

interface PageProps {
    searchParams: {
        filter?: string;
    }
}

export const metadata = {
    title: "Comunidad Q&A | Conecta+",
    description: "Preguntas y Respuestas para crecimiento espiritual"
};

export default async function QAPage({ searchParams }: PageProps) {
    const filter = (searchParams.filter === 'trending' ? 'trending' : 'recent') as 'trending' | 'recent';
    const questions = await getQuestions(filter);

    return <QAView initialQuestions={questions} filter={filter} />;
}

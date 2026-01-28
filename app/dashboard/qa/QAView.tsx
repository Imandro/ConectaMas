"use client";

import { useState } from "react";
import { MessageCircle, Flame, Clock, Plus } from "lucide-react";
import QuestionCard from "./components/QuestionCard";
import AskQuestionModal from "./components/AskQuestionModal";
import Link from "next/link";
import { useLanguage } from "@/app/LanguageContext";

interface QAViewProps {
    initialQuestions: any[];
    filter: 'trending' | 'recent';
}

export default function QAView({ initialQuestions, filter }: QAViewProps) {
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="container-fluid py-4 animate-fade-in">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 className="fw-bold text-secondary mb-1">{t.qa.title}</h1>
                    <p className="text-muted small mb-0">{t.qa.subtitle}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary fw-bold rounded-pill d-flex align-items-center gap-2 shadow-sm"
                >
                    <Plus size={18} />
                    <span className="d-none d-md-inline">{t.qa.ask_button}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="d-flex align-items-center gap-2 mb-4 overflow-x-auto pb-2">
                <Link
                    href="/dashboard/qa?filter=recent"
                    className={`btn btn-sm rounded-pill fw-bold border px-3 d-flex align-items-center gap-2 ${filter === 'recent' ? 'btn-dark text-white' : 'btn-white text-muted bg-white'}`}
                >
                    <Clock size={16} />
                    {t.qa.filter_recent}
                </Link>
                <Link
                    href="/dashboard/qa?filter=trending"
                    className={`btn btn-sm rounded-pill fw-bold border px-3 d-flex align-items-center gap-2 ${filter === 'trending' ? 'btn-warning text-dark' : 'btn-white text-muted bg-white'}`}
                >
                    <Flame size={16} />
                    {t.qa.filter_trending}
                </Link>
            </div>

            {/* List */}
            <div className="row">
                <div className="col-12 col-md-8 col-lg-6 mx-auto">
                    {initialQuestions.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <MessageCircle size={48} className="mb-3 opacity-25" />
                            <p>{t.qa.empty_state}</p>
                            <button onClick={() => setIsModalOpen(true)} className="btn btn-link">{t.qa.be_first}</button>
                        </div>
                    ) : (
                        initialQuestions.map(q => (
                            <QuestionCard key={q.id} question={q} />
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            <AskQuestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

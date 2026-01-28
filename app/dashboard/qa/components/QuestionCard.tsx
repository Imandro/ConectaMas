"use client";

import Link from "next/link";
import { MessageSquare, Heart, Eye } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";

interface QuestionCardProps {
    question: {
        id: string;
        title: string;
        content: string;
        views: number;
        likes: number;
        createdAt: Date;
        user: {
            name: string | null;
            image: string | null;
            profileType?: string | null;
        };
        _count: {
            answers: number;
        };
        tags: string | null;
    };
}

export default function QuestionCard({ question }: QuestionCardProps) {
    const { t } = useLanguage();

    // Parse tags if string
    let tags: string[] = [];
    try {
        if (question.tags) tags = JSON.parse(question.tags);
    } catch (e) { }

    return (
        <Link href={`/dashboard/qa/${question.id}`} className="text-decoration-none">
            <div className="card border-0 shadow-sm mb-3 rounded-4 hover-shadow transition-all">
                <div className="card-body">
                    {/* Header */}
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <div
                            className="rounded-circle overflow-hidden bg-light"
                            style={{ width: 24, height: 24 }}
                        >
                            {question.user.image ? (
                                <img src={question.user.image} alt={question.user.name || "User"} className="w-100 h-100 object-fit-cover" />
                            ) : (
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-primary text-white text-xs fw-bold">
                                    {question.user.name?.[0] || "U"}
                                </div>
                            )}
                        </div>
                        <span className="small text-muted fw-medium">
                            {question.user.name}
                            {question.user.profileType === 'COOPERATOR' && <span className="ms-1 badge bg-info text-dark" style={{ fontSize: '0.6rem' }}>{t.qa.user_badge_coop}</span>}
                        </span>
                        <span className="small text-muted ms-auto">
                            {new Date(question.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Content */}
                    <h5 className="fw-bold text-dark mb-2">{question.title}</h5>
                    <p className="text-secondary small mb-3 line-clamp-2">
                        {question.content}
                    </p>

                    {/* Footer */}
                    <div className="d-flex align-items-center gap-3 text-muted small">
                        <div className="d-flex align-items-center gap-1">
                            <Heart size={14} />
                            <span>{question.likes}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <MessageSquare size={14} />
                            <span>{question._count.answers}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1 ms-auto">
                            <Eye size={14} />
                            <span>{question.views}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

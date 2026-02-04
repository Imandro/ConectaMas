"use client";

import { Heart, CheckCircle } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { likeAnswer } from "../actions";
import { useState } from "react";
import toast from "react-hot-toast";

interface AnswerCardProps {
    answer: {
        id: string;
        content: string;
        createdAt: Date;
        likes: number;
        isAccepted: boolean;
        user: {
            name: string | null;
            image: string | null;
            profileType?: string | null;
        };
    };
    isOwner?: boolean; // If current user owns the question (to accept answer - Future)
}

export default function AnswerCard({ answer }: AnswerCardProps) {
    const { t } = useLanguage();
    const [likes, setLikes] = useState(answer.likes);
    const [hasLiked, setHasLiked] = useState(false); // Local optimist

    const handleLike = async () => {
        if (hasLiked) return;
        setLikes(p => p + 1);
        setHasLiked(true);
        // @ts-ignore
        await likeAnswer(answer.id, (answer as any).questionId);
    };

    return (
        <div className={`card mb-3 rounded-4 border-0 shadow-sm ${answer.isAccepted ? 'border border-success border-2' : ''}`}>
            <div className="card-body p-3">
                <div className="d-flex gap-3">
                    {/* User Avatar */}
                    <div
                        className="rounded-circle overflow-hidden bg-light flex-shrink-0"
                        style={{ width: 32, height: 32 }}
                    >
                        {answer.user.image ? (
                            <img src={answer.user.image} alt={answer.user.name || "User"} className="w-100 h-100 object-fit-cover" />
                        ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary text-white fw-bold">
                                {answer.user.name?.[0] || "U"}
                            </div>
                        )}
                    </div>

                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                            <span className="fw-bold small">
                                {answer.user.name}
                                {answer.user.profileType === 'COOPERATOR' && <span className="ms-1 badge bg-info text-dark" style={{ fontSize: '0.6rem' }}>{t.qa.user_badge_coop}</span>}
                            </span>
                            <span className="text-muted small" style={{ fontSize: '0.7rem' }}>
                                {new Date(answer.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <p className="small text-dark mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                            {answer.content}
                        </p>

                        <div className="d-flex align-items-center gap-3">
                            <button
                                onClick={handleLike}
                                className={`btn btn-sm p-0 d-flex align-items-center gap-1 ${hasLiked ? 'text-danger' : 'text-muted'}`}
                                disabled={hasLiked}
                            >
                                <Heart size={14} fill={hasLiked ? "currentColor" : "none"} />
                                <span className="small">{likes}</span>
                            </button>

                            {answer.isAccepted && (
                                <span className="text-success small fw-bold d-flex align-items-center gap-1">
                                    <CheckCircle size={14} />
                                    {t.qa.accepted}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

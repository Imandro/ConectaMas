"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send, MessageSquare, Heart, CheckCircle, Share2, Eye } from "lucide-react";
import AnswerCard from "../components/AnswerCard";
import Link from "next/link";
import { useLanguage } from "@/app/LanguageContext";
import { submitAnswer, likeQuestion, incrementQuestionViews } from "../actions";
import { toast } from "react-hot-toast";
import UserAvatar from "@/app/components/UserAvatar";

interface QuestionDetailViewProps {
    question: any;
}

export default function QuestionDetailView({ question }: QuestionDetailViewProps) {
    const { t } = useLanguage();
    const [answerContent, setAnswerContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [likes, setLikes] = useState(question.likes);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        incrementQuestionViews(question.id);
    }, [question.id]);

    const handleLikeQuestion = async () => {
        if (hasLiked) return;
        setLikes(likes + 1);
        setHasLiked(true);
        await likeQuestion(question.id);
    };

    const handleSubmitAnswer = async () => {
        if (answerContent.length < 5) return;
        setIsSubmitting(true);
        try {
            const res = await submitAnswer(question.id, answerContent);
            if (res.success) {
                toast.success(t.qa.answer_sent);
                setAnswerContent("");
                // Ideally we optimistically add it, but revalidatePath works closely enough
            } else {
                toast.error(t.qa.error_sending);
            }
        } catch (e) {
            toast.error("Error de conexión");
        } finally {
            setIsSubmitting(false);
        }
    };

    const tags = question.tags ? JSON.parse(question.tags) : [];

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <Link href="/dashboard/qa" className="btn btn-link text-muted p-0 mb-3 d-inline-flex align-items-center gap-2 text-decoration-none">
                <ArrowLeft size={18} />
                {t.qa.back_link}
            </Link>

            <div className="row">
                {/* Question Column */}
                <div className="col-12 col-lg-8 mx-auto">
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-4">
                            {/* Author Header */}
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <UserAvatar name={question.user.name} size={40} />
                                <div>
                                    <h6 className="fw-bold mb-0 text-dark">
                                        {question.user.name}
                                        {question.user.profileType === 'COOPERATOR' && <span className="ms-2 badge bg-warning text-dark small">{t.qa.user_badge_coop}</span>}
                                    </h6>
                                    <small className="text-muted d-flex align-items-center gap-1">
                                        {new Date(question.createdAt).toLocaleDateString()} ·
                                        <Eye size={12} className="ms-1" /> {question.views} {t.qa.views}
                                    </small>
                                </div>
                            </div>

                            <h3 className="fw-bold text-dark mb-3">{question.title}</h3>
                            <p className="text-secondary lead fs-6 mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                                {question.content}
                            </p>

                            {/* Tags */}
                            {tags.length > 0 && (
                                <div className="d-flex gap-2 mb-4">
                                    {tags.map((tag: string, i: number) => (
                                        <span key={i} className="badge bg-light text-muted border fw-normal px-3 py-2 rounded-pill">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="d-flex align-items-center gap-4 pt-3 border-top">
                                <button
                                    onClick={handleLikeQuestion}
                                    className={`btn btn-light rounded-pill px-3 d-flex align-items-center gap-2 ${hasLiked ? 'text-danger bg-danger-subtle' : 'text-muted'}`}
                                >
                                    <Heart size={18} fill={hasLiked ? "currentColor" : "none"} />
                                    <span className="fw-bold">{likes}</span>
                                </button>
                                <div className="d-flex align-items-center gap-2 text-muted">
                                    <MessageSquare size={18} />
                                    <span className="fw-bold">{question.answers.length}</span> {t.qa.answers_count}
                                </div>
                                <button className="btn btn-link text-muted ms-auto">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Answer Form */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4 bg-light">
                        <div className="card-body p-3">
                            <div className="d-flex gap-3">
                                <div className="flex-grow-1">
                                    <textarea
                                        className="form-control border-0 bg-white mb-2"
                                        rows={2}
                                        placeholder={t.qa.placeholder_answer}
                                        value={answerContent}
                                        onChange={(e) => setAnswerContent(e.target.value)}
                                        style={{ resize: 'none' }}
                                    />
                                    <div className="d-flex justify-content-end">
                                        <button
                                            onClick={handleSubmitAnswer}
                                            disabled={!answerContent.trim() || isSubmitting}
                                            className="btn btn-primary rounded-pill px-4 fw-bold btn-sm"
                                        >
                                            {isSubmitting ? t.qa.submitting : t.qa.submit_answer}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Answers List */}
                    <h5 className="fw-bold text-muted mb-3 ps-2">{t.qa.answers_count} ({question.answers.length})</h5>

                    {question.answers.length === 0 ? (
                        <div className="text-center py-5 text-muted bg-white rounded-4 shadow-sm border-0">
                            <p className="mb-0">{t.qa.be_first_answer}</p>
                        </div>
                    ) : (
                        question.answers.map((ans: any) => (
                            <AnswerCard key={ans.id} answer={ans} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

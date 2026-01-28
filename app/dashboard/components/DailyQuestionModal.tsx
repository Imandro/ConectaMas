"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useLanguage } from '@/app/LanguageContext';

interface DailyQuestionModalProps {
    questions: any[];
    isOpen: boolean;
    onClose: () => void;
}

export default function DailyQuestionModal({ questions, isOpen, onClose }: DailyQuestionModalProps) {
    const { t } = useLanguage();
    if (!isOpen || questions.length === 0) return null;

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 z-index-modal d-flex align-items-center justify-content-center p-3 animate-fade-in" style={{ zIndex: 1060 }}>
            <div className="bg-white rounded-4 shadow-lg w-100 overflow-hidden animate-scale-in" style={{ maxWidth: 500 }}>
                {/* Header */}
                <div className="bg-primary text-white p-4 position-relative overflow-hidden">
                    <div className="position-relative z-1">
                        <h4 className="fw-bold mb-1">{t.qa.daily_modal.title}</h4>
                        <p className="mb-0 opacity-75 small">{t.qa.daily_modal.subtitle}</p>
                    </div>
                    <Flame size={120} className="position-absolute opacity-25" style={{ right: -20, bottom: -40, transform: 'rotate(-20deg)' }} />
                    <button
                        onClick={onClose}
                        className="position-absolute top-0 end-0 m-3 btn btn-sm btn-white bg-white bg-opacity-25 text-white rounded-circle p-2 border-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="p-3">
                    {questions.map((q, i) => (
                        <div key={q.id} className="card border-0 shadow-sm mb-3 hover-scale transition-all">
                            <Link href={`/dashboard/qa/${q.id}`} className="text-decoration-none text-dark" onClick={onClose}>
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="fw-bold fs-4 text-primary lh-1">#{i + 1}</div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1 line-clamp-2">{q.title}</h6>
                                            <div className="d-flex align-items-center gap-3 text-muted small mt-2">
                                                <span className="d-flex align-items-center gap-1">
                                                    <MessageCircle size={14} />
                                                    {q._count?.answers || 0} {t.qa.daily_modal.responses}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className="text-muted" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}

                    <Link href="/dashboard/qa" className="btn btn-primary w-100 rounded-pill fw-bold py-2 mt-2" onClick={onClose}>
                        {t.qa.daily_modal.view_all}
                    </Link>
                </div>
            </div>
        </div>
    );
}

"use client";

import { CheckCircle2, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { useLanguage } from '@/app/LanguageContext';

interface ChallengeCardProps {
    isCompleted?: boolean;
}

export default function ChallengeCard({ isCompleted = false }: ChallengeCardProps) {
    const { t } = useLanguage();
    const total = 5;
    const completed = isCompleted ? 5 : 0; // Simplified for now, either all done or 0.
    const progress = (completed / total) * 100;

    return (
        <Link href={isCompleted ? "#" : "/dashboard/challenge"} className={`text-decoration-none ${isCompleted ? 'pointer-events-none' : ''}`}>
            <div className={`card border-0 shadow-sm mb-4 overflow-hidden hover-scale ${isCompleted ? 'bg-success' : ''}`}
                style={{
                    borderRadius: '24px',
                    background: isCompleted ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'
                }}>
                <div className="card-body p-4 text-white">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                            <Trophy size={20} className={isCompleted ? "text-white" : "text-warning"} />
                            <span className="fw-bold text-uppercase small tracking-wider">{t.dashboard.daily_challenge}</span>
                        </div>
                        <span className="badge bg-white bg-opacity-20 rounded-pill px-3">
                            {completed}/{total}
                        </span>
                    </div>

                    <h4 className="fw-black mb-3 text-white">
                        {isCompleted ? t.dashboard.challenge_completed : t.dashboard.feeding_spirit}
                    </h4>

                    {!isCompleted && (
                        <div className="progress bg-white bg-opacity-20 mb-3" style={{ height: '12px', borderRadius: '6px' }}>
                            <div
                                className="progress-bar bg-warning"
                                role="progressbar"
                                style={{ width: `${progress}%`, borderRadius: '6px' }}
                                aria-valuenow={progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            ></div>
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                        <p className="m-0 small text-white text-opacity-80">
                            {isCompleted ? t.dashboard.come_back_tomorrow : t.dashboard.verses_and_truths}
                        </p>
                        <div className="bg-white text-primary rounded-circle p-1">
                            {isCompleted ? <CheckCircle2 size={18} className="text-success" /> : <ArrowRight size={18} />}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

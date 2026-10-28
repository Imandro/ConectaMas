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
            <div
                className={`challenge-card ui-surface card border-0 mb-3 overflow-hidden ${isCompleted ? 'bg-success' : 'text-white'}`}
                style={{
                    backgroundColor: isCompleted
                        ? 'color-mix(in srgb, var(--success-color, #10b981) 18%, var(--card-bg, #ffffff))'
                        : 'var(--hero-from, var(--brand-primary, #0B1B32))',
                }}
            >
                <div className={`card-body p-3 p-sm-4 ${isCompleted ? 'text-dark' : 'text-white'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                            <Trophy size={20} className={isCompleted ? "text-success" : "text-warning"} aria-hidden="true" />
                            <span className="fw-bold text-uppercase small tracking-wider">{t.dashboard.daily_challenge}</span>
                        </div>
                        <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'var(--accent-soft, #fff7d6)', color: 'var(--brand-ink, var(--brand-primary, #0B1B32))' }}>
                            {completed}/{total}
                        </span>
                    </div>

                    <h4 className={`fw-bold mb-3 ${isCompleted ? 'text-dark' : 'text-white'}`}>
                        {isCompleted ? t.dashboard.challenge_completed : t.dashboard.feeding_spirit}
                    </h4>

                    {!isCompleted && (
                        <div className="progress mb-3" style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.16)' }}>
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${progress}%`, backgroundColor: 'var(--brand-accent, #fbbf24)' }}
                                aria-valuenow={progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            ></div>
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                        <p className={`m-0 small ${isCompleted ? 'text-muted' : 'text-white-50'}`}>
                            {isCompleted ? t.dashboard.come_back_tomorrow : t.dashboard.verses_and_truths}
                        </p>
                        <div className="rounded-circle p-2 flex-shrink-0 d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: 'var(--accent-soft, #fff7d6)', color: 'var(--brand-ink, var(--brand-primary, #0B1B32))' }} aria-hidden="true">
                            {isCompleted ? <CheckCircle2 size={18} className="text-success" /> : <ArrowRight size={18} />}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

"use client";

import { CheckCircle2, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ChallengeCard() {
    // In a real app, this would come from a provider/state
    const completed = 0;
    const total = 5;
    const progress = (completed / total) * 100;

    return (
        <Link href="/dashboard/challenge" className="text-decoration-none">
            <div className="card border-0 shadow-sm mb-4 overflow-hidden hover-scale" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}>
                <div className="card-body p-4 text-white">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                            <Trophy size={20} className="text-warning" />
                            <span className="fw-bold text-uppercase small tracking-wider">Reto Diario</span>
                        </div>
                        <span className="badge bg-white bg-opacity-20 rounded-pill px-3">
                            {completed}/{total} Completado
                        </span>
                    </div>

                    <h4 className="fw-black mb-3 text-white">¡Alimenta tu espíritu hoy!</h4>

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

                    <div className="d-flex justify-content-between align-items-center">
                        <p className="m-0 small text-white text-opacity-80">Completa 5 versículos y verdades</p>
                        <div className="bg-white text-primary rounded-circle p-1">
                            <ArrowRight size={18} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

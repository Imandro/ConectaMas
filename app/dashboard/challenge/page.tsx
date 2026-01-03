"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, XCircle, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { challengeData, Challenge } from '@/app/lib/challengeData';
import LlamiMascot from '@/app/components/LlamiMascot';

export default function ChallengePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    useEffect(() => {
        // Randomly pick 5 challenges
        const shuffled = [...challengeData].sort(() => 0.5 - Math.random());
        setChallenges(shuffled.slice(0, 5));
    }, []);

    const handleOptionSelect = (option: string) => {
        if (showResult) return;
        setSelectedOption(option);
        const correct = option === challenges[currentStep].answer;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            // Wait then next
            setTimeout(() => {
                if (currentStep < challenges.length - 1) {
                    setCurrentStep(currentStep + 1);
                    setSelectedOption(null);
                    setIsCorrect(null);
                    setShowResult(false);
                } else {
                    setCompleted(true);
                }
            }, 1500);
        } else {
            // Shake effect or just wait
            setTimeout(() => {
                setSelectedOption(null);
                setIsCorrect(null);
                setShowResult(false);
            }, 1500);
        }
    };

    if (challenges.length === 0) return null;

    if (completed) {
        return (
            <div className="container py-5 text-center animate-fade-in">
                <div className="card shadow-lg border-0 rounded-5 p-5 bg-white">
                    <Trophy size={80} className="text-warning mx-auto mb-4" />
                    <h1 className="fw-black text-dark mb-3">¡Misión Cumplida!</h1>
                    <p className="text-muted mb-4 fs-5">Has alimentado tu espíritu con la Verdad hoy.</p>
                    <div className="mb-4">
                        <LlamiMascot streak={10} level={2} />
                    </div>
                    <Link href="/dashboard" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow">
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        );
    }

    const currentChallenge = challenges[currentStep];
    const progress = ((currentStep) / challenges.length) * 100;

    return (
        <div className="min-vh-100 bg-light py-4 px-3">
            <div className="container max-w-md mx-auto">
                {/* Header */}
                <div className="d-flex align-items-center gap-3 mb-4">
                    <button onClick={() => router.back()} className="btn btn-white shadow-sm rounded-circle p-2">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex-grow-1">
                        <div className="progress bg-white bg-opacity-50" style={{ height: '12px', borderRadius: '6px' }}>
                            <div
                                className="progress-bar bg-primary transition-all duration-500"
                                style={{ width: `${progress}%`, borderRadius: '6px' }}
                            ></div>
                        </div>
                    </div>
                    <span className="fw-bold text-primary">{currentStep + 1}/{challenges.length}</span>
                </div>

                {/* Content */}
                <div className="text-center mb-5">
                    <div className="mb-4 d-inline-block p-3 bg-white rounded-circle shadow-sm">
                        <Sparkles size={32} className="text-warning" />
                    </div>
                    <h2 className="fw-black text-dark mb-4 px-2">
                        {currentChallenge.type === 'VERSE' ? 'Completa el versículo' : 'Verdad Bíblica'}
                    </h2>

                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
                        <p className="fs-3 fw-bold text-secondary mb-0">
                            {currentChallenge.question.split('__').map((part, i) => (
                                <span key={i}>
                                    {part}
                                    {i === 0 && (
                                        <span className={`mx-2 px-3 py-1 rounded-3 border-bottom border-3 ${isCorrect === true ? 'bg-success-subtle border-success text-success' : isCorrect === false ? 'bg-danger-subtle border-danger text-danger' : 'bg-light border-secondary text-primary'}`} style={{ minWidth: '80px', display: 'inline-block' }}>
                                            {selectedOption || '____'}
                                        </span>
                                    )}
                                </span>
                            ))}
                        </p>
                    </div>

                    {/* Options */}
                    <div className="row g-3">
                        {currentChallenge.options.map((option, i) => (
                            <div key={i} className="col-6">
                                <button
                                    onClick={() => handleOptionSelect(option)}
                                    disabled={showResult}
                                    className={`btn w-100 py-4 rounded-4 fw-black transition-all shadow-sm border-2 ${selectedOption === option
                                            ? (isCorrect ? 'btn-success border-success text-white scale-105' : 'btn-danger border-danger text-white scale-95')
                                            : 'btn-white hover-scale'
                                        }`}
                                >
                                    {option}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feedback bottom */}
                {showResult && (
                    <div className={`fixed-bottom p-4 animate-slide-up ${isCorrect ? 'bg-success' : 'bg-danger'}`} style={{ zIndex: 1000 }}>
                        <div className="container d-flex align-items-center justify-content-between text-white">
                            <div className="d-flex align-items-center gap-3">
                                {isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                                <div>
                                    <h5 className="fw-black m-0">{isCorrect ? '¡Excelente!' : 'Casi...'}</h5>
                                    <p className="m-0 small text-white text-opacity-80">
                                        {isCorrect ? 'Vas por muy buen camino.' : `La respuesta era: ${currentChallenge.answer}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                .animate-slide-up { animation: slideUp 0.3s ease-out; }
                .max-w-md { max-width: 500px; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .scale-105 { transform: scale(1.05); }
                .scale-95 { transform: scale(0.95); }
                .hover-scale:hover { transform: scale(1.02); }
                .transition-all { transition: all 0.2s ease; }
                .fw-black { font-weight: 900; }
            `}</style>
        </div>
    );
}

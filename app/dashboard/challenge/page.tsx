"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, XCircle, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getChallenges, Challenge } from '@/app/lib/challengeData';
import LlamiMascot from '@/app/components/LlamiMascot';

import { useLanguage } from '../../LanguageContext';

export default function ChallengePage() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Load challenges based on language
    // In a real app we might randomize these
    const challenges = useMemo(() => getChallenges(language).slice(0, 5), [language]);

    useEffect(() => {
        // Reset state if language changes drastically, or just keep going?
        // Ideally we reset to ensure they see the new language questions
        setCurrentStep(0);
        setIsCompleted(false);
        setIsCorrect(null);
        setSelectedOption(null);
    }, [language]);

    const handleOptionSelect = (option: string) => {
        if (showResult) return;
        setSelectedOption(option);
        const correct = option === challenges[currentStep].answer;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            // Wait then next
            setTimeout(() => {
                const nextStep = currentStep + 1;
                if (nextStep < challenges.length) {
                    setCurrentStep(nextStep);
                    setSelectedOption(null);
                    setIsCorrect(null);
                    setShowResult(false);
                } else {
                    // Complete!
                    handleCompletion();
                }
            }, 1000);
        } else {
            // Shake effect or just wait
            setTimeout(() => {
                setSelectedOption(null);
                setIsCorrect(null);
                setShowResult(false);
            }, 1500);
        }
    };

    const handleCompletion = async () => {
        try {
            await fetch('/api/challenge/complete', { method: 'POST' });
        } catch (e) {
            console.error(e);
        }
        setIsCompleted(true);
    };

    if (challenges.length === 0) return null;

    if (completed) {
        return (
            <div className="container py-5 text-center animate-fade-in">
                <div className="card shadow-lg border-0 rounded-5 p-5 bg-white position-relative overflow-hidden">
                    <div className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                            background: 'radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, rgba(255,255,255,0) 70%)',
                            zIndex: 0
                        }}
                    />
                    <div className="position-relative" style={{ zIndex: 1 }}>
                        <img
                            src="/assets/images/trophy_3d.png"
                            alt="Trofeo"
                            className="img-fluid mb-4 animate-bounce-slow"
                            style={{ maxHeight: '250px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}
                        />
                        <h1 className="fw-black text-dark mb-3 display-5">{t.challenge.mission_accomplished}</h1>
                        <p className="text-muted mb-4 fs-5">{t.challenge.mission_message}</p>

                        <div className="d-flex justify-content-center gap-3 mb-4">
                            <div className="d-inline-block p-3 rounded-4 bg-light">
                                <span className="d-block fw-bold text-primary fs-4">+50</span>
                                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>{t.challenge.points}</small>
                            </div>
                            <div className="d-inline-block p-3 rounded-4 bg-light">
                                <span className="d-block fw-bold text-warning fs-4">{t.challenge.completed}</span>
                                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>{t.challenge.status}</small>
                            </div>
                        </div>

                        <Link href="/dashboard" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-lg hover-scale">
                            {t.challenge.return_home}
                        </Link>
                    </div>
                </div>
                <style jsx>{`
                    .animate-bounce-slow { animation: bounce 3s infinite ease-in-out; }
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-15px); }
                    }
                `}</style>
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
                        {currentChallenge.type === 'VERSE' ? t.challenge.title_verse : t.challenge.title_truth}
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
                                    <h5 className="fw-black m-0">{isCorrect ? t.challenge.feedback_correct : t.challenge.feedback_incorrect}</h5>
                                    <p className="m-0 small text-white text-opacity-80">
                                        {isCorrect ? t.challenge.feedback_correct_msg : `${t.challenge.feedback_incorrect_msg} ${currentChallenge.answer}`}
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

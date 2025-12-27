"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Info, ArrowRight, Trophy, Zap, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    reference: string;
}

interface TriviaGameProps {
    onComplete: () => void;
}

// Note: TriviaGame doesn't seem to use useSession directly, but if it relies on a parent that fetches it improperly it could fail.
// Checking if I need to add useSession or if the error comes from parent.
// The user said "al entrar en el refugio de llami, a la trivia y otras tenemos este error"
// LlamiPage uses useSession potentially via other components or hooks.
// Let's check LlamiPage again.
export default function TriviaGame({ onComplete }: TriviaGameProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [gameState, setGameState] = useState<"PLAYING" | "RESULTS">("PLAYING");

    useEffect(() => {
        fetch("/api/trivia/daily")
            .then((res) => {
                if (res.status === 401) {
                    // Session not ready or invalid. 
                    // We can either redirect or just stop loading.
                    // For now, let's stop loading to prevent empty state crash if we had one.
                    throw new Error("Unauthorized");
                }
                return res.json();
            })
            .then((data) => {
                if (data.error) throw new Error(data.error);
                setQuestions(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching trivia:", err);
                setIsLoading(false);
            });
    }, []);

    const handleOptionSelect = async (index: number) => {
        if (showFeedback || isSubmitting) return;

        setSelectedOption(index);
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/trivia/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    questionId: questions[currentIndex].id,
                    selectedIndex: index,
                }),
            });

            const result = await res.json();
            setIsCorrect(result.isCorrect);
            if (result.isCorrect) setScore((prev) => prev + 1);
            setShowFeedback(true);
        } catch (err) {
            console.error("Error submitting answer:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        } else {
            setGameState("RESULTS");
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <Loader2 className="animate-spin mb-3 mx-auto text-warning" size={48} />
                <h4 className="text-white opacity-75">Preparando tus preguntas diarias...</h4>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center py-5 rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Info size={48} className="text-warning mb-3 mx-auto" />
                <h4 className="text-white mb-2">¡Todo al día!</h4>
                <p className="text-white-50">Has completado todas las preguntas disponibles por ahora.</p>
                <button onClick={onComplete} className="btn btn-warning rounded-pill px-4 mt-3 fw-bold">Volver</button>
            </div>
        );
    }

    if (gameState === "RESULTS") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-5 rounded-4 shadow-lg p-4"
                style={{ backgroundColor: '#0B1B32', border: '1px solid rgba(243, 179, 62, 0.3)' }}
            >
                <Trophy size={80} className="text-warning mb-4 mx-auto" />
                <h2 className="display-5 fw-bold text-white mb-2">¡Desafío Diario Completo!</h2>
                <div className="display-3 fw-bold text-warning mb-4">{score} / {questions.length}</div>

                <p className="lead text-white-50 mb-5">
                    {score === questions.length
                        ? "¡Increíble! Eres un experto en la Palabra."
                        : score >= 3 ? "¡Buen trabajo! Sigue creciendo cada día."
                            : "¡Sigue practicando! Cada error es una oportunidad de aprender."}
                </p>

                <div className="bg-warning bg-opacity-10 p-4 rounded-4 mb-5 border border-warning border-opacity-20">
                    <h5 className="fw-bold text-warning mb-2 d-flex align-items-center justify-content-center gap-2">
                        <Sparkles size={20} /> Recompensa para Llami
                    </h5>
                    <div className="d-flex justify-content-center gap-4 mt-3">
                        <div className="text-center">
                            <div className="fw-bold text-white fs-4">+{score * 5}</div>
                            <div className="tiny text-white-50">EXP</div>
                        </div>
                        <div className="text-center border-start border-white border-opacity-10 ps-4">
                            <div className="fw-bold text-white fs-4">+{score * 2}</div>
                            <div className="tiny text-white-50">LLAMAS</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onComplete}
                    className="btn btn-warning btn-lg rounded-pill w-100 fw-bold py-3 shadow-lg transform-scale-up"
                    style={{ backgroundColor: '#f3b33e', border: 'none', color: '#0B1B32' }}
                >
                    Alimentar a Llami y Guardar
                </button>
            </motion.div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="trivia-container">
            {/* Progress bar */}
            <div className="mb-4">
                <div className="d-flex justify-content-between text-muted small mb-2 fw-bold">
                    <span>PREGUNTA {currentIndex + 1} DE {questions.length}</span>
                    <span>{Math.round(((currentIndex) / questions.length) * 100)}%</span>
                </div>
                <div className="progress rounded-pill shadow-sm" style={{ height: '8px', backgroundColor: 'rgba(11, 27, 50, 0.1)' }}>
                    <motion.div
                        className="progress-bar bg-warning rounded-pill"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        style={{ backgroundColor: '#f3b33e' }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-4 p-4 shadow-sm"
                    style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
                >
                    <h3 className="fw-bold text-dark mb-4 lh-base" style={{ fontSize: '1.4rem' }}>
                        {currentQ.question}
                    </h3>

                    <div className="d-grid gap-3 mb-4">
                        {currentQ.options.map((option, idx) => {
                            const isSelected = selectedOption === idx;
                            const isCorrectOption = idx === currentQ.correctIndex;

                            let buttonStyle: React.CSSProperties = {
                                border: '2px solid',
                                borderColor: '#e2e8f0',
                                backgroundColor: '#f8fafc',
                                color: '#1e293b',
                                transition: 'all 0.2s ease',
                                fontWeight: '500'
                            };

                            let buttonClass = "btn text-start p-3 rounded-4 d-flex justify-content-between align-items-center mb-1";

                            if (showFeedback) {
                                if (isCorrectOption) {
                                    buttonStyle = { ...buttonStyle, backgroundColor: '#10b981', color: 'white', borderColor: '#10b981' };
                                } else if (isSelected) {
                                    buttonStyle = { ...buttonStyle, backgroundColor: '#ef4444', color: 'white', borderColor: '#ef4444' };
                                } else {
                                    buttonStyle = { ...buttonStyle, opacity: 0.3 };
                                }
                            } else if (isSelected) {
                                buttonStyle = {
                                    ...buttonStyle,
                                    backgroundColor: 'rgba(243, 179, 62, 0.1)',
                                    borderColor: '#f3b33e',
                                    color: '#b45309',
                                    fontWeight: 'bold'
                                };
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    disabled={showFeedback || isSubmitting}
                                    className={buttonClass}
                                    style={buttonStyle}
                                >
                                    <span className="fs-5">{option}</span>
                                    {showFeedback && isCorrectOption && <CheckCircle2 size={24} />}
                                    {showFeedback && isSelected && !isCorrectOption && <XCircle size={24} />}
                                </button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {showFeedback && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`p-4 rounded-4 ${isCorrect ? 'bg-success bg-opacity-10 border border-success' : 'bg-danger bg-opacity-10 border border-danger'} mb-4`}
                            >
                                <div className="d-flex align-items-start gap-3">
                                    <div className={`p-2 rounded-circle ${isCorrect ? 'bg-success' : 'bg-danger'} text-white shadow-sm`}>
                                        {isCorrect ? <Zap size={20} /> : <Info size={20} />}
                                    </div>
                                    <div>
                                        <h5 className={`fw-bold mb-1 ${isCorrect ? 'text-success' : 'text-danger'}`}>{isCorrect ? "¡Correcto!" : "No exactamente"}</h5>
                                        <p className="text-dark opacity-75 small mb-2">{currentQ.explanation}</p>
                                        <div className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 rounded-pill px-3 py-2">{currentQ.reference}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {showFeedback && (
                        <button
                            onClick={nextQuestion}
                            className="btn btn-warning w-100 py-3 rounded-pill fw-bold fs-5 d-flex align-items-center justify-content-center gap-2 shadow-lg"
                            style={{ backgroundColor: '#f3b33e', border: 'none', color: '#0B1B32' }}
                        >
                            {currentIndex === questions.length - 1 ? "Ver Resultados" : "Siguiente Pregunta"} <ArrowRight size={20} />
                        </button>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

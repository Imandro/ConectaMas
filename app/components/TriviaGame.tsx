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
            .then((res) => res.json())
            .then((data) => {
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
            <div className="text-center py-5 bg-white bg-opacity-5 rounded-4 border border-white border-opacity-10">
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
                className="text-center py-5 bg-white bg-opacity-10 backdrop-blur-md rounded-4 border border-white border-opacity-20 shadow-2xl p-4"
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
                <div className="d-flex justify-content-between text-white-50 small mb-2 fw-bold">
                    <span>PREGUNTA {currentIndex + 1} DE {questions.length}</span>
                    <span>{Math.round(((currentIndex) / questions.length) * 100)}%</span>
                </div>
                <div className="progress rounded-pill bg-white bg-opacity-10" style={{ height: '8px' }}>
                    <motion.div
                        className="progress-bar bg-warning rounded-pill"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white bg-opacity-10 backdrop-blur-sm rounded-4 p-4 border border-white border-opacity-20 shadow-xl"
                >
                    <h3 className="fw-bold text-white mb-4 lh-base" style={{ fontSize: '1.4rem' }}>
                        {currentQ.question}
                    </h3>

                    <div className="d-grid gap-3 mb-4">
                        {currentQ.options.map((option, idx) => {
                            const isSelected = selectedOption === idx;
                            const isCorrectOption = idx === currentQ.correctIndex;

                            let buttonClass = "btn btn-outline-light text-start p-3 rounded-4 border-2 transition-all d-flex justify-content-between align-items-center";
                            if (showFeedback) {
                                if (isCorrectOption) buttonClass = "btn btn-success text-start p-3 rounded-4 border-0 d-flex justify-content-between align-items-center";
                                else if (isSelected) buttonClass = "btn btn-danger text-start p-3 rounded-4 border-0 d-flex justify-content-between align-items-center";
                                else buttonClass = "btn btn-outline-light text-start p-3 rounded-4 border-2 opacity-50 d-flex justify-content-between align-items-center";
                            } else if (isSelected) {
                                buttonClass = "btn btn-warning text-start p-3 rounded-4 border-0 text-primary fw-bold d-flex justify-content-between align-items-center";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    disabled={showFeedback || isSubmitting}
                                    className={buttonClass}
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
                                    <div className={`p-2 rounded-circle ${isCorrect ? 'bg-success' : 'bg-danger'} text-white`}>
                                        {isCorrect ? <Zap size={20} /> : <Info size={20} />}
                                    </div>
                                    <div>
                                        <h5 className="fw-bold text-white mb-1">{isCorrect ? "¡Correcto!" : "No exactamente"}</h5>
                                        <p className="text-white-50 small mb-2">{currentQ.explanation}</p>
                                        <div className="badge bg-white text-primary rounded-pill px-3 py-2">{currentQ.reference}</div>
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

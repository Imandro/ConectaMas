"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ArrowLeft, Zap, Clock, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { speedQuizData, SpeedQuizQuestion } from "@/app/data/games/speedQuizData";
import { saveGameScore, getBestScores } from "@/app/actions/gameScore";

const TOTAL_QUESTIONS = 10;
const TIME_LIMIT = 60;

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function SpeedQuizGame() {
    const [phase, setPhase] = useState<"start" | "playing" | "result">("start");
    const [questions, setQuestions] = useState<SpeedQuizQuestion[]>([]);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [bestScore, setBestScore] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        getBestScores("speed_quiz").then((r) => {
            if (r.success) setBestScore(r.bestScore ?? 0);
        });
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const startGame = useCallback(() => {
        const shuffled = shuffleArray(speedQuizData).slice(0, TOTAL_QUESTIONS);
        setQuestions(shuffled);
        setRound(0);
        setScore(0);
        setTimeLeft(TIME_LIMIT);
        setSelectedAnswer(null);
        setFeedback(null);
        setPhase("playing");
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => {
        if (phase === "playing" && timeLeft === 0) {
            finishGame(score);
        }
    }, [timeLeft, phase, score]);

    const handleAnswer = (index: number) => {
        if (feedback) return;
        setSelectedAnswer(index);
        const correct = index === questions[round].correctIndex;
        setFeedback(correct ? "correct" : "incorrect");
        if (correct) setScore((s) => s + 1);
        setTimeout(() => {
            if (round + 1 >= TOTAL_QUESTIONS) {
                if (timerRef.current) clearInterval(timerRef.current);
                finishGame(correct ? score + 1 : score);
            } else {
                setRound((r) => r + 1);
                setSelectedAnswer(null);
                setFeedback(null);
            }
        }, 800);
    };

    const finishGame = async (finalScore: number) => {
        setPhase("result");
        const timeSpent = TIME_LIMIT - timeLeft;
        await saveGameScore("speed_quiz", finalScore, TOTAL_QUESTIONS, timeSpent);
        const r = await getBestScores("speed_quiz");
        if (r.success) setBestScore(r.bestScore ?? 0);
    };

    const progress = ((round + (feedback ? 1 : 0)) / TOTAL_QUESTIONS) * 100;

    return (
        <div className="container-fluid py-4 min-vh-100" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
            <div className="max-w-4xl mx-auto">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Link href="/dashboard/games" className="btn btn-white bg-white text-dark rounded-circle p-2 shadow-sm border-0">
                        <ArrowLeft size={22} />
                    </Link>
                    <h1 className="h3 mb-0 fw-bold text-white">Pregunta Relámpago</h1>
                </div>

                {phase === "start" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-5">
                        <div className="bg-white/10 rounded-5 p-5 backdrop-blur-sm max-w-md mx-auto">
                            <div className="bg-white/20 d-inline-flex p-4 rounded-circle mb-3">
                                <Zap size={48} className="text-warning" />
                            </div>
                            <h2 className="fw-bold text-white mb-2">¡Pregunta Relámpago!</h2>
                            <p className="text-white/80 mb-1">Responde {TOTAL_QUESTIONS} preguntas bíblicas lo más rápido posible.</p>
                            <p className="text-white/60 small mb-4">⏱️ Tiempo límite: {TIME_LIMIT} segundos</p>
                            {bestScore > 0 && (
                                <p className="text-warning small mb-3">🏆 Mejor puntaje: {bestScore}/{TOTAL_QUESTIONS}</p>
                            )}
                            <button onClick={startGame} className="btn btn-warning rounded-pill px-5 py-2 fw-bold shadow-lg">
                                ¡Comenzar!
                            </button>
                        </div>
                    </motion.div>
                )}

                {phase === "playing" && questions[round] && (
                    <AnimatePresence mode="wait">
                        <motion.div key={round} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="bg-white rounded-5 shadow-sm p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="badge bg-danger rounded-pill">
                                    <Clock size={14} className="me-1" />{timeLeft}s
                                </span>
                                <span className="fw-bold text-primary">⭐ {score}</span>
                                <span className="badge bg-secondary rounded-pill">{round + 1}/{TOTAL_QUESTIONS}</span>
                            </div>
                            <div className="progress mb-4" style={{ height: "6px", borderRadius: "3px" }}>
                                <div className="progress-bar bg-danger" style={{ width: `${progress}%` }} />
                            </div>

                            <h5 className="fw-bold text-dark mb-4">{questions[round].question}</h5>

                            <div className="d-flex flex-column gap-2">
                                {questions[round].options.map((opt, i) => {
                                    let btnClass = "btn btn-outline-dark rounded-pill py-3 fw-bold text-start";
                                    if (selectedAnswer !== null) {
                                        if (i === questions[round].correctIndex) {
                                            btnClass = "btn btn-success rounded-pill py-3 fw-bold text-start";
                                        } else if (i === selectedAnswer && feedback === "incorrect") {
                                            btnClass = "btn btn-danger rounded-pill py-3 fw-bold text-start";
                                        } else {
                                            btnClass = "btn btn-outline-dark rounded-pill py-3 fw-bold text-start opacity-50";
                                        }
                                    }
                                    return (
                                        <button key={i} onClick={() => handleAnswer(i)} disabled={feedback !== null}
                                            className={btnClass}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}

                {phase === "result" && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-5">
                        <div className="bg-white/10 backdrop-blur-sm rounded-5 p-5 max-w-md mx-auto">
                            <div className="mb-4">
                                <div className="bg-warning/30 d-inline-flex p-4 rounded-circle mb-3">
                                    <Trophy size={64} className="text-warning" />
                                </div>
                                <h2 className="fw-bold text-white mb-2">¡Tiempo Terminado!</h2>
                                <div className="display-3 fw-bold text-warning mb-2">{score}/{TOTAL_QUESTIONS}</div>
                                {score === TOTAL_QUESTIONS && <p className="text-white fw-bold">¡Perfecto! 🎉</p>}
                                {score >= 7 && score < TOTAL_QUESTIONS && <p className="text-white fw-bold">¡Muy bien! 🙌</p>}
                                {score < 7 && <p className="text-white fw-bold">¡Sigue practicando! 💪</p>}
                                {bestScore >= score && bestScore > score && (
                                    <p className="text-white/70 small">🏆 Tu récord: {bestScore}/{TOTAL_QUESTIONS}</p>
                                )}
                            </div>
                            <div className="d-flex justify-content-center gap-3 flex-column flex-sm-row">
                                <button onClick={startGame} className="btn btn-warning rounded-pill px-4 py-2 fw-bold shadow-sm">
                                    Jugar de nuevo
                                </button>
                                <Link href="/dashboard/games" className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold">
                                    Volver a juegos
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
            <style jsx>{`
                .max-w-4xl { max-width: 900px; }
                .max-w-md { max-width: 450px; margin: 0 auto; }
                .backdrop-blur-sm { backdrop-filter: blur(8px); }
            `}</style>
        </div>
    );
}

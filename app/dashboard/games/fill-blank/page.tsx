"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fillBlankData, FillBlankQuestion } from "@/app/data/games/fillBlankData";
import { saveGameScore, getBestScores } from "@/app/actions/gameScore";

const ROUNDS = 10;

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function FillBlankGame() {
    const [phase, setPhase] = useState<"start" | "playing" | "result">("start");
    const [questions, setQuestions] = useState<FillBlankQuestion[]>([]);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [bestScore, setBestScore] = useState(0);

    const startGame = useCallback(() => {
        const shuffled = shuffleArray(fillBlankData).slice(0, ROUNDS);
        setQuestions(shuffled);
        setRound(0);
        setScore(0);
        setSelectedAnswer(null);
        setFeedback(null);
        setPhase("playing");
    }, []);

    const handleAnswer = (index: number) => {
        if (feedback) return;
        setSelectedAnswer(index);
        const correct = index === questions[round].correctIndex;
        setFeedback(correct ? "correct" : "incorrect");
        if (correct) setScore((s) => s + 1);
        setTimeout(() => {
            if (round + 1 >= ROUNDS) {
                finishGame(correct ? score + 1 : score);
            } else {
                setRound((r) => r + 1);
                setSelectedAnswer(null);
                setFeedback(null);
            }
        }, 1000);
    };

    const finishGame = async (finalScore: number) => {
        setPhase("result");
        await saveGameScore("fill_blank", finalScore, ROUNDS, null);
        const r = await getBestScores("fill_blank");
        if (r.success) setBestScore(r.bestScore ?? 0);
    };

    return (
        <div className="container-fluid py-4 min-vh-100" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
            <div className="max-w-4xl mx-auto">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Link href="/dashboard/games" className="btn btn-white bg-white text-dark rounded-circle p-2 shadow-sm border-0">
                        <ArrowLeft size={22} />
                    </Link>
                    <h1 className="h3 mb-0 fw-bold text-white">Completa el Verso</h1>
                </div>

                {phase === "start" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-5">
                        <div className="bg-white/10 rounded-5 p-5 backdrop-blur-sm max-w-md mx-auto">
                            <div className="bg-white/20 d-inline-flex p-4 rounded-circle mb-3">
                                <Trophy size={48} className="text-warning" />
                            </div>
                            <h2 className="fw-bold text-white mb-2">¡Completa el Verso!</h2>
                            <p className="text-white/80 mb-1">Elige la palabra correcta para completar el versículo bíblico.</p>
                            <p className="text-white/60 small mb-4">{ROUNDS} versículos para completar</p>
                            {bestScore > 0 && (
                                <p className="text-warning small mb-3">🏆 Mejor puntaje: {bestScore}/{ROUNDS}</p>
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
                                <span className="badge bg-primary rounded-pill">{round + 1}/{ROUNDS}</span>
                                <span className="fw-bold text-primary">⭐ {score}</span>
                            </div>
                            <div className="progress mb-4" style={{ height: "6px", borderRadius: "3px" }}>
                                <div className="progress-bar bg-warning" style={{ width: `${((round + 1) / ROUNDS) * 100}%` }} />
                            </div>

                            <div className="bg-light rounded-4 p-4 mb-4 text-center">
                                <p className="fs-5 fw-bold mb-1">{questions[round].verse}</p>
                                <small className="text-muted">{questions[round].reference}</small>
                            </div>

                            <div className="d-flex flex-column gap-2">
                                {questions[round].options.map((opt, i) => {
                                    let btnClass = "btn btn-outline-dark rounded-pill py-3 fw-bold";
                                    if (selectedAnswer !== null) {
                                        if (i === questions[round].correctIndex) {
                                            btnClass = "btn btn-success rounded-pill py-3 fw-bold";
                                        } else if (i === selectedAnswer && feedback === "incorrect") {
                                            btnClass = "btn btn-danger rounded-pill py-3 fw-bold";
                                        } else {
                                            btnClass = "btn btn-outline-dark rounded-pill py-3 fw-bold opacity-50";
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
                                <h2 className="fw-bold text-white mb-2">¡Juego Terminado!</h2>
                                <div className="display-3 fw-bold text-warning mb-2">{score}/{ROUNDS}</div>
                                {score === ROUNDS && <p className="text-white fw-bold">¡Perfecto! 🎉</p>}
                                {score >= 7 && score < ROUNDS && <p className="text-white fw-bold">¡Buen trabajo! 🙌</p>}
                                {score < 7 && <p className="text-white fw-bold">¡Sigue practicando! 💪</p>}
                                {bestScore >= score && bestScore > score && (
                                    <p className="text-white/70 small">🏆 Tu récord: {bestScore}/{ROUNDS}</p>
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

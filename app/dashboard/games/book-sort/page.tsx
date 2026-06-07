"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { bookSortData, BookSortQuestion } from "@/app/data/games/bookSortData";
import { saveGameScore, getBestScores } from "@/app/dashboard/games/clientGameScore";

const ROUNDS = 15;

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function BookSortGame() {
    const [phase, setPhase] = useState<"start" | "playing" | "result">("start");
    const [questions, setQuestions] = useState<BookSortQuestion[]>([]);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [bestScore, setBestScore] = useState(0);
    const startTimeRef = useRef(0);

    useEffect(() => {
        getBestScores("book_sort").then((r) => {
            if (r.success) setBestScore(r.bestScore ?? 0);
        });
    }, []);

    const startGame = useCallback(() => {
        const shuffled = shuffleArray(bookSortData).slice(0, ROUNDS);
        setQuestions(shuffled);
        setRound(0);
        setScore(0);
        setFeedback(null);
        setPhase("playing");
        startTimeRef.current = Date.now();
    }, []);

    const handleAnswer = (testament: "AT" | "NT") => {
        if (feedback) return;
        const correct = testament === questions[round].testament;
        setFeedback(correct ? "correct" : "incorrect");
        if (correct) setScore((s) => s + 1);
        setTimeout(() => {
            if (round + 1 >= ROUNDS) {
                finishGame(correct ? score + 1 : score);
            } else {
                setRound((r) => r + 1);
                setFeedback(null);
            }
        }, 600);
    };

    const finishGame = async (finalScore: number) => {
        setPhase("result");
        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
        await saveGameScore("book_sort", finalScore, ROUNDS, timeSpent);
        const r = await getBestScores("book_sort");
        if (r.success) setBestScore(r.bestScore ?? 0);
    };

    return (
        <div className="container-fluid py-4 min-vh-100" style={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }}>
            <div className="max-w-4xl mx-auto">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Link href="/dashboard/games" className="btn btn-white bg-white text-dark rounded-circle p-2 shadow-sm border-0">
                        <ArrowLeft size={22} />
                    </Link>
                    <h1 className="h3 mb-0 fw-bold text-white">Clasifica el Libro</h1>
                </div>

                {phase === "start" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-5">
                        <div className="bg-white/10 rounded-5 p-5 backdrop-blur-sm max-w-md mx-auto">
                            <div className="bg-white/20 d-inline-flex p-4 rounded-circle mb-3">
                                <Book size={48} className="text-warning" />
                            </div>
                            <h2 className="fw-bold text-white mb-2">¡Clasifica el Libro!</h2>
                            <p className="text-white/80 mb-1">¿Es del Antiguo Testamento (AT) o Nuevo Testamento (NT)?</p>
                            <p className="text-white/60 small mb-4">{ROUNDS} libros para clasificar</p>
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
                        <motion.div key={round} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                            <div className="d-flex justify-content-between align-items-center mb-3 text-white">
                                <span className="badge bg-dark rounded-pill">{round + 1}/{ROUNDS}</span>
                                <span className="fw-bold">⭐ {score}</span>
                            </div>
                            <div className="progress mb-4">
                                <div className="progress-bar bg-warning" style={{ width: `${((round + 1) / ROUNDS) * 100}%` }} />
                            </div>

                            <div className="text-center mb-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-5 p-5 mb-4">
                                    <h2 className="display-5 fw-bold text-white mb-0">{questions[round].book}</h2>
                                </div>

                                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                                    <button onClick={() => handleAnswer("AT")} disabled={feedback !== null}
                                        className={`btn btn-lg rounded-4 px-5 py-4 fw-bold shadow-lg w-100 w-sm-auto ${feedback ? (questions[round].testament === "AT" ? "btn-success" : "btn-outline-light opacity-50") : "btn-outline-light"}`}
                                        style={{ fontSize: "1.3rem" }}
                                    >
                                        📜 AT
                                        <br /><small className="fw-normal">Antiguo Testamento</small>
                                    </button>
                                    <button onClick={() => handleAnswer("NT")} disabled={feedback !== null}
                                        className={`btn btn-lg rounded-4 px-5 py-4 fw-bold shadow-lg w-100 w-sm-auto ${feedback ? (questions[round].testament === "NT" ? "btn-success" : "btn-outline-light opacity-50") : "btn-outline-light"}`}
                                        style={{ fontSize: "1.3rem" }}
                                    >
                                        ✝️ NT
                                        <br /><small className="fw-normal">Nuevo Testamento</small>
                                    </button>
                                </div>

                                {feedback && (
                                    <div className={`mt-3 fw-bold fs-5 ${feedback === "correct" ? "text-white" : "text-warning"}`}>
                                        {feedback === "correct" ? "✅ ¡Correcto!" : "❌ Incorrecto"}
                                    </div>
                                )}
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
                                {score >= 11 && score < ROUNDS && <p className="text-white fw-bold">¡Muy bien! 🙌</p>}
                                {score < 11 && <p className="text-white fw-bold">¡Sigue practicando! 💪</p>}
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
                .btn:focus:not(:focus-visible) {
                    outline: none !important;
                    box-shadow: none !important;
                }
                .btn {
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                }
                .btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                }
                .btn:active:not(:disabled) {
                    transform: translateY(0px);
                }
                .btn:disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                }
                .progress {
                    height: 8px !important;
                    border-radius: 8px !important;
                    background: rgba(255,255,255,0.25) !important;
                    overflow: hidden;
                }
                .progress-bar {
                    border-radius: 8px !important;
                    transition: width 0.4s ease !important;
                    background-image: linear-gradient(90deg, #f59e0b, #f97316) !important;
                }
            `}</style>
        </div>
    );
}

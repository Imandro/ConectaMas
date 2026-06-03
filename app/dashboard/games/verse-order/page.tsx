"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ArrowLeft, Check, X, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { verseOrderData, VerseOrderQuestion } from "@/app/data/games/verseOrderData";
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

export default function VerseOrderGame() {
    const [phase, setPhase] = useState<"start" | "playing" | "result">("start");
    const [round, setRound] = useState(0);
    const [questions, setQuestions] = useState<VerseOrderQuestion[]>([]);
    const [shuffledWords, setShuffledWords] = useState<string[]>([]);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getBestScores("verse_order").then((r) => {
            if (r.success) setBestScore(r.bestScore ?? 0);
        });
    }, []);

    const startGame = useCallback(() => {
        const shuffled = shuffleArray(verseOrderData).slice(0, ROUNDS);
        setQuestions(shuffled);
        setRound(0);
        setScore(0);
        setShuffledWords(shuffleArray(shuffled[0].words));
        setSelectedWords([]);
        setFeedback(null);
        setPhase("playing");
    }, []);

    const nextRound = useCallback(() => {
        if (round + 1 >= ROUNDS) {
            finishGame(score);
            return;
        }
        const next = round + 1;
        setRound(next);
        setShuffledWords(shuffleArray(questions[next].words));
        setSelectedWords([]);
        setFeedback(null);
    }, [round, questions, score]);

    const handleWordClick = (word: string, index: number) => {
        if (feedback) return;
        const newSelected = [...selectedWords, word];
        setSelectedWords(newSelected);
        setShuffledWords((prev) => prev.filter((_, i) => i !== index));

        const currentQ = questions[round];
        const isFull = newSelected.length === currentQ.words.length;
        if (isFull) {
            const correct = newSelected.every((w, i) => w === currentQ.words[i]);
            setFeedback(correct ? "correct" : "incorrect");
            if (correct) setScore((s) => s + 1);
            setTimeout(() => nextRound(), 1200);
        }
    };

    const undoLastWord = () => {
        if (feedback || selectedWords.length === 0) return;
        const last = selectedWords[selectedWords.length - 1];
        setSelectedWords((prev) => prev.slice(0, -1));
        setShuffledWords((prev) => [...prev, last]);
    };

    const finishGame = async (finalScore: number) => {
        setPhase("result");
        setSaving(true);
        await saveGameScore("verse_order", finalScore, ROUNDS, null);
        const r = await getBestScores("verse_order");
        if (r.success) setBestScore(r.bestScore ?? 0);
        setSaving(false);
    };

    return (
        <div className="container-fluid py-4 min-vh-100" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <div className="max-w-4xl mx-auto">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Link href="/dashboard/games" className="btn btn-white bg-white text-dark rounded-circle p-2 shadow-sm border-0">
                        <ArrowLeft size={22} />
                    </Link>
                    <h1 className="h3 mb-0 fw-bold text-white">Ordena el Versículo</h1>
                </div>

                {phase === "start" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-5">
                        <div className="bg-white/10 rounded-5 p-5 backdrop-blur-sm max-w-md mx-auto">
                            <div className="bg-white/20 d-inline-flex p-4 rounded-circle mb-3">
                                <Trophy size={48} className="text-warning" />
                            </div>
                            <h2 className="fw-bold text-white mb-2">¡Ordena el Versículo!</h2>
                            <p className="text-white/80 mb-1">Toca las palabras en el orden correcto para formar el versículo.</p>
                            <p className="text-white/60 small mb-1">{ROUNDS} versículos para completar</p>
                            <p className="text-white/50 small mb-4 fst-italic">📖 Tip: Ten tu Biblia a mano para consultarla mientras juegas — así aprendes el orden correcto de cada verso.</p>
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
                                <span className="badge bg-primary rounded-pill">Ronda {round + 1}/{ROUNDS}</span>
                                <span className="fw-bold text-primary">⭐ {score}</span>
                            </div>
                            <div className="progress mb-4">
                                <div className="progress-bar bg-warning" style={{ width: `${((round + 1) / ROUNDS) * 100}%` }} />
                            </div>

                            <div className="text-center mb-4">
                                <small className="text-muted">{questions[round].reference}</small>
                            </div>

                            <div className="bg-light rounded-4 p-4 mb-4 min-h-100 d-flex flex-wrap gap-2 justify-content-center">
                                {selectedWords.map((word, i) => (
                                    <span key={i} className="badge bg-primary fs-6 px-3 py-2 animate__bounceIn">
                                        {word}
                                    </span>
                                ))}
                                {selectedWords.length === 0 && (
                                    <span className="text-muted">Toca las palabras en orden...</span>
                                )}
                            </div>

                            {feedback && (
                                <div className={`text-center mb-3 fw-bold ${feedback === "correct" ? "text-success" : "text-danger"}`}>
                                    {feedback === "correct" ? "✅ ¡Correcto!" : "❌ Incorrecto"}
                                </div>
                            )}

                            <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
                                {shuffledWords.map((word, i) => (
                                    <button key={i} onClick={() => handleWordClick(word, i)} disabled={!!feedback}
                                        className="btn btn-outline-primary rounded-pill fw-bold shadow-sm"
                                    >
                                        {word}
                                    </button>
                                ))}
                            </div>

                            {selectedWords.length > 0 && !feedback && (
                                <div className="text-center">
                                    <button onClick={undoLastWord} className="btn btn-sm btn-outline-secondary rounded-pill">
                                        <RotateCcw size={14} className="me-1" />Deshacer
                                    </button>
                                </div>
                            )}
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
                                {score >= ROUNDS * 0.7 && score < ROUNDS && <p className="text-white fw-bold">¡Buen trabajo! 🙌</p>}
                                {score < ROUNDS * 0.7 && <p className="text-white fw-bold">¡Sigue practicando! 💪</p>}
                                {bestScore >= score && bestScore > score && (
                                    <p className="text-white/70 small">🏆 Tu récord: {bestScore}/{ROUNDS}</p>
                                )}
                                {score === ROUNDS && <p className="text-warning small">🎯 ¡Nuevo récord!</p>}
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
                .min-h-100 { min-height: 80px; }
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
                .badge.bg-primary {
                    padding: 0.5rem 1rem !important;
                    font-size: 0.9rem !important;
                }
            `}</style>
        </div>
    );
}

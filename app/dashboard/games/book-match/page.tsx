"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { bookMatchData, BookMatchQuestion, BookMatchItem } from "@/app/data/games/bookMatchData";
import { saveGameScore, getBestScores } from "@/app/actions/gameScore";

const ROUNDS = 12;

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function BookMatchGame() {
    const [phase, setPhase] = useState<"start" | "playing" | "result">("start");
    const [questions, setQuestions] = useState<BookMatchQuestion[]>([]);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [assignments, setAssignments] = useState<Record<number, string>>({});
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [bestScore, setBestScore] = useState(0);

    const startGame = useCallback(() => {
        const shuffled = shuffleArray(bookMatchData).slice(0, ROUNDS);
        setQuestions(shuffled);
        setRound(0);
        setScore(0);
        setAssignments({});
        setFeedback(null);
        setPhase("playing");
    }, []);

    const handleCategorySelect = (bookId: number, category: string) => {
        if (feedback) return;
        const newAssignments = { ...assignments, [bookId]: category };
        setAssignments(newAssignments);

        const currentQ = questions[round];
        const allAssigned = currentQ.books.every((b) => newAssignments[b.id] !== undefined);
        if (allAssigned) {
            const correct = currentQ.books.every((b) => newAssignments[b.id] === b.category);
            setFeedback(correct ? "correct" : "incorrect");
            if (correct) setScore((s) => s + 1);
            setTimeout(() => {
                if (round + 1 >= ROUNDS) {
                    finishGame(correct ? score + 1 : score);
                } else {
                    setRound((r) => r + 1);
                    setAssignments({});
                    setFeedback(null);
                }
            }, 1200);
        }
    };

    const finishGame = async (finalScore: number) => {
        setPhase("result");
        await saveGameScore("book_match", finalScore, ROUNDS, null);
        const r = await getBestScores("book_match");
        if (r.success) setBestScore(r.bestScore ?? 0);
    };

    return (
        <div className="container-fluid py-4 min-vh-100" style={{ background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" }}>
            <div className="max-w-4xl mx-auto">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Link href="/dashboard/games" className="btn btn-white bg-white text-dark rounded-circle p-2 shadow-sm border-0">
                        <ArrowLeft size={22} />
                    </Link>
                    <h1 className="h3 mb-0 fw-bold text-white">Empareja Libros</h1>
                </div>

                {phase === "start" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-5">
                        <div className="bg-white/10 rounded-5 p-5 backdrop-blur-sm max-w-md mx-auto">
                            <div className="bg-white/20 d-inline-flex p-4 rounded-circle mb-3">
                                <Trophy size={48} className="text-warning" />
                            </div>
                            <h2 className="fw-bold text-white mb-2">¡Empareja Libros!</h2>
                            <p className="text-white/80 mb-1">Clasifica cada libro bíblico en su categoría correcta.</p>
                            <p className="text-white/60 small mb-4">{ROUNDS} rondas para completar</p>
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
                            <div className="progress mb-4" style={{ height: "6px", borderRadius: "3px" }}>
                                <div className="progress-bar bg-warning" style={{ width: `${((round + 1) / ROUNDS) * 100}%` }} />
                            </div>

                            <p className="text-muted small mb-3 text-center">Asigna cada libro a su categoría:</p>

                            <div className="d-flex flex-column gap-2 mb-4">
                                {questions[round].books.map((book) => {
                                    const assigned = assignments[book.id];
                                    let cardClass = "bg-light rounded-3 p-3 d-flex justify-content-between align-items-center";
                                    if (feedback) {
                                        if (assigned === book.category) cardClass += " border border-success";
                                        else if (assigned) cardClass += " border border-danger";
                                    }
                                    return (
                                        <div key={book.id} className={cardClass}>
                                            <span className="fw-bold">{book.book}</span>
                                            <div className="d-flex gap-1">
                                                {questions[round].options.map((cat) => {
                                                    const isSelected = assigned === cat;
                                                    let btnClass = "btn btn-sm rounded-pill";
                                                    if (feedback && isSelected) {
                                                        btnClass += cat === book.category ? " btn-success" : " btn-danger";
                                                    } else if (isSelected) {
                                                        btnClass += " btn-primary";
                                                    } else {
                                                        btnClass += " btn-outline-secondary";
                                                    }
                                                    return (
                                                        <button key={cat} onClick={() => handleCategorySelect(book.id, cat)}
                                                            disabled={feedback !== null}
                                                            className={btnClass}
                                                        >
                                                            {cat}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {feedback && (
                                <div className={`text-center fw-bold ${feedback === "correct" ? "text-success" : "text-danger"}`}>
                                    {feedback === "correct" ? "✅ ¡Correcto!" : "❌ Incorrecto"}
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
                                {score >= 8 && score < ROUNDS && <p className="text-white fw-bold">¡Muy bien! 🙌</p>}
                                {score < 8 && <p className="text-white fw-bold">¡Sigue practicando! 💪</p>}
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

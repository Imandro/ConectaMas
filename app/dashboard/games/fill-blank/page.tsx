"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fillBlankData, FillBlankQuestion } from "@/app/data/games/fillBlankData";
import { saveGameScore, getBestScores } from "@/app/actions/gameScore";
import { Check, X } from "lucide-react";

const ROUNDS = 10;

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getScoreMessage(score: number) {
    if (score === ROUNDS) return { text: "¡Perfecto! 🎉", level: "legend" };
    if (score >= ROUNDS * 0.8) return { text: "¡Excelente! 🔥", level: "amazing" };
    if (score >= ROUNDS * 0.6) return { text: "¡Buen trabajo! 🙌", level: "good" };
    if (score >= ROUNDS * 0.4) return { text: "¡Sigue así! 💪", level: "ok" };
    return { text: "¡Sigue practicando! 📖", level: "keep" };
}

function StepIndicator({ current, total }: { current: number; total: number }) {
    return (
        <div className="d-flex align-items-center gap-1">
            {Array.from({ length: total }, (_, i) => (
                <div key={i} className={`step-dot ${i < current ? "completed" : i === current ? "active" : ""}`} />
            ))}
        </div>
    );
}

function Confetti() {
    const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd", "#01a3a4", "#f368e0"];
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i, x: Math.random() * 100, color: colors[i % colors.length],
        delay: Math.random() * 0.5, size: 6 + Math.random() * 8, rotation: Math.random() * 360,
    }));
    return (
        <div className="confetti-container">
            {particles.map((p) => (
                <div key={p.id} className="confetti-particle" style={{
                    left: `${p.x}%`, width: p.size, height: p.size * 0.6,
                    backgroundColor: p.color, animationDelay: `${p.delay}s`,
                    transform: `rotate(${p.rotation}deg)`,
                }} />
            ))}
        </div>
    );
}

export default function FillBlankGame() {
    const [phase, setPhase] = useState<"start" | "playing" | "result">("start");
    const [questions, setQuestions] = useState<FillBlankQuestion[]>([]);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [bestScore, setBestScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    const startGame = useCallback(() => {
        const shuffled = shuffleArray(fillBlankData).slice(0, ROUNDS);
        setQuestions(shuffled);
        setRound(0);
        setScore(0);
        setSelectedAnswer(null);
        setFeedback(null);
        setShowConfetti(false);
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
                const final = correct ? score + 1 : score;
                setPhase("result");
                if (final === ROUNDS) setShowConfetti(true);
                saveGameScore("fill_blank", final, ROUNDS, null);
                getBestScores("fill_blank").then((r) => {
                    if (r.success) setBestScore(r.bestScore ?? 0);
                });
            } else {
                setRound((r) => r + 1);
                setSelectedAnswer(null);
                setFeedback(null);
            }
        }, correct ? 1200 : 1800);
    };

    return (
        <div className="min-vh-100 game-gradient">
            <div className="container py-4">
                <div className="mx-auto" style={{ maxWidth: 640 }}>
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <Link href="/dashboard/games" className="btn btn-white bg-white text-dark rounded-circle p-2 shadow-sm border-0">
                            <ArrowLeft size={22} />
                        </Link>
                        <h1 className="h4 mb-0 fw-bold text-white">Completa el Verso</h1>
                    </div>

                    {phase === "start" && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                            <div className="start-card mx-auto">
                                <div className="start-icon-wrap mx-auto mb-3">
                                    <Trophy size={40} className="text-warning" />
                                </div>
                                <h2 className="fw-bold mb-2">¡Completa el Verso!</h2>
                                <p className="text-muted mb-3">Elige la palabra correcta para completar el versículo.</p>
                                <p className="tip-text mb-3">📖 Ten tu Biblia a mano para memorizar mejor cada versículo.</p>
                                {bestScore > 0 && (
                                    <p className="text-warning small mb-3 fw-bold">🏆 Mejor puntaje: {bestScore}/{ROUNDS}</p>
                                )}
                                <button onClick={startGame} className="btn btn-warning rounded-pill px-5 py-2 fw-bold shadow-lg start-btn">
                                    ¡Comenzar!
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {phase === "playing" && questions[round] && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={round}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                animate={{
                                    opacity: 1, y: 0, scale: 1,
                                    boxShadow: feedback === "correct"
                                        ? "0 0 40px rgba(46, 204, 113, 0.5)"
                                        : feedback === "incorrect"
                                            ? "0 0 40px rgba(231, 76, 60, 0.5)"
                                            : "0 4px 20px rgba(0,0,0,0.08)",
                                }}
                                exit={{ opacity: 0, x: -60 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className={`game-card ${feedback === "correct" ? "feedback-correct" : feedback === "incorrect" ? "feedback-incorrect" : ""}`}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <span className="round-badge">{round + 1}/{ROUNDS}</span>
                                    <div className="d-flex align-items-center gap-2">
                                        <StepIndicator current={round} total={ROUNDS} />
                                        <span className="score-badge">⭐ {score}</span>
                                    </div>
                                </div>

                                <div className="verse-display mb-3">
                                    <p className="fs-5 fw-bold mb-1 verse-text">{questions[round].verse}</p>
                                    <small className="text-muted">{questions[round].reference}</small>
                                </div>

                                <div className="d-flex flex-column gap-2">
                                    {questions[round].options.map((opt, i) => {
                                        let btnClass = "option-btn";
                                        if (selectedAnswer !== null) {
                                            if (i === questions[round].correctIndex) {
                                                btnClass = "option-btn option-correct";
                                            } else if (i === selectedAnswer && feedback === "incorrect") {
                                                btnClass = "option-btn option-wrong";
                                            } else {
                                                btnClass = "option-btn option-dimmed";
                                            }
                                        }
                                        return (
                                            <motion.button
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.06 }}
                                                onClick={() => handleAnswer(i)}
                                                disabled={feedback !== null}
                                                className={btnClass}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                                                <span className="option-text">{opt}</span>
                                                {selectedAnswer !== null && i === questions[round].correctIndex && (
                                                    <Check size={18} className="option-icon text-success" />
                                                )}
                                                {i === selectedAnswer && feedback === "incorrect" && (
                                                    <X size={18} className="option-icon text-danger" />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                <AnimatePresence>
                                    {feedback && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`feedback-banner mt-3 ${feedback === "correct" ? "bg-success" : "bg-danger"} text-white`}
                                        >
                                            {feedback === "correct" ? "✅ ¡Correcto!" : `❌ Incorrecto — Era: ${questions[round].options[questions[round].correctIndex]}`}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {phase === "result" && (
                        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                            {showConfetti && <Confetti />}
                            <div className="result-card mx-auto">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="result-trophy-wrap mx-auto mb-3"
                                >
                                    <Trophy size={48} className="text-warning" />
                                </motion.div>
                                <h2 className="fw-bold mb-1">{getScoreMessage(score).text}</h2>
                                <div className="score-ring mx-auto my-3">
                                    <svg width="120" height="120" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                                        <motion.circle
                                            cx="60" cy="60" r="52" fill="none"
                                            stroke={score === ROUNDS ? "#f59e0b" : score >= ROUNDS * 0.6 ? "#10b981" : "#6b7280"}
                                            strokeWidth="8" strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 52}`}
                                            initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - score / ROUNDS) }}
                                            transition={{ duration: 1.2, ease: "easeOut" }}
                                            transform="rotate(-90 60 60)"
                                        />
                                        <text x="60" y="60" textAnchor="middle" dominantBaseline="central"
                                            fontSize="28" fontWeight="bold" fill="white">
                                            {score}/{ROUNDS}
                                        </text>
                                    </svg>
                                </div>
                                <div className="d-flex justify-content-center gap-2 flex-wrap mb-3">
                                    <div className="stat-chip"><Star size={14} /><span>{Math.round((score / ROUNDS) * 100)}% acierto</span></div>
                                </div>
                                {bestScore >= score && bestScore > score && (
                                    <p className="text-white-50 small">🏆 Tu récord: {bestScore}/{ROUNDS}</p>
                                )}
                                <div className="d-flex justify-content-center gap-2 flex-column flex-sm-row mt-3">
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
            </div>

            <style jsx>{`
                .game-gradient {
                    background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
                }
                .start-card {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    padding: 2.5rem 2rem;
                    max-width: 420px;
                    color: #fff;
                }
                .start-icon-wrap {
                    width: 80px; height: 80px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.12); border-radius: 50%;
                }
                .tip-text {
                    background: rgba(255,193,7,0.12);
                    border-radius: 12px; padding: 10px 16px;
                    font-size: 0.85rem; color: #ffc107;
                }
                .start-btn {
                    font-size: 1.05rem;
                    padding: 12px 48px !important;
                    animation: pulse-btn 2s ease-in-out infinite;
                }
                @keyframes pulse-btn {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(255,193,7,0.4); }
                    50% { box-shadow: 0 0 0 12px rgba(255,193,7,0); }
                }

                .game-card {
                    background: #fff;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    transition: box-shadow 0.3s ease;
                }
                .game-card.feedback-correct { box-shadow: 0 0 30px rgba(46,204,113,0.35), 0 4px 20px rgba(0,0,0,0.08); }
                .game-card.feedback-incorrect { box-shadow: 0 0 30px rgba(231,76,60,0.35), 0 4px 20px rgba(0,0,0,0.08); }

                .round-badge {
                    background: linear-gradient(135deg, #06b6d4, #0891b2);
                    color: #fff; font-weight: 700; font-size: 0.8rem;
                    padding: 4px 14px; border-radius: 100px;
                }
                .score-badge { font-weight: 700; color: #f59e0b; font-size: 0.9rem; }

                .step-dot {
                    width: 10px; height: 10px; border-radius: 50%;
                    background: rgba(0,0,0,0.12);
                    transition: all 0.3s ease;
                }
                .step-dot.active { background: #06b6d4; box-shadow: 0 0 0 3px rgba(6,182,212,0.3); }
                .step-dot.completed { background: #10b981; }

                .verse-display {
                    background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
                    border-radius: 16px;
                    padding: 1.25rem;
                    text-align: center;
                    border: 2px solid #99f6e4;
                }
                .verse-text { line-height: 1.6; }

                .option-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #fff;
                    border: 2px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 12px 16px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: #1e293b;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }
                .option-btn:hover:not(:disabled) {
                    border-color: #06b6d4;
                    box-shadow: 0 4px 14px rgba(6,182,212,0.15);
                    transform: translateY(-1px);
                }
                .option-btn:disabled { cursor: not-allowed; }
                .option-correct {
                    border-color: #10b981 !important;
                    background: #f0fdf4 !important;
                    box-shadow: 0 0 0 3px rgba(16,185,129,0.2) !important;
                }
                .option-wrong {
                    border-color: #ef4444 !important;
                    background: #fef2f2 !important;
                    box-shadow: 0 0 0 3px rgba(239,68,68,0.2) !important;
                }
                .option-dimmed { opacity: 0.5; }
                .option-letter {
                    width: 32px; height: 32px;
                    display: flex; align-items: center; justify-content: center;
                    background: #f1f5f9; border-radius: 50%;
                    font-weight: 700; font-size: 0.85rem; color: #64748b;
                    flex-shrink: 0;
                }
                .option-text { flex: 1; }
                .option-icon { flex-shrink: 0; }

                .feedback-banner {
                    font-weight: 700; font-size: 0.9rem;
                    padding: 10px 16px; border-radius: 12px;
                    text-align: center;
                }

                .result-card {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px; padding: 2.5rem 2rem;
                    max-width: 420px; color: #fff;
                    position: relative; overflow: hidden;
                }
                .result-trophy-wrap {
                    width: 88px; height: 88px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.12); border-radius: 50%;
                }
                .stat-chip {
                    background: rgba(255,255,255,0.1);
                    border-radius: 100px; padding: 5px 14px;
                    font-size: 0.8rem; color: rgba(255,255,255,0.8);
                    display: flex; align-items: center; gap: 5px;
                }

                .confetti-container {
                    position: fixed; top: 0; left: 0;
                    width: 100%; height: 100%;
                    pointer-events: none; z-index: 9999; overflow: hidden;
                }
                .confetti-particle {
                    position: absolute; top: -20px; border-radius: 2px;
                    animation: confetti-fall 3s ease-in-out forwards;
                }
                @keyframes confetti-fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }

                @media (max-width: 576px) {
                    .game-card { padding: 1rem; }
                    .start-card, .result-card { padding: 1.5rem 1rem; }
                    .option-btn { padding: 10px 12px; font-size: 0.85rem; }
                }
            `}</style>
        </div>
    );
}

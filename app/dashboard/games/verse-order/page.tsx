"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, RotateCcw, Check, X, Star, BookOpen } from "lucide-react";
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

function getScoreMessage(score: number) {
    if (score === ROUNDS) return { text: "¡Perfecto! 🎉", emoji: "🏆", level: "legend" };
    if (score >= ROUNDS * 0.8) return { text: "¡Excelente! 🔥", emoji: "🔥", level: "amazing" };
    if (score >= ROUNDS * 0.6) return { text: "¡Buen trabajo! 🙌", emoji: "🙌", level: "good" };
    if (score >= ROUNDS * 0.4) return { text: "¡Sigue así! 💪", emoji: "💪", level: "ok" };
    return { text: "¡Sigue practicando! 📖", emoji: "📖", level: "keep" };
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
    const particles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[i % colors.length],
        delay: Math.random() * 0.5,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
    }));

    return (
        <div className="confetti-container">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="confetti-particle"
                    style={{
                        left: `${p.x}%`,
                        width: p.size,
                        height: p.size * 0.6,
                        backgroundColor: p.color,
                        animationDelay: `${p.delay}s`,
                        transform: `rotate(${p.rotation}deg)`,
                    }}
                />
            ))}
        </div>
    );
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
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [saving, setSaving] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

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
        setStreak(0);
        setMaxStreak(0);
        setShuffledWords(shuffleArray(shuffled[0].words));
        setSelectedWords([]);
        setFeedback(null);
        setShowConfetti(false);
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
            if (correct) {
                const newStreak = streak + 1;
                setStreak(newStreak);
                if (newStreak > maxStreak) setMaxStreak(newStreak);
                setScore((s) => s + 1);
            } else {
                setStreak(0);
            }
            setTimeout(() => nextRound(), correct ? 1500 : 2200);
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
        if (finalScore === ROUNDS) setShowConfetti(true);
        setSaving(true);
        await saveGameScore("verse_order", finalScore, ROUNDS, null);
        const r = await getBestScores("verse_order");
        if (r.success) setBestScore(r.bestScore ?? 0);
        setSaving(false);
    };

    const currentQ = questions[round];

    return (
        <div className="min-vh-100 game-gradient">
            <div className="container py-4">
                <div className="mx-auto" style={{ maxWidth: 640 }}>
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <Link href="/dashboard/games" className="btn btn-white bg-white text-dark rounded-circle p-2 shadow-sm border-0">
                            <ArrowLeft size={22} />
                        </Link>
                        <h1 className="h4 mb-0 fw-bold text-white">Ordena el Versículo</h1>
                    </div>

                    {phase === "start" && (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                            <div className="start-card mx-auto">
                                <div className="start-icon-wrap mx-auto mb-3">
                                    <BookOpen size={40} className="text-warning" />
                                </div>
                                <h2 className="fw-bold mb-2">¡Ordena el Versículo!</h2>
                                <p className="text-muted mb-3">Arma el versículo tocando las palabras en el orden correcto.</p>
                                <div className="d-flex justify-content-center gap-3 mb-3">
                                    <div className="instruction-chip">
                                        <span className="instruction-icon">👆</span>
                                        <span>Toca</span>
                                    </div>
                                    <div className="instruction-chip">
                                        <span className="instruction-icon">🎯</span>
                                        <span>Acierta</span>
                                    </div>
                                    <div className="instruction-chip">
                                        <span className="instruction-icon">⭐</span>
                                        <span>Gana</span>
                                    </div>
                                </div>
                                <p className="text-muted small mb-3">{ROUNDS} versículos para completar</p>
                                <p className="tip-text mb-3">📖 Ten tu Biblia a mano para consultar el orden correcto.</p>
                                {bestScore > 0 && (
                                    <p className="text-warning small mb-3 fw-bold">🏆 Mejor puntaje: {bestScore}/{ROUNDS}</p>
                                )}
                                <button onClick={startGame} className="btn btn-warning rounded-pill px-5 py-2 fw-bold shadow-lg start-btn">
                                    ¡Comenzar!
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {phase === "playing" && currentQ && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={round}
                                ref={cardRef}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
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
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="round-badge">{round + 1}/{ROUNDS}</span>
                                        {streak >= 2 && (
                                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="streak-badge">
                                                🔥 {streak}
                                            </motion.span>
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <StepIndicator current={round} total={ROUNDS} />
                                        <span className="score-badge">⭐ {score}</span>
                                    </div>
                                </div>

                                <div className="reference-banner mb-3">
                                    <BookOpen size={14} className="me-1" />
                                    {currentQ.reference}
                                </div>

                                <div className={`verse-area mb-3 ${feedback === "incorrect" ? "shake" : ""}`}>
                                    {selectedWords.length === 0 && !feedback && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="verse-placeholder m-0"
                                        >
                                            Toca las palabras en el orden correcto...
                                        </motion.p>
                                    )}
                                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                                        {selectedWords.map((word, i) => (
                                            <motion.span
                                                key={`sel-${i}-${word}`}
                                                initial={{ opacity: 0, y: -20, scale: 0.5 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                className="selected-word"
                                            >
                                                {word}
                                                <span className="word-index">{i + 1}</span>
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {feedback && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={`feedback-banner ${feedback === "correct" ? "bg-success" : "bg-danger"} text-white text-center py-2 px-3 rounded-pill mb-3 d-inline-block mx-auto`}
                                        >
                                            {feedback === "correct" ? (
                                                <><Check size={18} className="me-1" /> ¡Correcto!</>
                                            ) : (
                                                <><X size={18} className="me-1" /> Incorrecto</>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {feedback === "incorrect" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="correct-answer-box mb-3"
                                    >
                                        <small className="text-muted d-block mb-1">Orden correcto:</small>
                                        <div className="d-flex flex-wrap gap-1 justify-content-center">
                                            {currentQ.words.map((w, i) => (
                                                <span key={i} className="correct-word-badge">{w}</span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                <div className="d-flex flex-wrap gap-2 justify-content-center mb-2 word-tiles-wrap">
                                    {shuffledWords.map((word, i) => (
                                        <motion.button
                                            key={`${round}-${i}-${word}`}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ delay: i * 0.03, type: "spring", stiffness: 200 }}
                                            onClick={() => handleWordClick(word, i)}
                                            disabled={!!feedback}
                                            whileTap={{ scale: 0.92 }}
                                            whileHover={{ scale: 1.04, y: -3 }}
                                            className="word-tile"
                                        >
                                            {word}
                                        </motion.button>
                                    ))}
                                </div>

                                {selectedWords.length > 0 && !feedback && (
                                    <div className="text-center mt-2">
                                        <button onClick={undoLastWord} className="undo-btn">
                                            <RotateCcw size={14} className="me-1" />Deshacer
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {phase === "result" && (
                        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                            {showConfetti && <Confetti />}
                            <div className="result-card mx-auto">
                                <div className="mb-3">
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
                                            <circle cx="60" cy="60" r="52" fill="none" stroke="#e9ecef" strokeWidth="8" />
                                            <motion.circle
                                                cx="60" cy="60" r="52" fill="none"
                                                stroke={score === ROUNDS ? "#f59e0b" : score >= ROUNDS * 0.6 ? "#10b981" : "#6b7280"}
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 52}`}
                                                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                                                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - score / ROUNDS) }}
                                                transition={{ duration: 1.2, ease: "easeOut" }}
                                                transform="rotate(-90 60 60)"
                                            />
                                            <text x="60" y="60" textAnchor="middle" dominantBaseline="central"
                                                fontSize="28" fontWeight="bold" fill="currentColor">
                                                {score}/{ROUNDS}
                                            </text>
                                        </svg>
                                    </div>
                                    <div className="d-flex justify-content-center gap-3 flex-wrap mb-2">
                                        <div className="stat-chip">
                                            <Star size={14} className="text-warning" />
                                            <span>Racha: {maxStreak}</span>
                                        </div>
                                        <div className="stat-chip">
                                            <span>{Math.round((score / ROUNDS) * 100)}% acierto</span>
                                        </div>
                                    </div>
                                    {bestScore >= score && bestScore > score && (
                                        <p className="text-muted small">🏆 Tu récord: {bestScore}/{ROUNDS}</p>
                                    )}
                                </div>
                                <div className="d-flex justify-content-center gap-2 flex-column flex-sm-row">
                                    <button onClick={startGame} className="btn btn-warning rounded-pill px-4 py-2 fw-bold shadow-sm">
                                        Jugar de nuevo
                                    </button>
                                    <Link href="/dashboard/games" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold">
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
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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
                    width: 80px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.12);
                    border-radius: 50%;
                }
                .instruction-chip {
                    background: rgba(255,255,255,0.1);
                    border-radius: 100px;
                    padding: 6px 14px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.8);
                }
                .instruction-icon { font-size: 1rem; }
                .tip-text {
                    background: rgba(255,193,7,0.12);
                    border-radius: 12px;
                    padding: 10px 16px;
                    font-size: 0.85rem;
                    color: #ffc107;
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
                .game-card.feedback-correct {
                    box-shadow: 0 0 30px rgba(46,204,113,0.35), 0 4px 20px rgba(0,0,0,0.08);
                }
                .game-card.feedback-incorrect {
                    box-shadow: 0 0 30px rgba(231,76,60,0.35), 0 4px 20px rgba(0,0,0,0.08);
                }

                .round-badge {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                    font-weight: 700;
                    font-size: 0.8rem;
                    padding: 4px 14px;
                    border-radius: 100px;
                }
                .streak-badge {
                    background: linear-gradient(135deg, #f59e0b, #ef4444);
                    color: #fff;
                    font-weight: 700;
                    font-size: 0.75rem;
                    padding: 3px 10px;
                    border-radius: 100px;
                }
                .score-badge {
                    font-weight: 700;
                    color: #f59e0b;
                    font-size: 0.9rem;
                }

                .step-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #e9ecef;
                    transition: all 0.3s ease;
                }
                .step-dot.active {
                    background: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.3);
                }
                .step-dot.completed {
                    background: #10b981;
                }

                .reference-banner {
                    background: linear-gradient(135deg, #eef2ff, #e0e7ff);
                    color: #4338ca;
                    font-weight: 600;
                    font-size: 0.85rem;
                    padding: 8px 14px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .verse-area {
                    background: linear-gradient(135deg, #fefce8, #fef3c7);
                    border: 2px dashed #f59e0b;
                    border-radius: 16px;
                    padding: 1.25rem;
                    min-height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .verse-area.shake {
                    animation: shake 0.5s ease-in-out;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-5px); }
                    80% { transform: translateX(5px); }
                }
                .verse-placeholder {
                    color: #d4a017;
                    font-style: italic;
                    font-size: 0.9rem;
                    user-select: none;
                }

                .selected-word {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                    font-weight: 600;
                    font-size: 0.95rem;
                    padding: 8px 16px;
                    border-radius: 100px;
                    position: relative;
                    box-shadow: 0 3px 10px rgba(99,102,241,0.3);
                }
                .word-index {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #f59e0b;
                    color: #fff;
                    font-size: 0.65rem;
                    font-weight: 700;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }

                .feedback-banner {
                    font-weight: 700;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    box-shadow: 0 3px 12px rgba(0,0,0,0.15);
                }

                .correct-answer-box {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 10px 14px;
                    text-align: center;
                }
                .correct-word-badge {
                    background: #e9ecef;
                    color: #495057;
                    font-size: 0.8rem;
                    font-weight: 600;
                    padding: 3px 10px;
                    border-radius: 100px;
                }

                .word-tiles-wrap {
                    min-height: 60px;
                }
                .word-tile {
                    background: #fff;
                    border: 2px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 10px 20px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: #1e293b;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    transition: border-color 0.2s, box-shadow 0.2s;
                    user-select: none;
                    -webkit-tap-highlight-color: transparent;
                }
                .word-tile:hover:not(:disabled) {
                    border-color: #6366f1;
                    box-shadow: 0 6px 16px rgba(99,102,241,0.15);
                }
                .word-tile:active:not(:disabled) {
                    transform: scale(0.95);
                }
                .word-tile:disabled {
                    cursor: not-allowed;
                    opacity: 0.5;
                }

                .undo-btn {
                    background: none;
                    border: 1px solid #dee2e6;
                    border-radius: 100px;
                    padding: 6px 16px;
                    font-size: 0.8rem;
                    color: #6c757d;
                    transition: all 0.2s;
                }
                .undo-btn:hover {
                    background: #f8f9fa;
                    border-color: #adb5bd;
                }

                .result-card {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    padding: 2.5rem 2rem;
                    max-width: 420px;
                    color: #fff;
                    position: relative;
                    overflow: hidden;
                }
                .result-trophy-wrap {
                    width: 88px;
                    height: 88px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.12);
                    border-radius: 50%;
                }
                .stat-chip {
                    background: rgba(255,255,255,0.1);
                    border-radius: 100px;
                    padding: 5px 14px;
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.8);
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .confetti-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 9999;
                    overflow: hidden;
                }
                .confetti-particle {
                    position: absolute;
                    top: -20px;
                    border-radius: 2px;
                    animation: confetti-fall 3s ease-in-out forwards;
                }
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }

                @media (max-width: 576px) {
                    .game-card { padding: 1rem; }
                    .start-card { padding: 1.5rem 1rem; }
                    .result-card { padding: 1.5rem 1rem; }
                    .word-tile { padding: 8px 14px; font-size: 0.85rem; }
                    .selected-word { font-size: 0.85rem; padding: 6px 12px; }
                }
            `}</style>
        </div>
    );
}

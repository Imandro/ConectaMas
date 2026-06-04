"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Zap, ChevronLeft, Edit2, Check, X, Trophy, Star, Moon, Sun, Book, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";
import LlamiMascot from "@/app/components/LlamiMascot";
import { getOrCreateMascot, feedMascot, updateMascotName } from "./actions";
import { toast } from "react-hot-toast";
import TriviaGame from "@/app/components/TriviaGame";
import { Gamepad2, HelpCircle } from "lucide-react";
import LlamiTutorial from "@/app/components/LlamiTutorial";
import { completeLlamiTutorial } from "./actions";
import { useLanguage } from "@/app/LanguageContext";

export const dynamic = 'force-dynamic';

const STAR_POSITIONS = [
    { x: "15%", y: "10%" }, { x: "45%", y: "5%" }, { x: "75%", y: "12%" },
    { x: "30%", y: "25%" }, { x: "65%", y: "20%" }, { x: "85%", y: "8%" },
    { x: "10%", y: "22%" }, { x: "55%", y: "15%" }, { x: "90%", y: "18%" },
    { x: "22%", y: "18%" }, { x: "70%", y: "28%" }, { x: "40%", y: "8%" },
];

export default function LlamiPage() {
    const { t } = useLanguage();
    const [mascot, setMascot] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFeeding, setIsFeeding] = useState(false);
    const [isPlayingTrivia, setIsPlayingTrivia] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [prevLevel, setPrevLevel] = useState<number | null>(null);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString("es-NI", { hour: "2-digit", minute: "2-digit" }));
    }, []);

    const loadMascot = async () => {
        try {
            const data = await getOrCreateMascot();
            if (data) {
                if (prevLevel !== null && data.level > prevLevel) {
                    setShowLevelUp(true);
                    setTimeout(() => setShowLevelUp(false), 5000);
                }
                setMascot(data);
                setPrevLevel(data.level);
                if (!data.user?.hasSeenLlamiTutorial) {
                    setShowTutorial(true);
                }
            } else {
                console.error("Failed to load mascot data.");
            }
        } catch (error) {
            console.error("Error loading mascot:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMascot();
    }, []);

    const handleFeed = async () => {
        if (isFeeding) return;
        setIsFeeding(true);

        const result = await feedMascot();

        if (result.success) {
            toast.success(t.llami.toast_happy, {
                icon: '🔥',
                style: { borderRadius: '15px', background: '#333', color: '#fff' }
            });
            await loadMascot();
        } else {
            toast.error(result.error || t.llami.toast_error);
        }

        setTimeout(() => setIsFeeding(false), 2000);
    };

    const handleTutorialComplete = async () => {
        setShowTutorial(false);
        await completeLlamiTutorial();
        await loadMascot();
    };

    const handleUpdateName = async () => {
        if (!newName.trim()) return;
        const result = await updateMascotName(newName);
        if (result.success) {
            toast.success(t.llami.toast_rename_success);
            setIsEditingName(false);
            loadMascot();
        } else {
            toast.error(result.error || t.llami.toast_rename_error);
        }
    };

    const getStageKey = (streak: number) => {
        if (streak <= 7) return "spark";
        if (streak <= 30) return "flame";
        if (streak <= 90) return "torch";
        if (streak <= 365) return "sun";
        return "star";
    };

    const stageNames = { spark: "Chispa", flame: "Llama", torch: "Antorcha", sun: "Sol", star: "Estrella" };
    const stageIcons = { spark: "🔥", flame: "🔥", torch: "✨", sun: "☀️", star: "⭐" };

    const getAchievedMilestones = () => {
        if (!mascot?.streak) return [];
        const achieved: number[] = [];
        const targets = [7, 30, 50, 100, 365];
        for (const t of targets) {
            if (mascot.streak >= t) achieved.push(t);
        }
        return achieved;
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-midnight text-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Flame size={48} className="text-primary" />
                </motion.div>
            </div>
        );
    }

    if (!mascot) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning">
                    {t.llami.error_load}
                </div>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>{t.llami.reload_button}</button>
            </div>
        );
    }

    const stage = getStageKey(mascot.streak || 0);
    const achievedMilestones = getAchievedMilestones();
    const nextMilestone = [7, 30, 50, 100, 365].find(m => !achievedMilestones.includes(m)) || 365;

    return (
        <div className="container-fluid py-4 min-vh-100 bg-light text-primary">
            <div className="d-flex align-items-center justify-content-between mb-5">
                <div className="d-flex align-items-center gap-3">
                    <Link href="/dashboard" className="btn btn-white bg-white text-primary rounded-circle p-2 shadow-sm border-0">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="h2 mb-0 fw-bold">{t.llami.title}</h1>
                </div>
                <div className="d-flex gap-2">
                    <div className="bg-white rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2 small text-muted">
                        <Clock size={14} />
                        {currentTime}
                    </div>
                    <button
                        onClick={() => setShowTutorial(true)}
                        className="btn btn-white bg-white text-warning rounded-pill px-3 py-2 shadow-sm border-0 d-flex align-items-center gap-2 fw-bold"
                    >
                        <HelpCircle size={20} />
                        <span className="d-none d-md-inline">{t.llami.help}</span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showTutorial && (
                    <LlamiTutorial onComplete={handleTutorialComplete} />
                )}
                {showLevelUp && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white bg-opacity-75"
                        style={{ zIndex: 9999 }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, repeat: 3 }}
                        >
                            <Trophy size={120} className="text-warning mb-4" />
                        </motion.div>
                        <h1 className="display-3 fw-bold text-primary mb-0">¡NIVEL {mascot?.level}!</h1>
                        <p className="lead fw-bold text-muted">¡{mascot?.name} está evolucionando!</p>
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="position-absolute rounded-1"
                                style={{
                                    width: 10, height: 10,
                                    backgroundColor: ['#ffc107', '#fd7e14', '#20c997', '#0d6efd', '#d63384'][i % 5],
                                    top: '50%', left: '50%'
                                }}
                                animate={{
                                    x: (Math.random() - 0.5) * 500,
                                    y: (Math.random() - 0.5) * 500,
                                    rotate: Math.random() * 360,
                                    opacity: [1, 0]
                                }}
                                transition={{ duration: 2, ease: "easeOut" }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {isPlayingTrivia ? (
                <div className="max-w-2xl mx-auto py-4">
                    <TriviaGame onComplete={() => {
                        setIsPlayingTrivia(false);
                        loadMascot();
                    }} />
                </div>
            ) : (
                <div className="row justify-content-center">

                    {/* Main column: Room + Stats */}
                    <div className="col-lg-8">
                        {/* --- COZY ROOM --- */}
                        <div className="position-relative py-2 mb-4">
                            <motion.div
                                className="mx-auto position-relative shadow-lg rounded-5 overflow-hidden"
                                animate={{
                                    background: isDarkMode ? '#1a1c2c' : '#f5f1ed',
                                    borderColor: isDarkMode ? '#0f172a' : '#fff'
                                }}
                                transition={{ duration: 0.7 }}
                                style={{
                                    width: '100%',
                                    maxWidth: '520px',
                                    height: '420px',
                                    border: '8px solid',
                                    boxShadow: isDarkMode ? '0 0 50px rgba(255,165,0,0.15)' : '0 10px 30px rgba(0,0,0,0.1)'
                                }}
                            >
                                {/* WALL */}
                                <motion.div
                                    className="position-absolute top-0 start-0 w-100"
                                    animate={{
                                        background: isDarkMode ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 70%, #1a1c2c 100%)' : 'linear-gradient(180deg, #fdfbf7 0%, #f5f1ed 70%, #eee7db 100%)'
                                    }}
                                    transition={{ duration: 0.7 }}
                                    style={{ height: '70%' }}
                                >
                                    {/* ★ WINDOW (day/night) */}
                                    <motion.div
                                        className="position-absolute rounded-3 overflow-hidden shadow-inner"
                                        animate={{
                                            background: isDarkMode ? 'linear-gradient(180deg, #0c1445 0%, #1a237e 100%)' : 'linear-gradient(180deg, #87CEEB 0%, #b8e1f5 100%)'
                                        }}
                                        transition={{ duration: 0.7 }}
                                        style={{ width: '90px', height: '100px', left: '20px', top: '25px', border: '4px solid #8B7355' }}
                                    >
                                        {/* Window cross */}
                                        <div className="position-absolute top-50 start-0 w-100" style={{ height: '2px', background: '#8B7355', zIndex: 2 }} />
                                        <div className="position-absolute top-0 start-50 h-100" style={{ width: '2px', background: '#8B7355', zIndex: 2 }} />
                                        {/* Sun or Moon */}
                                        {isDarkMode ? (
                                            <motion.div
                                                className="position-absolute rounded-circle"
                                                style={{ width: '20px', height: '20px', background: '#e2e8f0', top: '15px', right: '12px', zIndex: 1 }}
                                                animate={{ boxShadow: ['0 0 4px #e2e8f0', '0 0 10px #e2e8f0', '0 0 4px #e2e8f0'] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <div className="position-absolute" style={{ width: '8px', height: '8px', background: '#1a1c2c', borderRadius: '50%', top: '-2px', right: '-3px' }} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="position-absolute rounded-circle"
                                                style={{ width: '24px', height: '24px', background: '#FDB813', top: '12px', right: '10px', zIndex: 1 }}
                                                animate={{ boxShadow: ['0 0 6px #FDB813', '0 0 14px #FDB813', '0 0 6px #FDB813'] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        )}
                                        {/* Stars at night */}
                                        {isDarkMode && STAR_POSITIONS.map((s, i) => (
                                            <motion.div
                                                key={i}
                                                className="position-absolute rounded-circle bg-white"
                                                style={{ width: '2px', height: '2px', top: s.y, left: s.x, zIndex: 0 }}
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: Math.random() }}
                                            />
                                        ))}
                                    </motion.div>

                                    {/* Picture frame 1 */}
                                    <motion.div
                                        className="position-absolute rounded-1 shadow-sm overflow-hidden"
                                        animate={{ opacity: isDarkMode ? 0.3 : 1 }}
                                        style={{ width: '55px', height: '45px', right: '90px', top: '50px', border: '3px solid #8B7355' }}
                                    >
                                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }} />
                                    </motion.div>

                                    {/* Picture frame 2 */}
                                    <motion.div
                                        className="position-absolute rounded-1 shadow-sm overflow-hidden"
                                        animate={{ opacity: isDarkMode ? 0.3 : 1 }}
                                        style={{ width: '45px', height: '55px', right: '20px', top: '40px', border: '3px solid #8B7355' }}
                                    >
                                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #34d399, #10b981)' }} />
                                    </motion.div>

                                    {/* Light Switch */}
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsDarkMode(!isDarkMode)}
                                        className="position-absolute rounded-2 shadow-sm border-0 p-1"
                                        animate={{ background: isDarkMode ? '#fde68a' : '#fff' }}
                                        style={{
                                            width: '50px', height: '40px', border: '2px solid #e2e8f0',
                                            right: '20px', top: '100px', zIndex: 20, cursor: 'pointer'
                                        }}
                                    >
                                        <div className="w-100 h-100 bg-info opacity-20 rounded-1 d-flex align-items-center justify-content-center">
                                            {isDarkMode ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-warning" />}
                                        </div>
                                    </motion.button>

                                    {/* Floating Shelf with Bibles */}
                                    <motion.div
                                        className="position-absolute"
                                        animate={{ opacity: isDarkMode ? 0.3 : 1 }}
                                        style={{ top: '140px', left: '35px' }}
                                    >
                                        <div className="bg-secondary opacity-20 rounded-pill" style={{ width: '110px', height: '8px' }}></div>
                                        <div className="d-flex gap-2 mt-[-18px] ms-4">
                                            <div className="bg-primary rounded-1 shadow-sm" style={{ width: '10px', height: '22px' }}></div>
                                            <div className="bg-warning rounded-1 shadow-sm" style={{ width: '10px', height: '28px' }}></div>
                                            <div className="bg-danger rounded-1 shadow-sm" style={{ width: '10px', height: '18px' }}></div>
                                            <div className="bg-success rounded-1 shadow-sm" style={{ width: '10px', height: '24px' }}></div>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                {/* FLOOR with rug */}
                                <motion.div
                                    className="position-absolute bottom-0 start-0 w-100"
                                    animate={{
                                        background: isDarkMode ? '#0f172a' : '#d4c9b8',
                                        boxShadow: isDarkMode ? 'inset 0 10px 20px rgba(0,0,0,0.5)' : 'inset 0 8px 16px rgba(0,0,0,0.06)'
                                    }}
                                    transition={{ duration: 0.7 }}
                                    style={{ height: '30%' }}
                                >
                                    {/* Wood planks */}
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-100 border-bottom" style={{ height: '20%', borderColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)' }}></div>
                                    ))}

                                    {/* Rug */}
                                    <motion.div
                                        className="position-absolute start-50 translate-middle-x rounded-3"
                                        animate={{
                                            background: isDarkMode
                                                ? 'linear-gradient(135deg, #7c3aed, #a78bfa, #7c3aed)'
                                                : 'linear-gradient(135deg, #c084fc, #e9d5ff, #c084fc)'
                                        }}
                                        style={{
                                            bottom: '15%',
                                            width: '100px',
                                            height: '40px',
                                            background: 'linear-gradient(135deg, #c084fc, #e9d5ff, #c084fc)',
                                            opacity: 0.7
                                        }}
                                    >
                                        {/* Rug pattern */}
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ border: '2px solid rgba(255,255,255,0.3)', borderRadius: '12px' }}>
                                            <div style={{ width: '70%', height: '60%', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '8px' }} />
                                        </div>
                                    </motion.div>
                                </motion.div>

                                {/* Shadow under mascot */}
                                <motion.div
                                    className="position-absolute start-50 translate-middle-x"
                                    animate={{
                                        background: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.12)',
                                        width: isFeeding ? '140px' : '120px'
                                    }}
                                    style={{ bottom: '25%', height: '25px', borderRadius: '50%', filter: 'blur(6px)' }}
                                />

                                {/* Mascot */}
                                <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 5 }}>
                                    {isDarkMode && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.2, 1] }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            className="position-absolute start-50 top-50 translate-middle rounded-circle"
                                            style={{
                                                width: '300px', height: '300px',
                                                background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,165,0,0.1) 50%, transparent 70%)',
                                                filter: 'blur(20px)', zIndex: -1, pointerEvents: 'none'
                                            }}
                                        />
                                    )}
                                    <AnimatePresence>
                                        {isFeeding && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                                                animate={{ opacity: 1, scale: 1.2, y: -140 }}
                                                exit={{ opacity: 0 }}
                                                className="position-absolute start-50 translate-middle-x"
                                                style={{ zIndex: 10 }}
                                            >
                                                <Flame size={60} className="text-warning fill-current" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div className="transform-scale-room">
                                        <LlamiMascot
                                            streak={mascot.streak || 1}
                                            lastMood={mascot?.mood || 'FELIZ'}
                                            level={mascot?.level || 1}
                                            name={mascot?.name || 'Llami'}
                                            isFeeding={isFeeding}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Name */}
                            <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                                <span className="h4 fw-bold text-primary mb-0 me-2">{mascot?.name}</span>
                                {isEditingName ? (
                                    <div className="d-flex gap-2 bg-white p-2 rounded-pill shadow-sm animate-fade-in border">
                                        <input
                                            autoFocus type="text" value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="form-control form-control-sm border-0 bg-transparent text-primary fw-bold text-center"
                                            style={{ width: '120px', boxShadow: 'none' }}
                                            placeholder={t.llami.rename_placeholder}
                                        />
                                        <button onClick={handleUpdateName} className="btn btn-sm btn-success rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: 30, height: 30 }}>
                                            <Check size={16} />
                                        </button>
                                        <button onClick={() => setIsEditingName(false)} className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: 30, height: 30 }}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setNewName(mascot.name); setIsEditingName(true); }}
                                        className="btn btn-link text-muted text-decoration-none d-flex align-items-center gap-2 small opacity-75 hover-opacity-100"
                                    >
                                        <span className="small">{t.llami.rename}</span>
                                        <Edit2 size={14} />
                                    </button>
                                )}
                            </div>

                            {/* Stage badge */}
                            <div className="text-center mt-1">
                                <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-2 small fw-bold">
                                    {stageIcons[stage as keyof typeof stageIcons]} {stageNames[stage as keyof typeof stageNames]}
                                </span>
                            </div>
                        </div>

                        {/* --- MAIN STATS CARD (col-12) --- */}
                        <div className="card bg-white border-0 shadow-sm rounded-5 p-4 mb-4">
                            <div className="row g-3">
                                <div className="col-4">
                                    <div className="p-3 text-center">
                                        <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                                            <Zap size={18} className="text-warning" />
                                            <span className="small fw-bold text-muted">{t.llami.level_label}</span>
                                        </div>
                                        <div className="h1 mb-0 fw-bold">{mascot.level}</div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="p-3 text-center">
                                        <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                                            <Flame size={18} className="text-warning" />
                                            <span className="small fw-bold text-muted">{t.llami.flame_label}</span>
                                        </div>
                                        <div className="h1 mb-0 fw-bold text-warning">{mascot.flamePoints}</div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="p-3 text-center">
                                        <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                                            <Star size={18} className="text-warning" />
                                            <span className="small fw-bold text-muted">RACHA</span>
                                        </div>
                                        <div className="h1 mb-0 fw-bold text-primary">{mascot.streak || 0}<span className="h6 text-muted ms-1">días</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-start px-2">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small fw-bold text-muted">
                                        {t.llami.next_level.replace('{level}', (mascot.level + 1).toString())}
                                    </span>
                                    <span className="small fw-bold text-warning">{mascot.experience}/100 XP</span>
                                </div>
                                <div className="progress bg-light rounded-pill" style={{ height: '10px' }}>
                                    <motion.div
                                        className="progress-bar bg-warning rounded-pill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${mascot.experience}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- ACHIEVEMENTS / MILESTONES CARD --- */}
                        <div className="card bg-white border-0 shadow-sm rounded-5 p-4 mb-4">
                            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <Trophy size={20} className="text-warning" />
                                Logros de Racha
                            </h5>
                            <div className="d-flex flex-wrap gap-2">
                                {[7, 30, 50, 100, 365].map((target) => {
                                    const unlocked = achievedMilestones.includes(target);
                                    return (
                                        <motion.div
                                            key={target}
                                            className={`rounded-4 p-3 d-flex align-items-center gap-3 flex-grow-1 ${unlocked ? 'bg-warning bg-opacity-10' : 'bg-light'}`}
                                            style={{ minWidth: '170px', flex: '1 0 auto' }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className={`rounded-circle d-flex align-items-center justify-content-center ${unlocked ? 'bg-warning text-white' : 'bg-secondary bg-opacity-10 text-muted'}`}
                                                style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                                                {unlocked ? '🏆' : '🔒'}
                                            </div>
                                            <div>
                                                <div className={`fw-bold small ${unlocked ? 'text-dark' : 'text-muted'}`}>
                                                    {target} {target === 365 ? 'año' : 'días'}
                                                </div>
                                                <div className="small text-muted">
                                                    {unlocked ? '✓ Desbloqueado' : mascot.streak >= target ? '¡Completado!' : `${mascot.streak || 0}/${target}`}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Next milestone progress */}
                            {nextMilestone && !achievedMilestones.includes(nextMilestone) && (
                                <div className="mt-3 px-1">
                                    <div className="d-flex justify-content-between small text-muted mb-1">
                                        <span>Próximo logro: {nextMilestone} días</span>
                                        <span>{mascot.streak || 0}/{nextMilestone}</span>
                                    </div>
                                    <div className="progress bg-light rounded-pill" style={{ height: '6px' }}>
                                        <motion.div
                                            className="progress-bar bg-warning rounded-pill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, ((mascot.streak || 0) / nextMilestone) * 100)}%` }}
                                            transition={{ duration: 1, delay: 0.3 }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* --- ACTIONS --- */}
                        <div className="d-grid gap-3">
                            <button
                                onClick={handleFeed}
                                disabled={mascot.flamePoints < 5 || isFeeding}
                                className="btn btn-warning btn-lg rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm border-0"
                                style={{
                                    backgroundColor: '#f3b33e',
                                    opacity: mascot.flamePoints < 5 ? 0.5 : 1,
                                    color: '#0B1B32'
                                }}
                            >
                                <Flame size={24} />
                                {t.llami.feed_button}
                            </button>
                            <div className="small text-muted mb-4 text-center">
                                {t.llami.feed_hint}
                            </div>
                            <button
                                onClick={() => setIsPlayingTrivia(true)}
                                className="btn btn-outline-primary btn-lg rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-2"
                            >
                                <Gamepad2 size={24} />
                                {t.llami.trivia_button}
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT SIDEBAR: Guide + Tips --- */}
                    <div className="col-lg-4 mt-5 mt-lg-0">
                        <div className="card bg-white border-0 shadow-sm rounded-5 p-4 h-100">
                            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-warning">
                                <Sparkles size={24} />
                                {t.llami.guide_title}
                            </h4>
                            <div className="d-flex flex-column gap-4 text-start">
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-light p-3 rounded-4">
                                        <Book className="text-warning" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h6 className="fw-bold mb-1">{t.llami.guide_bible_title}</h6>
                                        <p className="small mb-0 text-muted">{t.llami.guide_bible_desc}</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-light p-3 rounded-4">
                                        <Sparkles className="text-warning" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h6 className="fw-bold mb-1">{t.llami.guide_devotionals_title}</h6>
                                        <p className="small mb-0 text-muted">{t.llami.guide_devotionals_desc}</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-light p-3 rounded-4">
                                        <Flame className="text-warning" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h6 className="fw-bold mb-1">{t.llami.guide_evolution_title}</h6>
                                        <p className="small mb-0 text-muted">{t.llami.guide_evolution_desc}</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-light p-3 rounded-4">
                                        <Gamepad2 className="text-warning" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h6 className="fw-bold mb-1">{t.llami.guide_trivia_title}</h6>
                                        <p className="small mb-0 text-muted">{t.llami.guide_trivia_desc}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick tip */}
                            <div className="bg-warning bg-opacity-10 rounded-4 p-3 mt-4">
                                <div className="d-flex align-items-start gap-2">
                                    <MessageCircle size={18} className="text-warning mt-1 flex-shrink-0" />
                                    <div>
                                        <h6 className="fw-bold mb-1 small text-warning">Consejo del día</h6>
                                        <p className="small mb-0 text-muted">
                                            {mascot.flamePoints < 5
                                                ? "Lee la Biblia o completa devocionales para ganar puntos de fuego y alimentar a Llami."
                                                : "¡Tienes suficientes puntos! Aviva el fuego de Llami para ganar XP y subir de nivel."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .transform-scale-room {
                    transform: scale(1.8);
                }
                @media (max-width: 576px) {
                    .transform-scale-room {
                        transform: scale(1.4);
                    }
                }
            `}</style>
        </div >
    );
}

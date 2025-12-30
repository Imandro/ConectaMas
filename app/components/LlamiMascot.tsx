"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getLlamiMessage } from "@/app/lib/mascot-messages";

interface LlamiMascotProps {
    streak: number;
    lastMood?: string;
    level?: number;
    forceStage?: "spark" | "flame" | "torch" | "sun" | "star";
    name?: string;
    outfit?: string; // none, glasses, bow, cap, scarf, headphones
}

export default function LlamiMascot({ streak, lastMood, level = 1, forceStage, name, outfit = "none" }: LlamiMascotProps) {
    const [message, setMessage] = useState<string>("");
    const [showMessage, setShowMessage] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    // Determine evolution stage
    const getStage = () => {
        if (forceStage) return forceStage;
        if (streak <= 2) return "spark";
        if (streak <= 14) return "flame";
        if (streak <= 60) return "torch";
        if (streak <= 180) return "sun";
        return "star";
    };

    const stage = getStage();

    useEffect(() => {
        const welcomeMsg = getLlamiMessage(streak, lastMood, false);
        setMessage(welcomeMsg);
        const timer = setTimeout(() => setShowMessage(true), 1500);
        const hideTimer = setTimeout(() => setShowMessage(false), 6500);
        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, [streak, lastMood]);

    const handleClick = () => {
        setClickCount((prev) => prev + 1);
        const clickMsg = getLlamiMessage(streak, lastMood, true);
        setMessage(clickMsg);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 4000);
    };

    // Stage-based colors (Conecta+ Gold/Blue Theme)
    const getColors = () => {
        switch (stage) {
            case "spark": return { p: "#EAB308", s: "#FDE047" }; // Gold
            case "flame": return { p: "#CA8A04", s: "#FCD34D" }; // Dark Gold
            case "torch": return { p: "#F59E0B", s: "#FEF3C7" }; // Amber
            case "sun": return { p: "#0F172A", s: "#38BDF8" }; // Dark Blue
            case "star": return { p: "#1E3A8A", s: "#60A5FA" }; // Deep Blue
            default: return { p: "#EAB308", s: "#FDE047" };
        }
    };

    const c = getColors();

    // Cosmetic Renderers
    const renderCosmetic = () => {
        switch (outfit) {
            case "glasses":
                return (
                    <g transform="translate(0, -2)">
                        <circle cx="35" cy="58" r="8" stroke="black" strokeWidth="2" fill="rgba(255,255,255,0.3)" />
                        <circle cx="65" cy="58" r="8" stroke="black" strokeWidth="2" fill="rgba(255,255,255,0.3)" />
                        <line x1="43" y1="58" x2="57" y2="58" stroke="black" strokeWidth="2" />
                    </g>
                );
            case "bow":
                return (
                    <g transform="translate(50, 15) rotate(-10)">
                        <path d="M -10 -5 L 10 5 L -10 15 Z" fill="#ec4899" />
                        <path d="M 10 -5 L -10 5 L 10 15 Z" fill="#ec4899" />
                        <circle cx="0" cy="5" r="3" fill="#be185d" />
                    </g>
                );
            case "cap":
                return (
                    <g transform="translate(15, -10)">
                        <path d="M 10 30 Q 35 10, 60 30 L 60 30 L 10 30" fill="#3b82f6" />
                        <rect x="10" y="28" width="50" height="5" fill="#1d4ed8" rx="2" />
                        <path d="M 60 28 L 80 28 L 80 33 L 60 33 Z" fill="#1d4ed8" />
                    </g>
                );
            case "scarf":
                return (
                    <path d="M 25 75 Q 50 85, 75 75 L 75 85 Q 50 95, 25 85 Z" fill="#ef4444" />
                );
            case "headphones":
                return (
                    <g>
                        <path d="M 20 60 Q 15 40, 25 20 Q 50 -5, 75 20 Q 85 40, 80 60" fill="none" stroke="#333" strokeWidth="4" />
                        <rect x="15" y="50" width="10" height="20" rx="3" fill="#111" />
                        <rect x="75" y="50" width="10" height="20" rx="3" fill="#111" />
                    </g>
                );
            default: return null;
        }
    }

    return (
        <div className="position-relative d-inline-block text-center" style={{ width: "100px", height: "120px" }}> {/* Increased container size for limbs */}

            {/* Speech Bubble */}
            <AnimatePresence>
                {showMessage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, scale: 0.8, y: 10, x: "-50%" }}
                        className="position-absolute bottom-100 start-50 mb-2"
                        style={{ width: "140px", zIndex: 100 }}
                    >
                        <div className="bg-white rounded-4 shadow-lg p-2 border border-2 border-warning position-relative">
                            <p className="text-dark mb-0 fw-bold text-center lh-sm" style={{ fontSize: '0.75rem' }}>
                                {message}
                            </p>
                            <div className="position-absolute top-100 start-50 translate-middle-x"
                                style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid #fff', marginTop: '-2px' }}>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Llami Container */}
            <motion.div
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer mx-auto position-relative"
                style={{ width: "80px", height: "80px", marginTop: "20px" }}
            >
                <svg viewBox="0 0 100 120" className="w-100 h-100 drop-shadow-lg overflow-visible">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <radialGradient id={`g-${stage}`} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={c.s} />
                            <stop offset="100%" stopColor={c.p} />
                        </radialGradient>
                    </defs>

                    {/* Aura */}
                    <motion.circle
                        cx="50" cy="50" r="45"
                        fill={`url(#g-${stage})`}
                        opacity="0.2"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Cute Feet (TikTok Style - little nubbins) */}
                    <g transform="translate(0, 10)">
                        <motion.ellipse
                            cx="35" cy="95" rx="6" ry="4" fill={c.p}
                            animate={{ y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.ellipse
                            cx="65" cy="95" rx="6" ry="4" fill={c.p}
                            animate={{ y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                        />
                    </g>

                    {/* Cute Hands (TikTok Style - waving or holding) */}
                    <g>
                        <motion.circle
                            cx="20" cy="60" r="5" fill={c.p}
                            animate={{ y: [0, 2, 0], x: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.circle
                            cx="80" cy="60" r="5" fill={c.p}
                            animate={{ y: [0, -2, 0], x: [0, -1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        />
                    </g>


                    {/* Main Flame Body */}
                    <motion.path
                        d="M 50 10 Q 80 40, 75 70 Q 70 95, 50 95 Q 30 95, 25 70 Q 20 40, 50 10"
                        fill={`url(#g-${stage})`}
                        filter="url(#glow)"
                        animate={{
                            d: [
                                "M 50 10 Q 80 40, 75 70 Q 70 95, 50 95 Q 30 95, 25 70 Q 20 40, 50 10",
                                "M 50 5 Q 85 45, 78 75 Q 70 98, 50 98 Q 30 98, 22 75 Q 15 45, 50 5",
                                "M 50 10 Q 80 40, 75 70 Q 70 95, 50 95 Q 30 95, 25 70 Q 20 40, 50 10"
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Face Container */}
                    <g transform="translate(0, 5)">
                        {/* Eyes */}
                        <motion.circle cx="38" cy="55" r="4" fill="#1e293b" animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 4 }} />
                        <motion.circle cx="62" cy="55" r="4" fill="#1e293b" animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 4 }} />
                        <circle cx="39" cy="54" r="1.5" fill="white" />
                        <circle cx="63" cy="54" r="1.5" fill="white" />

                        {/* Cheeks */}
                        <circle cx="30" cy="62" r="5" fill="#f472b6" opacity="0.4" />
                        <circle cx="70" cy="62" r="5" fill="#f472b6" opacity="0.4" />

                        {/* Smile */}
                        <path d="M 45 62 Q 50 65, 55 62" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </g>

                    {/* Outfit Render */}
                    {renderCosmetic()}

                </svg>
            </motion.div>

            {/* Name Tag */}
            <div className="mt-1 position-absolute top-100 start-50 translate-middle-x text-nowrap">
                <span className="badge bg-white shadow-sm rounded-pill text-primary fw-bold d-inline-flex align-items-center gap-1 px-2 py-0" style={{ fontSize: '0.65rem', border: '1px solid #e2e8f0' }}>
                    <Sparkles size={8} className="text-warning" />
                    {name || "Llami"}
                    <span className="text-muted ms-1 opacity-75">#{streak}</span>
                </span>
            </div>
        </div>
    );
}

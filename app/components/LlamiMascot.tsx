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
    outfit?: string;
}

export default function LlamiMascot({ streak, lastMood, level = 1, forceStage, name, outfit = "none" }: LlamiMascotProps) {
    const [message, setMessage] = useState<string>("");
    const [showMessage, setShowMessage] = useState(false);
    const [clickCount, setClickCount] = useState(0);

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

    const getColors = () => {
        switch (stage) {
            case "spark": return { p: "#EAB308", s: "#FDE047" };
            case "flame": return { p: "#CA8A04", s: "#FCD34D" };
            case "torch": return { p: "#F59E0B", s: "#FEF3C7" };
            case "sun": return { p: "#0F172A", s: "#38BDF8" };
            case "star": return { p: "#1E3A8A", s: "#60A5FA" };
            default: return { p: "#EAB308", s: "#FDE047" };
        }
    };

    const c = getColors();

    const renderCosmetic = () => {
        switch (outfit) {
            case "glasses":
                return (
                    <g transform="translate(0, 2)">
                        <ellipse cx="38" cy="48" rx="7" ry="6" stroke="#222" strokeWidth="2" fill="rgba(255,255,255,0.2)" />
                        <ellipse cx="62" cy="48" rx="7" ry="6" stroke="#222" strokeWidth="2" fill="rgba(255,255,255,0.2)" />
                        <line x1="45" y1="48" x2="55" y2="48" stroke="#222" strokeWidth="2" />
                    </g>
                );
            case "bow":
                return (
                    <g transform="translate(50, 18)">
                        <path d="M -8 -3 L 8 3 L -8 9 Z" fill="#ec4899" />
                        <path d="M 8 -3 L -8 3 L 8 9 Z" fill="#ec4899" />
                        <circle cx="0" cy="3" r="2.5" fill="#be185d" />
                    </g>
                );
            case "cap":
                return (
                    <g transform="translate(20, 8)">
                        <path d="M 5 20 Q 30 5, 55 20" fill="#3b82f6" />
                        <rect x="5" y="18" width="50" height="4" fill="#1d4ed8" rx="2" />
                        <path d="M 55 18 L 70 18 L 70 22 L 55 22 Z" fill="#1d4ed8" />
                    </g>
                );
            case "scarf":
                return (
                    <path d="M 30 68 Q 50 75, 70 68 L 70 75 Q 50 82, 30 75 Z" fill="#ef4444" />
                );
            case "headphones":
                return (
                    <g>
                        <path d="M 25 48 Q 20 30, 30 18 Q 50 5, 70 18 Q 80 30, 75 48" fill="none" stroke="#222" strokeWidth="3.5" />
                        <rect x="20" y="42" width="8" height="16" rx="2" fill="#111" />
                        <rect x="72" y="42" width="8" height="16" rx="2" fill="#111" />
                    </g>
                );
            default: return null;
        }
    }

    return (
        <div className="position-relative d-inline-block text-center" style={{ width: "90px", height: "105px" }}>

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

            <motion.div
                onClick={handleClick}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                className="cursor-pointer mx-auto position-relative"
                style={{ width: "70px", height: "70px", marginTop: "12px" }}
            >
                <svg viewBox="0 0 100 100" className="w-100 h-100 drop-shadow-lg overflow-visible">
                    <defs>
                        <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <radialGradient id={`grad-${stage}`} cx="50%" cy="40%" r="60%">
                            <stop offset="0%" stopColor={c.s} />
                            <stop offset="100%" stopColor={c.p} />
                        </radialGradient>
                    </defs>

                    {/* Aura */}
                    <motion.circle
                        cx="50" cy="50" r="38"
                        fill={`url(#grad-${stage})`}
                        opacity="0.15"
                        animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.25, 0.15] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    />

                    {/* Main Body - Round Blob (drawn first so limbs appear on top) */}
                    <motion.ellipse
                        cx="50" cy="48" rx="26" ry="30"
                        fill={`url(#grad-${stage})`}
                        filter="url(#soft-glow)"
                        animate={{
                            ry: [30, 31, 30],
                            rx: [26, 27, 26]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Inner Glow */}
                    <motion.ellipse
                        cx="50" cy="42" rx="17" ry="19"
                        fill="white"
                        opacity={0.3 + (level * 0.03)}
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.3 + (level * 0.03), 0.4 + (level * 0.03), 0.3 + (level * 0.03)]
                        }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                    />

                    {/* Cute Feet - Attached to bottom of body */}
                    <g>
                        <motion.ellipse
                            cx="40" cy="75" rx="6" ry="5" fill={c.p} opacity="0.95"
                            animate={{ ry: [5, 5.5, 5] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                        />
                        <motion.ellipse
                            cx="60" cy="75" rx="6" ry="5" fill={c.p} opacity="0.95"
                            animate={{ ry: [5, 5.5, 5] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
                        />
                    </g>

                    {/* Cute Arms - Attached to sides of body */}
                    <g>
                        <motion.ellipse
                            cx="26" cy="50" rx="5" ry="7" fill={c.p} opacity="0.95"
                            animate={{ rotate: [-5, 5, -5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ transformOrigin: "26px 50px" }}
                        />
                        <motion.ellipse
                            cx="74" cy="50" rx="5" ry="7" fill={c.p} opacity="0.95"
                            animate={{ rotate: [5, -5, 5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            style={{ transformOrigin: "74px 50px" }}
                        />
                    </g>

                    {/* Face */}
                    <g>
                        {/* Big Eyes */}
                        <g>
                            <motion.ellipse
                                cx="40" cy="46" rx="5" ry="6" fill="#1a1a1a"
                                animate={{ scaleY: [1, 0.1, 1] }}
                                transition={{ repeat: Infinity, duration: 4, times: [0, 0.48, 0.52, 1] }}
                            />
                            <circle cx="41" cy="44" r="2" fill="white" opacity="0.9" />
                            <circle cx="42" cy="47" r="1" fill="white" opacity="0.6" />

                            <motion.ellipse
                                cx="60" cy="46" rx="5" ry="6" fill="#1a1a1a"
                                animate={{ scaleY: [1, 0.1, 1] }}
                                transition={{ repeat: Infinity, duration: 4, times: [0, 0.48, 0.52, 1] }}
                            />
                            <circle cx="61" cy="44" r="2" fill="white" opacity="0.9" />
                            <circle cx="62" cy="47" r="1" fill="white" opacity="0.6" />
                        </g>

                        {/* Rosy Cheeks */}
                        <circle cx="33" cy="54" r="5" fill="#ff9aa2" opacity="0.5" />
                        <circle cx="67" cy="54" r="5" fill="#ff9aa2" opacity="0.5" />

                        {/* Smile */}
                        <motion.path
                            d="M 42 56 Q 50 60, 58 56"
                            stroke="#1a1a1a"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            animate={{ d: ["M 42 56 Q 50 60, 58 56", "M 42 56 Q 50 61, 58 56", "M 42 56 Q 50 60, 58 56"] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </g>

                    {renderCosmetic()}

                    {/* Sparkles */}
                    <motion.circle
                        cx="22" cy="28" r={1.5 + (level * 0.15)} fill="white"
                        animate={{
                            y: [-12, -25],
                            x: [0, 6, -4],
                            opacity: [0.8, 0],
                            scale: [1, 0.3]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    />
                    <motion.circle
                        cx="78" cy="26" r={1.5 + (level * 0.15)} fill={c.s}
                        animate={{
                            y: [-12, -28],
                            x: [0, -6, 4],
                            opacity: [1, 0],
                            scale: [1, 0.4]
                        }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: 0.7 }}
                    />
                </svg>
            </motion.div>

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

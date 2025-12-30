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
            case "spark": return { p: "#EAB308", s: "#FDE047", t: "#FEF3C7" };
            case "flame": return { p: "#F59E0B", s: "#FCD34D", t: "#FEF3C7" };
            case "torch": return { p: "#F97316", s: "#FDBA74", t: "#FED7AA" };
            case "sun": return { p: "#EF4444", s: "#FCA5A5", t: "#FEE2E2" };
            case "star": return { p: "#DC2626", s: "#FCA5A5", t: "#FEE2E2" };
            default: return { p: "#EAB308", s: "#FDE047", t: "#FEF3C7" };
        }
    };

    const c = getColors();

    const renderCosmetic = () => {
        switch (outfit) {
            case "glasses":
                return (
                    <g transform="translate(0, 2)">
                        <ellipse cx="38" cy="40" rx="7" ry="6" stroke="#222" strokeWidth="2" fill="rgba(255,255,255,0.2)" />
                        <ellipse cx="62" cy="40" rx="7" ry="6" stroke="#222" strokeWidth="2" fill="rgba(255,255,255,0.2)" />
                        <line x1="45" y1="40" x2="55" y2="40" stroke="#222" strokeWidth="2" />
                    </g>
                );
            case "bow":
                return (
                    <g transform="translate(50, 10)">
                        <path d="M -8 -3 L 8 3 L -8 9 Z" fill="#ec4899" />
                        <path d="M 8 -3 L -8 3 L 8 9 Z" fill="#ec4899" />
                        <circle cx="0" cy="3" r="2.5" fill="#be185d" />
                    </g>
                );
            case "cap":
                return (
                    <g transform="translate(20, 5)">
                        <path d="M 5 20 Q 30 5, 55 20" fill="#3b82f6" />
                        <rect x="5" y="18" width="50" height="4" fill="#1d4ed8" rx="2" />
                        <path d="M 55 18 L 70 18 L 70 22 L 55 22 Z" fill="#1d4ed8" />
                    </g>
                );
            case "scarf":
                return (
                    <path d="M 30 60 Q 50 65, 70 60 L 70 67 Q 50 72, 30 67 Z" fill="#ef4444" />
                );
            case "headphones":
                return (
                    <g>
                        <path d="M 25 40 Q 20 25, 30 15 Q 50 5, 70 15 Q 80 25, 75 40" fill="none" stroke="#222" strokeWidth="3.5" />
                        <rect x="20" y="35" width="8" height="16" rx="2" fill="#111" />
                        <rect x="72" y="35" width="8" height="16" rx="2" fill="#111" />
                    </g>
                );
            default: return null;
        }
    }

    return (
        <div className="position-relative d-inline-block text-center" style={{ width: "100px", height: "120px" }}>

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
                animate={{ y: [0, -4, 0] }}
                transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                className="cursor-pointer mx-auto position-relative"
                style={{ width: "90px", height: "90px", marginTop: "8px" }}
            >
                <svg viewBox="0 0 100 100" className="w-100 h-100 drop-shadow-lg overflow-visible">
                    <defs>
                        <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <radialGradient id={`grad-${stage}`} cx="50%" cy="40%" r="60%">
                            <stop offset="0%" stopColor={c.s} />
                            <stop offset="50%" stopColor={c.p} />
                            <stop offset="100%" stopColor={c.p} stopOpacity="0.8" />
                        </radialGradient>
                    </defs>

                    {/* Aura/Glow */}
                    <motion.circle
                        cx="50" cy="50" r="42"
                        fill={`url(#grad-${stage})`}
                        opacity="0.2"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    />

                    {/* CHUBBY FLAME BODY - No limbs */}
                    <motion.path
                        d="M 50 2 
                           Q 65 15, 75 35
                           Q 82 50, 80 65
                           Q 75 85, 50 90
                           Q 25 85, 20 65
                           Q 18 50, 25 35
                           Q 35 15, 50 2 Z"
                        fill={`url(#grad-${stage})`}
                        filter="url(#soft-glow)"
                        animate={{
                            d: [
                                "M 50 2 Q 65 15, 75 35 Q 82 50, 80 65 Q 75 85, 50 90 Q 25 85, 20 65 Q 18 50, 25 35 Q 35 15, 50 2 Z",
                                "M 50 0 Q 68 12, 78 34 Q 85 48, 83 64 Q 78 88, 50 92 Q 22 88, 17 64 Q 15 48, 22 34 Q 32 12, 50 0 Z",
                                "M 50 2 Q 65 15, 75 35 Q 82 50, 80 65 Q 75 85, 50 90 Q 25 85, 20 65 Q 18 50, 25 35 Q 35 15, 50 2 Z"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Inner flame glow - Chubby version */}
                    <motion.ellipse
                        cx="50" cy="45" rx="18" ry="22"
                        fill={c.t}
                        opacity={0.4 + (level * 0.02)}
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.4 + (level * 0.02), 0.55 + (level * 0.02), 0.4 + (level * 0.02)]
                        }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                    />


                    {/* FACE */}
                    <g>
                        {/* Eyes */}
                        <g>
                            <motion.ellipse
                                cx="42" cy="38" rx="5" ry="7" fill="#1a1a1a"
                                animate={{ scaleY: [1, 0.1, 1] }}
                                transition={{ repeat: Infinity, duration: 4, times: [0, 0.48, 0.52, 1] }}
                            />
                            <circle cx="43" cy="36" r="2.5" fill="white" opacity="0.9" />
                            <circle cx="44" cy="39" r="1.2" fill="white" opacity="0.6" />

                            <motion.ellipse
                                cx="58" cy="38" rx="5" ry="7" fill="#1a1a1a"
                                animate={{ scaleY: [1, 0.1, 1] }}
                                transition={{ repeat: Infinity, duration: 4, times: [0, 0.48, 0.52, 1] }}
                            />
                            <circle cx="59" cy="36" r="2.5" fill="white" opacity="0.9" />
                            <circle cx="60" cy="39" r="1.2" fill="white" opacity="0.6" />
                        </g>

                        {/* Rosy Cheeks */}
                        <circle cx="34" cy="48" r="5" fill="#ff9aa2" opacity="0.5" />
                        <circle cx="66" cy="48" r="5" fill="#ff9aa2" opacity="0.5" />

                        {/* Smile */}
                        <motion.path
                            d="M 42 50 Q 50 54, 58 50"
                            stroke="#1a1a1a"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            animate={{ d: ["M 42 50 Q 50 54, 58 50", "M 42 50 Q 50 55, 58 50", "M 42 50 Q 50 54, 58 50"] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </g>

                    {renderCosmetic()}

                    {/* Sparkles/Fire particles */}
                    <motion.circle
                        cx="25" cy="22" r={1.8 + (level * 0.15)} fill={c.s}
                        animate={{
                            y: [-8, -20],
                            x: [0, -4, 2],
                            opacity: [1, 0],
                            scale: [1, 0.3]
                        }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 0 }}
                    />
                    <motion.circle
                        cx="75" cy="20" r={1.8 + (level * 0.15)} fill={c.s}
                        animate={{
                            y: [-8, -22],
                            x: [0, 4, -2],
                            opacity: [1, 0],
                            scale: [1, 0.3]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                    <motion.circle
                        cx="50" cy="15" r={2 + (level * 0.15)} fill="white"
                        animate={{
                            y: [-5, -18],
                            opacity: [0.9, 0],
                            scale: [1, 0.4]
                        }}
                        transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}
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

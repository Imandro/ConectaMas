"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getLlamiMessage } from "@/app/lib/mascot-messages";

interface LlamiMascotProps {
    streak: number;
    lastMood?: string;
    level?: number;
}

export default function LlamiMascot({ streak, lastMood, level = 1 }: LlamiMascotProps) {
    const [message, setMessage] = useState<string>("");
    const [showMessage, setShowMessage] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    // Determine evolution stage
    const getStage = () => {
        if (streak <= 7) return "spark";
        if (streak <= 30) return "flame";
        if (streak <= 90) return "torch";
        if (streak <= 365) return "sun";
        return "star";
    };

    const stage = getStage();

    useEffect(() => {
        const welcomeMsg = getLlamiMessage(streak, lastMood, false);
        setMessage(welcomeMsg);
        // Delay initial greeting for better flow
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
        // Hide message after 4 seconds
        setTimeout(() => setShowMessage(false), 4000);
    };

    // Stage-based colors (Conecta+ Gold/Blue Theme)
    const getColors = () => {
        switch (stage) {
            case "spark": return { p: "#EAB308", s: "#FDE047" }; // Gold / Light Yellow
            case "flame": return { p: "#CA8A04", s: "#FCD34D" }; // Dark Gold / Gold
            case "torch": return { p: "#F59E0B", s: "#FEF3C7" }; // Amber / Pale Gold
            case "sun": return { p: "#0F172A", s: "#38BDF8" }; // Dark Blue / Sky Blue (Special)
            case "star": return { p: "#1E3A8A", s: "#60A5FA" }; // Deep Blue / Blue
            default: return { p: "#EAB308", s: "#FDE047" };
        }
    };

    const c = getColors();

    return (
        <div className="position-relative d-inline-block text-center" style={{ width: "100px" }}>
            {/* Premium Speech Bubble - High Contrast */}
            <AnimatePresence>
                {showMessage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, scale: 0.8, y: 10, x: "-50%" }}
                        className="position-absolute bottom-100 start-50 mb-2"
                        style={{ width: "180px", zIndex: 100 }}
                    >
                        <div className="bg-white rounded-4 shadow-lg p-3 border border-2 border-warning position-relative">
                            <p className="text-dark mb-0 fw-bold text-center lh-sm" style={{ fontSize: '0.8rem' }}>
                                {message}
                            </p>
                            {/* Bubble Arrow */}
                            <div className="position-absolute top-100 start-50 translate-middle-x"
                                style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid #fff', marginTop: '-2px' }}>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Mascot - Llami */}
            <motion.div
                onClick={handleClick}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.9, rotate: -2 }}
                animate={{
                    y: [0, -5, 0],
                }}
                transition={{
                    y: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                }}
                className="cursor-pointer mx-auto"
                style={{ width: "80px", height: "80px", position: "relative" }}
            >
                <svg viewBox="0 0 100 100" className="w-100 h-100 drop-shadow-lg">
                    <defs>
                        <filter id="beauty-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <radialGradient id={`grad-${stage}`} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={c.s} />
                            <stop offset="100%" stopColor={c.p} />
                        </radialGradient>
                    </defs>

                    {/* Aura/Glow Circle */}
                    <motion.circle
                        cx="50" cy="55" r="40"
                        fill={`url(#grad-${stage})`}
                        opacity="0.2"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* Body Path (Wavy Flame Shape) */}
                    <motion.path
                        d="M 50 10 Q 75 35, 75 65 Q 75 90, 50 90 Q 25 90, 25 65 Q 25 35, 50 10"
                        fill={`url(#grad-${stage})`}
                        filter="url(#beauty-glow)"
                        animate={{
                            d: [
                                "M 50 10 Q 75 35, 75 65 Q 75 90, 50 90 Q 25 90, 25 65 Q 25 35, 50 10",
                                "M 50 5 Q 85 40, 75 70 Q 65 95, 50 95 Q 35 95, 25 70 Q 15 40, 50 5",
                                "M 50 10 Q 75 35, 75 65 Q 75 90, 50 90 Q 25 90, 25 65 Q 25 35, 50 10"
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Dynamic Inner Light / Core Flame */}
                    <motion.path
                        d="M 50 25 Q 65 45, 60 65 Q 55 80, 50 80 Q 45 80, 40 65 Q 35 45, 50 25"
                        fill="white"
                        opacity={0.4 + (level * 0.05)}
                        animate={{
                            scale: [1, 1.1, 1],
                            y: [0, -5, 0],
                            opacity: [0.4 + (level * 0.05), 0.7 + (level * 0.05), 0.4 + (level * 0.05)]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ originX: "50px", originY: "70px" }}
                    />

                    {/* Eyes with Blinking Logic */}
                    <g>
                        <motion.circle
                            cx="40" cy="62" r="3.5"
                            fill="#2c3e50"
                            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0, 0.8, 0.85, 0.9, 1] }}
                        />
                        <motion.circle
                            cx="60" cy="62" r="3.5"
                            fill="#2c3e50"
                            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0, 0.8, 0.85, 0.9, 1] }}
                        />
                        <circle cx="41" cy="60.5" r="1.2" fill="white" />
                        <circle cx="61" cy="60.5" r="1.2" fill="white" />
                    </g>

                    {/* Cheeks */}
                    <circle cx="33" cy="68" r="4" fill="#ff80ab" opacity="0.3" />
                    <circle cx="67" cy="68" r="4" fill="#ff80ab" opacity="0.3" />

                    {/* Smile */}
                    <path
                        d="M 44 72 Q 50 76, 56 72"
                        stroke="#2c3e50"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Floating Sparks (Evolving) */}
                    <motion.circle
                        cx="25" cy="40" r={1.5 + (level * 0.2)} fill={c.s}
                        animate={{
                            y: [-20, -40],
                            x: [0, 10, -10],
                            opacity: [1, 0],
                            scale: [1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    />
                    <motion.circle
                        cx="75" cy="35" r={1.5 + (level * 0.2)} fill={c.s}
                        animate={{
                            y: [-20, -45],
                            x: [0, -10, 10],
                            opacity: [1, 0],
                            scale: [1, 0.5]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.circle
                        cx="50" cy="25" r={1 + (level * 0.2)} fill="white"
                        animate={{
                            y: [-30, -60],
                            opacity: [0.8, 0],
                        }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
                    />
                </svg>

                {/* Streak Badge */}
                <motion.div
                    className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                    style={{ width: "26px", height: "26px", fontSize: "10px", border: "2px solid white" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                >
                    {streak}
                </motion.div>
            </motion.div>

            {/* Mascot Name Overlay */}
            <div className="mt-2">
                <span className="badge bg-white shadow-sm rounded-pill text-primary fw-bold d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem' }}>
                    <Sparkles size={10} className="text-secondary" />
                    Llami
                </span>
            </div>
        </div>
    );
}

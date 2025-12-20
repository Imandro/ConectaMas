"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getLlamiMessage } from "@/app/lib/mascot-messages";

interface LlamiMascotProps {
    streak: number;
    lastMood?: string;
}

export default function LlamiMascot({ streak, lastMood }: LlamiMascotProps) {
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

    // Stage-based colors (Premium Midnight-compatible)
    const getColors = () => {
        switch (stage) {
            case "spark": return { p: "#FFAB40", s: "#FFD180" }; // Warm Orange
            case "flame": return { p: "#FF5252", s: "#FF8A80" }; // Soft Red
            case "torch": return { p: "#FFD600", s: "#FFFF8D" }; // Bright Yellow
            case "sun": return { p: "#FF9100", s: "#FFCE80" }; // Golden Sun
            case "star": return { p: "#448AFF", s: "#82B1FF" }; // Divine Blue
            default: return { p: "#FFAB40", s: "#FFD180" };
        }
    };

    const c = getColors();

    return (
        <div className="position-relative d-inline-block text-center" style={{ width: "100px" }}>
            {/* Premium Speech Bubble */}
            <AnimatePresence>
                {showMessage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, scale: 0.8, y: 10, x: "-50%" }}
                        className="position-absolute bottom-100 start-50 mb-3"
                        style={{ width: "180px", zIndex: 100 }}
                    >
                        <div className="bg-white rounded-4 shadow-lg p-3 border border-light position-relative">
                            <p className="text-dark small mb-0 fw-bold text-center lh-sm" style={{ fontSize: '0.85rem' }}>
                                {message}
                            </p>
                            {/* Bubble Arrow */}
                            <div className="position-absolute top-100 start-50 translate-middle-x"
                                style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid #fff', marginTop: '-1px' }}>
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
                    y: [0, -8, 0],
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

                    {/* Body Path (More rounded/cute llama shape) */}
                    <motion.path
                        d="M 50 15 Q 70 30, 65 60 Q 60 85, 50 85 Q 40 85, 35 60 Q 30 30, 50 15 Z"
                        fill={`url(#grad-${stage})`}
                        filter="url(#beauty-glow)"
                    />

                    {/* Dynamic Inner Light */}
                    <motion.path
                        d="M 50 25 Q 60 40, 55 60 Q 52 75, 50 75 Q 48 75, 45 60 Q 40 40, 50 25 Z"
                        fill="white"
                        opacity="0.3"
                    />

                    {/* Eyes with Blinking Logic */}
                    <g>
                        <motion.circle
                            cx="42" cy="50" r="3.5"
                            fill="#2c3e50"
                            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0, 0.8, 0.85, 0.9, 1] }}
                        />
                        <motion.circle
                            cx="58" cy="50" r="3.5"
                            fill="#2c3e50"
                            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0, 0.8, 0.85, 0.9, 1] }}
                        />
                        {/* Eye Shine */}
                        <circle cx="43" cy="48.5" r="1.2" fill="white" />
                        <circle cx="59" cy="48.5" r="1.2" fill="white" />
                    </g>

                    {/* Cheeks */}
                    <circle cx="35" cy="58" r="4" fill="#ff80ab" opacity="0.3" />
                    <circle cx="65" cy="58" r="4" fill="#ff80ab" opacity="0.3" />

                    {/* Smile */}
                    <path
                        d="M 44 63 Q 50 68, 56 63"
                        stroke="#2c3e50"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Stage Special Effects */}
                    {stage === 'star' && (
                        <motion.path
                            d="M 50 5 L 53 13 L 61 13 L 55 18 L 57 26 L 50 21 L 43 26 L 45 18 L 39 13 L 47 13 Z"
                            fill="#FFD700"
                            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                            transition={{ rotate: { duration: 10, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
                            style={{ originX: "50px", originY: "15px" }}
                        />
                    )}

                    {/* Floating Sparks */}
                    <motion.circle
                        cx="25" cy="40" r="2" fill={c.s}
                        animate={{ y: [-5, 5, -5], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.circle
                        cx="75" cy="45" r="2" fill={c.s}
                        animate={{ y: [5, -5, 5], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
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

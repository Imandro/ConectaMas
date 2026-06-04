"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLlamiMessage } from "@/app/lib/mascot-messages";
import { useLanguage } from "@/app/LanguageContext";

interface LlamiMascotProps {
    streak: number;
    lastMood?: string;
    level?: number;
    forceStage?: "spark" | "flame" | "torch" | "sun" | "star";
    name?: string;
    outfit?: string;
    expression?: "neutral" | "happy" | "sad" | "excited" | "sleepy";
    isFeeding?: boolean;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    type: "heart" | "star" | "spark";
    delay: number;
    size: number;
}

const IDLE_ACTIONS = ["lookLeft", "lookRight", "lookCenter", "yawn", "bounce", "stretch", "wiggle", "idle"];

export default function LlamiMascot({
    streak, lastMood = "FELIZ", level = 1, forceStage, name, outfit = "none",
    expression: propExpression, isFeeding = false
}: LlamiMascotProps) {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState<string>("");
    const [showMessage, setShowMessage] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
    const [isNear, setIsNear] = useState(false);
    const [idleAction, setIdleAction] = useState<string>("idle");
    const [particles, setParticles] = useState<Particle[]>([]);
    const [localExpression, setLocalExpression] = useState<"neutral" | "happy" | "sad" | "excited" | "sleepy">("neutral");
    const [isBouncing, setIsBouncing] = useState(false);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const inactivityRef = useRef<NodeJS.Timeout | null>(null);
    const particleIdRef = useRef(0);

    const expression = propExpression || localExpression;

    const getStage = () => {
        if (forceStage) return forceStage;
        if (streak <= 2) return "spark";
        if (streak <= 14) return "flame";
        if (streak <= 60) return "torch";
        if (streak <= 180) return "sun";
        return "star";
    };

    const stage = getStage();

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

    // Mood-based expression
    useEffect(() => {
        const moodMap: Record<string, "neutral" | "happy" | "sad" | "excited" | "sleepy"> = {
            FELIZ: "happy",
            TRISTE: "sad",
            NEUTRAL: "neutral",
            EMOCIONADO: "excited",
            DORMIDO: "sleepy",
        };
        setLocalExpression(moodMap[lastMood] || "neutral");
    }, [lastMood]);

    // Welcome message on mount + time greeting
    useEffect(() => {
        const welcomeMsg = getLlamiMessage(t, streak, false, "welcome");
        setMessage(welcomeMsg);
        const timer = setTimeout(() => setShowMessage(true), 800);
        const hideTimer = setTimeout(() => setShowMessage(false), 5000);
        return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    }, [streak]);

    // Idle animation cycle
    useEffect(() => {
        const cycleIdle = () => {
            const action = IDLE_ACTIONS[Math.floor(Math.random() * IDLE_ACTIONS.length)];
            setIdleAction(action);
            if (action === "yawn") setLocalExpression("sleepy");
            else setLocalExpression(prev => prev === "sleepy" ? "neutral" : prev);

            if (action === "bounce") {
                setIsBouncing(true);
                setTimeout(() => setIsBouncing(false), 600);
            }
        };
        idleTimerRef.current = setInterval(cycleIdle, 8000 + Math.random() * 6000);
        return () => { if (idleTimerRef.current) clearInterval(idleTimerRef.current); };
    }, []);

    // Inactivity → sleepy
    useEffect(() => {
        const resetInactivity = () => {
            if (inactivityRef.current) clearTimeout(inactivityRef.current);
            inactivityRef.current = setTimeout(() => {
                setLocalExpression("sleepy");
                setIdleAction("sleep");
                setMessage(getLlamiMessage(t, streak, false, "inactive"));
                setShowMessage(true);
            }, 15000);
        };
        resetInactivity();
        return () => { if (inactivityRef.current) clearTimeout(inactivityRef.current); };
    }, [cursorPos]);

    // Cursor tracking
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = (e.clientX - cx) / (rect.width / 2);
        let dy = (e.clientY - cy) / (rect.height / 2);
        dx = Math.max(-1, Math.min(1, dx));
        dy = Math.max(-1, Math.min(1, dy));
        setCursorPos({ x: 50 + dx * 8, y: 50 + dy * 6 });
        setIsNear(true);
        setLocalExpression(prev => prev === "sleepy" ? "neutral" : prev);
        setShowMessage(false);
        if (inactivityRef.current) clearTimeout(inactivityRef.current);
        inactivityRef.current = setTimeout(() => {
            setLocalExpression("sleepy");
            setIdleAction("sleep");
            setMessage(getLlamiMessage(t, streak, false, "inactive"));
            setShowMessage(true);
        }, 15000);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsNear(false);
        setCursorPos({ x: 50, y: 50 });
        setShowMessage(false);
    }, []);

    // Click handler with particles
    const handleClick = () => {
        const clickMsg = getLlamiMessage(t, streak, true);
        setMessage(clickMsg);
        setShowMessage(true);
        setLocalExpression("happy");
        setTimeout(() => {
            setShowMessage(false);
            setLocalExpression("neutral");
        }, 3500);

        // Spawn heart particles
        const newParticles: Particle[] = [];
        for (let i = 0; i < 8; i++) {
            particleIdRef.current++;
            newParticles.push({
                id: particleIdRef.current,
                x: 30 + Math.random() * 40,
                y: 30 + Math.random() * 20,
                type: "heart",
                delay: Math.random() * 0.2,
                size: 6 + Math.random() * 8,
            });
        }
        setParticles((prev) => [...prev, ...newParticles]);
        setTimeout(() => setParticles((prev) => prev.filter(p => !newParticles.find(n => n.id === p.id))), 1500);
    };

    // Feeding reaction animation
    useEffect(() => {
        if (isFeeding) {
            setLocalExpression("excited");
            setIsBouncing(true);
            setMessage(getLlamiMessage(t, streak, false, "feed"));
            setShowMessage(true);
            const newParticles: Particle[] = [];
            for (let i = 0; i < 12; i++) {
                particleIdRef.current++;
                newParticles.push({
                    id: particleIdRef.current,
                    x: 20 + Math.random() * 60,
                    y: 20 + Math.random() * 30,
                    type: "star",
                    delay: Math.random() * 0.3,
                    size: 5 + Math.random() * 6,
                });
            }
            setParticles((prev) => [...prev, ...newParticles]);
            setTimeout(() => {
                setIsBouncing(false);
                setLocalExpression("happy");
                setParticles((prev) => prev.filter(p => !newParticles.find(n => n.id === p.id)));
            }, 1500);
            setTimeout(() => { setShowMessage(false); }, 3000);
        }
    }, [isFeeding]);

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
                return <path d="M 30 60 Q 50 65, 70 60 L 70 67 Q 50 72, 30 67 Z" fill="#ef4444" />;
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
    };

    // Eye offset from cursor tracking
    const eyeDx = ((cursorPos.x - 50) / 50) * 3;
    const eyeDy = ((cursorPos.y - 50) / 50) * 2;

    // Eye rendering based on expression
    const renderEyes = () => {
        const baseEyeProps = { stroke: "#1a1a1a", strokeWidth: 2, fill: "#1a1a1a" };

        switch (expression) {
            case "happy":
                return (
                    <g>
                        <motion.path d={`M 37 ${36 + eyeDy} Q 42 ${40 + eyeDy}, 47 ${36 + eyeDy}`} stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <motion.path d={`M 53 ${36 + eyeDy} Q 58 ${40 + eyeDy}, 63 ${36 + eyeDy}`} stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </g>
                );
            case "excited":
                return (
                    <g>
                        <motion.circle cx={42 + eyeDx} cy={38} r={7} {...baseEyeProps}
                            animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                        />
                        <circle cx={43 + eyeDx} cy={36} r={3} fill="white" opacity={0.9} />
                        <circle cx={44 + eyeDx} cy={39} r={1.5} fill="white" opacity={0.6} />
                        <motion.circle cx={58 + eyeDx} cy={38} r={7} {...baseEyeProps}
                            animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        />
                        <circle cx={59 + eyeDx} cy={36} r={3} fill="white" opacity={0.9} />
                        <circle cx={60 + eyeDx} cy={39} r={1.5} fill="white" opacity={0.6} />
                    </g>
                );
            case "sad":
                return (
                    <g>
                        <motion.path d={`M 37 ${40 + eyeDy} Q 42 ${44 + eyeDy}, 47 ${40 + eyeDy}`} stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <motion.path d={`M 53 ${40 + eyeDy} Q 58 ${44 + eyeDy}, 63 ${40 + eyeDy}`} stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </g>
                );
            case "sleepy":
                return (
                    <g>
                        <motion.path d={`M 37 ${38 + eyeDy} Q 42 ${40 + eyeDy}, 47 ${38 + eyeDy}`} stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <motion.path d={`M 53 ${38 + eyeDy} Q 58 ${40 + eyeDy}, 63 ${38 + eyeDy}`} stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </g>
                );
            default:
                return (
                    <g>
                        <motion.ellipse cx={42 + eyeDx} cy={38 + eyeDy} rx={5} ry={7} {...baseEyeProps}
                            animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 4, times: [0, 0.48, 0.52, 1] }}
                        />
                        <circle cx={43 + eyeDx} cy={36 + eyeDy} r={2.5} fill="white" />
                        <circle cx={44 + eyeDx} cy={39 + eyeDy} r={1.2} fill="white" opacity={0.6} />
                        <motion.ellipse cx={58 + eyeDx} cy={38 + eyeDy} rx={5} ry={7} {...baseEyeProps}
                            animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 4, times: [0, 0.48, 0.52, 1] }}
                        />
                        <circle cx={59 + eyeDx} cy={36 + eyeDy} r={2.5} fill="white" />
                        <circle cx={60 + eyeDx} cy={39 + eyeDy} r={1.2} fill="white" opacity={0.6} />
                    </g>
                );
        }
    };

    const renderMouth = () => {
        switch (expression) {
            case "happy":
                return (
                    <motion.path d="M 42 50 Q 50 56, 58 50" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"
                        animate={{ d: ["M 42 50 Q 50 56, 58 50", "M 42 48 Q 50 58, 58 48", "M 42 50 Q 50 56, 58 50"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                );
            case "excited":
                return (
                    <motion.ellipse cx="50" cy="52" rx="6" ry="5" fill="#1a1a1a"
                        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
                    />
                );
            case "sad":
                return (
                    <motion.path d="M 42 54 Q 50 50, 58 54" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                );
            case "sleepy":
                return (
                    <motion.path d="M 45 52 Q 50 52, 55 52" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
                );
            default:
                return (
                    <motion.path d="M 42 50 Q 50 54, 58 50" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"
                        animate={{ d: ["M 42 50 Q 50 54, 58 50", "M 42 50 Q 50 55, 58 50", "M 42 50 Q 50 54, 58 50"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                );
        }
    };

    const renderBlush = () => {
        if (expression === "sad" || expression === "sleepy") return null;
        const intensity = expression === "happy" || expression === "excited" ? 0.7 : 0.4;
        return (
            <g>
                <motion.circle cx="34" cy="48" r="5" fill="#ff9aa2" opacity={intensity}
                    animate={{ opacity: [intensity, intensity + 0.2, intensity] }} transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle cx="66" cy="48" r="5" fill="#ff9aa2" opacity={intensity}
                    animate={{ opacity: [intensity, intensity + 0.2, intensity] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
            </g>
        );
    };

    return (
        <div
            ref={containerRef}
            className="position-relative d-flex align-items-center justify-content-center text-center"
            style={{ width: "100%", height: "100%" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Speech bubble */}
            <AnimatePresence>
                {showMessage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, scale: 0.8, y: 10, x: "-50%" }}
                        className="position-absolute bottom-100 start-50 mb-2"
                        style={{ width: "130px", zIndex: 100, pointerEvents: "none" }}
                    >
                        <div className="bg-white rounded-4 shadow-lg p-2 border border-2 border-warning position-relative">
                            <p className="text-dark mb-0 fw-bold text-center lh-sm" style={{ fontSize: '0.7rem' }}>
                                {message}
                            </p>
                            <div className="position-absolute top-100 start-50 translate-middle-x"
                                style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid #fff', marginTop: '-2px' }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Particles */}
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, x: p.x - 10, y: p.y, scale: 0 }}
                        animate={{
                            opacity: 0,
                            x: p.x - 10 + (Math.random() - 0.5) * 40,
                            y: p.y - 40 - Math.random() * 30,
                            scale: [0, 1.2, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 + p.delay, delay: p.delay, ease: "easeOut" }}
                        className="position-absolute"
                        style={{
                            fontSize: p.size,
                            pointerEvents: "none",
                            zIndex: 50,
                        }}
                    >
                        {p.type === "heart" ? "♥️" : p.type === "star" ? "✨" : "⭐"}
                    </motion.div>
                ))}
            </AnimatePresence>

            <motion.div
                onClick={handleClick}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                animate={{
                    y: isBouncing ? [0, -8, 0, -5, 0] : [0, -3, 0],
                    rotate: idleAction === "wiggle" ? [0, 5, -5, 3, -3, 0] : 0,
                    scaleX: idleAction === "stretch" ? [1, 1.08, 1] : 1,
                    scaleY: idleAction === "stretch" ? [1, 0.95, 1] : 1,
                }}
                transition={{
                    y: isBouncing ? { duration: 0.5, ease: "easeOut" } : { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 0.6 },
                    scaleX: { duration: 1.2 },
                    scaleY: { duration: 1.2 },
                }}
                className="cursor-pointer mx-auto position-relative d-flex align-items-center justify-content-center"
                style={{ width: "85px", height: "85px" }}
            >
                <svg viewBox="0 0 100 100" className="w-100 h-100 drop-shadow-lg overflow-visible">
                    <defs>
                        <filter id="soft-glow-llami" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <radialGradient id={`grad-llami-${stage}`} cx="50%" cy="40%" r="60%">
                            <stop offset="0%" stopColor={c.s} />
                            <stop offset="50%" stopColor={c.p} />
                            <stop offset="100%" stopColor={c.p} stopOpacity="0.8" />
                        </radialGradient>
                    </defs>

                    {/* Aura/Glow */}
                    <motion.circle
                        cx="50" cy="50" r="42"
                        fill={`url(#grad-llami-${stage})`}
                        opacity={isNear ? 0.35 : 0.2}
                        animate={{
                            scale: [1, 1.12, 1],
                            opacity: isNear ? [0.35, 0.5, 0.35] : [0.2, 0.3, 0.2],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Body */}
                    <motion.path
                        d="M 50 2 Q 65 15, 75 35 Q 82 50, 80 65 Q 75 85, 50 90 Q 25 85, 20 65 Q 18 50, 25 35 Q 35 15, 50 2 Z"
                        fill={`url(#grad-llami-${stage})`}
                        filter="url(#soft-glow-llami)"
                        animate={{
                            d: [
                                "M 50 2 Q 65 15, 75 35 Q 82 50, 80 65 Q 75 85, 50 90 Q 25 85, 20 65 Q 18 50, 25 35 Q 35 15, 50 2 Z",
                                "M 50 0 Q 68 12, 78 34 Q 85 48, 83 64 Q 78 88, 50 92 Q 22 88, 17 64 Q 15 48, 22 34 Q 32 12, 50 0 Z",
                                "M 50 2 Q 65 15, 75 35 Q 82 50, 80 65 Q 75 85, 50 90 Q 25 85, 20 65 Q 18 50, 25 35 Q 35 15, 50 2 Z",
                            ]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Inner glow */}
                    <motion.ellipse
                        cx="50" cy="45" rx="18" ry="22"
                        fill={c.t}
                        opacity={0.4 + level * 0.02}
                        animate={{ scale: [1, 1.06, 1], opacity: [0.4 + level * 0.02, 0.55 + level * 0.02, 0.4 + level * 0.02] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Ears (small bumps) */}
                    <ellipse cx="30" cy="12" rx="6" ry="4" fill={c.p} opacity={0.6} />
                    <ellipse cx="70" cy="12" rx="6" ry="4" fill={c.p} opacity={0.6} />

                    {/* Face */}
                    <g>
                        {renderEyes()}
                        {renderBlush()}
                        {renderMouth()}
                    </g>

                    {renderCosmetic()}

                    {/* Sparkles/Fire particles */}
                    <motion.circle cx="25" cy="22" r={1.8 + level * 0.15} fill={c.s}
                        animate={{ y: [-8, -22], x: [0, -4, 2], opacity: [1, 0], scale: [1, 0.3] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 0 }}
                    />
                    <motion.circle cx="75" cy="20" r={1.8 + level * 0.15} fill={c.s}
                        animate={{ y: [-8, -24], x: [0, 4, -2], opacity: [1, 0], scale: [1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                    <motion.circle cx="50" cy="12" r={2 + level * 0.15} fill="white"
                        animate={{ y: [-5, -20], opacity: [0.9, 0], scale: [1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    />
                </svg>
            </motion.div>
        </div>
    );
}

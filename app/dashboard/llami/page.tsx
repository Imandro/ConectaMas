"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Heart, Zap, ChevronLeft } from "lucide-react";
import Link from "next/link";
import LlamiMascot from "@/app/components/LlamiMascot";
import { getOrCreateMascot, feedMascot } from "./actions";
import { toast } from "react-hot-toast";

export default function LlamiPage() {
    const [mascot, setMascot] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFeeding, setIsFeeding] = useState(false);

    const loadMascot = async () => {
        const data = await getOrCreateMascot();
        setMascot(data);
        setLoading(false);
    };

    useEffect(() => {
        loadMascot();
    }, []);

    const handleFeed = async () => {
        if (isFeeding) return;
        setIsFeeding(true);

        const result = await feedMascot();

        if (result.success) {
            toast.success("¡Llami está feliz! +20 XP", {
                icon: '🔥',
                style: { borderRadius: '15px', background: '#333', color: '#fff' }
            });
            await loadMascot();
        } else {
            toast.error(result.error || "Algo salió mal");
        }

        setTimeout(() => setIsFeeding(false), 2000);
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

    return (
        <div className="container-fluid py-4 min-vh-100 bg-midnight text-white">
            {/* Header */}
            <div className="d-flex align-items-center gap-3 mb-5">
                <Link href="/dashboard" className="btn btn-outline-light rounded-circle p-2">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="h3 mb-0 fw-bold">El Refugio de Llami (Espíritu de Fuego)</h1>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-6 text-center">
                    {/* Mascot Container */}
                    <div className="position-relative py-5 mb-4">
                        <AnimatePresence>
                            {isFeeding && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                                    animate={{ opacity: 1, scale: 1.2, y: -100 }}
                                    exit={{ opacity: 0 }}
                                    className="position-absolute start-50 translate-middle-x"
                                    style={{ zIndex: 10 }}
                                >
                                    <Flame size={40} className="text-warning fill-current" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="transform-scale-2">
                            <LlamiMascot streak={1} lastMood={mascot.mood} />
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="card bg-glass border-0 shadow-lg rounded-5 p-4 mb-4">
                        <div className="row g-3">
                            {/* Level Block */}
                            <div className="col-6">
                                <div className="bg-white bg-opacity-10 rounded-4 p-3 h-100">
                                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                                        <Zap size={18} className="text-warning" />
                                        <span className="small fw-bold opacity-75 uppercase">Nivel</span>
                                    </div>
                                    <div className="h2 mb-0 fw-bold">{mascot.level}</div>
                                </div>
                            </div>

                            {/* Flame Points Block */}
                            <div className="col-6">
                                <div className="bg-white bg-opacity-10 rounded-4 p-3 h-100">
                                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                                        <Flame size={18} className="text-primary" />
                                        <span className="small fw-bold opacity-75 uppercase">Fuego</span>
                                    </div>
                                    <div className="h2 mb-0 fw-bold text-primary">{mascot.flamePoints}</div>
                                </div>
                            </div>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="mt-4 text-start">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="small fw-bold opacity-75">Experiencia para Nivel {mascot.level + 1}</span>
                                <span className="small fw-bold text-primary">{mascot.experience}/100</span>
                            </div>
                            <div className="progress bg-white bg-opacity-10 rounded-pill" style={{ height: '12px' }}>
                                <motion.div
                                    className="progress-bar bg-primary rounded-pill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mascot.experience}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="d-grid gap-3">
                        <button
                            onClick={handleFeed}
                            disabled={mascot.flamePoints < 5 || isFeeding}
                            className={`btn btn-primary btn-lg rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg ${mascot.flamePoints < 5 ? 'opacity-50' : ''}`}
                        >
                            <Flame size={24} />
                            Avivar el Fuego (-5 puntos)
                        </button>

                        <div className="small opacity-50 fst-italic">
                            Gana más puntos leyendo la Biblia o completando devocionales.
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="col-lg-4 mt-4 mt-lg-0">
                    <div className="card bg-glass border-0 shadow-lg rounded-5 p-4 h-100">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <Sparkles className="text-warning" />
                            Guía del Cuidador
                        </h4>

                        <div className="d-flex flex-column gap-4">
                            <div className="d-flex gap-3">
                                <div className="bg-primary bg-opacity-20 p-2 rounded-3 h-fit">
                                    <Book className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-1">Lectura de la Biblia</h6>
                                    <p className="small mb-0 opacity-75">Gana 1 punto de fuego por cada minuto de lectura activa.</p>
                                </div>
                            </div>

                            <div className="d-flex gap-3">
                                <div className="bg-success bg-opacity-20 p-2 rounded-3 h-fit">
                                    <Sparkles className="text-success" size={20} />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-1">Devocionales</h6>
                                    <p className="small mb-0 opacity-75">Cada devocional completo otorga 25 XP directos.</p>
                                </div>
                            </div>

                            <div className="d-flex gap-3">
                                <div className="bg-warning bg-opacity-20 p-2 rounded-3 h-fit">
                                    <Flame className="text-warning" size={20} />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-1">Evolución</h6>
                                    <p className="small mb-0 opacity-75">Al subir de nivel, el espíritu de Llami brilla con más fuerza.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .bg-midnight { background: #0a0a0c; }
                .bg-glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .transform-scale-2 {
                    transform: scale(2.5);
                }
                .h-fit { height: fit-content; }
            `}</style>
        </div>
    );
}

// Missing icon fix
function Book({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
    )
}

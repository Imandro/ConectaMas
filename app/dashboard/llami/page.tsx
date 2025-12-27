"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Heart, Zap, ChevronLeft, Edit2, Check, X } from "lucide-react";
import Link from "next/link";
import LlamiMascot from "@/app/components/LlamiMascot";
import { getOrCreateMascot, feedMascot, updateMascotName } from "./actions";
import { toast } from "react-hot-toast";
import TriviaGame from "@/app/components/TriviaGame";
import { Gamepad2, HelpCircle } from "lucide-react";
import LlamiTutorial from "@/app/components/LlamiTutorial";
import { completeLlamiTutorial } from "./actions";

export const dynamic = 'force-dynamic';

export default function LlamiPage() {
    const [mascot, setMascot] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFeeding, setIsFeeding] = useState(false);
    const [isPlayingTrivia, setIsPlayingTrivia] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");

    const loadMascot = async () => {
        try {
            const data = await getOrCreateMascot();
            if (data) {
                setMascot(data);
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

    const handleTutorialComplete = async () => {
        setShowTutorial(false);
        await completeLlamiTutorial();
        await loadMascot();
    };

    const handleUpdateName = async () => {
        if (!newName.trim()) return;
        const result = await updateMascotName(newName);
        if (result.success) {
            toast.success("¡Nombre actualizado!");
            setIsEditingName(false);
            loadMascot();
        } else {
            toast.error(result.error || "Error al actualizar");
        }
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

    // Safety check if mascot failed to load
    if (!mascot) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning">
                    No se pudo cargar a Llami. Por favor recarga la página.
                </div>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>Recargar</button>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 min-vh-100 bg-light text-primary">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-5">
                <div className="d-flex align-items-center gap-3">
                    <Link href="/dashboard" className="btn btn-white bg-white text-primary rounded-circle p-2 shadow-sm border-0">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="h2 mb-0 fw-bold">El Refugio de Llami</h1>
                </div>
                <button
                    onClick={() => setShowTutorial(true)}
                    className="btn btn-white bg-white text-warning rounded-pill px-3 py-2 shadow-sm border-0 d-flex align-items-center gap-2 fw-bold"
                >
                    <HelpCircle size={20} />
                    <span className="d-none d-md-inline">Ayuda</span>
                </button>
            </div>

            <AnimatePresence>
                {showTutorial && (
                    <LlamiTutorial onComplete={handleTutorialComplete} />
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
                    <div className="col-lg-5 text-center">
                        {/* Mascot Container */}
                        <div className="position-relative py-5 mb-4">
                            <div className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center shadow-sm" style={{ width: '250px', height: '250px', border: '4px solid #fff' }}>
                                <AnimatePresence>
                                    {isFeeding && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5, y: 0 }}
                                            animate={{ opacity: 1, scale: 1.5, y: -120 }}
                                            exit={{ opacity: 0 }}
                                            className="position-absolute start-50 translate-middle-x"
                                            style={{ zIndex: 10 }}
                                        >
                                            <Flame size={60} className="text-warning fill-current" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="transform-scale-15">
                                    <LlamiMascot streak={1} lastMood={mascot?.mood || 'FELIZ'} name={mascot?.name || 'Llami'} />
                                </div>
                            </div>

                            {/* Rename Interaction */}
                            <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                                {isEditingName ? (
                                    <div className="d-flex gap-2 bg-white p-2 rounded-pill shadow-sm animate-fade-in border">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="form-control form-control-sm border-0 bg-transparent text-primary fw-bold text-center"
                                            style={{ width: '120px', boxShadow: 'none' }}
                                            placeholder="Nombre..."
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
                                        onClick={() => {
                                            setNewName(mascot.name);
                                            setIsEditingName(true);
                                        }}
                                        className="btn btn-link text-muted text-decoration-none d-flex align-items-center gap-2 small opacity-75 hover-opacity-100"
                                    >
                                        <span className="small">Cambiar nombre</span>
                                        <Edit2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="card bg-white border-0 shadow-sm rounded-5 p-4 mb-4">
                            <div className="row g-3">
                                <div className="col-6">
                                    <div className="p-3">
                                        <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                                            <Zap size={18} className="text-warning" />
                                            <span className="small fw-bold text-muted">NIVEL</span>
                                        </div>
                                        <div className="h1 mb-0 fw-bold">{mascot.level}</div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="p-3">
                                        <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                                            <Flame size={18} className="text-warning" />
                                            <span className="small fw-bold text-muted">FUEGO</span>
                                        </div>
                                        <div className="h1 mb-0 fw-bold text-warning">{mascot.flamePoints}</div>
                                    </div>
                                </div>
                            </div>

                            {/* XP Progress Bar */}
                            <div className="mt-4 text-start px-2">
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="small fw-bold text-muted">Progreso para Nivel {mascot.level + 1}</span>
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

                        {/* Actions */}
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
                                Avivar el Fuego (-5 puntos)
                            </button>

                            <div className="small text-muted mb-4">
                                Gana más puntos leyendo la Biblia o completando devocionales.
                            </div>

                            <button
                                onClick={() => setIsPlayingTrivia(true)}
                                className="btn btn-outline-primary btn-lg rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-2"
                            >
                                <Gamepad2 size={24} />
                                Desafío Trivia Diario
                            </button>
                        </div>
                    </div>

                    {/* Info Sidebar */}
                    <div className="col-lg-4 mt-5 mt-lg-0">
                        <div className="card bg-white border-0 shadow-sm rounded-5 p-4 h-100">
                            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-warning">
                                <Sparkles size={24} />
                                Guía del Cuidador
                            </h4>

                            <div className="d-flex flex-column gap-4 text-start">
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-light p-3 rounded-4">
                                        <Book className="text-warning" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h6 className="fw-bold mb-1">Lectura de la Biblia</h6>
                                        <p className="small mb-0 text-muted">Gana 1 punto de fuego por cada minuto de lectura activa.</p>
                                    </div>
                                </div>

                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-light p-3 rounded-4">
                                        <Sparkles className="text-warning" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h6 className="fw-bold mb-1">Devocionales</h6>
                                        <p className="small mb-0 text-muted">Cada devocional completo otorga 25 XP directos.</p>
                                    </div>
                                </div>

                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-light p-3 rounded-4">
                                        <Flame className="text-warning" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h6 className="fw-bold mb-1">Evolución</h6>
                                        <p className="small mb-0 text-muted">Al subir de nivel, el espíritu de Llami brilla con más fuerza.</p>
                                    </div>
                                </div>

                                <div className="d-flex gap-3 align-items-start">
                                    <div className="bg-light p-3 rounded-4">
                                        <Gamepad2 className="text-warning" size={24} />
                                    </div>
                                    <div className="pt-1">
                                        <h6 className="fw-bold mb-1">Trivia Diaria</h6>
                                        <p className="small mb-0 text-muted">5 preguntas rápidas. Repite las que fallaste ayer para ganar XP.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .transform-scale-15 {
                    transform: scale(2.0);
                }
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

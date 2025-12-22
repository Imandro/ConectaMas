"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Heart, Zap, ArrowRight, X, Trophy, BookOpen } from "lucide-react";
import LlamiMascot from "./LlamiMascot";

interface LlamiTutorialProps {
    onComplete: () => void;
}

export default function LlamiTutorial({ onComplete }: LlamiTutorialProps) {
    const [step, setStep] = useState(1);
    const [previewStage, setPreviewStage] = useState<"spark" | "flame" | "torch" | "sun" | "star">("spark");

    const totalSteps = 6;

    const stages: ("spark" | "flame" | "torch" | "sun" | "star")[] = ["spark", "flame", "torch", "sun", "star"];
    const stageNames = {
        spark: "Chispa (Día 1)",
        flame: "Flama (Día 3)",
        torch: "Antorcha (Día 15)",
        sun: "Sol (Día 60)",
        star: "Estrella Celeste (Día 180+)"
    };

    // Cycle stages in step 2
    useEffect(() => {
        if (step === 2) {
            const interval = setInterval(() => {
                setPreviewStage(prev => {
                    const currentIndex = stages.indexOf(prev);
                    return stages[(currentIndex + 1) % stages.length];
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step]);

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="mb-4 d-flex justify-content-center">
                            <div className="bg-white rounded-circle p-4 shadow-sm">
                                <LlamiMascot streak={1} />
                            </div>
                        </div>
                        <h2 className="fw-bold text-white mb-3">¡Bienvenido al Refugio!</h2>
                        <p className="text-white-50 lead">
                            Aquí es donde vive tu mascota espiritual. Yo soy Llami, y reflejaré tu constancia en el camino con Dios.
                        </p>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="mb-4 d-flex justify-content-center">
                            <div className="bg-white rounded-circle p-4 shadow-sm" style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ transform: 'scale(1.5)' }}>
                                    <LlamiMascot streak={1} forceStage={previewStage} />
                                </div>
                            </div>
                        </div>
                        <h4 className="fw-bold text-warning mb-2">{stageNames[previewStage]}</h4>
                        <h2 className="fw-bold text-white mb-3">¡Evoluciono contigo!</h2>
                        <p className="text-white-50">
                            A medida que mantengas tu racha diaria, mi forma cambiará. <br />
                            <strong className="text-warning">¡Mi primera evolución ocurre al 3er día!</strong>
                        </p>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <div className="p-3 bg-white bg-opacity-10 rounded-4 border border-white border-opacity-10">
                                    <Zap className="text-warning mb-2" size={32} />
                                    <h6 className="fw-bold text-white mb-1">Nivel</h6>
                                    <p className="tiny text-white-50 mb-0">Sube de nivel con XP</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 bg-white bg-opacity-10 rounded-4 border border-white border-opacity-10">
                                    <Trophy className="text-warning mb-2" size={32} />
                                    <h6 className="fw-bold text-white mb-1">XP</h6>
                                    <p className="tiny text-white-50 mb-0">Gana XP en misiones</p>
                                </div>
                            </div>
                        </div>
                        <h2 className="fw-bold text-white mb-3">Niveles y Experiencia</h2>
                        <p className="text-white-50">
                            Completa devocionales, lee la Biblia y responde las trivias diarias para ganar XP y ayudarme a subir de nivel.
                        </p>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="mx-auto bg-warning bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                            <Flame className="text-warning" size={48} />
                        </div>
                        <h2 className="fw-bold text-white mb-3">Puntos de Llama</h2>
                        <p className="text-white-50">
                            Los <span className="text-warning fw-bold">Puntos de Llama</span> son la energía vital de tu espíritu. Los obtienes leyendo la Biblia en la app.
                        </p>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="p-4 bg-white rounded-5 shadow-lg mb-4 text-primary">
                            <button className="btn btn-warning w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                                <Flame size={24} /> Avivar el Fuego
                            </button>
                        </div>
                        <h2 className="fw-bold text-white mb-3">¡Cuidame!</h2>
                        <p className="text-white-50">
                            Usa tus puntos para "Avivar el Fuego". Esto me da XP directamente y me mantiene motivado para seguir creciendo contigo.
                        </p>
                    </motion.div>
                );
            case 6:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                            <Sparkles className="text-warning animate-pulse" size={64} />
                        </div>
                        <h2 className="fw-bold text-white mb-3">¿Estás listo?</h2>
                        <p className="text-white-50 mb-4">
                            Tu camino espiritual acaba de volverse más brillante. ¡Vamos a crecer juntos!
                        </p>
                        <div className="p-3 bg-white bg-opacity-5 rounded-4 border border-white border-opacity-10 text-start">
                            <p className="small text-white-50 mb-0 italic">
                                "Tu palabra es una lámpara que guía mis pies y una luz para mi camino."
                                <br /><span className="text-warning fw-bold">- Salmos 119:105</span>
                            </p>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, backgroundColor: 'rgba(11, 27, 50, 0.95)', backdropFilter: 'blur(10px)' }}>
            <div className="container" style={{ maxWidth: '500px' }}>
                <div className="d-flex justify-content-end mb-4">
                    <button onClick={onComplete} className="btn btn-link text-white-50 p-0 text-decoration-none">
                        Omitir tutorial
                    </button>
                </div>

                <div className="mb-4">
                    {renderStep()}
                </div>

                <div className="d-flex flex-column gap-3 mt-5">
                    <button
                        onClick={nextStep}
                        className="btn btn-warning btn-lg rounded-pill fw-bold py-3 shadow-lg d-flex align-items-center justify-content-center gap-2"
                        style={{ backgroundColor: '#f3b33e', border: 'none', color: '#0B1B32' }}
                    >
                        {step === totalSteps ? "¡Comenzar!" : "Siguiente"} <ArrowRight size={20} />
                    </button>

                    <div className="d-flex justify-content-center gap-2">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-circle ${step === i + 1 ? 'bg-warning' : 'bg-white bg-opacity-20'}`}
                                style={{ width: '8px', height: '8px', transition: 'all 0.3s' }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

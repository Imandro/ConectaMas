"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Heart, Zap, ArrowRight, X, Trophy, BookOpen } from "lucide-react";
import LlamiMascot from "./LlamiMascot";
import { useLanguage } from "../LanguageContext";

interface LlamiTutorialProps {
    onComplete: () => void;
}

export default function LlamiTutorial({ onComplete }: LlamiTutorialProps) {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [previewStage, setPreviewStage] = useState<"spark" | "flame" | "torch" | "sun" | "star">("spark");

    const totalSteps = 6;

    const stages: ("spark" | "flame" | "torch" | "sun" | "star")[] = ["spark", "flame", "torch", "sun", "star"];
    const stageNames = t.llami_tutorial.stages;

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
                        <h2 className="fw-bold text-white mb-3">{t.llami_tutorial.step1.title}</h2>
                        <p className="text-white-50 lead">
                            {t.llami_tutorial.step1.desc}
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
                        <h4 className="fw-bold text-warning mb-2">{stageNames[previewStage as keyof typeof stageNames]}</h4>
                        <h2 className="fw-bold text-white mb-3">{t.llami_tutorial.step2.title}</h2>
                        <p className="text-white-50">
                            {t.llami_tutorial.step2.desc} <br />
                            <strong className="text-warning">{t.llami_tutorial.step2.evolution}</strong>
                        </p>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <div className="p-3 rounded-4 border border-white border-opacity-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                                    <Zap className="text-warning mb-2" size={32} />
                                    <h6 className="fw-bold text-white mb-1">{t.llami_tutorial.step3.level_label}</h6>
                                    <p className="tiny text-white-50 mb-0">{t.llami_tutorial.step3.level_desc}</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 rounded-4 border border-white border-opacity-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                                    <Trophy className="text-warning mb-2" size={32} />
                                    <h6 className="fw-bold text-white mb-1">{t.llami_tutorial.step3.xp_label}</h6>
                                    <p className="tiny text-white-50 mb-0">{t.llami_tutorial.step3.xp_desc}</p>
                                </div>
                            </div>
                        </div>
                        <h2 className="fw-bold text-white mb-3">{t.llami_tutorial.step3.title}</h2>
                        <p className="text-white-50">
                            {t.llami_tutorial.step3.desc}
                        </p>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="mx-auto bg-warning bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                            <Flame className="text-warning" size={48} />
                        </div>
                        <h2 className="fw-bold text-white mb-3">{t.llami_tutorial.step4.title}</h2>
                        <p className="text-white-50">
                            {t.llami_tutorial.step4.desc_part1}<span className="text-warning fw-bold">{t.llami_tutorial.step4.desc_part2}</span>{t.llami_tutorial.step4.desc_part3}
                        </p>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="p-4 bg-white rounded-5 shadow-lg mb-4 text-primary">
                            <button className="btn btn-warning w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                                <Flame size={24} /> {t.llami_tutorial.step5.button}
                            </button>
                        </div>
                        <h2 className="fw-bold text-white mb-3">{t.llami_tutorial.step5.title}</h2>
                        <p className="text-white-50">
                            {t.llami_tutorial.step5.desc}
                        </p>
                    </motion.div>
                );
            case 6:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                            <Sparkles className="text-warning animate-pulse" size={64} />
                        </div>
                        <h2 className="fw-bold text-white mb-3">{t.llami_tutorial.step6.title}</h2>
                        <p className="text-white-50 mb-4">
                            {t.llami_tutorial.step6.desc}
                        </p>
                        <div className="p-3 rounded-4 border border-white border-opacity-10 text-start" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                            <p className="small text-white-50 mb-0 italic">
                                {t.llami_tutorial.step6.verse}
                                <br /><span className="text-warning fw-bold">{t.llami_tutorial.step6.citation}</span>
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
                        {t.llami_tutorial.skip}
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
                        {step === totalSteps ? t.llami_tutorial.start : t.llami_tutorial.next} <ArrowRight size={20} />
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

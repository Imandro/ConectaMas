"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Heart, MessageCircle, Shield, ArrowRight, X, Sparkles } from "lucide-react";
import LlamiMascot from "@/app/components/LlamiMascot";
import { useLanguage } from "@/app/LanguageContext";

interface LlamiCommunityTutorialProps {
    onComplete: () => void;
}

export default function LlamiCommunityTutorial({ onComplete }: LlamiCommunityTutorialProps) {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);

    const totalSteps = 4;

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const renderStep = () => {
        const ct = t.tutorials.community_tutorial;
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="mb-4 d-flex justify-content-center">
                            <div className="bg-white rounded-circle p-4 shadow-sm">
                                <LlamiMascot streak={1} />
                            </div>
                        </div>
                        <h2 className="fw-bold text-white mb-3">{ct.step1_title}</h2>
                        <p className="text-white-50 lead">
                            {ct.step1_desc}
                        </p>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="row g-3 mb-4">
                            <div className="col-12">
                                <div className="p-3 rounded-4 border border-white border-opacity-10 d-flex align-items-center gap-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                                    <MessageCircle className="text-warning flex-shrink-0" size={32} />
                                    <div className="text-start">
                                        <h6 className="fw-bold text-white mb-1">{ct.step2_cat_title}</h6>
                                        <p className="tiny text-white-50 mb-0">{ct.step2_cat_desc}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="p-3 rounded-4 border border-white border-opacity-10 d-flex align-items-center gap-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                                    <Heart className="text-warning flex-shrink-0" size={32} />
                                    <div className="text-start">
                                        <h6 className="fw-bold text-white mb-1">{ct.step2_support_title}</h6>
                                        <p className="tiny text-white-50 mb-0">{ct.step2_support_desc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 className="fw-bold text-white mb-3">{ct.step2_title}</h2>
                        <p className="text-white-50">
                            {ct.step2_desc}
                        </p>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Shield className="text-warning" size={48} />
                        </div>
                        <h2 className="fw-bold text-white mb-3">{ct.step3_title}</h2>
                        <p className="text-white-50 mb-4" dangerouslySetInnerHTML={{ __html: ct.step3_desc.replace('Anónimamente', '<strong>Anónimamente</strong>').replace('Anônima', '<strong>Anônima</strong>').replace('Anónima', '<strong>Anónima</strong>').replace('Anonymously', '<strong>Anonymously</strong>') }} />
                        <div className="p-3 rounded-4 border border-white border-opacity-10 text-start" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                            <p className="small text-white-50 mb-0">
                                <span className="text-warning fw-bold">{ct.step3_tip}</span> {ct.step3_tip_desc}
                            </p>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                            <Sparkles className="text-warning animate-pulse" size={64} />
                        </div>
                        <h2 className="fw-bold text-white mb-3">{ct.step4_title}</h2>
                        <p className="text-white-50 mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                            {ct.step4_desc}
                        </p>

                        <div className="p-3 rounded-4 border border-white border-opacity-10 text-start" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                            <p className="small text-white-50 mb-0 italic">
                                {ct.step4_verse}
                                <br /><span className="text-warning fw-bold">{ct.step4_verse_ref}</span>
                            </p>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    const ct = t.tutorials.community_tutorial;

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, backgroundColor: 'rgba(11, 27, 50, 0.95)', backdropFilter: 'blur(10px)' }}>
            <div className="container" style={{ maxWidth: '500px' }}>
                <div className="d-flex justify-content-end mb-4">
                    <button onClick={onComplete} className="btn btn-link text-white-50 p-0 text-decoration-none">
                        {ct.skip}
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
                        {step === totalSteps ? ct.finish : ct.next} <ArrowRight size={20} />
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

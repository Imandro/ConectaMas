"use client";

import { useState, useEffect } from "react";
import { Share, PlusSquare, MoreVertical, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

export default function PWAInstallPrompt() {
    const { t } = useLanguage();
    const [showPrompt, setShowPrompt] = useState(false);
    const [platform, setPlatform] = useState<"ios" | "android" | "other" | null>(null);

    useEffect(() => {
        // 1. Detect platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        // 2. Check if already in standalone mode
        const isStandalone =
            (window.navigator as any).standalone ||
            window.matchMedia('(display-mode: standalone)').matches;

        // 3. Logic to show prompt
        const hasDismissed = localStorage.getItem("pwaPromptDismissed");

        if (!isStandalone && (isIos || isAndroid) && !hasDismissed) {
            setPlatform(isIos ? "ios" : "android");
            // Delay a bit to not overwhelm the user immediately
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setShowPrompt(false);
        // We'll show it again after some time or just never again? 
        // Let's hide it for this session/browsing
        localStorage.setItem("pwaPromptDismissed", "true");
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed-bottom p-3 z-5" style={{ zIndex: 9999 }}>
            <div className="card shadow-lg border-0 bg-white animate-slide-up overflow-hidden">
                <div className="card-body p-0">
                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-primary text-white">
                        <div className="d-flex align-items-center gap-2">
                            <img src="/logo.png" alt="Logo" width="32" height="32" className="rounded" />
                            <div className="text-start">
                                <h6 className="mb-0 fw-bold">{t.pwa_prompt.title}</h6>
                                <small className="text-muted">{t.nav.safe_space}</small>
                            </div>
                        </div>
                        <button onClick={handleClose} className="btn btn-link p-0 text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <p className="small text-muted mb-4">
                            {t.pwa_prompt.description}
                        </p>

                        {platform === "ios" ? (
                            <div className="ios-tutorial">
                                <div className="d-flex align-items-start gap-3 mb-3">
                                    <div className="bg-light p-2 rounded">
                                        <Share size={20} className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="small fw-bold mb-1">{t.pwa_prompt.ios_step1}</h6>
                                        <p className="extra-small text-muted mb-0">{t.pwa_prompt.ios_step1_desc}</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-light p-2 rounded">
                                        <PlusSquare size={20} className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="small fw-bold mb-1">{t.pwa_prompt.ios_step2}</h6>
                                        <p className="extra-small text-muted mb-0">{t.pwa_prompt.ios_step2_desc}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="android-tutorial">
                                <div className="d-flex align-items-start gap-3 mb-3">
                                    <div className="bg-light p-2 rounded">
                                        <MoreVertical size={20} className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="small fw-bold mb-1">{t.pwa_prompt.android_step1}</h6>
                                        <p className="extra-small text-muted mb-0">{t.pwa_prompt.android_step1_desc}</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-light p-2 rounded">
                                        <Download size={20} className="text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="small fw-bold mb-1">{t.pwa_prompt.android_step2}</h6>
                                        <p className="extra-small text-muted mb-0">{t.pwa_prompt.android_step2_desc}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Button */}
                    <div className="p-3 bg-light text-center border-top">
                        <button
                            onClick={handleClose}
                            className="btn btn-primary w-100 rounded-pill py-2 fw-bold"
                        >
                            {t.pwa_prompt.button}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slideUp 0.4s ease-out;
                }
                .x-small {
                    font-size: 0.75rem;
                }
            `}</style>
        </div>
    );
}

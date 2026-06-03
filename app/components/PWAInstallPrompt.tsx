"use client";

import { useState, useEffect } from "react";
import { Share, PlusSquare, MoreVertical, Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/LanguageContext';

export default function PWAInstallPrompt() {
    const { t } = useLanguage();
    const [showPrompt, setShowPrompt] = useState(false);
    const [platform, setPlatform] = useState<"ios" | "android" | "other" | null>(null);
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);
        const isStandalone =
            (window.navigator as any).standalone ||
            window.matchMedia('(display-mode: standalone)').matches;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Listen for beforeinstallprompt (Android Chrome)
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e);
            (window as any).__pwaInstallPrompt = e;
            setPlatform("android");
            if (!localStorage.getItem("pwaPromptDismissed")) {
                setTimeout(() => setShowPrompt(true), 3000);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        // Fallback for iOS / non-Chrome Android
        const hasDismissed = localStorage.getItem("pwaPromptDismissed");
        if (!isStandalone && (isIos || isAndroid) && !hasDismissed && !installPrompt) {
            setPlatform(isIos ? "ios" : "android");
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            };
        }

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    }, []);

    const handleInstall = async () => {
        if (installPrompt) {
            installPrompt.prompt();
            const result = await installPrompt.userChoice;
            if (result.outcome === 'accepted') {
                setIsInstalled(true);
                setShowPrompt(false);
            }
            setInstallPrompt(null);
            localStorage.setItem("pwaPromptDismissed", "true");
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setShowPrompt(false);
        localStorage.setItem("pwaPromptDismissed", "true");
    };

    if (!showPrompt || isInstalled) return null;

    return (
        <div className="fixed-bottom p-3 z-5 d-flex justify-content-center justify-content-md-end" style={{ zIndex: 9999, bottom: '160px' }}>
            <div className="card shadow-lg border-0 overflow-hidden animate-slide-up" style={{
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                width: '100%',
                maxWidth: '350px',
                border: '1px solid rgba(0,0,0,0.05)'
            }}>
                <div className="card-body p-3">
                    <div className="d-flex align-items-start gap-3">
                        <img src="/logo.png" alt="Logo" width="40" height="40" className="rounded-3 shadow-sm" />
                        <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold text-dark small">{t.pwa_prompt.title}</h6>
                            <p className="extra-small text-muted mb-3 lh-sm">
                                {t.pwa_prompt.description}
                            </p>

                            {installPrompt ? (
                                <div className="android-steps extra-small text-primary fw-bold mb-3 d-flex flex-column gap-1">
                                    <div className="d-flex align-items-center gap-2">
                                        <Smartphone size={14} /> {t.pwa_prompt.android_step1 || "Instalar aplicación"}
                                    </div>
                                </div>
                            ) : platform === "ios" ? (
                                <div className="ios-steps extra-small text-primary fw-bold mb-3 d-flex flex-column gap-1">
                                    <div className="d-flex align-items-center gap-2">
                                        <Share size={14} /> {t.pwa_prompt.ios_step1}
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <PlusSquare size={14} /> {t.pwa_prompt.ios_step2}
                                    </div>
                                </div>
                            ) : (
                                <div className="android-steps extra-small text-primary fw-bold mb-3 d-flex flex-column gap-1">
                                    <div className="d-flex align-items-center gap-2">
                                        <MoreVertical size={14} /> {t.pwa_prompt.android_step1}
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Download size={14} /> {t.pwa_prompt.android_step2}
                                    </div>
                                </div>
                            )}

                            {installPrompt ? (
                                <button
                                    onClick={handleInstall}
                                    className="btn btn-success btn-sm w-100 rounded-pill fw-bold"
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    <Download size={14} className="me-1" /> Instalar App
                                </button>
                            ) : (
                                <button
                                    onClick={handleClose}
                                    className="btn btn-primary btn-sm w-100 rounded-pill fw-bold"
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    {t.pwa_prompt.button}
                                </button>
                            )}
                        </div>
                        <button onClick={handleClose} className="btn btn-link p-0 text-muted opacity-50 hover-opacity-100">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .extra-small {
                    font-size: 0.7rem;
                }
            `}</style>
        </div>
    );
}

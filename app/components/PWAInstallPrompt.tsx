"use client";

import { useState, useEffect } from "react";
import { Share, PlusSquare, MoreVertical, Download, X, Smartphone } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/LanguageContext';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type StandaloneNavigator = Navigator & {
    standalone?: boolean;
};

type InstallPromptWindow = Window & {
    __pwaInstallPrompt?: BeforeInstallPromptEvent;
};

const OVERLAY_OWNER_KEY = 'conectaOverlayOwner';

function claimOverlay(owner: string) {
    const root = document.documentElement;
    const currentOwner = root.dataset[OVERLAY_OWNER_KEY];
    if (currentOwner && currentOwner !== owner) return false;
    root.dataset[OVERLAY_OWNER_KEY] = owner;
    return true;
}

function releaseOverlay(owner: string) {
    const root = document.documentElement;
    if (root.dataset[OVERLAY_OWNER_KEY] === owner) delete root.dataset[OVERLAY_OWNER_KEY];
}

export default function PWAInstallPrompt() {
    const { t } = useLanguage();
    const [showPrompt, setShowPrompt] = useState(false);
    const [platform, setPlatform] = useState<"ios" | "android" | "other" | null>(null);
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/design-preview') {
            setShowPrompt(false);
            return;
        }

        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);
        const isStandalone =
            (window.navigator as StandaloneNavigator).standalone ||
            window.matchMedia('(display-mode: standalone)').matches;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Listen for beforeinstallprompt (Android Chrome)
        let promptTimer: number | undefined;
        const schedulePrompt = () => {
            if (!localStorage.getItem("pwaPromptDismissed")) {
                promptTimer = window.setTimeout(() => setShowPrompt(true), 3000);
            }
        };
        const handleBeforeInstall = (event: Event) => {
            const e = event as BeforeInstallPromptEvent;
            e.preventDefault();
            setInstallPrompt(e);
            (window as InstallPromptWindow).__pwaInstallPrompt = e;
            setPlatform("android");
            if (promptTimer) window.clearTimeout(promptTimer);
            schedulePrompt();
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowPrompt(false);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Fallback for iOS / non-Chrome Android
        const hasDismissed = localStorage.getItem("pwaPromptDismissed");
        if (!isStandalone && (isIos || isAndroid) && !hasDismissed) {
            setPlatform(isIos ? "ios" : "android");
            schedulePrompt();
        }

        return () => {
            if (promptTimer) window.clearTimeout(promptTimer);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [pathname]);

    useEffect(() => {
        if (!showPrompt) {
            setIsVisible(false);
            return;
        }
        if (!claimOverlay('pwa')) {
            setShowPrompt(false);
            return;
        }

        const frame = window.requestAnimationFrame(() => setIsVisible(true));
        return () => {
            window.cancelAnimationFrame(frame);
            releaseOverlay('pwa');
        };
    }, [showPrompt]);

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
        <div className="fixed-bottom p-3 d-flex justify-content-center justify-content-md-end mobile-overlay mobile-overlay-pwa" role="dialog" aria-modal="false" aria-label="Instalar Conecta+">
            <div className={`ui-surface-glass card shadow-lg overflow-hidden mobile-overlay-card ${isVisible ? 'is-visible' : ''}`}>
                <div className="card-body p-3">
                    <div className="d-flex align-items-start gap-3">
                        <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-3 shadow-sm" />
                        <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold small mobile-overlay-title">{t.pwa_prompt.title}</h6>
                            <p className="extra-small mb-3 lh-sm mobile-overlay-muted">
                                {t.pwa_prompt.description}
                            </p>

                            {installPrompt ? (
                                <div className="android-steps extra-small text-primary fw-bold mb-3 d-flex flex-column gap-1">
                                    <div className="d-flex align-items-center gap-2">
                                        <Smartphone size={14} aria-hidden="true" /> {t.pwa_prompt.android_step1 || "Instalar aplicación"}
                                    </div>
                                </div>
                            ) : platform === "ios" ? (
                                <div className="ios-steps extra-small text-primary fw-bold mb-3 d-flex flex-column gap-1">
                                    <div className="d-flex align-items-center gap-2">
                                        <Share size={14} aria-hidden="true" /> {t.pwa_prompt.ios_step1}
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <PlusSquare size={14} aria-hidden="true" /> {t.pwa_prompt.ios_step2}
                                    </div>
                                </div>
                            ) : (
                                <div className="android-steps extra-small text-primary fw-bold mb-3 d-flex flex-column gap-1">
                                    <div className="d-flex align-items-center gap-2">
                                        <MoreVertical size={14} aria-hidden="true" /> {t.pwa_prompt.android_step1}
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Download size={14} aria-hidden="true" /> {t.pwa_prompt.android_step2}
                                    </div>
                                </div>
                            )}

                            {installPrompt ? (
                                <button
                                    onClick={handleInstall}
                                    className="btn btn-success btn-sm w-100 rounded-pill fw-bold mobile-overlay-action"
                                >
                                    <Download size={14} className="me-1" aria-hidden="true" /> Instalar App
                                </button>
                            ) : (
                                <button
                                    onClick={handleClose}
                                    className="btn btn-primary btn-sm w-100 rounded-pill fw-bold mobile-overlay-action"
                                >
                                    {t.pwa_prompt.button}
                                </button>
                            )}
                        </div>
                        <button onClick={handleClose} aria-label="Cerrar instalación" className="btn btn-link p-0 opacity-50 hover-opacity-100 mobile-overlay-close">
                            <X size={16} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

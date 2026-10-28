"use client";

import React, { useState, useEffect } from "react";
import { X, Bell } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/LanguageContext';

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

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error);
}

export default function NotificationPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useLanguage();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/design-preview') {
            setShowPrompt(false);
            return;
        }

        // Register Service Worker for Push Notifications
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
        }

        // Only show if supported and permission is 'default' (not granted or denied)
        if ('Notification' in window && Notification.permission === 'default') {
            const hasDismissed = localStorage.getItem("notificationPromptDismissed");
            if (!hasDismissed) {
                // Show after 5 seconds to not be intrusive immediately
                const timer = setTimeout(() => setShowPrompt(true), 5000);
                return () => clearTimeout(timer);
            }
        }
    }, [pathname]);

    useEffect(() => {
        if (!showPrompt) {
            setIsVisible(false);
            return;
        }
        if (!claimOverlay('notifications')) {
            setShowPrompt(false);
            return;
        }

        const frame = window.requestAnimationFrame(() => setIsVisible(true));
        return () => {
            window.cancelAnimationFrame(frame);
            releaseOverlay('notifications');
        };
    }, [showPrompt]);

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem("notificationPromptDismissed", "true");
    };

    const handleEnable = async () => {
        if (!navigator.onLine) {
            alert(t.notifications_prompt.offline);
            return;
        }
        setLoading(true);
        try {
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                if ('serviceWorker' in navigator) {
                    const registration = await navigator.serviceWorker.ready;

                    let sub = await registration.pushManager.getSubscription();

                    if (!sub) {
                        const rawKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
                        const VAPID_PUBLIC_KEY = rawKey.trim();
                        if (!VAPID_PUBLIC_KEY) {
                            throw new Error(t.notifications_prompt.not_configured);
                        }

                        try {
                            sub = await registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                            });

                            const res = await fetch('/api/notifications/subscribe', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(sub.toJSON()),
                            });

                            if (!res.ok) {
                                const errText = await res.text();
                                throw new Error("Failed to save subscription on server: " + errText);
                            }
                        } catch (subErr: unknown) {
                            console.error("Failed to subscribe to push manager:", subErr);
                            alert(t.notifications_prompt.subscribe_error.replace('{error}', errorMessage(subErr)));
                            setLoading(false);
                            return;
                        }
                    }
                }
                setShowPrompt(false);
                localStorage.setItem("notificationPromptDismissed", "true");
            } else {
                alert(t.notifications_prompt.permission_denied);
                handleDismiss();
            }
        } catch (error: unknown) {
            console.error("Error requesting notification permission:", error);
            alert(t.notifications_prompt.generic_error.replace('{error}', errorMessage(error)));
            handleDismiss();
        } finally {
            setLoading(false);
        }
    };

    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    if (!showPrompt) return null;

    return (
        <div className="fixed-bottom p-3 d-flex justify-content-center justify-content-md-end mobile-overlay mobile-overlay-notifications" role="dialog" aria-modal="false" aria-label={t.notifications_prompt.aria_label}>
            <div className={`ui-surface-glass card shadow-lg overflow-hidden mobile-overlay-card ${isVisible ? 'is-visible' : ''}`}>
                <div className="card-body p-3">
                    <div className="d-flex align-items-start gap-3">
                        <div className="bg-secondary rounded-circle p-2 flex-shrink-0">
                            <Bell size={20} className="text-primary" aria-hidden="true" />
                        </div>
                        <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold small mobile-overlay-title">{t.notifications_prompt.heading}</h6>
                            <p className="extra-small mb-2 lh-sm mobile-overlay-muted">
                                {t.notifications_prompt.description}
                            </p>
                            <div className="d-flex gap-2">
                                <button
                                    onClick={handleEnable}
                                    className="btn btn-primary btn-sm rounded-pill px-3 fw-bold flex-grow-1 mobile-overlay-action"
                                    disabled={loading}
                                    aria-busy={loading}
                                >
                                    {loading ? '...' : t.notifications_prompt.button_enable}
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="btn btn-outline-secondary btn-sm rounded-pill px-3 flex-grow-1 mobile-overlay-action"
                                >
                                    {t.notifications_prompt.button_later}
                                </button>
                            </div>
                        </div>
                        <button onClick={handleDismiss} aria-label={t.common.close} className="btn btn-link p-0 opacity-50 hover-opacity-100 mobile-overlay-close">
                            <X size={16} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

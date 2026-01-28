"use client";

import React, { useState, useEffect } from "react";
import { X, Bell, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from '@/app/LanguageContext';

export default function NotificationPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        // Register Service Worker for Push Notifications
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then((registration) => {
                console.log('SW Registered:', registration);
            }).catch((error) => {
                console.error('Service Worker registration failed:', error);
                alert("SW Error: " + error.message);
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
    }, []);

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem("notificationPromptDismissed", "true");
    };

    const handleEnable = async () => {
        setLoading(true);
        console.log("Requesting permission...");
        try {
            const permission = await Notification.requestPermission();
            console.log("Permission:", permission);

            if (permission === 'granted') {
                if ('serviceWorker' in navigator) {
                    const registration = await navigator.serviceWorker.ready;
                    console.log("SW Ready:", registration);

                    let sub = await registration.pushManager.getSubscription();
                    console.log("Existing Sub:", sub);

                    if (!sub) {
                        const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BGBZ1Q1LwyPolkAPnshPKwQ6NNijzuu8_lqDziuABVb6z60pX1uwKsw1jgO-rCabt5QIf_90OSNqNRgXKti9zyI";
                        console.log("Using VAPID Key:", VAPID_PUBLIC_KEY);

                        try {
                            sub = await registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                            });
                            console.log("New Sub created:", sub);

                            const res = await fetch('/api/notifications/subscribe', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(sub.toJSON()),
                            });

                            if (!res.ok) {
                                const errText = await res.text();
                                throw new Error("Failed to save subscription on server: " + errText);
                            }
                            console.log("Sub saved to server");
                        } catch (subErr: any) {
                            console.error("Failed to subscribe to push manager:", subErr);
                            alert("Error subscribing: " + subErr.message);
                            setLoading(false);
                            return;
                        }
                    }
                }
                setShowPrompt(false);
                localStorage.setItem("notificationPromptDismissed", "true");
            } else {
                alert("Permission denied. Please enable notifications in your browser settings.");
                handleDismiss();
            }
        } catch (error: any) {
            console.error("Error requesting notification permission:", error);
            alert("Error: " + error.message);
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
        <div className="fixed-bottom p-3 z-5" style={{ zIndex: 9998, bottom: '80px' }}>
            <div className="card shadow-lg border-0 overflow-hidden animate-slide-up" style={{
                borderRadius: '24px',
                backgroundColor: 'var(--card-bg)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border-color)'
            }}>
                <div className="card-body p-0">
                    {/* Header with gradient */}
                    <div className="d-flex align-items-center justify-content-between p-3 text-white" style={{
                        background: 'linear-gradient(135deg, #0B1B32 0%, #1e293b 100%)'
                    }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-secondary rounded-circle p-1">
                                <Bell size={18} className="text-primary" />
                            </div>
                            <div className="text-start">
                                <h6 className="mb-0 fw-bold">{t.notifications_prompt.title}</h6>
                                <small className="text-muted">{t.notifications_prompt.welcome}</small>
                            </div>
                        </div>
                        <button onClick={handleDismiss} className="btn btn-link p-0 text-white opacity-75">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 text-center">
                        <div className="mb-3 d-flex justify-content-center gap-2">
                            <Sparkles className="text-secondary" size={24} />
                            <CheckCircle2 className="text-success" size={24} />
                        </div>
                        <h5 className="fw-bold mb-2" style={{ color: 'var(--text-color)' }}>{t.notifications_prompt.heading}</h5>
                        <p className="small text-muted mb-4">
                            {t.notifications_prompt.description}
                        </p>

                        <div className="d-grid gap-2">
                            <button
                                onClick={handleEnable}
                                className="btn btn-primary rounded-pill py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                disabled={loading}
                            >
                                {loading && <span className="spinner-border spinner-border-sm" role="status"></span>}
                                {loading ? t.notifications_prompt.button_enabling : t.notifications_prompt.button_enable}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="btn btn-link btn-sm text-muted text-decoration-none"
                            >
                                {t.notifications_prompt.button_later}
                            </button>
                        </div>
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
            `}</style>
        </div>
    );
}

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
                        const rawKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BGBZ1Q1LwyPolkAPnshPKwQ6NNijzuu8_lqDziuABVb6z60pX1uwKsw1jgO-rCabt5QIf_90OSNqNRgXKti9zyI";
                        const VAPID_PUBLIC_KEY = rawKey.trim();
                        console.log("Using VAPID Key length:", VAPID_PUBLIC_KEY.length);

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
        <div className="fixed-bottom p-3 z-5 d-flex justify-content-center justify-content-md-end" style={{ zIndex: 9998, bottom: '80px' }}>
            <div className="card shadow-lg border-0 overflow-hidden animate-slide-up" style={{
                borderRadius: '20px',
                backgroundColor: 'rgba(11, 27, 50, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                maxWidth: '350px'
            }}>
                <div className="card-body p-3">
                    <div className="d-flex align-items-start gap-3">
                        <div className="bg-secondary rounded-circle p-2 flex-shrink-0">
                            <Bell size={20} className="text-primary" />
                        </div>
                        <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold text-white small">{t.notifications_prompt.heading}</h6>
                            <p className="extra-small text-white-50 mb-2 lh-sm">
                                {t.notifications_prompt.description}
                            </p>
                            <div className="d-flex gap-2">
                                <button
                                    onClick={handleEnable}
                                    className="btn btn-primary btn-sm rounded-pill px-3 fw-bold flex-grow-1"
                                    disabled={loading}
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    {loading ? '...' : t.notifications_prompt.button_enable}
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="btn btn-outline-light btn-sm rounded-pill px-3 flex-grow-1"
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    {t.notifications_prompt.button_later}
                                </button>
                            </div>
                        </div>
                        <button onClick={handleDismiss} className="btn btn-link p-0 text-white opacity-50 hover-opacity-100">
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

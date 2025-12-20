"use client";

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';

export default function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            checkSubscription();
        } else {
            setLoading(false);
        }
    }, []);

    async function checkSubscription() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.getSubscription();
            setSubscription(sub);
        } catch (error) {
            console.error('Error checking subscription:', error);
        } finally {
            setLoading(false);
        }
    }

    async function subscribe() {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;

            // Generate VAPID public key
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidPublicKey) {
                throw new Error('VAPID public key not found');
            }

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            // Save to server
            const res = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub),
            });

            if (res.ok) {
                setSubscription(sub);
            } else {
                alert('Error al guardar la suscripción');
            }
        } catch (error) {
            console.error('Error during subscription:', error);
            alert('No se pudo activar las notificaciones. Asegúrate de dar permiso.');
        } finally {
            setLoading(false);
        }
    }

    async function unsubscribe() {
        setLoading(true);
        try {
            if (subscription) {
                await subscription.unsubscribe();

                // Remove from server
                await fetch('/api/notifications/subscribe', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                });

                setSubscription(null);
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);
        } finally {
            setLoading(false);
        }
    }

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

    if (!isSupported) return null;

    return (
        <div className="card shadow-sm border-0 mb-4 overflow-hidden">
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
                <div>
                    <h6 className="fw-bold mb-1 d-flex align-items-center gap-2">
                        <Bell className="text-primary" size={20} />
                        Notificaciones del Sistema
                    </h6>
                    <p className="small text-muted mb-0">
                        Recibe recordatorios en tu teléfono para orar y leer la Biblia.
                    </p>
                </div>

                {loading ? (
                    <Loader2 className="animate-spin text-muted" size={24} />
                ) : subscription ? (
                    <button
                        onClick={unsubscribe}
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                    >
                        <BellOff size={16} className="me-2" />
                        Desactivar
                    </button>
                ) : (
                    <button
                        onClick={subscribe}
                        className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm"
                    >
                        <Bell size={16} className="me-2" />
                        Activar
                    </button>
                )}
            </div>
        </div>
    );
}

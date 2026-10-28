'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
    drainSyncQueue,
    SYNC_STATUS_EVENT,
    type SyncStatusDetail,
} from '@/app/lib/syncQueueProcessor';
import { useLanguage } from '@/app/LanguageContext';

async function hashUser(value: string) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export default function OfflineUserSync() {
    const { data: session } = useSession();
    const userId = (session?.user as { id?: string; email?: string } | undefined)?.id || session?.user?.email || null;
    const { language } = useLanguage();
    const [status, setStatus] = useState<SyncStatusDetail | null>(null);

    useEffect(() => {
        if (!userId) {
            setStatus(null);
            return;
        }

        const drain = () => {
            if (navigator.onLine === false) return;
            void drainSyncQueue(userId).catch(() => undefined);
        };
        drain();
        window.addEventListener('online', drain);
        return () => window.removeEventListener('online', drain);
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        const onStatus = (event: Event) => {
            const detail = (event as CustomEvent<SyncStatusDetail>).detail;
            if (!detail || detail.userId !== userId) return;
            setStatus(detail);
            if (detail.status === 'done') {
                window.setTimeout(() => setStatus((current) => current?.message === detail.message ? null : current), 2500);
            }
        };
        window.addEventListener(SYNC_STATUS_EVENT, onStatus);
        return () => window.removeEventListener(SYNC_STATUS_EVENT, onStatus);
    }, [userId]);

    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        const swUserId = userId || 'guest';
        navigator.serviceWorker.ready
            .then((registration) => hashUser(swUserId).then((key) => {
                registration.active?.postMessage({ type: 'OFFLINE_USER', key, language });
            }))
            .catch(() => undefined);
    }, [userId, language]);

    if (!status) return null;

    const message = status.status === 'queued'
        ? 'Guardado sin conexión'
        : status.status === 'syncing'
            ? 'Sincronizando…'
            : status.status === 'permanent-error'
                ? 'Error permanente de sincronización'
                : 'Sincronizado';

    return (
        <div
            role="status"
            aria-live="polite"
            className={`position-fixed top-0 start-50 translate-middle-x mt-2 px-3 py-2 rounded-pill shadow-sm small fw-bold ${status.status === 'permanent-error' ? 'bg-danger text-white' : 'bg-dark text-white'}`}
            style={{ zIndex: 11000 }}
        >
            {message}: {status.message}
        </div>
    );
}

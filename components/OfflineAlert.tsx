'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useLanguage } from '@/app/LanguageContext';

export default function OfflineAlert() {
    const [isOffline, setIsOffline] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        setIsOffline(!navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div
            className="offline-alert position-fixed start-50 translate-middle-x d-flex align-items-center gap-2 py-2 px-3 mb-0 rounded-4"
            style={{
                zIndex: 11000,
                top: 'calc(0.75rem + env(safe-area-inset-top))',
                width: 'min(calc(100% - 1.5rem), 34rem)',
                backgroundColor: 'var(--card-bg, #ffffff)',
                border: '1px solid var(--border-color, #e2e8f0)',
                boxShadow: 'var(--shadow-sm, 0 2px 8px rgba(11, 27, 50, 0.06))',
                color: 'var(--text-color, #0B1B32)',
            }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
        >
            <WifiOff size={18} aria-hidden="true" />
            <span className="small">{t.offline.alert}</span>
        </div>
    );
}

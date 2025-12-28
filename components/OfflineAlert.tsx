'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import Image from 'next/image';

export default function OfflineAlert() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial check
        setIsOffline(!navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#001F3F] text-white p-6">
            <div className="flex flex-col items-center gap-6 text-center animate-fade-in-up">
                <div className="relative w-32 h-32 mb-4">
                    <Image
                        src="/logo.png"
                        alt="Conecta+ Logo"
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="bg-[#FFD700] p-4 rounded-full bg-opacity-10 backdrop-blur-sm border border-[#FFD700]/20">
                    <WifiOff className="w-12 h-12 text-[#FFD700]" />
                </div>

                <h2 className="text-3xl font-bold font-outfit text-[#FFD700]">Sin Conexión</h2>

                <p className="text-lg text-gray-300 max-w-sm">
                    Parece que no tienes internet. Revisa tu conexión para seguir disfrutando de Conecta+.
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-8 py-3 bg-[#FFD700] text-[#001F3F] font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                >
                    Reintentar
                </button>
            </div>
        </div>
    );
}

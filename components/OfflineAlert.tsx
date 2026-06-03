'use client';

import { useEffect, useState } from 'react';
import { WifiOff, BookOpen, Gamepad2, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function OfflineAlert() {
    const [isOffline, setIsOffline] = useState(false);

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
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#001F3F] text-white p-6">
            <div className="flex flex-col items-center gap-6 text-center animate-fade-in-up max-w-md">
                <div className="relative w-24 h-24 mb-2">
                    <Image
                        src="/logo.png"
                        alt="Conecta+ Logo"
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="bg-[#FFD700] p-4 rounded-full bg-opacity-10 backdrop-blur-sm border border-[#FFD700]/20">
                    <WifiOff className="w-10 h-10 text-[#FFD700]" />
                </div>

                <h2 className="text-2xl font-bold text-[#FFD700]">Sin Conexión</h2>

                <p className="text-gray-300 text-sm">
                    No tienes internet, pero aún puedes usar estas funciones:
                </p>

                <div className="grid gap-3 w-full">
                    <Link
                        href="/dashboard/bible"
                        className="flex items-center gap-3 bg-white/10 hover:bg-[#FFD700]/20 rounded-xl p-4 transition-colors text-left"
                    >
                        <BookOpen className="w-6 h-6 text-[#FFD700] shrink-0" />
                        <div>
                            <div className="font-semibold text-sm">Leer la Biblia</div>
                            <div className="text-xs text-gray-400">Disponible sin internet</div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/games/speed-quiz"
                        className="flex items-center gap-3 bg-white/10 hover:bg-[#FFD700]/20 rounded-xl p-4 transition-colors text-left"
                    >
                        <Gamepad2 className="w-6 h-6 text-[#FFD700] shrink-0" />
                        <div>
                            <div className="font-semibold text-sm">Pregunta Relámpago</div>
                            <div className="text-xs text-gray-400">Juego de trivia sin conexión</div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/games"
                        className="flex items-center gap-3 bg-white/10 hover:bg-[#FFD700]/20 rounded-xl p-4 transition-colors text-left"
                    >
                        <Gamepad2 className="w-6 h-6 text-[#FFD700] shrink-0" />
                        <div>
                            <div className="font-semibold text-sm">Juegos Bíblicos</div>
                            <div className="text-xs text-gray-400">Todos los juegos disponibles</div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/sos"
                        className="flex items-center gap-3 bg-white/10 hover:bg-[#FFD700]/20 rounded-xl p-4 transition-colors text-left"
                    >
                        <Heart className="w-6 h-6 text-[#FFD700] shrink-0" />
                        <div>
                            <div className="font-semibold text-sm">SOS / Emergencia</div>
                            <div className="text-xs text-gray-400">Promesas de Dios sin conexión</div>
                        </div>
                    </Link>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-8 py-3 bg-[#FFD700] text-[#001F3F] font-bold rounded-xl shadow-lg hover:scale-105 transition-transform text-sm w-full"
                >
                    Reintentar
                </button>
            </div>
        </div>
    );
}

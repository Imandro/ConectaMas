"use client";

import { WifiOff, BookOpen, Gamepad2, Heart, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white p-4">
            <div className="text-center animate-fade-in" style={{ maxWidth: 420 }}>
                <div className="mb-4 d-flex justify-content-center">
                    <div className="bg-danger-subtle p-4 rounded-circle">
                        <WifiOff size={64} className="text-danger" />
                    </div>
                </div>

                <h2 className="fw-bold mb-3">Sin Conexión</h2>
                <p className="text-white-50 small mb-4">
                    No se pudo cargar esta página sin internet.
                    Pero estas funciones están disponibles:
                </p>

                <div className="d-flex flex-column gap-2 mb-4">
                    <Link href="/dashboard/bible" className="btn btn-outline-info rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
                        <BookOpen size={18} /> Leer la Biblia
                    </Link>
                    <Link href="/dashboard/games/speed-quiz" className="btn btn-outline-success rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
                        <Gamepad2 size={18} /> Pregunta Relámpago
                    </Link>
                    <Link href="/dashboard/games" className="btn btn-outline-success rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
                        <Gamepad2 size={18} /> Juegos Bíblicos
                    </Link>
                    <Link href="/dashboard/sos" className="btn btn-outline-warning rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
                        <Heart size={18} /> SOS / Emergencia
                    </Link>
                    <Link href="/dashboard" className="btn btn-primary rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
                        <Home size={18} /> Ir al Inicio
                    </Link>
                </div>

                <div className="d-flex flex-column gap-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-outline-light rounded-pill py-2"
                    >
                        Reintentar Conexión
                    </button>

                    <button
                        onClick={() => {
                            if (confirm("Se cerrará tu sesión y se limpiarán datos corruptos. ¿Continuar?")) {
                                localStorage.clear();
                                sessionStorage.clear();
                                document.cookie.split(";").forEach((c) => {
                                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                                });
                                window.location.href = "/auth/login";
                            }
                        }}
                        className="btn btn-link text-warning small mt-2"
                    >
                        ¿Sigues con problemas? Limpiar todo
                    </button>
                </div>
            </div>
        </div>
    );
}

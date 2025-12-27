"use client";

import { WifiOff, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white p-4">
            <div className="text-center animate-fade-in">
                <div className="mb-4 d-flex justify-content-center">
                    <div className="bg-danger-subtle p-4 rounded-circle">
                        <WifiOff size={64} className="text-danger" />
                    </div>
                </div>

                <h2 className="fw-bold mb-3">Sin Conexión</h2>
                <p className="text-white-50 mb-4 opcaity-75">
                    Parece que no tienes internet. <br />
                    Puedes seguir usando algunas funciones básicas <br />
                    o intentar reconectar.
                </p>

                <div className="d-grid gap-2">
                    <Link href="/dashboard" className="btn btn-primary rounded-pill py-3 px-5 shadow-sm">
                        <Home size={18} className="me-2" />
                        Ir al Inicio (Caché)
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-outline-light rounded-pill py-3"
                    >
                        Reintentar Conexión
                    </button>
                </div>

                <div className="mt-5 p-3 rounded-4 bg-white bg-opacity-10 text-start">
                    <h6 className="fw-bold small mb-2 text-warning">FUNCIONES DISPONIBLES:</h6>
                    <ul className="small text-white-50 list-unstyled m-0">
                        <li>✅ Ver tus últimas estadísticas</li>
                        <li>✅ Leer Promesas de Dios (SOS)</li>
                        <li>✅ Acceder a tu perfil</li>
                        <li>✅ Consultar versículos guardados</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

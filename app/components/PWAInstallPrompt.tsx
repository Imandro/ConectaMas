"use client";

import { useState, useEffect } from "react";
import { X, Share, PlusSquare, MoreVertical, Download } from "lucide-react";

export default function PWAInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [platform, setPlatform] = useState<"ios" | "android" | "other" | null>(null);

    useEffect(() => {
        // 1. Detect platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        // 2. Check if already in standalone mode
        const isStandalone =
            (window.navigator as any).standalone ||
            window.matchMedia('(display-mode: standalone)').matches;

        // 3. Logic to show prompt
        const hasDismissed = localStorage.getItem("pwaPromptDismissed");

        if (!isStandalone && (isIos || isAndroid) && !hasDismissed) {
            setPlatform(isIos ? "ios" : "android");
            // Delay a bit to not overwhelm the user immediately
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setShowPrompt(false);
        // We'll show it again after some time or just never again? 
        // Let's hide it for this session/browsing
        localStorage.setItem("pwaPromptDismissed", "true");
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed-bottom p-3 z-5" style={{ zIndex: 9999 }}>
            <div className="card shadow-lg border-0 bg-white animate-slide-up overflow-hidden">
                <div className="card-body p-0">
                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-primary text-white">
                        <div className="d-flex align-items-center gap-2">
                            <img src="/logo.png" alt="Logo" width="32" height="32" className="rounded" />
                            <h6 className="mb-0 fw-bold">Instalar Conecta+ BETA</h6>
                        </div>
                        <button onClick={handleDismiss} className="btn btn-link p-0 text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <p className="small text-muted mb-4">
                            Usa Conecta+ BETA como una aplicación real en tu teléfono: sin barras de navegación y con acceso rápido.
                        </p>

                        {platform === "ios" ? (
                            <div className="ios-tutorial">
                                <div className="d-flex align-items-start gap-3 mb-3">
                                    <div className="bg-light p-2 rounded">
                                        <Share size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="mb-1 small fw-bold">1. Toca el botón compartir</p>
                                        <p className="mb-0 x-small text-muted">Ubicado en la parte inferior de Safari.</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-light p-2 rounded">
                                        <PlusSquare size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="mb-1 small fw-bold">2. Agregar al inicio</p>
                                        <p className="mb-0 x-small text-muted">Presiona &quot;Agregar a la pantalla de inicio&quot;.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="android-tutorial">
                                <div className="d-flex align-items-start gap-3 mb-3">
                                    <div className="bg-light p-2 rounded">
                                        <MoreVertical size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="mb-1 small fw-bold">1. Toca el menú</p>
                                        <p className="mb-0 x-small text-muted">Los tres puntos en la esquina superior derecha.</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start gap-3">
                                    <div className="bg-light p-2 rounded">
                                        <Download size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="mb-1 small fw-bold">2. Instalar aplicación</p>
                                        <p className="mb-0 x-small text-muted">Selecciona &quot;Instalar aplicación&quot; o &quot;Agregar a pantalla de inicio&quot;.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Button */}
                    <div className="p-3 bg-light text-center border-top">
                        <button
                            onClick={handleDismiss}
                            className="btn btn-primary rounded-pill px-4 btn-sm"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slideUp 0.4s ease-out;
                }
                .x-small {
                    font-size: 0.75rem;
                }
            `}</style>
        </div>
    );
}

"use client";

import { WifiOff, BookOpen, Gamepad2, Heart, Home, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OfflinePage() {
    const [reloading, setReloading] = useState(false);
    const [stars, setStars] = useState<{ x: number; y: number; d: number; s: number }[]>([]);

    useEffect(() => {
        setStars(
            Array.from({ length: 60 }, () => ({
                x: Math.random() * 100,
                y: Math.random() * 100,
                d: Math.random() * 3,
                s: Math.random() * 2 + 1,
            }))
        );
    }, []);

    return (
        <div className="position-relative min-vh-100 d-flex align-items-center justify-content-center p-4" style={{
            background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #1a0533 100%)',
            overflow: 'hidden',
        }}>
            {stars.map((star, i) => (
                <div key={i} className="position-absolute" style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.s,
                    height: star.s,
                    background: '#fff',
                    borderRadius: '50%',
                    animation: `pulse ${star.d}s ease-in-out infinite`,
                    pointerEvents: 'none',
                }} />
            ))}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
                @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
                @keyframes spin { to { transform: rotate(360deg); } }
                .llami-head {
                    width: 80px; height: 80px; background: linear-gradient(135deg, #e8d5b7, #d4b896);
                    border-radius: 50%; margin: 0 auto; position: relative;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }
                .llami-ear {
                    width: 18px; height: 28px; background: linear-gradient(135deg, #d4b896, #c4a07a);
                    border-radius: 50% 50% 30% 30%; position: absolute; top: -10px;
                }
                .llami-ear.left { left: 12px; transform: rotate(-15deg); }
                .llami-ear.right { right: 12px; transform: rotate(15deg); }
                .llami-eye {
                    width: 14px; height: 16px; background: #2d1b69;
                    border-radius: 50%; position: absolute; top: 32px;
                }
                .llami-eye.left { left: 18px; }
                .llami-eye.right { right: 18px; }
                .llami-eye::after {
                    content: ''; width: 5px; height: 5px; background: #fff;
                    border-radius: 50%; position: absolute; top: 3px; left: 3px;
                }
                .llami-nose {
                    width: 10px; height: 8px; background: #c4a07a;
                    border-radius: 50%; position: absolute; top: 44px; left: 50%; margin-left: -5px;
                }
                .llami-mouth {
                    width: 20px; height: 10px; border-bottom: 3px solid #8b6f4e;
                    border-radius: 0 0 20px 20px; position: absolute; top: 52px; left: 50%; margin-left: -10px;
                }
                .llami-scarf {
                    width: 60px; height: 12px;
                    background: linear-gradient(90deg, #8b5cf6, #6d28d9, #8b5cf6);
                    border-radius: 4px; margin: -6px auto 0; position: relative; z-index: 2;
                }
                .glass-card {
                    background: rgba(255,255,255,0.06);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .offline-link {
                    transition: all 0.2s;
                }
                .offline-link:hover {
                    transform: translateX(4px);
                }
            `}</style>

            <div className="glass-card rounded-4 p-4 p-sm-5 text-center animate-fade-in" style={{
                maxWidth: 440, width: '100%', animation: 'fadeIn 0.6s ease-out',
                position: 'relative', zIndex: 1,
            }}>
                <div style={{ animation: 'float 3s ease-in-out infinite', marginBottom: 20 }}>
                    <div className="llami-head">
                        <div className="llami-ear left"></div>
                        <div className="llami-ear right"></div>
                        <div className="llami-eye left"></div>
                        <div className="llami-eye right"></div>
                        <div className="llami-nose"></div>
                        <div className="llami-mouth"></div>
                    </div>
                    <div className="llami-scarf"></div>
                </div>

                <div className="d-flex justify-content-center gap-1 mb-3" style={{ height: 24 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} style={{
                            width: 6, height: [16, 24, 32, 40, 48][i - 1],
                            background: 'linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0.6))',
                            borderRadius: 3,
                            animation: `pulse 1.5s ease-in-out ${(i - 1) * 0.2}s infinite`,
                        }} />
                    ))}
                </div>

                <h1 className="fw-bold mb-2" style={{
                    fontSize: '1.5rem',
                    background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    <WifiOff size={24} className="me-2" style={{ WebkitTextFillColor: 'initial', color: 'rgba(255,255,255,0.6)' }} />
                    Sin conexión
                </h1>
                <p className="mb-4" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    No se pudo cargar esta página sin internet. Pero estas funciones están disponibles:
                </p>

                <div className="d-flex flex-column gap-2 mb-4">
                    <Link href="/dashboard/bible"
                        className="offline-link btn d-flex align-items-center gap-2 rounded-pill py-2"
                        style={{ background: 'rgba(13,202,240,0.15)', color: '#6edff6', border: '1px solid rgba(13,202,240,0.3)' }}>
                        <BookOpen size={18} /> Leer la Biblia
                    </Link>
                    <Link href="/dashboard/games/speed-quiz"
                        className="offline-link btn d-flex align-items-center gap-2 rounded-pill py-2"
                        style={{ background: 'rgba(25,135,84,0.15)', color: '#75b798', border: '1px solid rgba(25,135,84,0.3)' }}>
                        <Gamepad2 size={18} /> Pregunta Relámpago
                    </Link>
                    <Link href="/dashboard/games"
                        className="offline-link btn d-flex align-items-center gap-2 rounded-pill py-2"
                        style={{ background: 'rgba(25,135,84,0.15)', color: '#75b798', border: '1px solid rgba(25,135,84,0.3)' }}>
                        <Gamepad2 size={18} /> Juegos Bíblicos
                    </Link>
                    <Link href="/dashboard/sos"
                        className="offline-link btn d-flex align-items-center gap-2 rounded-pill py-2"
                        style={{ background: 'rgba(255,193,7,0.15)', color: '#ffda6a', border: '1px solid rgba(255,193,7,0.3)' }}>
                        <Heart size={18} /> SOS / Emergencia
                    </Link>
                    <Link href="/dashboard"
                        className="offline-link btn d-flex align-items-center gap-2 rounded-pill py-2"
                        style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
                        <Home size={18} /> Ir al Inicio
                    </Link>
                </div>

                <button
                    onClick={() => { setReloading(true); setTimeout(() => window.location.reload(), 600); }}
                    disabled={reloading}
                    className="btn rounded-pill py-2 px-4 fw-bold w-100"
                    style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                        color: '#fff', border: 'none',
                        boxShadow: '0 4px 20px rgba(109,40,217,0.4)',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {reloading ? (
                        <span className="d-inline-flex align-items-center gap-2">
                            <span style={{ animation: 'spin 0.6s linear infinite', display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}></span>
                            Reconectando...
                        </span>
                    ) : (
                        <span className="d-inline-flex align-items-center gap-2"><RefreshCw size={18} /> Reintentar</span>
                    )}
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
                    className="btn btn-link mt-3 p-0"
                    style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textDecoration: 'none' }}
                >
                    <AlertTriangle size={12} className="me-1" /> ¿Sigues con problemas? Limpiar todo
                </button>

                <div className="mt-4" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                    Conecta+ — No estás solo. Dios sigue contigo.
                </div>
            </div>
        </div>
    );
}

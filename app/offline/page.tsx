"use client";

"use client";

import { WifiOff, BookOpen, Gamepad2, Heart, Home, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/app/LanguageContext';

export default function OfflinePage() {
    const { t } = useLanguage();
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
            background: 'var(--bg-color, #F7F8FA)',
            color: 'var(--text-color, #0B1B32)',
            overflow: 'hidden',
        }}>
            {stars.map((star, i) => (
                <div key={i} className="position-absolute" style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.s,
                    height: star.s,
                    background: 'var(--brand-accent, #fbbf24)',
                    opacity: 0.45,
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
                    width: 80px; height: 80px; background: var(--accent-soft, #fff7d6);
                    border-radius: 50%; margin: 0 auto; position: relative;
                    box-shadow: var(--shadow-md, 0 4px 16px rgba(11, 27, 50, 0.08));
                }
                .llami-ear {
                    width: 18px; height: 28px; background: var(--brand-accent, #fbbf24);
                    border-radius: 50% 50% 30% 30%; position: absolute; top: -10px;
                }
                .llami-ear.left { left: 12px; transform: rotate(-15deg); }
                .llami-ear.right { right: 12px; transform: rotate(15deg); }
                .llami-eye {
                    width: 14px; height: 16px; background: var(--brand-primary, #0B1B32);
                    border-radius: 50%; position: absolute; top: 32px;
                }
                .llami-eye.left { left: 18px; }
                .llami-eye.right { right: 18px; }
                .llami-eye::after {
                    content: ''; width: 5px; height: 5px; background: #fff;
                    border-radius: 50%; position: absolute; top: 3px; left: 3px;
                }
                .llami-nose {
                    width: 10px; height: 8px; background: var(--brand-accent-strong, #8a5a00);
                    border-radius: 50%; position: absolute; top: 44px; left: 50%; margin-left: -5px;
                }
                .llami-mouth {
                    width: 20px; height: 10px; border-bottom: 3px solid var(--brand-primary, #0B1B32);
                    border-radius: 0 0 20px 20px; position: absolute; top: 52px; left: 50%; margin-left: -10px;
                }
                .llami-scarf {
                    width: 60px; height: 12px;
                    background: var(--brand-accent, #fbbf24);
                    border-radius: 4px; margin: -6px auto 0; position: relative; z-index: 2;
                }
                .glass-card {
                    background: var(--card-bg, #ffffff);
                    border: 1px solid var(--border-color, #e1e8f0);
                    box-shadow: var(--card-shadow, 0 4px 16px rgba(11, 27, 50, 0.06));
                }
                .offline-link {
                    transition: transform 0.2s ease, opacity 0.2s ease;
                }
                .offline-link:hover {
                    transform: translateX(4px);
                }
            `}</style>

            <div className="ui-surface glass-card rounded-4 p-4 p-sm-5 text-center animate-fade-in" style={{
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
                            background: 'var(--brand-accent, #fbbf24)',
                            opacity: 0.65,
                            borderRadius: 3,
                            animation: `pulse 1.5s ease-in-out ${(i - 1) * 0.2}s infinite`,
                        }} />
                    ))}
                </div>

                <h1 className="fw-bold mb-2" style={{
                    fontSize: '1.5rem',
                    color: 'var(--text-color, #0B1B32)',
                }}>
                    <WifiOff size={24} className="me-2" style={{ color: 'var(--brand-primary, #0B1B32)' }} />
                    {t.offline.title}
                </h1>
                <p className="mb-4" style={{ color: 'var(--text-muted, #5f6f82)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    {t.offline.description}
                </p>

                <div className="d-flex flex-column gap-2 mb-4">
                    <Link href="/dashboard/bible"
                        className="offline-link btn d-flex align-items-center gap-2 rounded-pill py-2"
                        style={{ background: 'var(--surface-soft, #F3F6FA)', color: 'var(--text-color, #0B1B32)', border: '1px solid var(--border-color, #e1e8f0)' }}>
                        <BookOpen size={18} /> {t.offline.bible}
                    </Link>
                    <Link href="/dashboard/games/speed-quiz"
                        className="offline-link btn d-flex align-items-center gap-2 rounded-pill py-2"
                        style={{ background: 'var(--surface-soft, #F3F6FA)', color: 'var(--text-color, #0B1B32)', border: '1px solid var(--border-color, #e1e8f0)' }}>
                        <Gamepad2 size={18} /> {t.offline.quick_quiz}
                    </Link>
                    <Link href="/dashboard/games"
                        className="offline-link btn d-flex align-items-center gap-2 rounded-pill py-2"
                        style={{ background: 'var(--surface-soft, #F3F6FA)', color: 'var(--text-color, #0B1B32)', border: '1px solid var(--border-color, #e1e8f0)' }}>
                        <Gamepad2 size={18} /> {t.offline.games}
                    </Link>
                    <Link href="/dashboard/sos"
                        className="offline-link btn d-flex align-items-center gap-2 rounded-pill py-2"
                        style={{ background: 'var(--accent-soft, #fff7d6)', color: 'var(--brand-primary, #0B1B32)', border: '1px solid var(--brand-accent, #fbbf24)' }}>
                        <Heart size={18} /> {t.offline.sos}
                    </Link>
                    <Link href="/dashboard"
                        className="offline-link btn d-flex align-items-center gap-2 rounded-pill py-2"
                        style={{ background: 'var(--surface-soft, #F3F6FA)', color: 'var(--text-color, #0B1B32)', border: '1px solid var(--border-color, #e1e8f0)' }}>
                        <Home size={18} /> {t.offline.home}
                    </Link>
                </div>

                <button
                    onClick={() => { setReloading(true); setTimeout(() => window.location.reload(), 600); }}
                    disabled={reloading}
                    className="btn rounded-pill py-2 px-4 fw-bold w-100"
                    style={{
                        background: 'var(--brand-primary, #0B1B32)',
                        color: '#fff', border: 'none',
                        boxShadow: 'var(--shadow-md, 0 6px 18px rgba(11, 27, 50, 0.08))',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {reloading ? (
                        <span className="d-inline-flex align-items-center gap-2">
                            <span style={{ animation: 'spin 0.6s linear infinite', display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}></span>
                            {t.offline.reconnecting}
                        </span>
                    ) : (
                        <span className="d-inline-flex align-items-center gap-2"><RefreshCw size={18} /> {t.offline.retry}</span>
                    )}
                </button>

                <button
                    onClick={() => {
                        if (confirm(t.offline.clear_confirm)) {
                            localStorage.clear();
                            sessionStorage.clear();
                            document.cookie.split(";").forEach((c) => {
                                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                            });
                            window.location.href = "/auth/login";
                        }
                    }}
                    className="btn btn-link mt-3 p-0"
                    style={{ color: 'var(--text-muted, #5f6f82)', fontSize: '0.8rem', textDecoration: 'none' }}
                >
                    <AlertTriangle size={12} className="me-1" /> {t.offline.problem}
                </button>

                <div className="mt-4" style={{ color: 'var(--text-muted, #5f6f82)', fontSize: '0.75rem' }}>
                    {t.offline.footer}
                </div>
            </div>
        </div>
    );
}

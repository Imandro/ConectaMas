"use client";

import { useEffect, useRef, useState } from "react";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Note: In a real app we'd use icons from lucide-react. 
// For now I'm using text/emoji placeholders or basic SVGs if needed to be standalone without running npm install.
// Assuming lucide-react IS in package.json, we can try to use it, but if it fails to compile without install, we'll fall back.
// Since user hasn't installed node_modules, imports might partial fail in IDE but let's write code assuming they will install.
import { Home, BookOpen, Book, MessageCircle, Gamepad2, HeartHandshake, Download, Heart, Crown, LogIn, MoreHorizontal, X } from 'lucide-react';
import { signOut, useSession } from "next-auth/react";
import { useLanguage } from '@/app/LanguageContext';
import { useGuest } from '@/app/components/GuestProvider';
import { isMobilePrimaryNav } from '@/app/lib/designNavigation';
import { isPollingAllowed } from '@/app/lib/networkPolicy';
import { DashboardModeToggle, GlassIntensitySwitcher } from './DesignModeSwitcher';

const QA_COUNT_TTL = 60 * 1000;

type InstallPromptWindow = Window & {
    __pwaInstallPrompt?: {
        prompt: () => void;
        userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    };
};

export default function DashboardNav() {
    const { t } = useLanguage();
    const { isGuest } = useGuest();
    const { data: session, status: sessionStatus } = useSession();
    const pathname = usePathname();
    const [notificationCount, setNotificationCount] = useState(0);
    const [moreOpen, setMoreOpen] = useState(false);
    const moreButtonRef = useRef<HTMLButtonElement>(null);
    const moreMenuRef = useRef<HTMLDivElement>(null);
    const moreCloseRef = useRef<HTMLButtonElement>(null);
    const qaRequestRef = useRef<Promise<void> | null>(null);

    const navItems = [
        { name: t.nav.home, shortName: t.nav.home, href: '/dashboard', icon: Home },
        { name: t.nav.devotionals, shortName: 'Devoc.', href: '/dashboard/devotionals', icon: BookOpen },
        { name: t.nav.bible, shortName: t.nav.bible, href: '/dashboard/bible', icon: Book },
        { name: "Pregunta", shortName: 'Preg.', href: '/dashboard/qa', icon: MessageCircle, showBadge: true },
        { name: "Oración", shortName: 'Orac.', href: '/dashboard/prayer', icon: HeartHandshake },
        { name: t.nav.games, shortName: t.nav.games, href: '/dashboard/games', icon: Gamepad2 },
        { name: "Apoyar", shortName: 'Apoyar', href: '/dashboard/support', icon: Heart },
        { name: "Premium", shortName: 'Premium', href: '/dashboard/premium', icon: Crown },
    ];

    const mobileNavItems = navItems.filter((item) => isMobilePrimaryNav(item.href));
    const secondaryNavItems = navItems.filter((item) => !isMobilePrimaryNav(item.href));
    const moreIsActive = moreOpen || secondaryNavItems.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

    useEffect(() => {
        setMoreOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!moreOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMoreOpen(false);
                moreButtonRef.current?.focus();
                return;
            }
            if (event.key === 'Tab') {
                const focusable = moreMenuRef.current?.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
                if (!focusable?.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };
        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (!moreMenuRef.current?.contains(target) && !moreButtonRef.current?.contains(target)) {
                setMoreOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('pointerdown', handlePointerDown);
        const frame = window.requestAnimationFrame(() => moreCloseRef.current?.focus());

        return () => {
            window.cancelAnimationFrame(frame);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [moreOpen]);

    const closeMoreMenu = () => {
        setMoreOpen(false);
        window.requestAnimationFrame(() => moreButtonRef.current?.focus());
    };

    useEffect(() => {
        if (isGuest || sessionStatus === 'loading') return;

        const sessionUser = session?.user as { id?: string; email?: string } | undefined;
        const userKey = sessionUser?.id || sessionUser?.email;
        if (!userKey) return;

        const storageKey = `conecta:qa-count:${userKey}`;
        let lastFetchedAt = 0;
        try {
            lastFetchedAt = Number(sessionStorage.getItem(storageKey)) || 0;
        } catch {
            // Session storage may be unavailable in private browsing.
        }

        const fetchCount = async () => {
            if (!isPollingAllowed(navigator.onLine, document.hidden)) return;
            if (Date.now() - lastFetchedAt < QA_COUNT_TTL) return;
            if (qaRequestRef.current) return qaRequestRef.current;

            qaRequestRef.current = (async () => {
                try {
                    const res = await fetch("/api/notifications/qa-count");
                    if (res.ok) {
                        const data = await res.json();
                        setNotificationCount(data.count);
                        lastFetchedAt = Date.now();
                        try {
                            sessionStorage.setItem(storageKey, String(lastFetchedAt));
                        } catch {
                            // Session storage may be unavailable in private browsing.
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            })().finally(() => {
                qaRequestRef.current = null;
            });

            return qaRequestRef.current;
        };

        fetchCount();
        const interval = window.setInterval(fetchCount, QA_COUNT_TTL);
        window.addEventListener('online', fetchCount);
        document.addEventListener('visibilitychange', fetchCount);
        return () => {
            window.clearInterval(interval);
            window.removeEventListener('online', fetchCount);
            document.removeEventListener('visibilitychange', fetchCount);
        };
    }, [isGuest, session, sessionStatus]);

    return (
        <>
            {/* Mobile + Tablet Bottom Nav */}
            {moreOpen && (
                <div
                    ref={moreMenuRef}
                    id="mobile-more-menu"
                    className="mobile-more-menu glass-surface position-fixed shadow-lg"
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="mobile-more-title"
                >
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <strong id="mobile-more-title">Más en Conecta+</strong>
                        <button ref={moreCloseRef} type="button" className="btn btn-sm btn-light rounded-circle p-2 mobile-menu-close" onClick={closeMoreMenu} aria-label="Cerrar más opciones">
                            <X size={18} aria-hidden="true" />
                        </button>
                    </div>
                    <div className="row g-2">
                        {secondaryNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <div className="col-6" key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={closeMoreMenu}
                                        className={`mobile-more-link mobile-more-action d-flex align-items-center gap-2 rounded-3 p-2 text-decoration-none ${isActive ? 'is-active' : ''}`}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        <Icon size={18} aria-hidden="true" />
                                        <span className="small fw-semibold">{item.name}</span>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-3 pt-3 border-top">
                        <GlassIntensitySwitcher />
                    </div>
                    <div className="mt-3 pt-3 border-top">
                        <DashboardModeToggle />
                    </div>
                </div>
            )}
            <nav
                className="navbar mobile-bottom-dock fixed-bottom navbar-light d-lg-none shadow-lg"
                aria-label="Navegación principal"
            >
                <div className="container-fluid d-flex px-0 justify-content-between align-items-center h-100">
                    {mobileNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link mobile-nav-item mobile-nav-link d-flex flex-column align-items-center justify-content-center small text-center ${isActive ? 'text-primary is-active' : 'text-muted'}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <div className={`mobile-nav-icon position-relative ${isActive ? 'is-active' : ''}`}>
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                                    {item.showBadge && notificationCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem', padding: '0.25em 0.4em' }}>
                                            {notificationCount > 9 ? '9+' : notificationCount}
                                        </span>
                                    )}
                                </div>
                                <span className="mobile-nav-label text-truncate">
                                    <span className="mobile-nav-label-full">{item.name}</span>
                                    <span className="mobile-nav-label-short">{item.shortName}</span>
                                </span>
                            </Link>
                        );
                    })}
                    <button
                        ref={moreButtonRef}
                        type="button"
                        className={`nav-link mobile-nav-item mobile-nav-more d-flex flex-column align-items-center justify-content-center small text-center border-0 bg-transparent ${moreIsActive ? 'text-primary is-active' : 'text-muted'}`}
                        aria-expanded={moreOpen}
                        aria-controls="mobile-more-menu"
                        aria-label="Más opciones"
                        onClick={() => setMoreOpen((open) => !open)}
                    >
                        <div className={`mobile-nav-icon position-relative ${moreIsActive ? 'is-active' : ''}`}>
                            {moreOpen ? <X size={24} aria-hidden="true" /> : <MoreHorizontal size={24} aria-hidden="true" />}
                        </div>
                        <span className="mobile-nav-label text-truncate">
                            Más
                        </span>
                    </button>
                </div>
            </nav>

            {/* Desktop Sidebar (Hidden on Mobile/Tablet) */}
            <div className="d-none d-lg-flex flex-column bg-primary border-end h-100 p-3 position-fixed top-0 start-0 text-white" style={{ width: '240px', zIndex: 2 }}>
                <div className="mb-5 px-2 mt-2">
                    <h4 className="fw-bold text-white mb-0">Conecta<span className="text-secondary">+</span></h4>
                    <small className="text-white-50 small">{t.nav.safe_space}</small>
                </div>

                <nav className="nav flex-column gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link d-flex align-items-center gap-3 rounded-pill px-3 py-2 transition-all ${isActive
                                    ? 'bg-secondary text-primary shadow-sm fw-bold'
                                    : 'text-white-50 hover-text-white hover-bg-white-10'}`}
                                aria-current={isActive ? 'page' : undefined}
                                style={{ transition: 'background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease' }}
                            >
                                <div className="position-relative d-flex align-items-center">
                                    <Icon size={20} />
                                    {item.showBadge && notificationCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.55rem', marginLeft: '-5px' }}>
                                            {notificationCount > 9 ? '9+' : notificationCount}
                                        </span>
                                    )}
                                </div>
                                <span className="fw-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto px-2 d-flex flex-column gap-2">
                    <DashboardModeToggle />
                    <button
                        onClick={async () => {
                            const event = new Event('beforeinstallprompt');
                            window.dispatchEvent(event);
                            const installWindow = window as InstallPromptWindow;
                            if (installWindow.__pwaInstallPrompt) {
                                installWindow.__pwaInstallPrompt.prompt();
                                const r = await installWindow.__pwaInstallPrompt.userChoice;
                                if (r.outcome === 'accepted') {
                                    installWindow.__pwaInstallPrompt = undefined;
                                }
                            } else {
                                alert('Abre Chrome en tu celular, toca el menú ⋮ y selecciona "Instalar aplicación"');
                            }
                        }}
                        className="btn btn-outline-light w-100 rounded-pill btn-sm fw-bold shadow-sm mb-1"
                        style={{ fontSize: '0.75rem' }}
                    >
                        <Download size={14} className="me-1" /> Descargar App
                    </button>
                    {isGuest ? (
                        <Link
                            href="/auth/login"
                            className="btn btn-success w-100 rounded-pill btn-sm fw-bold text-white shadow-sm d-flex align-items-center justify-content-center gap-1"
                            style={{ fontSize: '0.75rem' }}
                        >
                            <LogIn size={14} /> Iniciar sesión
                        </Link>
                    ) : (
                        <button
                            onClick={async () => {
                                await signOut({ redirect: false });
                                window.location.href = "/auth/login";
                            }}
                            className="btn btn-danger w-100 rounded-pill btn-sm fw-bold text-white shadow-sm"
                        >
                            {t.nav.logout}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

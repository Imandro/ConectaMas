"use client";

import { useEffect, useState } from "react";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Note: In a real app we'd use icons from lucide-react. 
// For now I'm using text/emoji placeholders or basic SVGs if needed to be standalone without running npm install.
// Assuming lucide-react IS in package.json, we can try to use it, but if it fails to compile without install, we'll fall back.
// Since user hasn't installed node_modules, imports might partial fail in IDE but let's write code assuming they will install.
import { Home, BookOpen, HeartPulse, User, Menu, Book, MessageCircle, Zap, Trophy, Gamepad2, HeartHandshake, Globe, Download, Heart } from 'lucide-react';
import { signOut } from "next-auth/react";
import { useLanguage } from '@/app/LanguageContext';

export default function DashboardNav() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [notificationCount, setNotificationCount] = useState(0);

    const navItems = [
        { name: t.nav.home, href: '/dashboard', icon: Home },
        { name: t.nav.devotionals, href: '/dashboard/devotionals', icon: BookOpen },
        { name: t.nav.bible, href: '/dashboard/bible', icon: Book },
        { name: "Pregunta", href: '/dashboard/qa', icon: MessageCircle, showBadge: true },
        { name: "Oración", href: '/dashboard/prayer', icon: HeartHandshake },
        { name: t.nav.games, href: '/dashboard/games', icon: Gamepad2 },
        { name: "Apoyar", href: '/dashboard/support', icon: Heart },
    ];

    useEffect(() => {
        // Fetch Q&A notification count
        const fetchCount = async () => {
            try {
                const res = await fetch("/api/notifications/qa-count");
                if (res.ok) {
                    const data = await res.json();
                    setNotificationCount(data.count);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Mobile + Tablet Bottom Nav */}
            <nav
                className="navbar fixed-bottom navbar-light bg-white border-top d-lg-none safe-area-bottom shadow-lg p-0"
                style={{ borderRadius: '20px 20px 0 0', borderTopColor: 'var(--border-color)', height: '70px' }}
            >
                <div className="container-fluid d-flex px-0 justify-content-between align-items-center h-100">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link d-flex flex-column align-items-center justify-content-center small flex-grow-1 text-center h-100 ${isActive ? 'text-primary' : 'text-muted'}`}
                                style={{ transition: 'all 0.2s ease' }}
                            >
                                <div className="position-relative">
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    {item.showBadge && notificationCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem', padding: '0.25em 0.4em' }}>
                                            {notificationCount > 9 ? '9+' : notificationCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-truncate mt-1" style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400, maxWidth: '100%' }}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Desktop Sidebar (Hidden on Mobile/Tablet) */}
            <div className="d-none d-lg-flex flex-column bg-primary border-end h-100 p-3 position-fixed top-0 start-0 text-white" style={{ width: '240px' }}>
                <div className="mb-5 px-2 mt-2">
                    <h4 className="fw-bold text-white mb-0">Conecta<span className="text-secondary">+</span></h4>
                    <small className="text-white-50 small">{t.nav.safe_space}</small>
                </div>

                <nav className="nav flex-column gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link d-flex align-items-center gap-3 rounded-pill px-3 py-2 transition-all ${isActive ? 'bg-secondary text-primary shadow-sm fw-bold' : 'text-white-50 hover-text-white hover-bg-white-10'}`}
                            >
                                <div className="position-relative d-flex align-items-center">
                                    <Icon size={20} />
                                    {item.name === t.nav.community && notificationCount > 0 && (
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
                    <button
                        onClick={async () => {
                            const event = new Event('beforeinstallprompt');
                            window.dispatchEvent(event);
                            if ((window as any).__pwaInstallPrompt) {
                                (window as any).__pwaInstallPrompt.prompt();
                                const r = await (window as any).__pwaInstallPrompt.userChoice;
                                if (r.outcome === 'accepted') {
                                    (window as any).__pwaInstallPrompt = null;
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
                    <button
                        onClick={async () => {
                            await signOut({ redirect: false });
                            window.location.href = "/auth/login";
                        }}
                        className="btn btn-danger w-100 rounded-pill btn-sm fw-bold text-white shadow-sm"
                    >
                        {t.nav.logout}
                    </button>
                </div>
            </div>
        </>
    );
}

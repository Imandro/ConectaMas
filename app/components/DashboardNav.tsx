"use client";

import { useEffect, useState } from "react";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Note: In a real app we'd use icons from lucide-react. 
// For now I'm using text/emoji placeholders or basic SVGs if needed to be standalone without running npm install.
// Assuming lucide-react IS in package.json, we can try to use it, but if it fails to compile without install, we'll fall back.
// Since user hasn't installed node_modules, imports might partial fail in IDE but let's write code assuming they will install.
import { Home, BookOpen, HeartPulse, User, Menu, Book, MessageCircle } from 'lucide-react';
import { signOut } from "next-auth/react";

const navItems = [
    { name: 'Inicio', href: '/dashboard', icon: Home },
    { name: 'Devocionales', href: '/dashboard/devotionals', icon: BookOpen },
    { name: 'Biblia', href: '/dashboard/bible', icon: Book },
    { name: 'Comunidad', href: '/dashboard/forums', icon: MessageCircle },
    { name: 'Salud Espiritual', href: '/dashboard/checkin', icon: HeartPulse },
    { name: 'Perfil', href: '/dashboard/profile', icon: User },
];

export default function DashboardNav() {
    const pathname = usePathname();
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        // Fetch notification count
        const fetchCount = async () => {
            try {
                const res = await fetch("/api/notifications/count");
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
            {/* Mobile Bottom Nav */}
            <nav
                className="navbar fixed-bottom navbar-light bg-white border-top d-md-none safe-area-bottom shadow-lg"
                style={{ borderRadius: '20px 20px 0 0', borderTopColor: 'var(--border-color) !important' }}
            >
                <div className="container-fluid d-flex justify-content-around">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link d-flex flex-column align-items-center small ${isActive ? 'text-primary' : 'text-muted'}`}
                            >
                                <div className="position-relative">
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    {item.name === 'Comunidad' && notificationCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem', padding: '0.25em 0.4em' }}>
                                            {notificationCount > 9 ? '9+' : notificationCount}
                                        </span>
                                    )}
                                </div>
                                <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: isActive ? 600 : 400 }}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Desktop Sidebar (Hidden on Mobile) */}
            <div className="d-none d-md-flex flex-column bg-primary border-end h-100 p-3 position-fixed top-0 start-0 text-white" style={{ width: '240px' }}>
                <div className="mb-5 px-2 mt-2">
                    <h4 className="fw-bold text-white mb-0">Conecta<span className="text-secondary">+</span></h4>
                    <small className="text-white-50 small">Tu espacio seguro</small>
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
                                    {item.name === 'Comunidad' && notificationCount > 0 && (
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

                <div className="mt-auto px-2 d-flex flex-column gap-3">
                    <button
                        onClick={async () => {
                            await signOut({ redirect: false });
                            window.location.href = "/auth/login";
                        }}
                        className="btn btn-danger w-100 rounded-pill btn-sm fw-bold text-white shadow-sm"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
}

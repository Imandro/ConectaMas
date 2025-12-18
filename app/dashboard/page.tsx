"use client";

import Link from 'next/link';
import { Sun, AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import StruggleTracker from './components/StruggleTracker';
import DailyVerse from './components/DailyVerse';

interface DashboardStats {
    name: string;
    streak: number;
    lastCheckin: any;
    struggles: any[];
}

export default function DashboardHome() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkinLoading, setCheckinLoading] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/dashboard/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
                if (data.lastCheckin) {
                    const lastDate = new Date(data.lastCheckin.createdAt).toDateString();
                    const today = new Date().toDateString();
                    if (lastDate === today) setHasCheckedIn(true);
                }
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckin = async (mood: string) => {
        if (checkinLoading || hasCheckedIn) return;
        setCheckinLoading(true);

        try {
            const res = await fetch('/api/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood }),
            });

            if (res.ok) {
                setHasCheckedIn(true);
                fetchStats(); // Refresh streak
            }
        } catch (error) {
            console.error('Checkin failed:', error);
        } finally {
            setCheckinLoading(false);
        }
    };

    const currentDate = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">

            {/* Header */}
            <header className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <small className="text-muted fw-bold text-capitalize">{currentDate}</small>
                    <h2 className="fw-bold text-secondary m-0">Hola, {stats?.name || 'Campeón'}</h2>
                </div>
                <div className="bg-white rounded-circle shadow-sm p-1">
                    <Link href="/dashboard/profile">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold text-decoration-none" style={{ width: '40px', height: '40px' }}>
                            {stats?.name ? stats.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </Link>
                </div>
            </header>

            {/* Versículo del día */}
            <section className="mb-4">
                <DailyVerse />
            </section>

            {/* Estado y SOS */}
            <section className="row g-3 mb-4">
                <div className="col-8">
                    <div className="card border-0 shadow-sm h-100 bg-white">
                        <div className="card-body p-3 d-flex align-items-center gap-3">
                            <div className="bg-success-subtle text-success p-2 rounded-circle">
                                <Sun size={24} />
                            </div>
                            <div>
                                <small className="text-muted d-block lh-1">Días en victoria</small>
                                <span className="fw-bold fs-4">{stats?.streak || 0} Días</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <Link href="/dashboard/sos" className="card border-0 shadow-sm h-100 bg-danger text-white text-decoration-none hover-scale">
                        <div className="card-body p-2 d-flex flex-column align-items-center justify-content-center text-center">
                            <AlertTriangle size={36} className="mb-1 text-white" />
                            <span className="fw-bold lh-1 mt-1">SOS</span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Struggle Tracker (NEW) */}
            <section className="mb-4">
                <StruggleTracker initialStruggles={stats?.struggles || []} />
            </section>

            {/* Check-in Diario */}
            <section>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold text-secondary mb-0">Tu corazón hoy</h5>
                </div>
                <div className="card border-0 shadow-sm bg-white">
                    <div className="card-body p-4 text-center">
                        <p className="text-muted mb-3">
                            {hasCheckedIn ? '¡Gracias por compartir! Dios está contigo.' : '¿Cómo te sientes en este momento?'}
                        </p>

                        {!hasCheckedIn ? (
                            <div className="d-flex justify-content-between px-2">
                                {['😔', '😐', '🙂', '😄', '🙌'].map((emoji, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleCheckin(emoji)}
                                        disabled={checkinLoading}
                                        className="btn btn-light rounded-circle fs-2 p-2 shadow-sm border-0 hover-scale transition-all"
                                        style={{ width: '50px', height: '50px' }}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-success fw-bold animate-fade-in">
                                ¡Ánimo! Has dado un paso más.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

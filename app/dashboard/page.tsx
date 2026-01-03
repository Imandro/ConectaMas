"use client";

import Link from 'next/link';
import { Sun, AlertTriangle, Loader2, HelpCircle, ChevronRight, ShieldAlert, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import DailyVerse from './components/DailyVerse';
import DailyPrayerCard from '../components/DailyPrayerCard';
import LlamiMascot from '../components/LlamiMascot';
import FeatureTour from './components/FeatureTour';
import AgePrompt from './components/AgePrompt';
import ChallengeCard from './components/ChallengeCard';

import SupportFundingAd from './components/SupportFundingAd';
import SupportAdModal from './components/SupportAdModal';
import GrowthMilestoneModal from './components/GrowthMilestoneModal';
import WhatsappModal from '../components/WhatsappModal';
import WhatsappCard from '../components/WhatsappCard';
import InstagramModal from '../components/InstagramModal';
import InstagramCard from '../components/InstagramCard';
import CheckinModal from '../components/CheckinModal';
import CountryModal from '../components/CountryModal';

interface DashboardStats {
    name: string;
    streak: number;
    lastCheckin: any;
    struggles: any[];
    mascot: any;

    hasSeenTutorialTour: boolean;
    hasJoinedWhatsapp: boolean;
    hasFollowedInstagram: boolean;
    country?: string;
    age?: number;
}

export default function DashboardHome() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkinLoading, setCheckinLoading] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }));
        fetchStats();
    }, []);

    const fetchStats = async () => {
        // Cargar desde caché primero para rapidez u offline
        const cached = localStorage.getItem('dashboard_stats');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                setStats(parsed);
                if (parsed.lastCheckin) {
                    const lastDate = new Date(parsed.lastCheckin.createdAt).toDateString();
                    const today = new Date().toDateString();
                    if (lastDate === today) setHasCheckedIn(true);
                }
            } catch (e) {
                console.error("Error parsing cached stats", e);
            }
        }

        try {
            const res = await fetch('/api/dashboard/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
                localStorage.setItem('dashboard_stats', JSON.stringify(data));
                if (data.lastCheckin) {
                    const lastDate = new Date(data.lastCheckin.createdAt).toDateString();
                    const today = new Date().toDateString();
                    if (lastDate === today) setHasCheckedIn(true);
                }
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Si hay error (probablemente offline), mantenemos lo que hay en stats (que vino del caché)
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
                // Force clear local cache to ensure fresh data on next fetch
                localStorage.removeItem('dashboard_stats');
                localStorage.removeItem('dashboard_stats_time');
                await fetchStats(); // Refresh streak and everything
            } else {
                const errorData = await res.json();
                if (res.status === 429) {
                    setHasCheckedIn(true); // Treat as already checked in if server says so
                }
                console.error('Checkin rejected:', errorData.message);
            }
        } catch (error) {
            console.error('Checkin failed:', error);
        } finally {
            setCheckinLoading(false);
        }
    };


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
                    <h3 className="text-secondary fw-bold text-capitalize mb-1" style={{ fontSize: '1.1rem' }}>{currentDate}</h3>
                    <h1 className="fw-extrabold text-warning m-0" style={{ fontSize: '2.5rem' }}>Hola, {stats?.name || 'Mario'}</h1>
                </div>
                <div className="bg-white rounded-pill shadow-sm p-1 d-flex align-items-center gap-1 border">
                    <Link href="/dashboard/tutorials" className="btn btn-light bg-transparent border-0 rounded-circle p-1 text-dark hover-scale" title="Tutoriales">
                        <HelpCircle size={32} />
                    </Link>
                    <Link href="/dashboard/friends" className="btn btn-light bg-transparent border-0 rounded-circle p-1 text-dark hover-scale" title="Amigos">
                        <Users size={32} />
                    </Link>
                    <Link href="/dashboard/profile">
                        <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold text-decoration-none shadow-sm" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                            {stats?.name ? stats.name.charAt(0).toUpperCase() : 'M'}
                        </div>
                    </Link>
                </div>
            </header>



            {/* Versículo del día */}
            <section className="mb-4" id="tour-verse">
                <DailyVerse />
            </section>

            {/* Nuevo: Reto Diario Estilo Duolingo */}
            <section className="mb-4">
                <ChallengeCard />
            </section>

            {/* Estado y SOS con Llami */}
            <section className="row g-3 mb-4">
                <div className="col-12 col-md-7">
                    <div className="card border-0 shadow-sm h-100 bg-white overflow-visible" style={{ borderRadius: '32px' }}>
                        <div className="card-body p-4">
                            <div className="row align-items-between h-100">
                                <div className="col-7 d-flex flex-column justify-content-center">
                                    <p className="text-muted fw-bold mb-3" style={{ fontSize: '1.2rem', color: '#94A3B8' }}>Días en victoria</p>

                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-success-subtle text-success p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                            <Sun size={28} />
                                        </div>
                                        <span className="fw-black text-dark" style={{ fontSize: '3.5rem', lineHeight: '1' }}>{stats?.streak || 10}</span>
                                    </div>

                                    <h2 className="fw-black text-dark mt-1" style={{ fontSize: '2.5rem', marginLeft: '60px' }}>Días</h2>
                                </div>
                                <div className="col-5 text-center position-relative d-flex flex-column align-items-center justify-content-center">
                                    {/* Llami Mascot Link with Speech Bubble */}
                                    <Link href="/dashboard/llami" className="text-decoration-none group mb-2">
                                        <div className="position-relative d-inline-block">
                                            <div className="hover-scale transition-all">
                                                <div className="bg-warning-subtle rounded-circle p-3" style={{ width: '140px', height: '140px' }}>
                                                    <LlamiMascot
                                                        streak={stats?.streak || 10}
                                                        lastMood={stats?.lastCheckin?.mood}
                                                        level={stats?.mascot?.level || 2}
                                                        name={stats?.mascot?.name}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="mt-1">
                                        <span className="badge bg-secondary-subtle text-dark rounded-pill px-3 py-1 fw-bold">Nivel {stats?.mascot?.level || 2}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-5">
                    <Link href="/dashboard/sos" className="card border-0 shadow-sm h-100 bg-danger text-white text-decoration-none hover-scale overflow-hidden" style={{ borderRadius: '32px' }}>
                        <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center">
                            <div className="bg-white bg-opacity-20 p-4 rounded-4 mb-3">
                                <AlertTriangle size={80} className="text-white" />
                            </div>
                            <h1 className="fw-black m-0" style={{ fontSize: '3.5rem' }}>SOS</h1>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Mi Seguimiento - Resumen Premium */}
            <section className="mb-4" id="tour-struggles">
                <Link href="/dashboard/luchas" className="text-decoration-none">
                    <div className="card border-0 shadow-sm bg-white overflow-hidden hover-scale transition-all" style={{ borderRadius: '24px' }}>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary-subtle text-primary p-3 rounded-4">
                                        <ShieldAlert size={28} />
                                    </div>
                                    <div>
                                        <h5 className="fw-extrabold text-secondary m-0">Mi Seguimiento</h5>
                                        <p className="text-muted small m-0">Gestiona tus planes de transformación</p>
                                    </div>
                                </div>
                                <div className="text-primary bg-light p-2 rounded-circle">
                                    <ChevronRight size={24} />
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-6">
                                    <div className="bg-light p-3 rounded-4 text-center">
                                        <span className="d-block fw-bold text-primary fs-4">
                                            {stats?.struggles?.filter((s: any) => s.status === "ACTIVE" && s.isStarted)?.length || 0}
                                        </span>
                                        <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>En Progreso</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bg-light p-3 rounded-4 text-center">
                                        <span className="d-block fw-bold text-warning fs-4">
                                            {stats?.struggles?.filter((s: any) => s.status === "ACTIVE" && !s.isStarted)?.length || 0}
                                        </span>
                                        <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Próximos</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative bar */}
                        <div className="bg-primary" style={{ height: '4px', width: '100%' }}></div>
                    </div>
                </Link>
            </section>

            {/* Social Media Cards */}
            <section className="mb-4 animate-fade-in delay-200">
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <WhatsappCard />
                    </div>
                    <div className="col-12 col-md-6">
                        <InstagramCard />
                    </div>
                </div>
            </section>

            {/* Daily Prayer */}
            <section className="mb-4" id="tour-prayer">
                <DailyPrayerCard />
            </section>

            {/* Feature Tour (Proactive Tutorial) */}
            {stats && !stats.hasSeenTutorialTour && (
                <FeatureTour onComplete={() => setStats({ ...stats, hasSeenTutorialTour: true })} />
            )}

            {/* Support Ad - Moved to bottom */}
            <section className="mb-5 pb-5 mt-5">
                <SupportFundingAd />
            </section>

            <GrowthMilestoneModal />

            <div className="pb-5"></div>

            {stats && (
                <>
                    <AgePrompt missingAge={!stats.age} />
                    <WhatsappModal hasJoined={stats.hasJoinedWhatsapp} />
                    <InstagramModal hasFollowed={stats.hasFollowedInstagram} />
                    <CheckinModal
                        hasCheckedIn={hasCheckedIn}
                        onCheckin={handleCheckin}
                        isLoading={checkinLoading}
                    />
                    <CountryModal hasSelectedCountry={!!stats.country} />
                </>
            )}
        </div>
    );
}

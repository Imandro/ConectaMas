"use client";

import Link from 'next/link';
import { Sun, AlertTriangle, Loader2, HelpCircle, ChevronRight, ShieldAlert, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import DailyVerse from './components/DailyVerse';
import DailyPrayerCard from '../components/DailyPrayerCard';
import LlamiMascot from '../components/LlamiMascot';
import FeatureTour from './components/FeatureTour';
import AgePrompt from './components/AgePrompt';

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
                    <small className="text-muted fw-bold text-capitalize">{currentDate}</small>
                    <h2 className="fw-bold text-secondary m-0">Hola, {stats?.name || 'Campeón'}</h2>
                </div>
                <div className="bg-white rounded-pill shadow-sm p-1 d-flex align-items-center gap-1 border">
                    <Link href="/dashboard/tutorials" className="btn btn-light bg-transparent border-0 rounded-circle p-2 text-primary hover-scale" title="Tutoriales">
                        <HelpCircle size={24} />
                    </Link>
                    <Link href="/dashboard/friends" className="btn btn-light bg-transparent border-0 rounded-circle p-2 text-primary hover-scale" title="Amigos">
                        <Users size={24} />
                    </Link>
                    <Link href="/dashboard/profile">
                        <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold text-decoration-none shadow-sm" style={{ width: '40px', height: '40px' }}>
                            {stats?.name ? stats.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </Link>
                </div>
            </header>

            {/* Versículo del día */}
            <section className="mb-4" id="tour-verse">
                <DailyVerse />
            </section>

            {/* Estado y SOS con Llami */}
            <section className="row g-3 mb-4">
                <div className="col-8" id="tour-streak">
                    <div className="card border-0 shadow-sm h-100 bg-white">
                        <div className="card-body p-3 d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-success-subtle text-success p-2 rounded-circle">
                                    <Sun size={24} />
                                </div>
                                <div>
                                    <small className="text-muted d-block lh-1">Días en victoria</small>
                                    <span className="fw-bold fs-4">{stats?.streak || 0} Días</span>
                                </div>
                            </div>
                            {/* Llami Mascot Link */}
                            <Link href="/dashboard/llami" className="text-decoration-none group" id="tour-llami">
                                <div className="text-center">
                                    <div className="hover-scale transition-all">
                                        <LlamiMascot
                                            streak={stats?.streak || 0}
                                            lastMood={stats?.lastCheckin?.mood}
                                            level={stats?.mascot?.level || 1}
                                            name={stats?.mascot?.name}
                                        />
                                    </div>
                                    <div className="badge bg-primary-subtle text-primary rounded-pill mt-1" style={{ fontSize: '0.65rem' }}>
                                        Nivel {stats?.mascot?.level || 1}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-4" id="tour-sos">
                    <Link href="/dashboard/sos" className="card border-0 shadow-sm h-100 bg-danger text-white text-decoration-none hover-scale">
                        <div className="card-body p-2 d-flex flex-column align-items-center justify-content-center text-center">
                            <AlertTriangle size={36} className="mb-1 text-white" />
                            <span className="fw-bold lh-1 mt-1">SOS</span>
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

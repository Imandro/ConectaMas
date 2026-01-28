"use client";

import Link from 'next/link';
import { Sun, AlertTriangle, Loader2, HelpCircle, ChevronRight, Shield, Users, BookOpen, Trophy, Gamepad2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import DailyVerse from './components/DailyVerse';
// import DailyPrayerCard from '../components/DailyPrayerCard';
import LlamiMascot from '../components/LlamiMascot';
import FeatureTour from './components/FeatureTour';
import AgePrompt from './components/AgePrompt';
import ChallengeCard from './components/ChallengeCard';

import SupportFundingAd from './components/SupportFundingAd';
import SupportAdModal from './components/SupportAdModal';
import GrowthMilestoneModal from "./components/GrowthMilestoneModal";
import DonationMissionsModal from "./components/DonationMissionsModal";
import WhatsappModal from '../components/WhatsappModal';
import WhatsappCard from '../components/WhatsappCard';
import InstagramModal from '../components/InstagramModal';
import InstagramCard from '../components/InstagramCard';
import CheckinModal from '../components/CheckinModal';
import CountryModal from '../components/CountryModal';
import DailyQuestionModal from './components/DailyQuestionModal';

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
    lastChallengeCompleted?: string;
    league?: string;
}

import { useLanguage } from '@/app/LanguageContext';

export default function DashboardHome() {
    const { t, language } = useLanguage();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkinLoading, setCheckinLoading] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [currentDate, setCurrentDate] = useState("");
    const [dailyQuestions, setDailyQuestions] = useState<any[]>([]);
    const [showDailyQuestions, setShowDailyQuestions] = useState(false);

    useEffect(() => {
        const localeMap: Record<string, string> = { es: 'es-ES', en: 'en-US', pt: 'pt-BR' };
        setCurrentDate(new Date().toLocaleDateString(localeMap[language] || 'es-ES', { day: 'numeric', month: 'long' }));
        fetchStats();
        fetchDailyQuestions();
    }, [language]);

    const fetchDailyQuestions = async () => {
        try {
            // Lazy load the action to avoid build issues if mixed
            const { getDailyQuestions } = await import('./qa/actions');
            const questions = await getDailyQuestions();
            // Show if we have questions and user hasn't dismissed today (removed local storage check for simplicity for now, or add it)
            // Let's rely on session or just show it if random chance? 
            // For now, ALWAYS show it if there are questions, unless we track it.
            // Requirement said "modal upon app entry".
            // I'll check a sessionStorage key "seenDailyQuestions"
            if (questions.length > 0 && !sessionStorage.getItem('seen_daily_questions')) {
                setDailyQuestions(questions);
                setTimeout(() => setShowDailyQuestions(true), 2000); // Small delay for effect
                sessionStorage.setItem('seen_daily_questions', 'true');
            }
        } catch (e) {
            console.error("Error fetching daily questions", e);
        }
    };

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
                    <h1 className="fw-extrabold text-warning m-0" style={{ fontSize: '2.5rem' }}>{t.dashboard.greeting}, {stats?.name || 'Mario'}</h1>
                </div>
                <div className="bg-white rounded-pill shadow-sm p-1 d-flex align-items-center gap-1 border">
                    <Link href="/dashboard/tutorials" className="btn btn-light bg-transparent border-0 rounded-circle p-1 text-dark hover-scale" title={t.nav.tutorials}>
                        <HelpCircle size={32} />
                    </Link>
                    <Link href="/dashboard/friends" className="btn btn-light bg-transparent border-0 rounded-circle p-1 text-dark hover-scale" title={t.nav.friends}>
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
                <ChallengeCard
                    isCompleted={
                        stats?.lastChallengeCompleted
                            ? new Date(stats.lastChallengeCompleted).toDateString() === new Date().toDateString()
                            : false
                    }
                />
            </section>

            {/* Estado y SOS con Llami */}
            <section className="row g-2 mb-4">
                <div className="col-7">
                    <div id="tour-checkin" className="card border-0 shadow-sm h-100 bg-white overflow-visible" style={{ borderRadius: '24px' }}>
                        <div className="card-body p-3">
                            <div className="row align-items-between h-100">
                                <div className="col-7 d-flex flex-column justify-content-center">
                                    <p className="text-muted fw-bold mb-1" style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{t.dashboard.streak_label}</p>

                                    <div className="d-flex align-items-center gap-1">
                                        <div className="bg-success-subtle text-success p-1 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                            <Sun size={20} />
                                        </div>
                                        <span className="fw-black text-dark" style={{ fontSize: '2.5rem', lineHeight: '1' }}>{stats?.streak || 10}</span>
                                    </div>

                                    <h2 className="fw-black text-dark m-0" style={{ fontSize: '1.8rem', marginLeft: '35px' }}>{t.dashboard.days}</h2>
                                </div>
                                <div className="col-5 text-center position-relative d-flex flex-column align-items-center justify-content-center pe-3">
                                    {/* Llami Mascot Link with Speech Bubble */}
                                    <Link href="/dashboard/llami" className="text-decoration-none group mb-1">
                                        <div className="position-relative d-inline-block">
                                            <div className="hover-scale transition-all">
                                                <div className="bg-warning-subtle rounded-circle p-2" style={{ width: '100px', height: '100px' }}>
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
                                        <span className="badge bg-secondary-subtle text-dark rounded-pill px-3 py-1 fw-bold">{t.dashboard.level} {stats?.mascot?.level || 2}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-5">
                    <Link href="/dashboard/sos" className="card border-0 shadow-sm h-100 bg-danger text-white text-decoration-none hover-scale overflow-hidden" style={{ borderRadius: '24px' }}>
                        <div className="card-body p-2 d-flex flex-column align-items-center justify-content-center text-center">
                            <div className="mb-2 d-flex align-items-center justify-content-center">
                                <Shield size={72} className="text-white" fill="white" fillOpacity={0.2} />
                            </div>
                            <h1 className="fw-black m-0" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>SOS</h1>
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
                                        <Shield size={28} />
                                    </div>
                                    <div>
                                        <h5 className="fw-extrabold text-secondary m-0">{t.dashboard.my_tracking}</h5>
                                        <p className="text-muted small m-0">{t.dashboard.tracking_desc}</p>
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
                                            {stats?.struggles?.filter((s: { status: string, isStarted: boolean }) => s.status === "ACTIVE" && s.isStarted)?.length || 0}
                                        </span>
                                        <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>{t.dashboard.in_progress}</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bg-light p-3 rounded-4 text-center">
                                        <span className="d-block fw-bold text-warning fs-4">
                                            {stats?.struggles?.filter((s: { status: string, isStarted: boolean }) => s.status === "ACTIVE" && !s.isStarted)?.length || 0}
                                        </span>
                                        <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>{t.dashboard.upcoming}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative bar */}
                        <div className="bg-primary" style={{ height: '4px', width: '100%' }}></div>
                    </div>
                </Link>
            </section>



            {/* Main Action Grid (New Navigation) */}
            <section className="mb-4 animate-fade-in delay-100">
                <div className="row g-3">
                    {/* Games Card */}
                    <div className="col-6">
                        <Link href="/dashboard/games" className="text-decoration-none">
                            <div id="tour-games" className="card border-0 shadow-sm h-100 bg-white hover-scale" style={{ borderRadius: '24px' }}>
                                <div className="card-body p-3 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '140px' }}>
                                    <div className="bg-primary-subtle text-primary p-3 rounded-circle mb-3">
                                        <Gamepad2 size={32} />
                                    </div>
                                    <h5 className="fw-extrabold text-dark m-0">Juegos</h5>
                                    <small className="text-muted fw-bold">Trivia & Papa Caliente</small>
                                </div>
                            </div>
                        </Link>
                    </div>
                    {/* Leagues Card */}
                    <div className="col-6">
                        <Link href="/dashboard/leagues" className="text-decoration-none">
                            <div id="tour-leagues" className="card border-0 shadow-sm h-100 bg-white hover-scale" style={{ borderRadius: '24px' }}>
                                <div className="card-body p-3 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '140px' }}>
                                    <div className="bg-warning-subtle text-warning p-3 rounded-circle mb-3">
                                        <Trophy size={32} />
                                    </div>
                                    <h5 className="fw-extrabold text-dark m-0">{t.leagues.title}</h5>
                                    <small className="text-muted fw-bold">{stats?.league || "Bronce"}</small>
                                </div>
                            </div>
                        </Link>
                    </div>
                    {/* Bible Study Card (Full Width) */}
                    <div className="col-12">
                        <Link href="/dashboard/study" className="text-decoration-none">
                            <div id="tour-study" className="card border-0 shadow-sm bg-white hover-scale overflow-hidden" style={{ borderRadius: '24px' }}>
                                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-success-subtle text-success p-3 rounded-4">
                                            <BookOpen size={28} />
                                        </div>
                                        <div>
                                            <h5 className="fw-extrabold text-dark m-0">Estudio Bíblico</h5>
                                            <p className="text-muted small m-0 fw-bold">Explora la palabra en grupo</p>
                                        </div>
                                    </div>
                                    <div className="text-success bg-light p-2 rounded-circle">
                                        <ChevronRight size={24} />
                                    </div>
                                </div>
                                <div className="progress" style={{ height: '4px' }}>
                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '35%' }} aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}></div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Spiritual Insights Value Add Section */}
            <section className="mb-4">
                <div className="card border-0 shadow-sm bg-white p-4" style={{ borderRadius: '24px' }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="bg-warning-subtle text-warning p-2 rounded-3">
                            <Sun size={24} />
                        </div>
                        <h5 className="fw-bold text-secondary m-0">Sabiduría para hoy</h5>
                    </div>
                    <div className="bg-light p-3 rounded-4 mb-3 border-start border-warning border-4">
                        <p className="small text-muted mb-0 lh-base">
                            <strong>¿Sabías que?</strong> La palabra &quot;Selah&quot; aparece 74 veces en la Biblia y es una invitación a hacer una pausa, respirar y meditar en lo que acabas de leer. Hoy, tómate un momento Selah.
                        </p>
                    </div>
                    <div className="row g-3">
                        <div className="col-12">
                            <h6 className="small fw-bold text-uppercase text-muted mb-2 ls-1" style={{ fontSize: '0.7rem' }}>Tips de Crecimiento</h6>
                            <ul className="list-unstyled d-flex flex-column gap-2 m-0">
                                <li className="small d-flex gap-2">
                                    <span className="text-warning">•</span>
                                    <span>La oración no es para cambiar a Dios, sino para que Él nos cambie a nosotros.</span>
                                </li>
                                <li className="small d-flex gap-2">
                                    <span className="text-warning">•</span>
                                    <span>Leer un capítulo al día te permite completar la Biblia en poco más de 3 años.</span>
                                </li>
                                <li className="small d-flex gap-2">
                                    <span className="text-warning">•</span>
                                    <span>Tus &quot;luchas&quot; son oportunidades para que el poder de Dios se perfeccione en tu debilidad.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
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

            {/* Feature Tour (Proactive Tutorial) */}
            {stats && (!stats.hasSeenTutorialTour || localStorage.getItem('tour_version') !== '2026-01-new-dashboard') && (
                <FeatureTour onComplete={() => {
                    setStats((prev: DashboardStats | null) => prev ? { ...prev, hasSeenTutorialTour: true } : null);
                    localStorage.setItem('tour_version', '2026-01-new-dashboard');
                }} />
            )}

            {/* Support Ad - Moved to bottom */}
            <section className="mb-5 pb-5 mt-5">
                <SupportFundingAd />
            </section>

            <GrowthMilestoneModal />
            <DonationMissionsModal />

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
                    <DailyQuestionModal
                        questions={dailyQuestions}
                        isOpen={showDailyQuestions}
                        onClose={() => setShowDailyQuestions(false)}
                    />
                </>
            )}
        </div>
    );
}

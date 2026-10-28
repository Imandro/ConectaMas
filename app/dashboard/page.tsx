"use client";

import Link from 'next/link';
import { Sun, Loader2, HelpCircle, ChevronRight, Shield, Users, Trophy, Gamepad2, Heart, Sparkles } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';
import DailyVerse from './components/DailyVerse';
import LlamiMascot from '../components/LlamiMascot';
import FeatureTour from './components/FeatureTour';
import AgePrompt from './components/AgePrompt';
import ChallengeCard from './components/ChallengeCard';
import SupportFundingAd from './components/SupportFundingAd';
import WhatsappModal from '../components/WhatsappModal';
import WhatsappCard from '../components/WhatsappCard';
import InstagramModal from '../components/InstagramModal';
import InstagramCard from '../components/InstagramCard';
import CheckinModal from '../components/CheckinModal';
import CountryModal from '../components/CountryModal';
import DailyQuestionModal from './components/DailyQuestionModal';
import { languageLocale } from '@/app/lib/languages';

interface DashboardCheckin {
    createdAt: string;
    mood?: string;
}

interface DashboardMascot {
    level?: number;
    name?: string;
}

interface DashboardStruggle {
    status: string;
    isStarted: boolean;
}

interface DashboardStats {
    name: string;
    streak: number;
    lastCheckin: DashboardCheckin | null;
    struggles: DashboardStruggle[];
    mascot: DashboardMascot | null;
    hasSeenTutorialTour: boolean;
    hasJoinedWhatsapp: boolean;
    hasFollowedInstagram: boolean;
    country?: string;
    age?: number;
    lastChallengeCompleted?: string;
    league?: string;
}

import { useLanguage } from '@/app/LanguageContext';
import { useGuest } from '@/app/components/GuestProvider';
import { getGuestStats, updateGuestStreak } from '@/app/lib/guest';
import { useSession } from 'next-auth/react';
import { getSnapshot, saveSnapshot } from '@/app/lib/offlineStore';
import { createIdempotencyKey, enqueueOfflineMutation } from '@/app/lib/syncQueueProcessor';
import AdBanner from '@/app/components/AdBanner';

const MODAL_QUEUE = ['checkin', 'age', 'country', 'whatsapp', 'instagram', 'support', 'dailyQuestions'] as const;
type ModalId = typeof MODAL_QUEUE[number];
const SEEN_KEY = 'conectaplus_seen_modals';
const DASHBOARD_STATS_TTL = 60 * 1000;

function getSeenModals(): string[] {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); }
    catch { return []; }
}

function markModalSeen(id: string) {
    const seen = getSeenModals();
    if (!seen.includes(id)) {
        seen.push(id);
        localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
    }
}

export default function DashboardHome() {
    const { t, language } = useLanguage();
    const { isGuest, refreshStats } = useGuest();
    const { data: session, status: sessionStatus } = useSession();
    const snapshotUserId = isGuest ? 'guest' : ((session?.user as { id?: string } | undefined)?.id || session?.user?.email || 'anonymous');
    const dashboardCacheKey = `dashboard_stats:${snapshotUserId}`;
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkinLoading, setCheckinLoading] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [currentDate, setCurrentDate] = useState("");
    const [dailyQuestions, setDailyQuestions] = useState<unknown[]>([]);
    const [showDailyQuestions, setShowDailyQuestions] = useState(false);
    const [activeModal, setActiveModal] = useState<ModalId | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const statsRequestRef = useRef<{ userId: string; promise: Promise<void> } | null>(null);
    const activeSnapshotUserRef = useRef(snapshotUserId);
    activeSnapshotUserRef.current = snapshotUserId;
    const dashboardStatsTimestampKey = `conecta:dashboard-stats:${snapshotUserId}`;

    const fetchStats = useCallback(async (force = false) => {
        if (statsRequestRef.current?.userId === snapshotUserId) return statsRequestRef.current.promise;
        const requestUserId = snapshotUserId;
        const isCurrentUser = () => activeSnapshotUserRef.current === requestUserId;

        const pending = (async () => {
            const cached = localStorage.getItem(dashboardCacheKey);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached) as DashboardStats;
                    if (isCurrentUser()) setStats(parsed);
                    if (parsed.lastCheckin) {
                        const lastDate = new Date(parsed.lastCheckin.createdAt).toDateString();
                        if (lastDate === new Date().toDateString()) setHasCheckedIn(true);
                    }
                } catch (error) {
                    console.error('Error parsing cached stats', error);
                }
            }

            try {
                const snapshot = await getSnapshot<DashboardStats>('/dashboard', snapshotUserId);
                if (snapshot?.payload && isCurrentUser()) setStats(snapshot.payload);
            } catch (error) {
                console.warn('Error reading dashboard snapshot:', error);
            }

            if (!isCurrentUser() || !navigator.onLine || document.hidden) return;

            let lastFetchedAt = 0;
            try {
                lastFetchedAt = Number(sessionStorage.getItem(dashboardStatsTimestampKey)) || 0;
            } catch {
                // Session storage may be unavailable in private browsing.
            }
            if (!force && Date.now() - lastFetchedAt < DASHBOARD_STATS_TTL) return;

            const controller = new AbortController();
            const timeoutId = window.setTimeout(() => controller.abort(), 8000);
            try {
                const res = await fetch('/api/dashboard/stats', {
                    signal: controller.signal,
                    cache: 'no-store',
                });

                if (res.ok && isCurrentUser()) {
                    const data = await res.json() as DashboardStats;
                    setStats(data);
                    localStorage.setItem(dashboardCacheKey, JSON.stringify(data));
                    void saveSnapshot('/dashboard', snapshotUserId, data);
                    try {
                        sessionStorage.setItem(dashboardStatsTimestampKey, String(Date.now()));
                    } catch {
                        // Session storage may be unavailable in private browsing.
                    }
                    if (data.lastCheckin) {
                        const lastDate = new Date(data.lastCheckin.createdAt).toDateString();
                        if (lastDate === new Date().toDateString()) setHasCheckedIn(true);
                    }
                }
            } catch (error: unknown) {
                console.error('Error fetching stats:', error);
                if (error instanceof Error && error.name === 'AbortError') {
                    console.warn('Stats fetch timed out, using cache or default.');
                }
            } finally {
                window.clearTimeout(timeoutId);
            }
        })().finally(() => {
            if (isCurrentUser()) {
                setLoading(false);
                if (statsRequestRef.current?.userId === requestUserId) statsRequestRef.current = null;
            }
        });

        statsRequestRef.current = { userId: requestUserId, promise: pending };
        return pending;
    }, [dashboardCacheKey, dashboardStatsTimestampKey, snapshotUserId]);

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString(languageLocale(language), { day: 'numeric', month: 'long' }));
        if (isGuest) {
            loadGuestStats();
        } else if (sessionStatus !== 'loading') {
            fetchStats();
            fetchDailyQuestions();
        }
    }, [language, isGuest, sessionStatus, snapshotUserId, fetchStats]);

    useEffect(() => {
        if (isGuest || sessionStatus === 'loading') return;
        const refreshWhenAvailable = () => {
            if (navigator.onLine && !document.hidden) void fetchStats();
        };
        window.addEventListener('online', refreshWhenAvailable);
        document.addEventListener('visibilitychange', refreshWhenAvailable);
        return () => {
            window.removeEventListener('online', refreshWhenAvailable);
            document.removeEventListener('visibilitychange', refreshWhenAvailable);
        };
    }, [fetchStats, isGuest, sessionStatus]);

    const advanceModal = useCallback(() => {
        if (!activeModal) return;
        markModalSeen(activeModal);
        const seen = getSeenModals();
        const next = MODAL_QUEUE.find(id => !seen.includes(id)) || null;
        setActiveModal(next);
    }, [activeModal]);

    useEffect(() => {
        if (!activeModal) return;
        const timer = setTimeout(advanceModal, 12000);
        return () => clearTimeout(timer);
    }, [activeModal, advanceModal]);

    useEffect(() => {
        if (isGuest) return;
        const completedTour = stats?.hasSeenTutorialTour &&
            localStorage.getItem('tour_version') === '2026-01-new-dashboard';
        if (completedTour && !activeModal) {
            const seen = getSeenModals();
            const next = MODAL_QUEUE.find(id => !seen.includes(id)) || null;
            if (next) {
                const t = setTimeout(() => setActiveModal(next), 2000);
                return () => clearTimeout(t);
            }
        }
    }, [stats, isGuest, activeModal]);

    const loadGuestStats = () => {
        const gs = getGuestStats();
        setStats({
            name: gs.name,
            streak: gs.streak,
            lastCheckin: gs.lastCheckin,
            struggles: [],
            mascot: gs.mascot,
            hasSeenTutorialTour: true,
            hasJoinedWhatsapp: false,
            hasFollowedInstagram: false,
            country: undefined,
            age: undefined,
            lastChallengeCompleted: undefined,
        });
        if (gs.hasCheckedInToday) setHasCheckedIn(true);
        setLoading(false);
    };

    const fetchDailyQuestions = async () => {
        if (!navigator.onLine || document.hidden) return;
        try {
            const today = new Date().toDateString();
            const lastSeen = localStorage.getItem('seen_daily_questions_date');
            if (lastSeen === today) return;

            const { getDailyQuestions } = await import('./qa/actions');
            const questions = await getDailyQuestions();

            if (questions.length > 0) {
                setDailyQuestions(questions);
                setTimeout(() => setShowDailyQuestions(true), 2000);
                localStorage.setItem('seen_daily_questions_date', today);
            }
        } catch (e) {
            console.error("Error fetching daily questions", e);
        }
    };

    const handleCheckin = async (mood: string) => {
        if (checkinLoading || hasCheckedIn) return;
        setCheckinLoading(true);

        if (isGuest) {
            // Guest check-in: store locally
            updateGuestStreak();
            refreshStats();
            setHasCheckedIn(true);
            loadGuestStats();
            setCheckinLoading(false);
            return;
        }

        const idempotencyKey = createIdempotencyKey();
        const now = new Date();
        const dayKey = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');

        try {
            if (navigator.onLine === false) {
                if (snapshotUserId === 'anonymous') throw new Error('No hay una sesión para guardar el check-in');
                await enqueueOfflineMutation({
                    userId: snapshotUserId,
                    operation: 'CHECK_IN',
                    route: '/api/checkin',
                    payload: { mood, dayKey },
                    idempotencyKey,
                });
                setHasCheckedIn(true);
                return;
            }

            const res = await fetch('/api/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
                body: JSON.stringify({ mood, dayKey, idempotencyKey }),
            });

            if (res.ok) {
                setHasCheckedIn(true);
                // Force clear local cache to ensure fresh data on next fetch
                localStorage.removeItem(dashboardCacheKey);
                await fetchStats(true); // Refresh streak and everything
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
            <header className="dashboard-header ui-page-header ui-surface-glass d-flex justify-content-between align-items-center gap-3 mb-3 p-3 p-md-4 rounded-4 shadow-sm">
                <div className="dashboard-header-greeting min-w-0">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Sparkles size={14} className="text-warning flex-shrink-0" aria-hidden="true" />
                        <span className="text-muted fw-semibold small text-truncate">{currentDate}</span>
                    </div>
                    <h1 className="dashboard-greeting-title fw-bold text-primary m-0" style={{ fontSize: 'clamp(1.85rem, 8vw, 2.5rem)', lineHeight: 1.05 }}>{t.dashboard.greeting}, {stats?.name || 'Mario'}</h1>
                </div>
                <div className="dashboard-header-actions d-flex align-items-center gap-1 flex-shrink-0" aria-label="Acciones del perfil">
                    <Link href="/dashboard/tutorials" aria-label={t.nav.tutorials} className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" title={t.nav.tutorials}>
                        <HelpCircle size={22} aria-hidden="true" />
                    </Link>
                    <Link id="tour-friends" href="/dashboard/friends" aria-label={t.nav.friends} className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" title={t.nav.friends}>
                        <Users size={22} aria-hidden="true" />
                    </Link>
                    <Link href="/dashboard/profile" aria-label="Abrir perfil">
                        <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold text-decoration-none" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                            {stats?.name ? stats.name.charAt(0).toUpperCase() : 'M'}
                        </div>
                    </Link>
                </div>
            </header>

            <AdBanner placement="dashboard" />



            <section className="mb-0" id="tour-verse">
                <DailyVerse />
            </section>

            <section className="mb-0">
                <ChallengeCard
                    isCompleted={
                        stats?.lastChallengeCompleted
                            ? new Date(stats.lastChallengeCompleted).toDateString() === new Date().toDateString()
                            : false
                    }
                />
            </section>

            {/* Estado y SOS con Llami */}
            <section className="row g-2 g-md-3 mb-3">
                <div className="col-12 col-sm-7">
                    <div id="tour-checkin" className="dashboard-checkin-card card ui-surface-glass border-0 shadow-sm h-100 overflow-visible">
                        <div className="card-body p-3 p-md-4">
                            <div className="row align-items-center h-100 g-0">
                                <div className="col-7 d-flex flex-column justify-content-center">
                                    <p className="text-muted fw-semibold mb-1 small">{t.dashboard.streak_label}</p>

                                    <div className="d-flex align-items-center gap-1">
                                        <div className="bg-success-subtle text-success p-1 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                                            <Sun size={18} aria-hidden="true" />
                                        </div>
                                        <span className="fw-bold text-primary" style={{ fontSize: 'clamp(2rem, 10vw, 2.5rem)', lineHeight: 1 }}>{stats?.streak || 10}</span>
                                    </div>

                                    <h2 className="fw-bold text-primary m-0" style={{ fontSize: '1.25rem', marginLeft: '32px' }}>{t.dashboard.days}</h2>
                                </div>
                                <div className="col-5 text-center position-relative d-flex flex-column align-items-center justify-content-center">
                                    <div className="mb-1" aria-label="Interactuar con Llami">
                                        <div className="position-relative d-inline-block">
                                            <div className="dashboard-checkin-mascot bg-warning-subtle rounded-circle p-2" style={{ width: '76px', height: '76px' }}>
                                                <LlamiMascot
                                                    streak={stats?.streak || 10}
                                                    lastMood={stats?.lastCheckin?.mood}
                                                    level={stats?.mascot?.level || 2}
                                                    name={stats?.mascot?.name}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                        <Link href="/dashboard/llami" className="badge bg-light text-muted rounded-pill px-2 py-1 fw-semibold text-decoration-none">
                                            {t.dashboard.level} {stats?.mascot?.level || 2}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-5">
                    <Link href="/dashboard/sos" aria-label="SOS: ayuda inmediata" className="dashboard-sos-card card shadow-sm h-100 bg-danger-subtle text-danger text-decoration-none overflow-hidden position-relative">
                        <div className="card-body p-3 d-flex flex-column align-items-center justify-content-center text-center">
                            <div className="mb-1 d-flex align-items-center justify-content-center">
                                <Shield size={40} className="text-danger" fill="currentColor" fillOpacity={0.08} aria-hidden="true" />
                            </div>
                            <h2 className="fw-bold m-0 text-danger" style={{ fontSize: '1.55rem', letterSpacing: '-0.5px' }}>SOS</h2>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Mi Seguimiento - Resumen Premium */}
            <section className="mb-3" id="tour-struggles">
                <Link href="/dashboard/luchas" className="text-decoration-none">
                    <div className="card ui-surface-elevated border shadow-sm overflow-hidden">
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center gap-2 min-w-0">
                                    <div className="bg-primary-subtle text-primary p-2 rounded-3 flex-shrink-0">
                                        <Shield size={22} aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="h6 fw-bold text-primary m-0 text-truncate">{t.dashboard.my_tracking}</h3>
                                        <p className="text-muted small m-0 line-clamp-2">{t.dashboard.tracking_desc}</p>
                                    </div>
                                </div>
                                <div className="text-primary bg-light p-2 rounded-circle flex-shrink-0">
                                    <ChevronRight size={18} aria-hidden="true" />
                                </div>
                            </div>

                            <div className="row g-2">
                                <div className="col-6">
                                    <div className="bg-light p-2 rounded-3 text-center">
                                        <span className="d-block fw-bold text-primary fs-5">
                                            {stats?.struggles?.filter((s) => s.status === "ACTIVE" && s.isStarted)?.length || 0}
                                        </span>
                                        <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.6rem' }}>{t.dashboard.in_progress}</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bg-light p-2 rounded-3 text-center">
                                        <span className="d-block fw-bold text-warning fs-5">
                                            {stats?.struggles?.filter((s) => s.status === "ACTIVE" && !s.isStarted)?.length || 0}
                                        </span>
                                        <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: '0.6rem' }}>{t.dashboard.upcoming}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </section>



            {/* Secondary actions stay compact so they do not compete with the daily path. */}
            <section className="mb-3" aria-labelledby="dashboard-secondary-actions">
                <h2 id="dashboard-secondary-actions" className="visually-hidden">Accesos secundarios</h2>
                <div className="row g-2">
                    <div className="col-4 col-md-4">
                        <Link href="/dashboard/games" className="text-decoration-none">
                            <div id="tour-games" className="card ui-surface border shadow-sm h-100">
                                <div className="card-body p-2 p-md-3 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '96px' }}>
                                    <div className="bg-primary-subtle text-primary p-2 rounded-circle mb-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <Gamepad2 size={22} aria-hidden="true" />
                                    </div>
                                    <h3 className="h6 fw-bold text-primary m-0">Juegos</h3>
                                    <small className="text-muted fw-semibold d-none d-md-block text-truncate w-100" style={{ fontSize: '0.65rem' }}>Trivia & Papa Caliente</small>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-4 col-md-4">
                        <Link href="/dashboard/leagues" className="text-decoration-none">
                            <div id="tour-leagues" className="card ui-surface border shadow-sm h-100">
                                <div className="card-body p-2 p-md-3 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '96px' }}>
                                    <div className="bg-warning-subtle text-warning p-2 rounded-circle mb-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <Trophy size={22} aria-hidden="true" />
                                    </div>
                                    <h3 className="h6 fw-bold text-primary m-0 text-truncate w-100">{t.leagues.title}</h3>
                                    <small className="text-muted fw-semibold text-truncate w-100" style={{ fontSize: '0.65rem' }}>{stats?.league || "Bronce"}</small>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-4 col-md-4">
                        <Link href="/dashboard/support" className="text-decoration-none">
                            <div className="card ui-surface border shadow-sm h-100">
                                <div className="card-body p-2 p-md-3 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '96px' }}>
                                    <div className="bg-danger-subtle text-danger p-2 rounded-circle mb-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <Heart size={22} aria-hidden="true" />
                                    </div>
                                    <h3 className="h6 fw-bold text-primary m-0">Apoyar</h3>
                                    <small className="text-muted fw-semibold d-none d-md-block text-truncate w-100" style={{ fontSize: '0.65rem' }}>Donar al proyecto</small>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Spiritual insights stay available without occupying the first scan. */}
            <section className="mb-3">
                <details className="card ui-surface border shadow-sm">
                    <summary className="card-body p-3 d-flex align-items-center gap-2" style={{ listStyle: 'none', cursor: 'pointer' }}>
                        <div className="bg-warning-subtle text-warning p-2 rounded-3 flex-shrink-0">
                            <Sun size={20} aria-hidden="true" />
                        </div>
                        <span className="fw-bold text-primary">Sabiduría para hoy</span>
                        <span className="ms-auto text-muted small">Ver</span>
                    </summary>
                    <div className="px-3 pb-3">
                        <div className="bg-light p-3 rounded-3 mb-3">
                            <p className="small text-muted mb-0 lh-base">
                                <strong>¿Sabías que?</strong> La palabra &quot;Selah&quot; aparece 74 veces en la Biblia y es una invitación a hacer una pausa, respirar y meditar en lo que acabas de leer. Hoy, tómate un momento Selah.
                            </p>
                        </div>
                        <h3 className="small fw-bold text-uppercase text-muted mb-2" style={{ fontSize: '0.7rem' }}>Tips de Crecimiento</h3>
                        <ul className="list-unstyled d-flex flex-column gap-2 m-0">
                            <li className="small d-flex gap-2"><span className="text-warning" aria-hidden="true">•</span><span>La oración no es para cambiar a Dios, sino para que Él nos cambie a nosotros.</span></li>
                            <li className="small d-flex gap-2"><span className="text-warning" aria-hidden="true">•</span><span>Leer un capítulo al día te permite completar la Biblia en poco más de 3 años.</span></li>
                            <li className="small d-flex gap-2"><span className="text-warning" aria-hidden="true">•</span><span>Tus &quot;luchas&quot; son oportunidades para que el poder de Dios se perfeccione en tu debilidad.</span></li>
                        </ul>
                    </div>
                </details>
            </section>

            {/* Social Media Cards - hidden for guests */}
            {!isGuest && (
                <section className="mb-3">
                    <details className="card ui-surface border shadow-sm">
                        <summary className="card-body p-3 d-flex align-items-center gap-2" style={{ listStyle: 'none', cursor: 'pointer' }}>
                            <Users size={20} className="text-primary" aria-hidden="true" />
                            <span className="fw-bold text-primary">Conecta con la comunidad</span>
                            <span className="ms-auto text-muted small">Ver</span>
                        </summary>
                        <div className="px-3 pb-3">
                            <div className="row g-2">
                                <div className="col-12 col-md-6"><WhatsappCard /></div>
                                <div className="col-12 col-md-6"><InstagramCard /></div>
                            </div>
                        </div>
                    </details>
                </section>
            )}

            {/* Feature Tour - only for logged-in users */}
            {!isGuest && stats && (!stats.hasSeenTutorialTour || localStorage.getItem('tour_version') !== '2026-01-new-dashboard') && (
                <FeatureTour onComplete={() => {
                    setStats((prev: DashboardStats | null) => prev ? { ...prev, hasSeenTutorialTour: true } : null);
                    localStorage.setItem('tour_version', '2026-01-new-dashboard');
                }} />
            )}

            {/* Progressive modals - one at a time for logged-in users */}
            {!isGuest && stats && stats.hasSeenTutorialTour && (
                <div ref={modalRef}>
                    {activeModal === 'checkin' && (
                        <CheckinModal
                            hasCheckedIn={hasCheckedIn}
                            onCheckin={handleCheckin}
                            isLoading={checkinLoading}
                        />
                    )}
                    {activeModal === 'age' && (
                        <AgePrompt missingAge={!stats.age} />
                    )}
                    {activeModal === 'country' && (
                        <CountryModal hasSelectedCountry={!!stats.country} />
                    )}
                    {activeModal === 'whatsapp' && (
                        <WhatsappModal hasJoined={stats.hasJoinedWhatsapp} />
                    )}
                    {activeModal === 'instagram' && (
                        <InstagramModal hasFollowed={stats.hasFollowedInstagram} />
                    )}
                    {activeModal === 'support' && (
                        <section className="mb-5 pb-5 mt-5">
                            <SupportFundingAd />
                        </section>
                    )}
                    {activeModal === 'dailyQuestions' && (
                        <DailyQuestionModal
                            questions={dailyQuestions}
                            isOpen={showDailyQuestions}
                            onClose={() => setShowDailyQuestions(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

"use client";

// Metadata removed for client component

import Link from 'next/link';
import { Clock, BookOpen, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { getDevotionals, getDevotionalBackground, type Devotional } from '@/app/lib/devotionalsData';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/app/LanguageContext';
import SecondaryPageShell from '@/app/components/SecondaryUI';

const categories = ['Para ti', 'Sabiduría', 'Espíritu Santo', 'Ansiedad', 'Identidad', 'Integridad', 'Fe', 'Relaciones', 'Oración', 'Soledad', 'Culpa', 'Ira', 'Envidia', 'Comunidad'];

const categoryKeys: Record<string, string> = {
    'Para ti': 'for_you',
    'Sabiduría': 'wisdom',
    'Espíritu Santo': 'holy_spirit',
    'Ansiedad': 'anxiety',
    'Identidad': 'identity',
    'Integridad': 'integrity',
    'Fe': 'faith',
    'Relaciones': 'relationships',
    'Oración': 'prayer',
    'Soledad': 'loneliness',
    'Culpa': 'guilt',
    'Ira': 'anger',
    'Envidia': 'envy',
    'Comunidad': 'community',
};

const getOptimizedImageUrl = (url: string) => {
    if (url.includes('&w=') || url.includes('?w=')) return url;
    return url + '&w=500';
};

type DevotionalGroup = { type: 'group'; name: string; devotionals: Devotional[] };
type DisplayItem = Devotional | DevotionalGroup;
type UserProfilePayload = { sinsToOvercome?: string | null; problemsFaced?: string | null };

const parseProfileList = (value: string | null | undefined) => {
    if (!value) return [];
    try {
        const parsed: unknown = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch {
        return [];
    }
};

export default function DevotionalsPage() {
    const { t, language } = useLanguage();
    const devotionalsData = getDevotionals(language);
    const { data: session } = useSession();
    const [selectedCategory, setSelectedCategory] = useState('Para ti');
    const [recommendedDevotionals, setRecommendedDevotionals] = useState<Devotional[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<DevotionalGroup | null>(null);

    useEffect(() => {
        const userEmail = session?.user?.email;
        if (!userEmail) {
            setRecommendedDevotionals([]);
            return;
        }

        fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`)
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to load user profile');
                return await res.json() as UserProfilePayload;
            })
            .then((userData) => {
                const userStruggles = [
                    ...parseProfileList(userData.sinsToOvercome),
                    ...parseProfileList(userData.problemsFaced)
                ];
                const recommended = devotionalsData.filter((dev) =>
                    userStruggles.some((struggle) =>
                        dev.category.toLowerCase().includes(struggle.toLowerCase()) ||
                        dev.title.toLowerCase().includes(struggle.toLowerCase())
                    )
                );
                setRecommendedDevotionals(recommended.slice(0, 4));
            })
            .catch((error) => console.error('Error fetching user profile:', error));
    }, [session, language]);

    const selectedCategoryLabel = selectedCategory === 'Para ti'
        ? t.devotionals.categories.for_you
        : t.devotionals.categories[categoryKeys[selectedCategory] as keyof typeof t.devotionals.categories] || selectedCategory;
    const filteredDevotionals = selectedCategory === 'Para ti'
        ? devotionalsData
        : devotionalsData.filter(dev => dev.category === selectedCategoryLabel);

    const getGroupName = (title: string) => {
        if (title.includes(':')) return title.split(':')[0].trim();
        const regex = /\s+(D[íi]a|Ziua)\s+/i;
        if (regex.test(title)) return title.split(regex)[0].trim();
        return title;
    };

    const groupedDevs: Record<string, Devotional[]> = {};
    const displayItems: DisplayItem[] = [];

    filteredDevotionals.forEach(dev => {
        const groupName = getGroupName(dev.title);
        if (groupName !== dev.title) {
            if (!groupedDevs[groupName]) groupedDevs[groupName] = [];
            groupedDevs[groupName].push(dev);
        } else {
            displayItems.push(dev);
        }
    });

    Object.entries(groupedDevs).forEach(([name, devs]) => {
        if (devs.length > 1) {
            displayItems.push({ type: 'group', name, devotionals: devs });
        } else {
            displayItems.push(...devs);
        }
    });

    return (
        <SecondaryPageShell>
        <div className="animate-fade-in">
            <header className="ui-page-header mb-4">
                <h2 className="fw-bold text-secondary mb-0">{t.devotionals.title}</h2>
            </header>

            {recommendedDevotionals.length > 0 && (
                <section className="mb-5">
                    <h5 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                        <Sparkles size={20} />
                        {t.devotionals.recommended_title}
                    </h5>
                    <div className="row g-3 mb-4">
                        {recommendedDevotionals.map((dev) => (
                            <div key={dev.id} className="col-12 col-md-6">
                                <Link href={`/dashboard/devotionals/${dev.id}`} className="card ui-surface border-0 shadow-sm text-decoration-none hover-scale h-100">
                                    <div className="d-flex h-100">
                                        <div style={{ width: '100px', minHeight: '140px', backgroundImage: `url(${getOptimizedImageUrl(dev.image)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className="rounded-start d-flex align-items-center justify-content-center">
                                            <div className="bg-dark bg-opacity-25 w-100 h-100 d-flex align-items-center justify-content-center">
                                                <BookOpen className="text-white opacity-75" size={32} />
                                            </div>
                                        </div>
                                        <div className="card-body py-3">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <span className="badge bg-light text-secondary rounded-pill fw-normal">{dev.category}</span>
                                                <Heart size={16} className="text-muted" />
                                            </div>
                                            <h6 className="fw-bold text-dark mb-1">{dev.title}</h6>
                                            <div className="d-flex align-items-center text-muted small mt-auto">
                                                <Clock size={14} className="me-1" />
                                                {dev.time} {t.devotionals.read_time}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Categories Filter */}
            <div className="d-flex gap-2 overflow-auto pb-2 mb-4 no-scrollbar">
                {categories.map((cat, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedCategory(cat)}
                        className={`btn btn-sm rounded-pill px-3 flex-shrink-0 transition-all ${selectedCategory === cat ? 'btn-primary text-white shadow-sm' : 'btn-light text-secondary border-0'}`}
                    >
                        {t.devotionals.categories[categoryKeys[cat] as keyof typeof t.devotionals.categories] || cat}
                    </button>
                ))}
            </div>

            <div className="row g-3">
                {displayItems.length > 0 ? (
                    displayItems.map((item, idx) => {
                        if ('type' in item && item.type === 'group') {
                            return (
                                <div key={`group-${idx}`} className="col-12 col-md-6">
                                    <div className="card ui-surface border-0 shadow-sm hover-scale h-100 cursor-pointer"
                                        onClick={() => setSelectedGroup(item)}>
                                        <div className="d-flex h-100">
                                            <div className="bg-primary-subtle text-primary rounded-start py-5 px-4 d-flex align-items-center justify-content-center" style={{ width: '100px' }}>
                                                <BookOpen size={32} />
                                            </div>
                                            <div className="card-body py-3 d-flex flex-column justify-content-center">
                                                <h6 className="fw-bold text-dark mb-1">{item.name}</h6>
                                                <p className="text-muted small m-0">{item.devotionals.length} {t.devotionals.days_content}</p>
                                            </div>
                                            <div className="d-flex align-items-center px-3 text-muted">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        const dev = item as Devotional;
                        return (
                            <div key={dev.id} className="col-12 col-md-6">
                                <Link href={`/dashboard/devotionals/${dev.id}`} className="card ui-surface border-0 shadow-sm text-decoration-none hover-scale h-100">
                                    <div className="d-flex h-100">
                                        <div style={{ width: '100px', minHeight: '140px', background: getDevotionalBackground(dev.id) }} className="rounded-start d-flex align-items-center justify-content-center">
                                            <div className="bg-dark bg-opacity-25 w-100 h-100 d-flex align-items-center justify-content-center">
                                                <BookOpen className="text-white opacity-75" size={32} />
                                            </div>
                                        </div>
                                        <div className="card-body py-3">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <span className="badge bg-light text-secondary rounded-pill fw-normal">{dev.category}</span>
                                                <Heart size={16} className="text-muted" />
                                            </div>
                                            <h6 className="fw-bold text-dark mb-1">{dev.title}</h6>
                                            <div className="d-flex align-items-center text-muted small mt-auto">
                                                <Clock size={14} className="me-1" />
                                                {dev.time} {t.devotionals.read_time}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted">{t.devotionals.no_content}</p>
                        <button onClick={() => setSelectedCategory('Para ti')} className="btn btn-sm btn-outline-secondary rounded-pill">
                            {t.devotionals.view_all}
                        </button>
                    </div>
                )}
            </div>

            {/* Custom React Modal for Groups */}
            {selectedGroup && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div className="ui-surface-glass rounded-5 shadow-lg w-100 overflow-hidden" style={{ maxWidth: '500px' }}>
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light">
                            <h5 className="fw-bold m-0 text-primary">{selectedGroup.name}</h5>
                            <button onClick={() => setSelectedGroup(null)} className="btn-close"></button>
                        </div>
                        <div className="p-4 mobile-scroll-container" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <p className="text-muted small mb-3">{t.devotionals.select_day}</p>
                            <div className="list-group gap-2">
                                {selectedGroup.devotionals.map((dev, dIdx) => (
                                    <Link
                                        key={dev.id}
                                        href={`/dashboard/devotionals/${dev.id}`}
                                        className="list-group-item list-group-item-action border-0 rounded-4 bg-light d-flex align-items-center justify-content-between p-3"
                                        onClick={() => setSelectedGroup(null)}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: '24px', height: '24px' }}>{dIdx + 1}</span>
                                            <span className="fw-bold text-dark">{dev.title}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-muted" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="p-3 text-center bg-light">
                            <button onClick={() => setSelectedGroup(null)} className="btn btn-primary rounded-pill px-4">{t.devotionals.close}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </SecondaryPageShell>
    );
}

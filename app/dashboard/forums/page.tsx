"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Plus, Hash, ChevronRight } from 'lucide-react';
import LlamiCommunityTutorial from './components/LlamiCommunityTutorial';
import { getCommunityTutorialStatus, markCommunityTutorialSeen, getForumCategories } from './actions';
import SecondaryPageShell from "@/app/components/SecondaryUI";
import { useLanguage } from '@/app/LanguageContext';

interface ForumCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    _count: {
        posts: number;
    };
}

export default function ForumsPage() {
    const { t, language } = useLanguage();
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTutorial, setShowTutorial] = useState(false);

    const localizeCategory = (category: ForumCategory) => {
        if (language !== 'ro') return category;
        const keyByName: Record<string, keyof typeof t.forums.categories> = {
            'Conecta+': 'conecta', 'Testimonios': 'testimonies', 'Ansiedad y Estrés': 'anxiety',
            'Depresión y Tristeza': 'depression', 'Lujuria y Tentación': 'lust', 'Adicciones': 'addictions',
            'Relaciones y Familia': 'relationships', 'Mentira y Honestidad': 'lying', 'Orgullo y Humildad': 'pride',
            'Enojo e Ira': 'anger', 'Soledad y Propósito': 'loneliness', 'Dudas de Fe': 'faith_doubts', 'Oración': 'prayer',
        };
        const copy = t.forums.categories[keyByName[category.name]];
        return copy ? { ...category, name: copy.name, description: copy.desc } : category;
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            if (!navigator.onLine) {
                setLoading(false);
                return;
            }
            const [status, res] = await Promise.all([
                getCommunityTutorialStatus(),
                getForumCategories()
            ]);

            if (!status) setShowTutorial(true);
            if (res.success) setCategories(res.categories as ForumCategory[]);
            setLoading(false);
        };
        init();
    }, []);

    const handleTutorialComplete = async () => {
        if (!navigator.onLine) {
            alert('Sin conexión. Guardar este tutorial requiere internet.');
            return;
        }
        setShowTutorial(false);
        await markCommunityTutorialSeen();
    };

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t.forums.loading}</span>
                </div>
            </div>
        );
    }

    return (
        <SecondaryPageShell>
        <div className="container-fluid py-4 animate-fade-in">
            <div className="ui-page-header mb-5">
                <div>
                    <h1 className="h2 fw-bold text-dark mb-1">{t.forums.title} Conecta+</h1>
                    <p className="text-muted mb-0">{t.forums.subtitle}</p>
                    <p className="small mt-2 mb-0"><Link href="/legal/community">{t.forums.community_rules}</Link> · <a href="mailto:marioalejandroruiz28@gmail.com">{t.forums.report_content}</a></p>
                </div>
                <div className="d-flex gap-2">
                    <Link href="/dashboard/forums/new" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm">
                        <Plus size={20} /> <span className="d-none d-md-inline">{t.forums.new_post}</span>
                    </Link>
                </div>
            </div>

            {showTutorial && <LlamiCommunityTutorial onComplete={handleTutorialComplete} />}

            <div className="row g-4">
                {categories.map((rawCategory) => { const cat = localizeCategory(rawCategory); return (
                    <div key={cat.id} className="col-md-6 col-lg-4">
                        <Link href={`/dashboard/forums/${cat.id}`} className="text-decoration-none h-100">
                            <div className="card ui-surface h-100 border-0 shadow-sm rounded-4 transform-hover overflow-hidden">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                            <Hash className="text-primary" size={24} />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold text-dark mb-0">{cat.name}</h5>
                                            <span className="badge bg-light text-primary rounded-pill small border">
                                                {cat._count.posts} {t.forums.participations}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-muted small mb-0 line-clamp-2">
                                        {cat.description}
                                    </p>
                                    <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                                        <span className="small fw-bold text-primary">{t.forums.explore_topics}</span>
                                        <ChevronRight size={16} className="text-primary" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ); })}
            </div>

            {categories.length === 0 && (
                <div className="ui-state mt-4">
                    <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block mb-3">
                        <Users size={48} className="text-primary" />
                    </div>
                    <h4 className="fw-bold text-dark mb-2">{t.forums.community_growth}</h4>
                    <p className="text-muted mx-auto" style={{ maxWidth: '400px' }}>
                        {t.forums.no_public_categories}
                    </p>
                    <Link href="/dashboard" className="btn btn-outline-primary rounded-pill px-4 mt-2">
                        {t.forums.back_home}
                    </Link>
                </div>
            )}
        </div>
        </SecondaryPageShell>
    );
}

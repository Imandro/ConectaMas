"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Users, Plus, Hash, ChevronRight } from 'lucide-react';
import LlamiCommunityTutorial from './components/LlamiCommunityTutorial';
import { getCommunityTutorialStatus, markCommunityTutorialSeen, getForumCategories } from './actions';
import { useLanguage } from "@/app/LanguageContext";

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
    const { t } = useLanguage();
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
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
        setShowTutorial(false);
        await markCommunityTutorialSeen();
    };

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="h2 fw-bold text-dark mb-1">Comunidad Conecta+</h1>
                    <p className="text-muted mb-0">Un espacio seguro para compartir, preguntar y crecer en la fe.</p>
                </div>
                <div className="d-flex gap-2">
                    <Link href="/dashboard/forums/new" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm">
                        <Plus size={20} /> <span className="d-none d-md-inline">Nuevo Post</span>
                    </Link>
                </div>
            </div>

            {showTutorial && <LlamiCommunityTutorial onComplete={handleTutorialComplete} />}

            <div className="row g-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="col-md-6 col-lg-4">
                        <Link href={`/dashboard/forums/${cat.id}`} className="text-decoration-none h-100">
                            <div className="card h-100 border-0 shadow-sm rounded-4 transform-hover overflow-hidden">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                            <Hash className="text-primary" size={24} />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold text-dark mb-0">{cat.name}</h5>
                                            <span className="badge bg-light text-primary rounded-pill small border">
                                                {cat._count.posts} participaciones
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-muted small mb-0 line-clamp-2">
                                        {cat.description}
                                    </p>
                                    <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                                        <span className="small fw-bold text-primary">Explorar temas</span>
                                        <ChevronRight size={16} className="text-primary" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm border mt-4">
                    <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block mb-3">
                        <Users size={48} className="text-primary" />
                    </div>
                    <h4 className="fw-bold text-dark mb-2">Comunidad en Crecimiento</h4>
                    <p className="text-muted mx-auto" style={{ maxWidth: '400px' }}>
                        Aún no hay categorías públicas configuradas. Sé parte de los primeros en conectar.
                    </p>
                    <Link href="/dashboard" className="btn btn-outline-primary rounded-pill px-4 mt-2">
                        Volver al Inicio
                    </Link>
                </div>
            )}
        </div>
    );
}

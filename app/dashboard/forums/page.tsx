"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Users, Plus } from 'lucide-react';
import LlamiCommunityTutorial from './components/LlamiCommunityTutorial';
import NotificationDropdown from './components/NotificationDropdown';
import { getCommunityTutorialStatus, markCommunityTutorialSeen } from './actions';

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
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        // Mark as read
        fetch('/api/forums/mark-read', { method: 'POST' });

        // Check tutorial status
        // Check tutorial status
        const localSeen = localStorage.getItem('conecta_hasSeenCommunityTutorial');
        if (localSeen) {
            setShowTutorial(false);
        } else {
            getCommunityTutorialStatus().then(hasSeen => {
                if (!hasSeen) {
                    setShowTutorial(true);
                }
            });
        }

        fetch('/api/forums/categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading categories:', err);
                setLoading(false);
            });
    }, []);

    const handleTutorialComplete = async () => {
        localStorage.setItem('conecta_hasSeenCommunityTutorial', 'true'); // Immediate client-side persistence
        setShowTutorial(false);
        await markCommunityTutorialSeen();
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 animate-fade-in">
            {showTutorial && <LlamiCommunityTutorial onComplete={handleTutorialComplete} />}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold text-secondary mb-2">Comunidad</h1>
                    <p className="text-muted mb-0">Comparte, aprende y crece junto a otros en la fe</p>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <NotificationDropdown />
                    <Link href="/dashboard/forums/new" className="btn btn-primary rounded-pill px-4">
                        <Plus size={20} className="me-2" />
                        Nueva Publicación
                    </Link>
                </div>
            </div>

            <div className="row g-4">
                {categories.map(category => (
                    <div key={category.id} className="col-md-6 col-lg-4">
                        <Link
                            href={`/dashboard/forums/${category.id}`}
                            className="card border-0 shadow-sm h-100 text-decoration-none hover-scale transition-all"
                        >
                            <div className="card-body p-4">
                                <div className="d-flex align-items-start gap-3 mb-3">
                                    <div className="fs-1">{category.icon}</div>
                                    <div className="flex-grow-1">
                                        <h5 className="fw-bold text-dark mb-1">{category.name}</h5>
                                        <p className="text-muted small mb-0">{category.description}</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3 text-muted small">
                                    <div className="d-flex align-items-center gap-1">
                                        <MessageCircle size={16} />
                                        <span>{category._count.posts} publicaciones</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-5">
                    <Users size={48} className="text-muted mb-3" />
                    <p className="text-muted">No hay categorías disponibles aún.</p>
                </div>
            )}
        </div>
    );
}

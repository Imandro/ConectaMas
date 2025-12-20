"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Clock, Shield, User as UserIcon } from 'lucide-react';

interface Post {
    id: string;
    title: string;
    content: string;
    isAnonymous: boolean;
    createdAt: string;
    user: {
        name: string;
        isCounselor: boolean;
    } | null;
    _count: {
        replies: number;
    };
}

interface Category {
    name: string;
    icon: string;
    description: string;
}

export default function CategoryPostsPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.categoryId as string;

    const [posts, setPosts] = useState<Post[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch posts for this category
        fetch(`/api/forums/posts?categoryId=${categoryId}`)
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                if (data.length > 0 && data[0].category) {
                    setCategory(data[0].category);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading posts:', err);
                setLoading(false);
            });
    }, [categoryId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return date.toLocaleDateString('es-ES');
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
            <Link href="/dashboard/forums" className="btn btn-light mb-3">
                <ArrowLeft size={20} className="me-2" />
                Volver a Comunidad
            </Link>

            {category && (
                <div className="card border-0 shadow-sm mb-4 bg-gradient-primary text-white">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="fs-1">{category.icon}</div>
                            <div>
                                <h2 className="fw-bold mb-1">{category.name}</h2>
                                <p className="mb-0 opacity-75">{category.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-secondary mb-0">Publicaciones</h4>
                <Link href={`/dashboard/forums/new?category=${categoryId}`} className="btn btn-primary rounded-pill">
                    Nueva Publicación
                </Link>
            </div>

            <div className="d-flex flex-column gap-3">
                {posts.map(post => (
                    <Link
                        key={post.id}
                        href={`/dashboard/forums/post/${post.id}`}
                        className="card border-0 shadow-sm text-decoration-none hover-scale transition-all"
                    >
                        <div className="card-body p-4">
                            <h5 className="fw-bold text-dark mb-2">{post.title}</h5>
                            <p className="text-muted mb-3" style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                {post.content}
                            </p>
                            <div className="d-flex align-items-center gap-3 text-muted small">
                                <div className="d-flex align-items-center gap-1">
                                    {post.isAnonymous ? (
                                        <>
                                            <UserIcon size={16} />
                                            <span>Anónimo</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserIcon size={16} />
                                            <span>{post.user?.name || 'Usuario'}</span>
                                            {post.user?.isCounselor && (
                                                <span className="badge bg-success-subtle text-success ms-1">
                                                    <Shield size={12} className="me-1" />
                                                    Consejero
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                    <Clock size={16} />
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                    <MessageCircle size={16} />
                                    <span>{post._count.replies} respuestas</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-5">
                        <MessageCircle size={48} className="text-muted mb-3" />
                        <p className="text-muted mb-3">No hay publicaciones en esta categoría aún.</p>
                        <Link href={`/dashboard/forums/new?category=${categoryId}`} className="btn btn-primary rounded-pill">
                            Sé el primero en publicar
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

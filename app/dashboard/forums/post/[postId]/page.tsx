"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Shield, User as UserIcon, Send, Trash2 } from 'lucide-react';

interface Reply {
    id: string;
    content: string;
    isAnonymous: boolean;
    createdAt: string;
    user: {
        name: string;
        isCounselor: boolean;
    } | null;
}

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
    category: {
        name: string;
        icon: string;
    };
    replies: Reply[];
}

export default function PostPage() {
    const params = useParams();
    const postId = params.postId as string;

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [isAnonymousReply, setIsAnonymousReply] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchPost = () => {
        fetch(`/api/forums/posts/${postId}`)
            .then(res => res.json())
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading post:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!replyContent.trim()) {
            alert('Por favor escribe una respuesta');
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`/api/forums/posts/${postId}/replies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: replyContent,
                    isAnonymous: isAnonymousReply
                })
            });

            if (res.ok) {
                setReplyContent('');
                setIsAnonymousReply(false);
                fetchPost(); // Refresh to show new reply
            } else {
                alert('Error al enviar respuesta');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar respuesta');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    if (!post) {
        return (
            <div className="container-fluid py-4">
                <p className="text-muted">Publicación no encontrada</p>
                <Link href="/dashboard/forums" className="btn btn-primary">
                    Volver a Comunidad
                </Link>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <Link href={`/dashboard/forums/${(post as any).categoryId}`} className="btn btn-light mb-4">
                <ArrowLeft size={20} className="me-2" />
                Volver a {post.category.icon} {post.category.name}
            </Link>

            {/* Original Post */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h2 className="fw-bold text-dark mb-0">{post.title}</h2>
                        {(post as any).isOwner && (
                            <button
                                onClick={async () => {
                                    if (!confirm("¿Estás seguro de eliminar esta publicación?")) return;
                                    try {
                                        const res = await fetch(`/api/forums/posts/${post.id}`, { method: 'DELETE' });
                                        if (res.ok) {
                                            alert("Publicación eliminada");
                                            window.location.href = '/dashboard/forums';
                                        } else {
                                            alert("Error al eliminar");
                                        }
                                    } catch (e) {
                                        alert("Error al eliminar");
                                    }
                                }}
                                className="btn btn-outline-danger btn-sm rounded-pill"
                            >
                                <Trash2 size={16} className="me-2" />
                                Eliminar
                            </button>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-3 text-muted small mb-3">
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
                    </div>

                    <div className="border-top pt-3">
                        <p className="text-dark mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                            {post.content}
                        </p>
                    </div>
                </div>
            </div>

            {/* Replies Section */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">Respuestas ({post.replies.length})</h5>

                    {post.replies.map(reply => (
                        <div key={reply.id} className="border-start border-primary border-3 ps-3 mb-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center gap-3 text-muted small">
                                    <div className="d-flex align-items-center gap-1">
                                        {reply.isAnonymous ? (
                                            <>
                                                <UserIcon size={14} />
                                                <span>Anónimo</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserIcon size={14} />
                                                <span>{reply.user?.name || 'Usuario'}</span>
                                                {reply.user?.isCounselor && (
                                                    <span className="badge bg-success-subtle text-success ms-1">
                                                        <Shield size={10} className="me-1" />
                                                        Consejero
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center gap-1">
                                        <Clock size={14} />
                                        <span>{formatDate(reply.createdAt)}</span>
                                    </div>
                                </div>
                                {(reply as any).isOwner && (
                                    <button
                                        onClick={async () => {
                                            if (!confirm("¿Eliminar esta respuesta?")) return;
                                            try {
                                                const res = await fetch(`/api/forums/replies/${reply.id}`, { method: 'DELETE' });
                                                if (res.ok) {
                                                    fetchPost(); // Refresh
                                                } else {
                                                    alert("Error al eliminar");
                                                }
                                            } catch (e) {
                                                alert("Error al eliminar");
                                            }
                                        }}
                                        className="btn btn-link text-danger p-0 border-0"
                                        title="Eliminar respuesta"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            <p className="text-dark mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                {reply.content}
                            </p>
                        </div>
                    ))}

                    {post.replies.length === 0 && (
                        <p className="text-muted text-center py-3">
                            No hay respuestas aún. ¡Sé el primero en responder!
                        </p>
                    )}
                </div>
            </div>

            {/* Reply Form */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Tu Respuesta</h5>
                    <form onSubmit={handleReplySubmit}>
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                rows={4}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Comparte tu consejo, experiencia o apoyo..."
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="anonymousReplyCheck"
                                    checked={isAnonymousReply}
                                    onChange={(e) => setIsAnonymousReply(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="anonymousReplyCheck">
                                    Responder de forma anónima
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send size={20} className="me-2" />
                                    Enviar Respuesta
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

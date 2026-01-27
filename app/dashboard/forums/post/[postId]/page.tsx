"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Shield, User as UserIcon, Send, Trash2 } from 'lucide-react';
import { useLanguage } from '@/app/LanguageContext';

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
    const { t, language } = useLanguage();
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
            alert(t.forums.form_reply_validation);
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
                alert(t.forums.post_error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(t.forums.post_error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const localeMap: Record<string, string> = {
            'es': 'es-ES',
            'en': 'en-US',
            'pt': 'pt-BR'
        };
        return date.toLocaleString(localeMap[language] || 'es-ES', {
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
                        <span className="visually-hidden">{t.forums.loading}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container-fluid py-4">
                <p className="text-muted">{t.forums.not_found}</p>
                <Link href="/dashboard/forums" className="btn btn-primary">
                    {t.forums.back_to_community}
                </Link>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <Link href={`/dashboard/forums/${(post as any).categoryId}`} className="btn btn-light mb-4 text-decoration-none">
                <ArrowLeft size={20} className="me-2" />
                {t.forums.back_to_community} | {post.category.icon} {post.category.name}
            </Link>

            {/* Original Post */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h2 className="fw-bold text-dark mb-0">{post.title}</h2>
                        {(post as any).isOwner && (
                            <button
                                onClick={async () => {
                                    if (!confirm(t.forums.delete_post_confirm)) return;
                                    try {
                                        const res = await fetch(`/api/forums/posts/${post.id}`, { method: 'DELETE' });
                                        if (res.ok) {
                                            alert(t.forums.delete_success);
                                            window.location.href = '/dashboard/forums';
                                        } else {
                                            alert(t.forums.delete_error);
                                        }
                                    } catch (e) {
                                        alert(t.forums.delete_error);
                                    }
                                }}
                                className="btn btn-outline-danger btn-sm rounded-pill"
                            >
                                <Trash2 size={16} className="me-2" />
                                {t.forums.delete_button}
                            </button>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                        <div className="d-flex align-items-center gap-1">
                            {post.isAnonymous ? (
                                <>
                                    <UserIcon size={16} />
                                    <span>{t.forums.anonymous}</span>
                                </>
                            ) : (
                                <>
                                    <UserIcon size={16} />
                                    <span>{post.user?.name || t.forums.user_fallback}</span>
                                    {post.user?.isCounselor && (
                                        <span className="badge bg-success-subtle text-success ms-1">
                                            <Shield size={12} className="me-1" />
                                            {t.forums.counselor_badge}
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
                    <h5 className="fw-bold mb-4">{t.forums.replies_count.replace('{count}', post.replies.length.toString())}</h5>

                    {post.replies.map(reply => (
                        <div key={reply.id} className="border-start border-primary border-3 ps-3 mb-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center gap-3 text-muted small">
                                    <div className="d-flex align-items-center gap-1">
                                        {reply.isAnonymous ? (
                                            <>
                                                <UserIcon size={14} />
                                                <span>{t.forums.anonymous}</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserIcon size={14} />
                                                <span>{reply.user?.name || t.forums.user_fallback}</span>
                                                {reply.user?.isCounselor && (
                                                    <span className="badge bg-success-subtle text-success ms-1">
                                                        <Shield size={10} className="me-1" />
                                                        {t.forums.counselor_badge}
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
                                            if (!confirm(t.forums.delete_reply_confirm)) return;
                                            try {
                                                const res = await fetch(`/api/forums/replies/${reply.id}`, { method: 'DELETE' });
                                                if (res.ok) {
                                                    fetchPost(); // Refresh
                                                } else {
                                                    alert(t.forums.delete_error);
                                                }
                                            } catch (e) {
                                                alert(t.forums.delete_error);
                                            }
                                        }}
                                        className="btn btn-link text-danger p-0 border-0"
                                        title={t.forums.delete_button}
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
                            {t.forums.no_posts}
                        </p>
                    )}
                </div>
            </div>

            {/* Reply Form */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">{t.forums.your_reply}</h5>
                    <form onSubmit={handleReplySubmit}>
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                rows={4}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={t.forums.reply_placeholder}
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
                                    {t.forums.reply_anonymous}
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
                                    {t.forums.sending}
                                </>
                            ) : (
                                <>
                                    <Send size={20} className="me-2" />
                                    {t.forums.send_reply}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

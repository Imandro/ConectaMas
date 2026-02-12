"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Eye, Calendar, Share2, BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ArticleCard from '@/app/components/ArticleCard';

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    category: string;
    tags?: string;
    author: string;
    readTime: number;
    views: number;
    publishedAt: string;
}

export default function ArticlePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    const fetchArticle = async () => {
        try {
            const res = await fetch(`/api/articles/${slug}`);
            if (!res.ok) {
                router.push('/dashboard/articles');
                return;
            }

            const data = await res.json();
            setArticle(data.article);
            setRelatedArticles(data.relatedArticles || []);

            // Mark as read after 10 seconds
            setTimeout(() => {
                markAsRead();
            }, 10000);
        } catch (error) {
            console.error('Error fetching article:', error);
            router.push('/dashboard/articles');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async () => {
        try {
            await fetch(`/api/articles/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress: 100, completed: true }),
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleShare = async () => {
        if (navigator.share && article) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!article) {
        return null;
    }

    const tags = article.tags ? article.tags.split(',').map(t => t.trim()) : [];

    return (
        <div className="animate-fade-in pb-5">
            {/* Back Button */}
            <Link
                href="/dashboard/articles"
                className="btn btn-light rounded-pill mb-4 d-inline-flex align-items-center gap-2"
            >
                <ArrowLeft size={18} />
                Volver a Artículos
            </Link>

            {/* Article Header */}
            <article>
                {/* Category Badge */}
                <div className="mb-3">
                    <span className="badge bg-primary px-4 py-2 rounded-pill fs-6">
                        {article.category}
                    </span>
                </div>

                {/* Title */}
                <h1 className="fw-extrabold text-dark mb-3" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
                    {article.title}
                </h1>

                {/* Meta Info */}
                <div className="d-flex flex-wrap align-items-center gap-3 mb-4 text-muted">
                    <div className="d-flex align-items-center gap-2">
                        <div className="bg-warning-subtle text-warning rounded-circle p-2">
                            <BookOpen size={16} />
                        </div>
                        <span className="fw-bold">{article.author}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                        <Clock size={16} />
                        <span>{article.readTime} min de lectura</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                        <Eye size={16} />
                        <span>{article.views} vistas</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                        <Calendar size={16} />
                        <span>
                            {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                </div>

                {/* Cover Image */}
                {article.coverImage && (
                    <div className="mb-4 rounded-4 overflow-hidden shadow">
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-100"
                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                        />
                    </div>
                )}

                {/* Share Button */}
                <div className="mb-4">
                    <button
                        onClick={handleShare}
                        className="btn btn-outline-primary rounded-pill px-4"
                    >
                        <Share2 size={18} className="me-2" />
                        Compartir artículo
                    </button>
                </div>

                {/* Article Content */}
                <div
                    className="card border-0 shadow-sm bg-white p-4 p-md-5 mb-5"
                    style={{ borderRadius: '24px' }}
                >
                    <div
                        className="article-content"
                        style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            color: '#2d3748',
                        }}
                    >
                        {/* Render markdown content as HTML */}
                        <div dangerouslySetInnerHTML={{ __html: formatContent(article.content) }} />
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="mt-5 pt-4 border-top">
                            <h6 className="text-muted small fw-bold mb-3">ETIQUETAS</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="badge bg-light text-dark px-3 py-2 rounded-pill"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="mt-5">
                    <h3 className="fw-bold text-dark mb-4">📖 Artículos Relacionados</h3>
                    <div className="row g-3">
                        {relatedArticles.map((relatedArticle) => (
                            <div key={relatedArticle.id} className="col-12 col-md-4">
                                <ArticleCard article={relatedArticle} />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

// Simple markdown-like formatting
function formatContent(content: string): string {
    return content
        .split('\n\n')
        .map((paragraph) => {
            // Headers
            if (paragraph.startsWith('### ')) {
                return `<h3 class="fw-bold mt-4 mb-3">${paragraph.replace('### ', '')}</h3>`;
            }
            if (paragraph.startsWith('## ')) {
                return `<h2 class="fw-bold mt-5 mb-3">${paragraph.replace('## ', '')}</h2>`;
            }
            // Bold
            paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Italic
            paragraph = paragraph.replace(/\*(.*?)\*/g, '<em>$1</em>');
            // Lists
            if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').map(item =>
                    `<li>${item.replace('- ', '')}</li>`
                ).join('');
                return `<ul class="mb-3">${items}</ul>`;
            }
            // Regular paragraph
            return `<p class="mb-3">${paragraph}</p>`;
        })
        .join('');
}

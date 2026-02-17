import Link from 'next/link';
import { Calendar, Clock, Eye } from 'lucide-react';

interface ArticleCardProps {
    article: {
        slug: string;
        title: string;
        excerpt: string;
        coverImage?: string;
        category: string;
        author: string;
        readTime: number;
        views: number;
        publishedAt: string;
        isFeatured?: boolean;
    };
    featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
    const categoryColors: Record<string, string> = {
        'Vida Cristiana': 'bg-primary text-white',
        'Relaciones': 'bg-danger text-white',
        'Salud Mental': 'bg-success text-white',
        'Propósito y Llamado': 'bg-warning text-dark',
        'Superación de Luchas': 'bg-info text-white',
    };

    const categoryColor = categoryColors[article.category] || 'bg-secondary text-white';

    return (
        <Link
            href={`/dashboard/articles/${article.slug}`}
            className="text-decoration-none"
        >
            <div
                className={`card border-0 shadow-sm h-100 hover-scale transition-all overflow-hidden ${featured ? 'bg-gradient' : 'bg-white'
                    }`}
                style={{ borderRadius: '24px' }}
            >
                {article.coverImage && (
                    <div
                        className="position-relative"
                        style={{
                            height: featured ? '240px' : '180px',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-100 h-100 object-fit-cover"
                            style={{ objectFit: 'cover' }}
                        />
                        {article.isFeatured && (
                            <div className="position-absolute top-0 end-0 m-3">
                                <span className="badge bg-warning text-dark px-3 py-2 fw-bold">
                                    ⭐ Destacado
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span className={`badge ${categoryColor} px-3 py-1 rounded-pill`}>
                            {article.category}
                        </span>
                    </div>

                    <h5
                        className={`fw-bold mb-2 ${featured ? 'fs-4' : 'fs-5'
                            } text-dark`}
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {article.title}
                    </h5>

                    <p
                        className="text-muted mb-3"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: featured ? 3 : 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: '0.9rem',
                        }}
                    >
                        {article.excerpt}
                    </p>

                    <div className="d-flex align-items-center justify-content-between text-muted small">
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-1">
                                <Clock size={14} />
                                <span>{article.readTime} min</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <Calendar size={14} />
                            <span>
                                {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

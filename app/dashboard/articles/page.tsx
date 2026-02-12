"use client";

import { useEffect, useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import ArticleCard from '@/app/components/ArticleCard';
import { useLanguage } from '@/app/LanguageContext';

interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    category: string;
    author: string;
    readTime: number;
    views: number;
    publishedAt: string;
    isFeatured: boolean;
}

export default function ArticlesPage() {
    const { t } = useLanguage();
    const [articles, setArticles] = useState<Article[]>([]);
    const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        'Todos',
        'Vida Cristiana',
        'Relaciones',
        'Salud Mental',
        'Propósito y Llamado',
        'Superación de Luchas',
    ];

    useEffect(() => {
        fetchArticles();
    }, [selectedCategory]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory && selectedCategory !== 'Todos') {
                params.append('category', selectedCategory);
            }

            const [articlesRes, featuredRes] = await Promise.all([
                fetch(`/api/articles?${params.toString()}`),
                fetch('/api/articles?featured=true&limit=3'),
            ]);

            const articlesData = await articlesRes.json();
            const featuredData = await featuredRes.json();

            setArticles(articlesData.articles || []);
            setFeaturedArticles(featuredData.articles || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredArticles = articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <header className="mb-4">
                <h1 className="fw-extrabold text-dark mb-2" style={{ fontSize: '2.5rem' }}>
                    📚 Artículos
                </h1>
                <p className="text-muted fs-5">
                    Contenido educativo para fortalecer tu fe y crecimiento personal
                </p>
            </header>

            {/* Search Bar */}
            <div className="card border-0 shadow-sm mb-4 bg-white" style={{ borderRadius: '20px' }}>
                <div className="card-body p-3">
                    <div className="input-group">
                        <span className="input-group-text bg-transparent border-0">
                            <Search size={20} className="text-muted" />
                        </span>
                        <input
                            type="text"
                            className="form-control border-0 bg-transparent"
                            placeholder="Buscar artículos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                    <Filter size={18} className="text-muted" />
                    <span className="fw-bold text-secondary">Categorías</span>
                </div>
                <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category === 'Todos' ? '' : category)}
                            className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap ${(category === 'Todos' && !selectedCategory) ||
                                    selectedCategory === category
                                    ? 'btn-primary'
                                    : 'btn-light text-dark'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            ) : (
                <>
                    {/* Featured Articles */}
                    {!selectedCategory && featuredArticles.length > 0 && (
                        <section className="mb-5">
                            <h3 className="fw-bold text-dark mb-3">⭐ Artículos Destacados</h3>
                            <div className="row g-3">
                                {featuredArticles.map((article) => (
                                    <div key={article.id} className="col-12">
                                        <ArticleCard article={article} featured />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* All Articles */}
                    <section>
                        <h3 className="fw-bold text-dark mb-3">
                            {selectedCategory ? `${selectedCategory}` : 'Todos los Artículos'}
                        </h3>
                        {filteredArticles.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="text-muted">No se encontraron artículos</p>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {filteredArticles.map((article) => (
                                    <div key={article.id} className="col-12 col-md-6">
                                        <ArticleCard article={article} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

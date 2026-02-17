"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, X, Star } from 'lucide-react';

interface FeaturedArticleModalProps {
    article: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function FeaturedArticleModal({ article, isOpen, onClose }: FeaturedArticleModalProps) {
    if (!isOpen || !article) return null;

    return (
        <div className="fixed inset-0 z-[1060] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-white rounded-[32px] shadow-2xl overflow-hidden w-full max-w-lg border-0 animate-scale-in"
                style={{ maxHeight: '90vh' }}
            >
                {/* Header with Close */}
                <div className="relative">
                    {article.coverImage && (
                        <div style={{ height: '220px', overflow: 'hidden' }}>
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-100 h-100 object-fit-cover transition-transform duration-700 hover:scale-105"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/80 backdrop-blur-md hover:bg-white text-dark rounded-full p-2 transition-all shadow-lg"
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>

                    <div className="absolute bottom-4 left-4 d-flex gap-2">
                        <span className="badge bg-warning text-dark px-3 py-1 rounded-pill d-flex align-items-center gap-1 shadow-sm">
                            <Star size={12} fill="currentColor" /> Artículo Destacado
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 pt-5">
                    <div className="mb-3">
                        <span className="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill fw-bold">
                            {article.category}
                        </span>
                    </div>

                    <h3 className="fw-black text-dark mb-3" style={{ fontSize: '1.75rem', lineHeight: '1.2' }}>
                        {article.title}
                    </h3>

                    <p className="text-muted mb-4 fs-6 lh-base">
                        {article.excerpt}
                    </p>

                    <div className="d-flex align-items-center justify-content-center mb-4 text-muted small fw-medium bg-light p-3 rounded-4">
                        <div className="d-flex align-items-center gap-2">
                            <BookOpen size={16} className="text-primary" />
                            <span>{article.readTime} min de lectura</span>
                        </div>
                    </div>

                    <div className="d-grid gap-2">
                        <Link
                            href={`/dashboard/articles/${article.slug}`}
                            onClick={onClose}
                            className="btn btn-primary rounded-pill py-3 fw-bold fs-5 shadow-lg hover-scale"
                        >
                            Leer ahora →
                        </Link>
                        <button
                            onClick={onClose}
                            className="btn btn-link text-muted text-decoration-none fw-bold pt-2"
                        >
                            Quizás más tarde
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

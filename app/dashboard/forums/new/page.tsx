"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    icon: string;
}

export default function NewPostPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedCategory = searchParams.get('category');

    const [categories, setCategories] = useState<Category[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState(preselectedCategory || '');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/forums/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Error loading categories:', err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim() || !categoryId) {
            alert('Por favor completa todos los campos');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/forums/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    categoryId,
                    isAnonymous
                })
            });

            if (res.ok) {
                const post = await res.json();
                router.push(`/dashboard/forums/post/${post.id}`);
            } else {
                alert('Error al crear la publicación');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear la publicación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <Link href="/dashboard/forums" className="btn btn-light mb-4">
                <ArrowLeft size={20} className="me-2" />
                Volver a Comunidad
            </Link>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <h2 className="fw-bold text-secondary mb-4">Nueva Publicación</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Categoría</label>
                            <select
                                className="form-select"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Título</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="¿De qué quieres hablar?"
                                maxLength={200}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Contenido</label>
                            <textarea
                                className="form-control"
                                rows={8}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Comparte tu historia, pregunta o consejo..."
                                required
                            />
                            <small className="text-muted">
                                Puedes incluir links para compartir recursos útiles
                            </small>
                        </div>

                        <div className="mb-4">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="anonymousCheck"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="anonymousCheck">
                                    Publicar de forma anónima
                                </label>
                            </div>
                            <small className="text-muted">
                                Tu identidad permanecerá oculta para otros usuarios
                            </small>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Publicando...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} className="me-2" />
                                        Publicar
                                    </>
                                )}
                            </button>
                            <Link href="/dashboard/forums" className="btn btn-outline-secondary">
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

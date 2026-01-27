"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { useLanguage } from "@/app/LanguageContext";

interface Category {
    id: string;
    name: string;
    icon: string;
}

export default function NewPostPage() {
    const { t } = useLanguage();
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
            alert(t.forums.form_validation);
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
                alert(t.forums.post_error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(t.forums.post_error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <Link href="/dashboard/forums" className="btn btn-light mb-4">
                <ArrowLeft size={20} className="me-2" />
                {t.forums.back_to_community}
            </Link>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <h2 className="fw-bold text-secondary mb-4">{t.forums.new_post}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">{t.forums.form_category}</label>
                            <select
                                className="form-select"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">{t.forums.form_category_select}</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">{t.forums.form_title}</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t.forums.form_title_placeholder}
                                maxLength={200}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">{t.forums.form_content}</label>
                            <textarea
                                className="form-control"
                                rows={8}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={t.forums.form_content_placeholder}
                                required
                            />
                            <small className="text-muted">
                                {t.forums.form_helper}
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
                                    {t.forums.form_anonymous}
                                </label>
                            </div>
                            <small className="text-muted">
                                {t.forums.form_anonymous_helper}
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
                                        {t.forums.form_publishing}
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} className="me-2" />
                                        {t.forums.form_publish}
                                    </>
                                )}
                            </button>
                            <Link href="/dashboard/forums" className="btn btn-outline-secondary text-decoration-none">
                                {t.forums.form_cancel}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

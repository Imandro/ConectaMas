"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLanguage } from "@/app/LanguageContext";
import { getGuestStats } from '@/app/lib/guest';
import { SUPPORTED_COUNTRY_OPTIONS } from '@/app/lib/legal/policy';

export default function RegisterPage() {
    const { t, language } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const gs = getGuestStats();
        if (gs.streak > 0 || gs.mascot.experience > 0 || gs.mascot.level > 1) {
            setFormData(prev => ({ ...prev, name: gs.name !== 'Invitado' ? gs.name : prev.name }));
        }
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        securityAnswer: '',
        age: '',
        country: '',
        termsAccepted: false,
        privacyAccepted: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.id]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!navigator.onLine) {
            setError(t.auth.offline_register);
            return;
        }
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, locale: language === 'en' || language === 'pt' ? language : 'es' }),
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMessage = data.details ? `${data.message}: ${data.details}` : (data.message || 'Error al registrarte');
                throw new Error(errorMessage);
            }

            // Auto-login after registration
            const loginRes = await signIn('credentials', {
                identifier: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (loginRes?.error) {
                // Fallback if auto-login fails
                window.location.href = '/auth/login?registered=true';
            } else {
                window.location.href = '/onboarding';
            }

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al registrarte');
            setLoading(false);
        }
    };

    return (
        <div className="ui-surface p-4 animate-fade-in-up">
            <div className="text-center mb-4">
                <Link href="/" className="d-inline-block mb-3">
                    <div className="position-relative" style={{ width: '120px', height: '50px', margin: '0 auto' }}>
                        <img
                            src="/logo.png"
                            alt={t.auth.logo_alt}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </div>
                </Link>
                <h3 className="fw-bold text-secondary">{t.auth.register_title}</h3>
                <p className="text-muted small">{t.auth.register_subtitle}</p>
            </div>

            {error && (
                <div className="alert alert-danger small p-2 text-center" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label small fw-bold text-primary ps-2">{t.auth.full_name}</label>
                    <input
                        type="text"
                        className="form-control form-control-lg bg-light border-0"
                        id="name"
                        placeholder={t.auth.full_name_placeholder}
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="username" className="form-label small fw-bold text-primary ps-2">{t.auth.username}</label>
                    <input
                        type="text"
                        className="form-control form-control-lg bg-light border-0"
                        id="username"
                        placeholder={t.auth.username_placeholder}
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label small fw-bold text-primary ps-2">{t.auth.email_user}</label>
                    <input
                        type="email"
                        className="form-control form-control-lg bg-light border-0"
                        id="email"
                        placeholder={t.auth.placeholder_email}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="form-label small fw-bold text-primary ps-2">{t.auth.password}</label>
                    <div className="position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control form-control-lg bg-light border-0 pe-5"
                            id="password"
                            placeholder={t.auth.password_hint}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? t.auth.hide_password : t.auth.show_password}
                            style={{ zIndex: 10 }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="securityAnswer" className="form-label small fw-bold text-primary ps-2">{t.auth.security_question}</label>
                    <p className="small text-muted mb-1">{t.auth.security_question_text}</p>
                    <input
                        type="text"
                        className="form-control form-control-lg bg-light border-0"
                        id="securityAnswer"
                        placeholder={t.auth.security_answer_placeholder}
                        value={formData.securityAnswer}
                        onChange={handleChange}
                        required
                    />

                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {t.auth.security_answer_hint}
                    </small>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-5">
                        <label htmlFor="age" className="form-label small fw-bold text-primary ps-2">{t.onboarding.age_title}</label>
                        <input type="number" min="13" max="120" className="form-control form-control-lg bg-light border-0" id="age" value={formData.age} onChange={handleChange} required />
                    </div>
                    <div className="col-7">
                        <label htmlFor="country" className="form-label small fw-bold text-primary ps-2">{t.profile.country_label}</label>
                        <select id="country" className="form-select form-select-lg bg-light border-0" value={formData.country} onChange={handleChange} required>
                            <option value="">{t.language_region_modal.select_prompt}</option>
                            {SUPPORTED_COUNTRY_OPTIONS.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mb-4 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        required
                    />
                    <label className="form-check-label small text-muted" htmlFor="termsAccepted">
                        {t.auth.terms_text} <Link href="/legal/terms" target="_blank" className="text-primary fw-bold text-decoration-none">{t.auth.terms_link}</Link>.
                    </label>
                </div>

                <div className="mb-4 form-check">
                    <input type="checkbox" className="form-check-input" id="privacyAccepted" checked={formData.privacyAccepted} onChange={handleChange} required />
                    <label className="form-check-label small text-muted" htmlFor="privacyAccepted">
                        {t.auth.terms_text} <Link href="/legal/privacy" target="_blank" className="text-primary fw-bold text-decoration-none">{t.auth.privacy_link}</Link> y las reglas de comunidad.
                    </label>
                </div>

                <div className="d-grid mb-3">
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg text-white shadow-sm fw-bold rounded-pill"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin me-2" size={20} />
                                {t.auth.creating_account}
                            </>
                        ) : t.auth.create_account}
                    </button>
                </div>

                <p className="small text-muted text-center mb-3 text-balance">
                    {t.auth.respect_disclaimer}
                </p>

                <div className="text-center border-top pt-3">
                    <p className="small text-muted mb-0">
                        {t.auth.already_have_account} <Link href="/auth/login" className="text-primary fw-bold text-decoration-none">{t.auth.login_link_text}</Link>
                    </p>
                </div>
            </form >
        </div >
    );
}

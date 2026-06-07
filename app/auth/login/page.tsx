"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { useLanguage } from "@/app/LanguageContext";

export default function LoginPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccessMessage(t.auth.account_created);
        }

        // EMERGENCY COOKIE CLEANUP
        // If the user lands here, we assume they might be having issues. 
        // We clear legacy giant cookies to fix 494 errors.
        const cookies = document.cookie.split(";");
        let cleaned = false;

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

            // Identify massive cookies or legacy ones
            if (name.includes('next-auth') || name.length > 50) {
                // Nuke it with various domains/paths to be sure
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + window.location.hostname;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=." + window.location.hostname;
                cleaned = true;
            }
        }

        if (cleaned) {
            console.log("Cleaned cookies to prevent 494 error.");
        }
    }, [searchParams, t]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                identifier: formData.identifier,
                password: formData.password,
                redirect: false,
            });

            if (res?.error) {
                setError(t.auth.invalid_credentials);
            } else {
                // Force a hard navigation to ensure clean state and avoid caching issues
                // router.push('/dashboard'); 
                // router.refresh();
                window.location.href = '/dashboard';
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(t.auth.login_error);
            setLoading(false);
        }
        // Don't set loading to false here if successful, because we are navigating away
        // and we want to keep the button disabled/spinning until the page unloads.
        if (error) setLoading(false);
    };

    return (
        <div className="position-relative">
            {loading && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white"
                    style={{ zIndex: 9999, opacity: 0.8 }}
                >
                    <div className="text-center">
                        <Loader2 className="animate-spin text-primary mb-3" size={48} />
                        <h5 className="text-secondary fw-bold">{t.auth.logging_in || 'Iniciando sesión...'}</h5>
                    </div>
                </div>
            )}

            <div className="card shadow-sm border-0 p-4 animate-fade-in-up">
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
                    <h3 className="fw-bold text-secondary">{t.auth.welcome_back}</h3>
                    <p className="text-muted small">{t.auth.login_subtitle}</p>
                </div>

                {successMessage && (
                    <div className="alert alert-success small p-2 text-center" role="alert">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger small p-2 text-center" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="identifier" className="form-label small fw-bold text-primary ps-2">{t.auth.email_user}</label>
                        <input
                            type="text"
                            className="form-control form-control-lg bg-light border-0"
                            id="identifier"
                            placeholder={t.auth.placeholder_email}
                            value={formData.identifier}
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
                                placeholder={t.auth.placeholder_password}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ zIndex: 10 }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="text-end mb-4">
                        <Link href="/auth/forgot-password" className="small text-muted text-decoration-none">
                            {t.auth.forgot_password}
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 text-white shadow-sm mb-3 hover-scale rounded-pill fw-bold"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : t.auth.login_button}
                    </button>

                    <div className="text-center border-top pt-3">
                        <p className="small text-muted mb-2">
                            {t.auth.no_account} <Link href="/auth/register" className="text-primary fw-bold text-decoration-none">{t.auth.register_link}</Link>
                        </p>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <hr className="flex-grow-1 m-0" />
                            <span className="text-muted small">o</span>
                            <hr className="flex-grow-1 m-0" />
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                document.cookie = "conectaplus_guest=true; path=/; max-age=86400";
                                window.location.href = '/dashboard';
                            }}
                            className="btn btn-outline-secondary btn-sm rounded-pill w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                            Continuar como invitado
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (confirm("¿Tienes problemas para entrar? Esto limpiará los datos de conexión y reiniciará la app. ¿Continuar?")) {
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    document.cookie.split(";").forEach((c) => {
                                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                                    });
                                    window.location.reload();
                                }
                            }}
                            className="btn btn-link text-warning extra-small text-decoration-none"
                            style={{ fontSize: '0.7rem' }}
                        >
                            ¿Problemas técnicos? Limpiar conexión (Reset)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

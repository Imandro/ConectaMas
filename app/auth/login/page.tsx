"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { useLanguage } from '../../LanguageContext';

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
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err) {
            setError(t.auth.login_error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 p-4 animate-fade-in-up">
            <div className="text-center mb-4">
                <Link href="/" className="d-inline-block mb-3">
                    <div className="position-relative" style={{ width: '120px', height: '50px', margin: '0 auto' }}>
                        <Image
                            src="/logo.png"
                            alt={t.auth.logo_alt}
                            fill
                            style={{ objectFit: 'contain' }}
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
                    <p className="small text-muted mb-0">
                        {t.auth.no_account} <Link href="/auth/register" className="text-primary fw-bold text-decoration-none">{t.auth.register_link}</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

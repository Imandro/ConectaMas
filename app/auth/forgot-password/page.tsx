"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { checkUserStatus, resetPasswordWithSecurityAnswer } from './actions';
import { useLanguage } from "@/app/LanguageContext";

export default function ForgotPasswordPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState<'EMAIL' | 'SECURITY' | 'NEW_PASSWORD' | 'SUCCESS'>('EMAIL');
    const [email, setEmail] = useState('');
    const [answer, setAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const status = await checkUserStatus(email);
            if (!status.exists) {
                setError(t.auth.email_not_found);
            } else if (!status.hasSecurityAnswer) {
                setError(t.auth.no_security_answer);
            } else {
                setStep('SECURITY');
            }
        } catch (err) {
            setError(t.auth.check_email_error);
        } finally {
            setLoading(false);
        }
    };

    const handleSecuritySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStep('NEW_PASSWORD'); // Optimistically move to password input, validation happens on final submit to verify both
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await resetPasswordWithSecurityAnswer(email, answer, newPassword);
            setStep('SUCCESS');
        } catch (err: any) {
            setError(err.message || t.auth.error_reset);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 p-4 animate-fade-in-up">
            <div className="text-center mb-4">
                <Link href="/auth/login" className="d-inline-block small text-muted text-decoration-none mb-3">
                    <ArrowLeft size={16} className="me-1" /> {t.common.back}
                </Link>
                <div className="position-relative" style={{ width: '100px', height: '40px', margin: '0 auto 1rem' }}>
                    <Image
                        src="/logo.png"
                        alt="Conecta+ BETA Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                <h3 className="fw-bold text-secondary">{t.auth.forgot_password_title}</h3>
            </div>

            {step === 'EMAIL' && (
                <form onSubmit={handleEmailSubmit}>
                    <p className="text-muted small text-center mb-4">
                        {t.auth.forgot_password_subtitle}
                    </p>
                    {error && <div className="alert alert-danger small p-2 text-center">{error}</div>}
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-primary ps-2">{t.auth.email_user}</label>
                        <input
                            type="email"
                            className="form-control form-control-lg bg-light border-0"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder={t.auth.placeholder_email}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold py-2 pb-2" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : t.common.continue}
                    </button>
                </form>
            )}

            {step === 'SECURITY' && (
                <form onSubmit={handleSecuritySubmit}>
                    <div className="text-center mb-4">
                        <div className="mx-auto bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                            <Shield className="text-warning" size={30} />
                        </div>
                        <h5 className="fw-bold">{t.auth.security_question}</h5>
                        <p className="text-muted small">{t.auth.new_password_subtitle}</p>
                        <p className="fw-bold text-primary p-3 bg-light rounded-3 border">
                            "{t.auth.security_question_text}"
                        </p>
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control form-control-lg bg-light border-0 text-center fw-bold"
                            placeholder={t.auth.security_answer_placeholder}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold" disabled={!answer}>
                        {t.auth.verify_answer}
                    </button>
                </form>
            )}

            {step === 'NEW_PASSWORD' && (
                <form onSubmit={handleFinalSubmit}>
                    <div className="text-center mb-4">
                        <h5 className="fw-bold">{t.auth.new_password_title}</h5>
                        <p className="text-muted small">{t.auth.new_password_subtitle}</p>
                    </div>
                    {error && <div className="alert alert-danger small p-2 text-center">{error}</div>}

                    {/* Re-enter answer just to keep it in state context visually or hidden? 
                        Actually we have it in state 'answer'. We just need to submit it.
                    */}

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-primary ps-2">{t.auth.security_answer}</label>
                        <input type="text" className="form-control bg-light border-0" value={answer} disabled />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-primary ps-2">{t.auth.password}</label>
                        <div className="position-relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control form-control-lg bg-light border-0 pe-5"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder={t.auth.password_hint}
                            />
                            <button
                                type="button"
                                className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : t.auth.reset_password_button}
                    </button>
                </form>
            )}

            {step === 'SUCCESS' && (
                <div className="text-center animate-fade-in">
                    <div className="mb-3 text-success">
                        <CheckCircle size={48} />
                    </div>
                    <h5 className="fw-bold mb-3">{t.auth.password_reset_success_title}</h5>
                    <p className="text-muted small mb-4">
                        {t.auth.password_reset_success_msg}
                    </p>
                    <Link href="/auth/login" className="btn btn-primary w-100 rounded-pill">
                        {t.auth.login_button}
                    </Link>
                </div>
            )}

        </div>
    );
}

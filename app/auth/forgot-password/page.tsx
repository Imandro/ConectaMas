"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { checkUserStatus, resetPasswordWithSecurityAnswer } from './actions';

export default function ForgotPasswordPage() {
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
                setError('No encontramos ninguna cuenta con este correo.');
            } else if (!status.hasSecurityAnswer) {
                setError('Esta cuenta no tiene configurada una pregunta de seguridad. Contacta a soporte.');
            } else {
                setStep('SECURITY');
            }
        } catch (err) {
            setError('Error al verificar el correo.');
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
            setError(err.message || 'Error al restablecer la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 p-4 animate-fade-in-up">
            <div className="text-center mb-4">
                <Link href="/auth/login" className="d-inline-block small text-muted text-decoration-none mb-3">
                    <ArrowLeft size={16} className="me-1" /> Volver
                </Link>
                <div className="position-relative" style={{ width: '100px', height: '40px', margin: '0 auto 1rem' }}>
                    <Image
                        src="/logo.png"
                        alt="Conecta+ BETA Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                <h3 className="fw-bold text-secondary">Recuperar Cuenta</h3>
            </div>

            {step === 'EMAIL' && (
                <form onSubmit={handleEmailSubmit}>
                    <p className="text-muted small text-center mb-4">
                        Ingresa tu correo para buscar tu cuenta.
                    </p>
                    {error && <div className="alert alert-danger small p-2 text-center">{error}</div>}
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-primary ps-2">Email</label>
                        <input
                            type="email"
                            className="form-control form-control-lg bg-light border-0"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="nombre@ejemplo.com"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold py-2 pb-2" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Continuar'}
                    </button>
                </form>
            )}

            {step === 'SECURITY' && (
                <form onSubmit={handleSecuritySubmit}>
                    <div className="text-center mb-4">
                        <div className="mx-auto bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                            <Shield className="text-warning" size={30} />
                        </div>
                        <h5 className="fw-bold">Pregunta de Seguridad</h5>
                        <p className="text-muted small">Para verificar que eres tú, responde:</p>
                        <p className="fw-bold text-primary p-3 bg-light rounded-3 border">
                            "¿Cómo se llamaba tu primera mascota?"
                        </p>
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control form-control-lg bg-light border-0 text-center fw-bold"
                            placeholder="Tu respuesta aquí"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold" disabled={!answer}>
                        Verificar Respuesta
                    </button>
                </form>
            )}

            {step === 'NEW_PASSWORD' && (
                <form onSubmit={handleFinalSubmit}>
                    <div className="text-center mb-4">
                        <h5 className="fw-bold">Crear Nueva Contraseña</h5>
                        <p className="text-muted small">Ingresa la respuesta y tu nueva clave.</p>
                    </div>
                    {error && <div className="alert alert-danger small p-2 text-center">{error}</div>}

                    {/* Re-enter answer just to keep it in state context visually or hidden? 
                        Actually we have it in state 'answer'. We just need to submit it.
                    */}

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-primary ps-2">Respuesta de Seguridad</label>
                        <input type="text" className="form-control bg-light border-0" value={answer} disabled />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-primary ps-2">Nueva Contraseña</label>
                        <div className="position-relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control form-control-lg bg-light border-0 pe-5"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="Mínimo 6 caracteres"
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
                        {loading ? <Loader2 className="animate-spin" /> : 'Restablecer Contraseña'}
                    </button>
                </form>
            )}

            {step === 'SUCCESS' && (
                <div className="text-center animate-fade-in">
                    <div className="mb-3 text-success">
                        <CheckCircle size={48} />
                    </div>
                    <h5 className="fw-bold mb-3">¡Contraseña Actualizada!</h5>
                    <p className="text-muted small mb-4">
                        Tu contraseña ha sido restablecida exitosamente. Ya puedes acceder a tu cuenta.
                    </p>
                    <Link href="/auth/login" className="btn btn-primary w-100 rounded-pill">
                        Iniciar Sesión
                    </Link>
                </div>
            )}

        </div>
    );
}

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccessMessage('Cuenta creada exitosamente. Por favor, inicia sesión.');
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (res?.error) {
                setError('Credenciales inválidas');
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setError('Ocurrió un error al iniciar sesión');
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
                            alt="Conecta+ Logo"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </Link>
                <h3 className="fw-bold text-secondary">Bienvenido de nuevo</h3>
                <p className="text-muted small">Ingresa para continuar tu camino.</p>
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
                    <label htmlFor="email" className="form-label small fw-bold text-primary ps-2">Email</label>
                    <input
                        type="email"
                        className="form-control form-control-lg bg-light border-0"
                        id="email"
                        placeholder="nombre@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="form-label small fw-bold text-primary ps-2">Contraseña</label>
                    <div className="position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control form-control-lg bg-light border-0 pe-5"
                            id="password"
                            placeholder="Ingrese su contraseña"
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

                <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 text-white shadow-sm mb-3 hover-scale rounded-pill fw-bold"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
                </button>

                <div className="text-center">
                    <p className="small text-muted mb-3">O continúa con</p>
                    <div className="d-grid gap-2 mb-4">
                        <button
                            type="button"
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                            className="btn btn-outline-light border text-primary w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 py-2 hover-bg-light fw-bold"
                        >
                            <img src="https://authjs.dev/img/providers/google.svg" width="20" height="20" alt="Google" />
                            Continuar con Google
                        </button>
                    </div>
                </div>

                <div className="text-center border-top pt-3">
                    <p className="small text-muted mb-0">
                        ¿No tienes cuenta? <Link href="/auth/register" className="text-primary fw-bold text-decoration-none">Regístrate aquí</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMessage = data.details ? `${data.message}: ${data.details}` : (data.message || 'Error al registrarte');
                throw new Error(errorMessage);
            }

            // Auto-login after registration
            const loginRes = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (loginRes?.error) {
                // Fallback if auto-login fails
                window.location.href = '/auth/login?registered=true';
            } else {
                window.location.href = '/dashboard';
            }

        } catch (err: any) {
            setError(err.message);
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
                <h3 className="fw-bold text-secondary">Únete a Conecta+</h3>
                <p className="text-muted small">Tu viaje hacia la libertad comienza hoy.</p>
            </div>

            {error && (
                <div className="alert alert-danger small p-2 text-center" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label small fw-bold text-primary ps-2">Nombre o Apodo</label>
                    <input
                        type="text"
                        className="form-control form-control-lg bg-light border-0"
                        id="name"
                        placeholder="Cómo quieres que te llamemos"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                            placeholder="Mínimo 6 caracteres"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
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

                <div className="d-grid mb-3">
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg text-white shadow-sm fw-bold rounded-pill"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin me-2" size={20} />
                                Creando cuenta...
                            </>
                        ) : 'Crear mi cuenta'}
                    </button>
                </div>

                <p className="small text-muted text-center mb-3 text-balance">
                    Al registrarte, aceptas que este es un espacio seguro y de respeto.
                </p>

                <div className="text-center border-top pt-3">
                    <p className="small text-muted mb-0">
                        ¿Ya tienes cuenta? <Link href="/auth/login" className="text-primary fw-bold text-decoration-none">Inicia sesión</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

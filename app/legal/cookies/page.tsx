"use client";

import Link from "next/link";
import { ChevronLeft, Cookie, Info, ShieldAlert } from "lucide-react";

export default function CookiePolicy() {
    return (
        <div className="min-vh-100 bg-light py-5">
            <div className="container" style={{ maxWidth: '800px' }}>
                <Link href="/" className="btn btn-link text-decoration-none text-muted mb-4 d-flex align-items-center gap-2">
                    <ChevronLeft size={20} />
                    Volver
                </Link>

                <div className="card border-0 shadow-sm p-4 p-md-5" style={{ borderRadius: '24px' }}>
                    <div className="text-center mb-5">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                            <Cookie size={48} className="text-primary" />
                        </div>
                        <h1 className="fw-bold text-secondary">Política de Cookies</h1>
                        <p className="text-muted">En <strong>Conecta+ BETA</strong> utilizamos cookies para mejorar tu experiencia.</p>
                        <p className="text-muted">Última actualización: 26 de diciembre de 2025</p>
                    </div>

                    <div className="content text-secondary lh-lg">
                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Info size={24} className="text-primary" />
                                ¿Qué son las cookies?
                            </h4>
                            <p>
                                Las cookies son pequeños archivos de texto que los sitios web almacenan en tu computadora o dispositivo móvil cuando los visitas. Ayudan a que el sitio funcione correctamente y nos permiten entender cómo interactúas con la app.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <ShieldAlert size={24} className="text-primary" />
                                Tipos de Cookies que utilizamos
                            </h4>
                            <ul>
                                <li className="mb-3">
                                    <strong>Cookies Necesarias:</strong> Esenciales para que puedas iniciar sesión y navegar por las áreas seguras de la app (NextAuth). Sin estas, la app no funcionaría.
                                </li>
                                <li className="mb-3">
                                    <strong>Cookies de Publicidad (Google AdSense):</strong> Estas cookies son utilizadas por Google para mostrar anuncios que sean relevantes para ti. También ayudan a limitar el número de veces que ves un anuncio y a medir la eficacia de las campañas publicitarias.
                                </li>
                                <li className="mb-3">
                                    <strong>Cookies de Rendimiento:</strong> Nos ayudan a saber qué páginas son más populares y cómo se mueven los usuarios por la app (Vercel Analytics).
                                </li>
                            </ul>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Cookie size={24} className="text-primary" />
                                Control de Cookies
                            </h4>
                            <p>
                                Puedes controlar y/o borrar las cookies como desees. Consulta los detalles en <a href="https://aboutcookies.org" target="_blank">aboutcookies.org</a>. Puedes borrar todas las cookies que ya están en tu computadora y configurar la mayoría de los navegadores para que no las acepten.
                            </p>
                        </section>

                        <div className="text-center mt-5 pt-4 border-top">
                            <p className="small text-muted mb-0">
                                Al usar Conecta+, aceptas el uso de cookies según esta política.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

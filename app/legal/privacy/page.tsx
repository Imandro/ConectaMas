"use client";

import Link from "next/link";
import { ChevronLeft, ShieldCheck, Lock, Eye, Cookie } from "lucide-react";

export default function PrivacyPolicy() {
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
                            <ShieldCheck size={48} className="text-primary" />
                        </div>
                        <h1 className="fw-bold text-secondary">Política de Privacidad</h1>
                        <p className="text-muted">Última actualización: 26 de diciembre de 2025</p>
                    </div>

                    <div className="content text-secondary lh-lg">
                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Lock size={24} className="text-primary" />
                                1. Introducción
                            </h4>
                            <p>
                                En <strong>Conecta+</strong>, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe cómo recolectamos, usamos y protegemos tu información personal cuando utilizas nuestra aplicación espiritual.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Eye size={24} className="text-primary" />
                                2. Información que Recolectamos
                            </h4>
                            <ul>
                                <li><strong>Información de Registro:</strong> Nombre, correo electrónico, nombre de usuario y edad.</li>
                                <li><strong>Datos Espirituales:</strong> Respuestas de onboarding, check-ins de salud espiritual y metas de crecimiento (estos datos están aislados y protegidos).</li>
                                <li><strong>Datos de Navegación:</strong> Dirección IP, tipo de dispositivo y datos de uso técnico mediante cookies.</li>
                            </ul>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Cookie size={24} className="text-primary" />
                                3. Cookies y Publicidad (Google AdSense)
                            </h4>
                            <p>
                                Utilizamos cookies técnicas para mantener tu sesión activa (NextAuth) y cookies de terceros de <strong>Google AdSense</strong> para mostrar anuncios en el plan gratuito.
                            </p>
                            <p>
                                Los proveedores de terceros, incluido Google, utilizan cookies para servir anuncios basados en las visitas previas de un usuario a este sitio web o a otros sitios web. El uso de cookies de publicidad por parte de Google permite a Google y a sus socios servir anuncios a los usuarios basados en su visita a sus sitios y/u otros sitios en Internet.
                            </p>
                            <p>
                                Puedes inhabilitar la publicidad personalizada visitando <a href="https://www.google.com/settings/ads" target="_blank">Configuración de anuncios</a>.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <ShieldCheck size={24} className="text-primary" />
                                4. Seguridad de tus Datos
                            </h4>
                            <p>
                                Implementamos medidas de seguridad técnicas (encriptación, hash de contraseñas) para proteger tu información. No vendemos tus datos personales a terceros bajo ninguna circunstancia.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h5 className="fw-bold text-danger">Aviso Importante (Descargo de Responsabilidad)</h5>
                            <p className="small bg-danger bg-opacity-10 p-3 rounded-3 border-start border-4 border-danger">
                                <strong>Conecta+</strong> es una herramienta de acompañamiento espiritual. El contenido y las funciones (incluida la sección SOS) no sustituyen el consejo médico, psicológico o profesional. Si te encuentras en una situación de peligro inminente, por favor contacta a las autoridades de emergencia locales de inmediato.
                            </p>
                        </section>

                        <div className="text-center mt-5 pt-4 border-top">
                            <p className="small text-muted mb-0">
                                Si tienes dudas sobre tu privacidad, contáctanos a través del foro de Soporte dentro de la app.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

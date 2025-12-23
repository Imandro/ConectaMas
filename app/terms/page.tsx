"use client";

import Link from 'next/link';
import { ChevronLeft, Shield, FileText, Lock, AlertCircle } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-vh-100 bg-light py-5">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="mb-4">
                    <Link href="/auth/register" className="btn btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-2">
                        <ChevronLeft size={20} />
                        Volver al Registro
                    </Link>
                </div>

                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                    <div className="bg-primary p-5 text-white text-center">
                        <FileText size={48} className="mb-3 opacity-75" />
                        <h1 className="fw-bold h2">Términos y Condiciones</h1>
                        <p className="lead opacity-75 mb-0">Última actualización: Diciembre 2025</p>
                    </div>

                    <div className="card-body p-4 p-md-5">
                        <div className="mb-5">
                            <h4 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                                <Shield size={24} />
                                1. Aceptación de los Términos
                            </h4>
                            <p className="text-muted">
                                Al crear una cuenta y acceder a <strong>Conecta+</strong>, aceptas cumplir y estar legalmente obligado por los términos y condiciones descritos en este documento. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.
                            </p>
                        </div>

                        <div className="mb-5">
                            <h4 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                                <AlertCircle size={24} />
                                2. Código de Conducta
                            </h4>
                            <p className="text-muted mb-3">
                                Conecta+ es un espacio seguro dedicado al crecimiento espiritual y personal. Para mantener esta comunidad segura, aceptas:
                            </p>
                            <ul className="list-group list-group-flush rounded-3">
                                <li className="list-group-item bg-light border-0 mb-1">No publicar contenido ofensivo, violento o sexualmente explícito.</li>
                                <li className="list-group-item bg-light border-0 mb-1">Tratar a todos los miembros de la comunidad con respeto y dignidad.</li>
                                <li className="list-group-item bg-light border-0 mb-1">No utilizar la plataforma para acosar, intimidar o dañar a otros.</li>
                                <li className="list-group-item bg-light border-0 mb-1">Mantener la confidencialidad de lo compartido en foros privados o de consejería.</li>
                            </ul>
                        </div>

                        <div className="mb-5">
                            <h4 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                                <Lock size={24} />
                                3. Privacidad y Datos
                            </h4>
                            <p className="text-muted">
                                Valoramos tu privacidad. Tus datos personales, incluyendo tu progreso espiritual, diario personal y luchas, son confidenciales. No vendemos ni compartimos tu información personal con terceros para fines comerciales. Consulta nuestra Política de Privacidad para más detalles sobre cómo protegemos tu información.
                            </p>
                        </div>

                        <div className="mb-5">
                            <h5 className="fw-bold text-secondary mb-2">4. Responsabilidad</h5>
                            <p className="text-muted">
                                El contenido proporcionado en Conecta+ es para fines educativos y espirituales y no sustituye el consejo médico, psicológico o profesional. Si estás enfrentando una crisis de salud mental, por favor busca ayuda profesional inmediata.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h5 className="fw-bold text-secondary mb-2">5. Terminación</h5>
                            <p className="text-muted">
                                Nos reservamos el derecho de suspender o eliminar tu cuenta si violas estos términos, especialmente en casos de comportamiento abusivo o que ponga en riesgo la seguridad de la comunidad.
                            </p>
                        </div>

                        <div className="text-center pt-4 border-top">
                            <p className="small text-muted mb-0">
                                ¿Tienes dudas acerca de nuestros términos? Contáctanos en <a href="mailto:soporte@conectaplus.app" className="text-primary fw-bold text-decoration-none">soporte@conectaplus.app</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

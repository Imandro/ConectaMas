"use client";

import Link from "next/link";
import { ChevronLeft, FileText, Scale, UserCheck, AlertTriangle } from "lucide-react";

export default function TermsAndConditions() {
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
                            <FileText size={48} className="text-primary" />
                        </div>
                        <h1 className="fw-bold text-secondary">Términos y Condiciones</h1>
                        <p className="text-muted">Última actualización: 26 de diciembre de 2025</p>
                    </div>

                    <div className="content text-secondary lh-lg">
                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Scale size={24} className="text-primary" />
                                1. Aceptación de los Términos
                            </h4>
                            <p>
                                Al crear una cuenta en <strong>Conecta+</strong>, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte, por favor no utilices la aplicación.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <UserCheck size={24} className="text-primary" />
                                2. Uso de la Aplicación
                            </h4>
                            <p>
                                Conecta+ es una plataforma de contenido espiritual cristiano. Te comprometes a utilizar la aplicación de manera respetuosa, especialmente en las secciones de comunidad (foros). Queda prohibido el lenguaje de odio, acoso o contenido inapropiado.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <AlertTriangle size={24} className="text-warning" />
                                3. Descargo de Responsabilidad Médico/Espiritual
                            </h4>
                            <p className="fw-bold">
                                El contenido de Conecta+ es meramente informativo y de apoyo espiritual. No constituye consejo médico, psiquiátrico ni psicológico profesional.
                            </p>
                            <p>
                                El uso de la función SOS y los recursos de &quot;Salud Espiritual&quot; es bajo tu propio riesgo. Conecta+ y sus desarrolladores no se hacen responsables de decisiones tomadas por el usuario basadas en el contenido de la app.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Scale size={24} className="text-primary" />
                                4. Suscripciones y Pagos
                            </h4>
                            <p>
                                El <strong>Plan Premium</strong> se adquiere mediante una donación de $1 USD mensual. Este pago se utiliza exclusivamente para el mantenimiento de infraestructura y desarrollo de nuevas funciones misionales.
                            </p>
                            <p>
                                Los pagos son procesados de forma segura por <strong>PayPal</strong>. Al ser una donación de apoyo al proyecto, no se contemplan reembolsos automáticos, pero cualquier incidencia será atendida por nuestro equipo.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <FileText size={24} className="text-primary" />
                                5. Propiedad Intelectual
                            </h4>
                            <p>
                                Todo el contenido visual, algoritmos de seguimiento, y el personaje &quot;Llami&quot; son propiedad intelectual de <strong>Mario Alvarez / Conecta+</strong>. Queda prohibido el uso comercial de cualquier recurso sin consentimiento previo.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h4 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <Scale size={24} className="text-primary" />
                                6. Limitación de Responsabilidad
                            </h4>
                            <p>
                                Conecta+ no garantiza resultados espirituales específicos ni la resolución inmediata de conflictos personales. La aplicación es un facilitador y no un sustituto de la vida en comunidad eclesial y el acompañamiento pastoral presencial.
                            </p>
                        </section>

                        <div className="text-center mt-5 pt-4 border-top">
                            <p className="small text-muted mb-0">
                                Estos términos constituyen el acuerdo completo entre el usuario y Conecta+. Su última revisión fue realizada en diciembre de 2025.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

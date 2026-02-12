"use client";

import Link from 'next/link';

export default function LegalFooter() {
    return (
        <footer className="bg-light border-top mt-5 py-4">
            <div className="container">
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <h6 className="fw-bold text-dark mb-3">ConectaMas</h6>
                        <p className="text-muted small mb-2">
                            Plataforma espiritual para adolescentes y jóvenes cristianos
                        </p>
                        <p className="text-muted small mb-0">
                            © 2026 ConectaMas. Todos los derechos reservados.
                        </p>
                    </div>

                    <div className="col-12 col-md-3">
                        <h6 className="fw-bold text-dark mb-3">Legal</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link href="/legal/privacy" className="text-muted small text-decoration-none hover-text-primary">
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/legal/terms" className="text-muted small text-decoration-none hover-text-primary">
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/legal/cookies" className="text-muted small text-decoration-none hover-text-primary">
                                    Política de Cookies
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-12 col-md-3">
                        <h6 className="fw-bold text-dark mb-3">Contacto</h6>
                        <p className="text-muted small mb-1">
                            <strong>Email:</strong> contacto@conectamas.com
                        </p>
                        <p className="text-muted small mb-0">
                            <strong>Desarrollador:</strong> Mario Alvarez
                        </p>
                    </div>
                </div>

                <div className="row mt-4 pt-3 border-top">
                    <div className="col-12 text-center">
                        <p className="text-muted small mb-0">
                            ConectaMas utiliza Google AdMob para mostrar anuncios.
                            <Link href="/legal/privacy" className="text-primary ms-1">
                                Más información sobre privacidad
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .hover-text-primary:hover {
          color: var(--bs-primary) !important;
        }
      `}</style>
        </footer>
    );
}

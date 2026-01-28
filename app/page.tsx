import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-4 position-relative overflow-hidden">
            {/* Background Decor */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-light" style={{ zIndex: -1 }}>
                <div className="position-absolute top-0 start-50 translate-middle rounded-circle bg-warning opacity-10 blur-3xl" style={{ width: '600px', height: '600px', filter: 'blur(100px)' }}></div>
                <div className="position-absolute bottom-0 end-0 rounded-circle bg-secondary opacity-10 blur-3xl" style={{ width: '500px', height: '500px', filter: 'blur(80px)' }}></div>
            </div>

            <div className="card border-0 shadow-lg bg-white-80 backdrop-blur-md p-4 p-md-5 text-center" style={{ maxWidth: '480px', width: '100%', borderRadius: '32px' }}>
                {/* Logo Real */}
                <div className="mb-4 mx-auto animate-fade-in">
                    <div className="position-relative mx-auto" style={{ width: '200px', height: '80px' }}>
                        <Image
                            src="/logo.png"
                            title="Conecta+"
                            alt="Conecta+ Logo"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>
                </div>

                {/* Hero Text */}
                <h1 className="display-5 fw-bold mb-2 text-secondary font-fredoka">
                    No estás solo.
                </h1>

                <p className="lead text-muted mb-4 fs-5">
                    Dios sigue contigo.
                </p>

                {/* Buttons */}
                <div className="d-grid gap-3 w-100">
                    <Link href="/auth/register" className="btn btn-primary btn-lg text-white shadow-sm hover-scale rounded-pill py-3 fw-bold">
                        Crear cuenta
                    </Link>

                    <Link href="/auth/login" className="btn btn-outline-secondary btn-lg border-2 hover-scale rounded-pill py-3 fw-bold">
                        Ya tengo cuenta
                    </Link>


                </div>

                <div className="mt-5 pt-3 border-top border-light">
                    <div className="d-flex justify-content-center gap-3 small text-muted">
                        <Link href="/legal/privacy" className="text-decoration-none text-muted hover-primary">Privacidad</Link>
                        <span className="opacity-25">|</span>
                        <Link href="/legal/terms" className="text-decoration-none text-muted hover-primary">Términos</Link>
                        <span className="opacity-25">|</span>
                        <Link href="/legal/cookies" className="text-decoration-none text-muted hover-primary">Cookies</Link>
                    </div>
                    <p className="extra-small text-muted mt-2 mb-0">© 2025 Conecta+</p>
                </div>
            </div>

            {/* Value Add Sections for AdSense Coverage */}
            <div className="mt-5 w-100 animate-fade-in-up" style={{ maxWidth: '800px' }}>
                <div className="row g-4 px-3">
                    <div className="col-12 col-md-4">
                        <div className="p-4 bg-white rounded-5 shadow-sm h-100">
                            <h3 className="h5 fw-bold text-secondary mb-3">Tu Refugio Digital</h3>
                            <p className="small text-muted mb-0">
                                Conecta+ es más que una app; es un espacio seguro diseñado para que los jóvenes encuentren paz en medio del caos digital.
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="p-4 bg-white rounded-5 shadow-sm h-100">
                            <h3 className="h5 fw-bold text-secondary mb-3">Crecimiento Diario</h3>
                            <p className="small text-muted mb-0">
                                A través de devocionales personalizados y seguimiento espiritual, te acompañamos en cada paso de tu camino con Dios.
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="p-4 bg-white rounded-5 shadow-sm h-100">
                            <h3 className="h5 fw-bold text-secondary mb-3">Comunidad Real</h3>
                            <p className="small text-muted mb-0">
                                No caminamos solos. Conecta con otros jóvenes, comparte peticiones de oración y apóyense mutuamente en fe.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 p-5 bg-white rounded-5 shadow-sm text-start mx-3">
                    <h2 className="h4 fw-bold text-secondary mb-4">Nuestra Misión</h2>
                    <p className="text-muted mb-4">
                        En un mundo lleno de distracciones y ansiedad, creemos que la tecnología puede ser una herramienta para la redención. Conecta+ nace del deseo de reconciliar a la juventud con lo eterno, proporcionando recursos de alta calidad para el estudio bíblico, la oración constante y el acompañamiento fraternal.
                    </p>
                    <p className="text-muted mb-0">
                        Cada versículo, cada devocional y cada interacción dentro de la plataforma está fundamentada en principios bíblicos, buscando fomentar una relación genuina y profunda con Jesucristo. Estamos comprometidos con la privacidad y la integridad de tu proceso espiritual.
                    </p>
                </div>
            </div>
        </div>
    );
}

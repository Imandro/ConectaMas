import Link from 'next/link';

export default function PublicSiteNav() {
    return <nav className="container py-3 d-flex align-items-center justify-content-between gap-3" aria-label="Navegación pública">
        <Link href="/" className="fw-bold text-secondary text-decoration-none fs-5">Conecta+</Link>
        <div className="d-flex align-items-center gap-3 small">
            <Link href="/recursos" className="text-secondary text-decoration-none">Recursos</Link>
            <Link href="/about" className="text-secondary text-decoration-none">Qué es Conecta+</Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm rounded-pill px-3">Empezar</Link>
        </div>
    </nav>;
}

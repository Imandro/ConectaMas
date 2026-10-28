import type { Metadata } from 'next';
import Link from 'next/link';
import PublicSiteNav from '@/app/components/PublicSiteNav';
import LegalFooter from '@/app/components/LegalFooter';
import { PUBLIC_RESOURCES } from '@/app/lib/public-content';

export const metadata: Metadata = {
    title: 'Recursos cristianos | Conecta+',
    description: 'Devocionales, guías de oración, hábitos, estudio bíblico y juegos familiares originales de Conecta+.',
    alternates: { canonical: 'https://conectamas.live/recursos' },
    openGraph: { url: 'https://conectamas.live/recursos', title: 'Recursos cristianos | Conecta+', description: 'Contenido cristiano práctico y original para crecer acompañado.' },
};

export default function ResourcesPage() {
    return <div className="min-vh-100 bg-light">
        <PublicSiteNav />
        <main className="container py-4 py-md-5" style={{ maxWidth: 1050 }}>
            <header className="mb-5">
                <p className="text-uppercase text-primary fw-bold small mb-2">Biblioteca Conecta+</p>
                <h1 className="display-5 fw-bold text-secondary">Recursos para caminar con fe</h1>
                <p className="lead text-muted mb-0">Lecturas originales para orar, estudiar, cuidar tu bienestar y compartir en familia. Revisa cada recurso a tu ritmo.</p>
            </header>
            <div className="row g-4">
                {PUBLIC_RESOURCES.map((resource) => <article key={resource.slug} className="col-12 col-md-6">
                    <div className="card border-0 shadow-sm h-100 p-4">
                        <div className="d-flex justify-content-between gap-2 mb-3"><span className="badge text-bg-light text-primary">{resource.category}</span><span className="small text-muted">{resource.readingMinutes} min</span></div>
                        <h2 className="h4 fw-bold text-secondary">{resource.title}</h2>
                        <p className="text-muted flex-grow-1">{resource.description}</p>
                        <div className="small text-muted mb-3">Por {resource.author} · {new Date(`${resource.publishedAt}T12:00:00Z`).toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</div>
                        <Link href={`/recursos/${resource.slug}`} className="btn btn-outline-primary rounded-pill align-self-start">Leer recurso</Link>
                    </div>
                </article>)}
            </div>
            <aside className="alert alert-light border mt-5 mb-0"><strong>Nota de cuidado:</strong> estos recursos acompañan la reflexión cristiana, pero no sustituyen atención médica, psicológica, legal ni servicios de emergencia.</aside>
        </main>
        <LegalFooter />
    </div>;
}

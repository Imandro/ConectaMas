import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicSiteNav from '@/app/components/PublicSiteNav';
import LegalFooter from '@/app/components/LegalFooter';
import { getPublicResource, PUBLIC_RESOURCES } from '@/app/lib/public-content';

export function generateStaticParams() {
    return PUBLIC_RESOURCES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const resource = getPublicResource(params.slug);
    if (!resource) return {};
    return {
        title: `${resource.title} | Conecta+`,
        description: resource.description,
        alternates: { canonical: `https://conectamas.live/recursos/${resource.slug}` },
        openGraph: { url: `https://conectamas.live/recursos/${resource.slug}`, title: `${resource.title} | Conecta+`, description: resource.description },
    };
}

export default function ResourcePage({ params }: { params: { slug: string } }) {
    const resource = getPublicResource(params.slug);
    if (!resource) notFound();
    return <div className="min-vh-100 bg-light">
        <PublicSiteNav />
        <main className="container py-4 py-md-5" style={{ maxWidth: 850 }}>
            <Link href="/recursos" className="small text-primary text-decoration-none">← Volver a recursos</Link>
            <article className="card border-0 shadow-sm p-4 p-md-5 mt-3">
                <header className="mb-4">
                    <span className="badge text-bg-light text-primary mb-3">{resource.category}</span>
                    <h1 className="display-6 fw-bold text-secondary">{resource.title}</h1>
                    <p className="lead text-muted">{resource.description}</p>
                    <p className="small text-muted mb-0">Por {resource.author} · {new Date(`${resource.publishedAt}T12:00:00Z`).toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} · {resource.readingMinutes} min de lectura</p>
                </header>
                {resource.body.map((paragraph) => <p key={paragraph} className="text-secondary lh-lg">{paragraph}</p>)}
                <div className="border-top pt-4 mt-4">
                    <h2 className="h5 fw-bold text-secondary">Sigue leyendo</h2>
                    <div className="d-flex flex-wrap gap-2">{resource.relatedSlugs.map((slug) => { const related = getPublicResource(slug); return related ? <Link key={slug} href={`/recursos/${slug}`} className="btn btn-sm btn-outline-primary rounded-pill">{related.title}</Link> : null; })}</div>
                </div>
            </article>
        </main>
        <LegalFooter />
    </div>;
}

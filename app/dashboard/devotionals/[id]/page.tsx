import Link from 'next/link';
import { ArrowLeft, Share2, CheckCircle2 } from 'lucide-react';
import { devotionalsData } from '@/app/lib/devotionalsData';
import { notFound } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import DevotionalCompletionButton from '../DevotionalCompletionButton';

export default async function DevotionalDetailPage({ params }: { params: { id: string } }) {
    const dev = devotionalsData.find(d => d.id === params.id);

    if (!dev) {
        return notFound();
    }

    const session = await auth();
    let isCompleted = false;

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (user) {
            // Safety check: userDevotional might be undefined if prisma generate failed
            // We cast to any to avoid TS errors, but check existence at runtime
            const delegate = (prisma as any).userDevotional;

            if (delegate) {
                const completedRecord = await delegate.findUnique({
                    where: {
                        userId_devotionalId: {
                            userId: user.id,
                            devotionalId: dev.id
                        }
                    }
                });
                if (completedRecord) isCompleted = true;
            }
        }
    }

    return (
        <div className="animate-fade-in pb-5">
            {/* Top Nav */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link href="/dashboard/devotionals" className="btn btn-light rounded-circle p-2 shadow-sm">
                    <ArrowLeft size={24} />
                </Link>
                <div className="d-flex gap-2">
                    <button className="btn btn-light rounded-circle p-2 shadow-sm">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Header */}
            <span className="badge bg-white text-secondary mb-2 fw-bold border shadow-sm">{dev.category}</span>
            <h1 className="fw-bold mb-3 display-6">{dev.title}</h1>

            <div className="d-flex align-items-center gap-3 text-muted mb-4 border-bottom pb-4">
                {/* Author/Date */}
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-secondary rounded-circle" style={{ width: '24px', height: '24px' }}></div>
                    <small>{dev.author}</small>
                </div>
                <small>•</small>
                <small>{dev.time} lectura</small>
            </div>

            {/* Content */}
            <article className="typography-article mb-5 text-secondary">
                <p className="lead text-dark fw-medium">
                    "{dev.bibleVerse}" - {dev.bibleReference}
                </p>

                {dev.content.map((paragraph, idx) => (
                    <p key={idx} className="mb-3">{paragraph}</p>
                ))}

                <h5 className="fw-bold text-dark mt-4">Aplicación Práctica</h5>
                <ul className="list-unstyled d-flex flex-column gap-2 mt-3">
                    {dev.applicationSteps.map((step, idx) => (
                        <li key={idx} className="d-flex gap-2">
                            <div className="mt-1 d-flex align-items-center justify-content-center bg-success text-white rounded-circle" style={{ width: '20px', height: '20px', fontSize: '10px', flexShrink: 0 }}>{idx + 1}</div>
                            <span>{step}</span>
                        </li>
                    ))}
                </ul>

                <h5 className="fw-bold text-dark mt-4">Oración</h5>
                <div className="bg-light p-3 rounded-3 fst-italic text-muted">
                    "{dev.prayer}"
                </div>
            </article>

            {/* Completion Action */}
            <DevotionalCompletionButton devotionalId={dev.id} initialCompleted={isCompleted} />

        </div>
    );
}

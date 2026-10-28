export const dynamic = "force-dynamic";
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowLeft } from 'lucide-react';
import { getDevotionals, getDevotionalBackground } from '@/app/lib/devotionalsData';
import { notFound } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
import { getTranslations } from '@/app/lib/getTranslations';
import { isLanguage } from '@/app/lib/languages';
import DevotionalCompletionButton from '../DevotionalCompletionButton';
import ShareDevotionalButton from '../ShareDevotionalButton';

type UserDevotionalDelegate = {
    findUnique: (args: { where: { userId_devotionalId: { userId: string; devotionalId: string } } }) => Promise<unknown>;
};

export default async function DevotionalDetailPage({ params }: { params: { id: string } }) {
    const session = await auth();
    const cookieLanguage = cookies().get('app-language')?.value;
    const language = isLanguage(session?.user?.preferredLanguage)
        ? session.user.preferredLanguage
        : isLanguage(cookieLanguage) ? cookieLanguage : 'es';
    const t = getTranslations(language);
    const dev = getDevotionals(language).find(d => d.id === params.id);

    if (!dev) {
        return notFound();
    }

    let isCompleted = false;

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (user) {
            // Safety check: userDevotional might be undefined if prisma generate failed.
            const delegate = (prisma as typeof prisma & { userDevotional?: UserDevotionalDelegate }).userDevotional;

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
            <div className="ui-page-header mb-4">
                    <Link href="/dashboard/devotionals" className="btn btn-light rounded-circle p-2 shadow-sm" aria-label={t.common.back}>
                    <ArrowLeft size={24} />
                </Link>
                <div className="d-flex gap-2">
                    <ShareDevotionalButton devotional={dev} />
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
                <small>{dev.time} {t.devotionals.read_time}</small>
            </div>

            {/* Featured Image */}
            <div className="rounded-4 overflow-hidden mb-4 shadow-sm" style={{ height: '240px', backgroundImage: getDevotionalBackground(dev.id), backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="w-100 h-100 d-flex align-items-end p-4" style={{ background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.6))' }}>
                    <span className="badge bg-white text-dark rounded-pill fw-bold shadow-sm">{dev.category}</span>
                </div>
            </div>

            {/* Content */}
            <article className="ui-surface typography-article mb-5 p-4 text-secondary">
                <p className="lead text-dark fw-medium">
                    &ldquo;{dev.bibleVerse}&rdquo; - {dev.bibleReference}
                </p>

                {dev.content.map((paragraph, idx) => (
                    <p key={idx} className="mb-3">{paragraph}</p>
                ))}

                <h5 className="fw-bold text-dark mt-4">{t.devotionals.application}</h5>
                <ul className="list-unstyled d-flex flex-column gap-2 mt-3">
                    {dev.applicationSteps.map((step, idx) => (
                        <li key={idx} className="d-flex gap-2">
                            <div className="mt-1 d-flex align-items-center justify-content-center bg-success text-white rounded-circle" style={{ width: '20px', height: '20px', fontSize: '10px', flexShrink: 0 }}>{idx + 1}</div>
                            <span>{step}</span>
                        </li>
                    ))}
                </ul>

                <h5 className="fw-bold text-dark mt-4">{t.devotionals.prayer_section}</h5>
                <div className="bg-light p-3 rounded-3 fst-italic text-muted">
                    &ldquo;{dev.prayer}&rdquo;
                </div>
            </article>

            {/* Completion Action */}
            <DevotionalCompletionButton devotionalId={dev.id} initialCompleted={isCompleted} />

        </div>
    );
}

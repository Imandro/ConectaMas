"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
    ArrowRight,
    BookOpen,
    Gamepad2,
    Heart,
    HelpCircle,
    Sparkles,
    Sun,
    Users,
} from 'lucide-react';
import DailyVerse from '@/app/dashboard/components/DailyVerse';
import ChallengeCard from '@/app/dashboard/components/ChallengeCard';
import LlamiMascot from '@/app/components/LlamiMascot';
import DesignVariantSwitcher from '@/app/components/DesignVariantSwitcher';
import DesignModeSwitcher, { useDesignMode } from '@/app/components/DesignModeSwitcher';
import { setDesignVariant } from '@/app/components/DesignVariantProvider';
import { DESIGN_VARIANTS, resolveDesignVariant, type DesignVariant } from '@/app/lib/designVariants';
import { resolveDesignMode, type DesignMode } from '@/app/lib/designModes';

const VARIANT_LABELS: Record<DesignVariant, string> = {
    calma: 'Calma',
    comunidad: 'Comunidad',
    fuego: 'Fuego',
};

function MiniDashboard({ variant, mode }: { variant: DesignVariant; mode: DesignMode }) {
    return (
        <article className="design-preview-phone" data-design={variant} data-mode={variant === 'fuego' ? mode : undefined}>
            <div className="design-preview-statusbar">
                <span>10:09</span>
                <span aria-hidden="true">◔ ◉ ▪</span>
            </div>

            <div className="design-preview-screen">
                <header className="design-preview-header">
                    <div>
                        <div className="design-preview-brand">
                            <Image src="/logo.png" alt="Conecta+" width={96} height={34} />
                        </div>
                        <div className="design-preview-date"><Sparkles size={13} /> 26 de octubre</div>
                        <h2>Hola, <span>Mario</span></h2>
                    </div>
                    <div className="design-preview-actions" aria-label="Acciones rápidas">
                        <HelpCircle size={21} />
                        <Users size={21} />
                        <span className="design-preview-avatar">M</span>
                    </div>
                </header>

                <section className="design-preview-real-component">
                    <DailyVerse />
                </section>

                <section className="design-preview-real-component">
                    <ChallengeCard />
                </section>

                <section className="design-preview-checkin">
                    <div>
                        <span className="design-preview-eyebrow"><Sun size={15} /> Tu camino</span>
                        <strong>1 <small>día en victoria</small></strong>
                    </div>
                    <div className="design-preview-llami" aria-label="Llami, tu acompañante">
                        <LlamiMascot streak={1} level={2} name="Llami" expression="happy" />
                    </div>
                </section>

                <div className="design-preview-links">
                    <span><BookOpen size={17} /> Biblia</span>
                    <span><Heart size={17} /> Oración</span>
                    <span><Gamepad2 size={17} /> Juegos</span>
                </div>

                <nav className="design-preview-nav" aria-label={`Navegación ${VARIANT_LABELS[variant]}`}>
                    <span className="is-active"><Sun size={16} />Inicio</span>
                    <span><BookOpen size={16} /> Biblia</span>
                    <span><Users size={16} /> Comunidad</span>
                    <span><Heart size={16} /> Apoyar</span>
                </nav>
            </div>
        </article>
    );
}

export default function DesignPreviewPage() {
    const searchParams = useSearchParams();
    const queryVariant = searchParams.get('design');
    const initialVariant = queryVariant ? resolveDesignVariant(queryVariant) : undefined;
    const queryMode = searchParams.get('mode');
    const mode = useDesignMode(queryMode ? resolveDesignMode(queryMode) : undefined);

    return (
        <main className="design-preview-page">
            <div className="container py-4 py-lg-5">
                <header className="design-preview-intro">
                    <div>
                        <span className="design-preview-kicker">Conecta+ / laboratorio visual</span>
                        <h1>Elige cómo se siente la app.</h1>
                        <p>Las tres versiones conservan fe, acompañamiento, comunidad y Llami. Cambia una versión para verla aplicada al resto de la app.</p>
                    </div>
                    <Link href="/dashboard" className="btn btn-primary rounded-pill px-4 fw-bold">
                        Ver aplicación <ArrowRight size={17} className="ms-1" />
                    </Link>
                </header>

                <section className="design-preview-controls" aria-labelledby="design-preview-choice">
                    <div>
                        <h2 id="design-preview-choice">Tres direcciones</h2>
                        <p className="text-muted mb-0">La selección se guarda en este dispositivo. Fuego tiene modo oscuro y claro.</p>
                    </div>
                    <div className="design-preview-controls-actions">
                        <DesignVariantSwitcher initialVariant={initialVariant} />
                        <div className="design-mode-caption">
                            <span>Fuego</span>
                            <DesignModeSwitcher initialMode={mode} />
                        </div>
                    </div>
                </section>

                <section className="design-preview-grid" aria-label="Comparación de versiones">
                    {DESIGN_VARIANTS.map((variant) => (
                        <div key={variant} className="design-preview-column">
                            <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                                <h2>{VARIANT_LABELS[variant]}</h2>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary rounded-pill"
                                    onClick={() => setDesignVariant(variant)}
                                >
                                    Usar esta
                                </button>
                            </div>
                            <MiniDashboard variant={variant} mode={mode} />
                        </div>
                    ))}
                </section>

                <p className="design-preview-note"><strong>Recomendación:</strong> prueba primero en 360–412 px. Después abre Biblia, devocionales, oración, comunidad y juegos para validar continuidad.</p>
            </div>
        </main>
    );
}

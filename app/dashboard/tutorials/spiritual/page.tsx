"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    BookOpen,
    Calendar,
    TrendingUp,
    CheckCircle2,
    Target
} from 'lucide-react';
import Link from 'next/link';

export default function SpiritualTutorial() {
    return (
        <div className="container-fluid py-4 min-vh-100 bg-white">
            {/* Header */}
            <header className="d-flex align-items-center gap-3 mb-5 px-lg-4">
                <Link href="/dashboard/tutorials" className="btn btn-light rounded-circle p-2 shadow-sm">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="h4 mb-0 fw-bold">Manual de Crecimiento Espiritual</h1>
            </header>

            <div className="row justify-content-center px-lg-4">
                <div className="col-lg-8">
                    {/* Intro Section */}
                    <div className="text-center mb-5">
                        <div className="bg-success text-white p-4 rounded-circle d-inline-block mb-4 shadow-lg">
                            <BookOpen size={48} />
                        </div>
                        <h2 className="fw-bold">Alimenta tu Espíritu</h2>
                        <p className="text-muted lead px-md-5">
                            Diseñamos Conecta+ para que tu lectura no sea solo una tarea, sino una experiencia personalizada de sanidad y crecimiento.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="d-grid gap-4 mb-5">
                        <SpiritualFeature
                            icon={<Target size={24} className="text-success" />}
                            title="Recomendaciones Inteligentes"
                            desc="El sistema sugiere devocionales basados en tus luchas y tu estado de ánimo actual. ¡Déjate guiar por lo que tu corazón necesita hoy!"
                        />
                        <SpiritualFeature
                            icon={<Calendar size={24} className="text-primary" />}
                            title="Seguimiento de Rachas"
                            desc="Tu constancia es clave. Mira tu progreso en el calendario y mantén viva tu racha de días en victoria."
                        />
                        <SpiritualFeature
                            icon={<TrendingUp size={24} className="text-warning" />}
                            title="Check-in Diario"
                            desc="Al registrar cómo te sientes, permites que la app ajuste el contenido para darte palabras de aliento específicas para tu situación."
                        />
                    </div>

                    {/* Pro Tip */}
                    <div className="card bg-success bg-opacity-10 border-0 rounded-4 p-4 text-center">
                        <CheckCircle2 className="text-success mx-auto mb-3" size={32} />
                        <h5 className="fw-bold text-success">Tip de Oro</h5>
                        <p className="small text-muted mb-0">No intentes leer todo de una vez. Lo más importante es la constancia diaria, incluso si solo tienes 5 minutos.</p>
                    </div>

                    {/* Final Button */}
                    <div className="mt-5 text-center">
                        <Link href="/dashboard/devotionals" className="btn btn-success rounded-pill btn-lg px-5 shadow-lg fw-bold">
                            Ir a Devocionales
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpiritualFeature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="d-flex gap-4 align-items-center bg-light bg-opacity-50 p-4 rounded-4 border-start border-success border-4 shadow-sm">
            <div className="bg-white p-3 rounded-4 shadow-sm shrink-0">
                {icon}
            </div>
            <div>
                <h5 className="fw-bold mb-1">{title}</h5>
                <p className="text-muted small mb-0">{desc}</p>
            </div>
        </div>
    );
}

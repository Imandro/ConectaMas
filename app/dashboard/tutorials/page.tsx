"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Download,
    Flame,
    BookOpen,
    AlertTriangle,
    Users,
    ChevronRight,
    PlayCircle,
    Info
} from 'lucide-react';
import Link from 'next/link';

interface TutorialItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    category: string;
    href: string;
}

const tutorials: TutorialItem[] = [
    {
        id: 'install',
        title: 'Instalación PWA',
        description: 'Cómo instalar Conecta+ en tu pantalla de inicio como una App real.',
        icon: <Download size={24} />,
        color: 'bg-primary',
        category: 'Esencial',
        href: '/dashboard/tutorials/install'
    },
    {
        id: 'llami',
        title: 'Llami: Espíritu de Fuego',
        description: 'Aprende a cuidar tu llama interior y subir de nivel.',
        icon: <Flame size={24} />,
        color: 'bg-warning',
        category: 'Crecimiento',
        href: '/dashboard/tutorials/llami'
    },
    {
        id: 'spiritual',
        title: 'Lectura Diaria',
        description: 'Saca el máximo provecho a tus devocionales y lectura bíblica.',
        icon: <BookOpen size={24} />,
        color: 'bg-success',
        category: 'Espiritual',
        href: '/dashboard/tutorials/spiritual'
    },
    {
        id: 'sos',
        title: 'Zona de Auxilio (SOS)',
        description: 'Qué hacer en momentos de crisis y cómo contactar ayuda.',
        icon: <AlertTriangle size={24} />,
        color: 'bg-danger',
        category: 'Soporte',
        href: '/dashboard/tutorials/sos'
    },
    {
        id: 'community',
        title: 'Comunidad y Foro',
        description: 'Cómo interactuar, pedir oración y apoyar a otros.',
        icon: <Users size={24} />,
        color: 'bg-info',
        category: 'Comunidad',
        href: '/dashboard/tutorials/community'
    }
];

export default function TutorialHub() {
    return (
        <div className="container-fluid py-4 min-vh-100 bg-light">
            {/* Header */}
            <header className="mb-5">
                <h1 className="display-6 fw-bold text-secondary mb-2">Centro de Aprendizaje</h1>
                <p className="text-muted">Todo lo que necesitas saber para dominar Conecta+ y crecer en tu fe.</p>
            </header>

            {/* Featured Tutorial */}
            <section className="mb-5">
                <Link href="/dashboard/tutorials/install" className="text-decoration-none">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="card border-0 shadow-lg bg-primary text-white rounded-5 overflow-hidden"
                    >
                        <div className="card-body p-4 p-lg-5 d-flex flex-column flex-lg-row align-items-center justify-content-between gap-4">
                            <div className="text-center text-lg-start">
                                <span className="badge bg-white text-primary mb-3">RECOMENDADO</span>
                                <h2 className="fw-bold mb-3">Guía de Instalación</h2>
                                <p className="opacity-75 mb-4">
                                    Conecta+ funciona mejor como una aplicación instalada.
                                    Aprende a activarla en segundos paso a paso.
                                </p>
                                <button className="btn btn-light rounded-pill px-4 fw-bold d-inline-flex align-items-center gap-2">
                                    <PlayCircle size={20} />
                                    Comenzar Guía
                                </button>
                            </div>
                            <div className="bg-white bg-opacity-20 p-4 rounded-circle">
                                <Download size={80} />
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </section>

            {/* Grid */}
            <div className="row g-4">
                {tutorials.filter(t => t.id !== 'install').map((item, idx) => (
                    <div className="col-md-6 col-lg-4" key={item.id}>
                        <Link href={item.href} className="text-decoration-none h-100">
                            <motion.div
                                whileHover={{ y: -5 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden"
                            >
                                <div className="card-body p-4">
                                    <div className={`${item.color} text-white p-3 rounded-4 d-inline-block mb-3 shadow-sm`}>
                                        {item.icon}
                                    </div>
                                    <h5 className="fw-bold text-secondary mb-2">{item.title}</h5>
                                    <p className="small text-muted mb-4">{item.description}</p>

                                    <div className="d-flex align-items-center justify-content-between mt-auto">
                                        <span className="badge bg-light text-muted fw-normal">{item.category}</span>
                                        <div className="text-primary d-flex align-items-center gap-1 fw-bold small">
                                            Leer mas
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Help Section */}
            <section className="mt-5 pt-5 border-top text-center">
                <div className="bg-white p-5 rounded-5 shadow-sm border">
                    <Info size={40} className="text-primary mb-3" />
                    <h3 className="fw-bold text-secondary mb-3">¿Aún tienes dudas?</h3>
                    <p className="text-muted mb-4">Nuestro equipo de líderes está listo para apoyarte en cualquier momento.</p>
                    <Link href="/dashboard/sos" className="btn btn-outline-primary rounded-pill px-5 fw-bold">
                        Contactar Soporte
                    </Link>
                </div>
            </section>
        </div>
    );
}

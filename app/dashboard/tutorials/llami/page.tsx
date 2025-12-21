"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Flame,
    Zap,
    Book,
    Sparkles,
    TrendingUp,
    Heart
} from 'lucide-react';
import Link from 'next/link';
import LlamiMascot from "@/app/components/LlamiMascot";

export default function LlamiTutorial() {
    return (
        <div className="container-fluid py-4 min-vh-100 bg-conecta-gradient text-white">
            {/* Header */}
            <header className="d-flex align-items-center gap-3 mb-5">
                <Link href="/dashboard/tutorials" className="btn btn-outline-light rounded-circle p-2">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="h4 mb-0 fw-bold">Llami: Guía de Cuidado</h1>
            </header>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {/* Intro Section */}
                    <div className="text-center mb-5">
                        <div className="mb-4 transform-scale-1">
                            <LlamiMascot streak={1} level={5} />
                        </div>
                        <h2 className="fw-bold display-6 mb-3">Tu Espíritu de Fuego</h2>
                        <p className="text-white-50 lead px-md-5">
                            Llami no es solo una mascota, es el reflejo visual de tu fervor espiritual.
                            Aprende cómo mantener su llama brillando con fuerza.
                        </p>
                    </div>

                    {/* Mechanics Grid */}
                    <div className="row g-4 mb-5">
                        <div className="col-md-6">
                            <div className="card bg-glass border-0 shadow-lg rounded-5 p-4 h-100">
                                <div className="bg-primary bg-opacity-20 p-3 rounded-4 d-inline-block mb-3">
                                    <Book className="text-primary" size={32} />
                                </div>
                                <h4 className="fw-bold">Puntos de Fuego</h4>
                                <p className="text-white-50">
                                    Ganarás 1 punto de fuego por cada minuto de lectura en la sección "Biblia".
                                    Estos puntos sirven para avivar el espíritu de Llami.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card bg-glass border-0 shadow-lg rounded-5 p-4 h-100">
                                <div className="bg-success bg-opacity-20 p-3 rounded-4 d-inline-block mb-3">
                                    <Zap className="text-success" size={32} />
                                </div>
                                <h4 className="fw-bold">Experiencia (XP)</h4>
                                <p className="text-white-50">
                                    Completar devocionales te otorga una gran cantidad de XP (25 puntos).
                                    La XP es necesaria para que Llami suba de nivel.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Evolutionary Steps */}
                    <section className="mb-5">
                        <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <TrendingUp className="text-primary" />
                            Evolución y Niveles
                        </h3>
                        <div className="d-flex flex-column gap-3">
                            <EvolutionStep
                                level="Nivel 1-10"
                                title="Chispa de Fe"
                                desc="Llami es una llama pequeña pero constante. Representa el inicio de tu compromiso."
                            />
                            <EvolutionStep
                                level="Nivel 11-50"
                                title="Llama Ardiente"
                                desc="Su núcleo se vuelve más blanco e intenso. Las chispas vuelan más alto."
                                active
                            />
                            <EvolutionStep
                                level="Nivel 50+"
                                title="Espíritu Radiante"
                                desc="Llami alcanza su máximo esplendor, simbolizando una madurez espiritual profunda."
                            />
                        </div>
                    </section>

                    {/* Interactive Tips */}
                    <div className="alert bg-primary bg-opacity-10 border-primary border-opacity-20 rounded-4 p-4 d-flex gap-3 align-items-start text-white">
                        <Sparkles className="text-primary shrink-0" size={24} />
                        <div>
                            <h6 className="fw-bold text-primary mb-1">¡Truco de Crecimiento!</h6>
                            <p className="small mb-0 text-white-50">
                                No dejes que Llami pase muchos días sin atención.
                                La constancia en la lectura bíblica diaria es la mejor forma de que suba de nivel rápidamente.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 text-center">
                        <Link href="/dashboard/llami" className="btn btn-primary rounded-pill btn-lg px-5 shadow-lg fw-bold">
                            Visitar a Llami Ahora
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .bg-conecta-gradient { 
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
                }
                .bg-glass {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .transform-scale-1 {
                    transform: scale(1.0);
                }
            `}</style>
        </div>
    );
}

function EvolutionStep({ level, title, desc, active = false }: { level: string, title: string, desc: string, active?: boolean }) {
    return (
        <div className={`p-4 rounded-4 border-start border-4 ${active ? 'bg-glass border-primary shadow-lg' : 'bg-transparent border-transparent opacity-50'}`}>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small fw-bold text-primary uppercase">{level}</span>
                {active && <Heart size={16} className="text-primary animate-pulse" />}
            </div>
            <h5 className="fw-bold text-white">{title}</h5>
            <p className="small mb-0 text-white-50">{desc}</p>
        </div>
    );
}

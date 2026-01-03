"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Share,
    PlusSquare,
    MoreVertical,
    Download,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function InstallTutorial() {
    const [platform, setPlatform] = useState<"ios" | "android">("ios");

    return (
        <div className="container-fluid py-4 min-vh-100 bg-white">
            {/* Header */}
            <header className="d-flex align-items-center gap-3 mb-5 px-lg-4">
                <Link href="/dashboard/tutorials" className="btn btn-light rounded-circle p-2 shadow-sm">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="h4 mb-0 fw-bold">Guía de Instalación</h1>
            </header>

            <div className="row justify-content-center px-lg-4">
                <div className="col-lg-8">
                    {/* Intro */}
                    <div className="text-center mb-5">
                        <div className="bg-primary text-white p-4 rounded-circle d-inline-block mb-4 shadow-lg">
                            <Download size={48} />
                        </div>
                        <h2 className="fw-bold">Conecta+ BETA en tu pantalla</h2>
                        <p className="text-muted lead">
                            Instala la aplicación para disfrutar de una experiencia completa,
                            más rápida y sin distracciones.
                        </p>
                    </div>

                    {/* Platform Selector */}
                    <div className="d-flex justify-content-center gap-2 mb-5">
                        <button
                            onClick={() => setPlatform("ios")}
                            className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${platform === "ios" ? 'btn-primary shadow-lg' : 'btn-light'}`}
                        >
                            iPhone / iPad
                        </button>
                        <button
                            onClick={() => setPlatform("android")}
                            className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${platform === "android" ? 'btn-primary shadow-lg' : 'btn-light'}`}
                        >
                            Android
                        </button>
                    </div>

                    {/* Steps Wrapper */}
                    <div className="position-relative">
                        <AnimatePresence mode="wait">
                            {platform === "ios" ? (
                                <motion.div
                                    key="ios"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="d-flex flex-column gap-5"
                                >
                                    <Step
                                        number={1}
                                        title="Abre Safari"
                                        text="Asegúrate de estar navegando desde el navegador Safari de Apple."
                                        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg" width="40" alt="Safari" />}
                                    />
                                    <Step
                                        number={2}
                                        title="Toca &apos;Compartir&apos;"
                                        text="Busca el icono de compartir en la barra inferior (un cuadrado con una flecha hacia arriba)."
                                        icon={<Share className="text-primary" size={32} />}
                                    />
                                    <Step
                                        number={3}
                                        title="Agregar a Inicio"
                                        text="Desliza hacia abajo y selecciona la opción &apos;Agregar a la pantalla de inicio&apos;."
                                        icon={<PlusSquare className="text-primary" size={32} />}
                                    />
                                    <Step
                                        number={4}
                                        title="¡Listo!"
                                        text="Presiona &apos;Agregar&apos; en la esquina superior derecha. Conecta+ BETA aparecerá entre tus apps."
                                        icon={<CheckCircle2 className="text-success" size={32} />}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="android"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="d-flex flex-column gap-5"
                                >
                                    <Step
                                        number={1}
                                        title="Menu de Chrome"
                                        text="Toca los tres puntos verticales en la esquina superior derecha del navegador."
                                        icon={<MoreVertical className="text-primary" size={32} />}
                                    />
                                    <Step
                                        number={2}
                                        title="Instalar Aplicación"
                                        text="Busca y selecciona la option que dice &apos;Instalar aplicación&apos; o &apos;Instalar Conecta+ BETA&apos;."
                                        icon={<Download className="text-primary" size={32} />}
                                    />
                                    <Step
                                        number={3}
                                        title="Confirmar"
                                        text="Presiona el botón &apos;Instalar&apos; en la ventana emergente que aparecerá."
                                        icon={<CheckCircle2 className="text-success" size={32} />}
                                    />
                                    <Step
                                        number={4}
                                        title="Acceso directo"
                                        text="Ahora podrás abrir Conecta+ BETA directamente desde tu cajón de aplicaciones."
                                        icon={<ArrowRight className="text-primary" size={32} />}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Call to action */}
                    <div className="mt-5 pt-5 text-center">
                        <Link href="/dashboard" className="btn btn-primary rounded-pill btn-lg px-5 shadow">
                            Regresar al Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Step({ number, title, text, icon }: { number: number, title: string, text: string, icon: React.ReactNode }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="card border-0 bg-light rounded-4 overflow-hidden border-start border-primary border-4"
        >
            <div className="card-body p-4 d-flex align-items-center gap-4">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shrink-0" style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {number}
                </div>
                <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1">{title}</h5>
                    <p className="text-muted small mb-0">{text}</p>
                </div>
                <div className="bg-white p-3 rounded-4 shadow-sm shrink-0 d-none d-sm-block">
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}

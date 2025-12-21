"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    AlertTriangle,
    Phone,
    Music,
    Heart,
    Shield
} from 'lucide-react';
import Link from 'next/link';

export default function SOSTutorial() {
    return (
        <div className="container-fluid py-4 min-vh-100 bg-white">
            {/* Header */}
            <header className="d-flex align-items-center gap-3 mb-5 px-lg-4">
                <Link href="/dashboard/tutorials" className="btn btn-light rounded-circle p-2 shadow-sm">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="h4 mb-0 fw-bold">Manual de Auxilio (SOS)</h1>
            </header>

            <div className="row justify-content-center px-lg-4">
                <div className="col-lg-8">
                    {/* Intro Section */}
                    <div className="text-center mb-5">
                        <div className="bg-danger text-white p-4 rounded-circle d-inline-block mb-4 shadow-lg animate-pulse">
                            <AlertTriangle size={48} />
                        </div>
                        <h2 className="fw-bold">No estás solo en la crisis</h2>
                        <p className="text-muted lead px-md-5">
                            La sección SOS está diseñada para ser tu refugio inmediato cuando te sientes abrumado, tentado o triste.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="d-flex flex-column gap-4 mb-5">
                        <TutorialFeature
                            icon={<Phone size={24} className="text-danger" />}
                            title="Llama a un Líder"
                            desc="Si configuraste el número de tu líder en tu perfil, el botón rojo de llamada te conectará instantáneamente con alguien que puede orar por ti."
                        />
                        <TutorialFeature
                            icon={<Music size={24} className="text-primary" />}
                            title="Música de Adoración"
                            desc="Encuentra canciones seleccionadas para calmar tu mente y recordarte las promesas de Dios en medio de la tormenta."
                        />
                        <TutorialFeature
                            icon={<Shield size={24} className="text-success" />}
                            title="Verdades Bíblicas"
                            desc="Lee verdades poderosas que contrarrestan las mentiras que el enemigo intenta susurrarte en momentos de debilidad."
                        />
                        <TutorialFeature
                            icon={<Heart size={24} className="text-warning" />}
                            title="Paz Inmediata"
                            desc="Solo respira y deja que el contenido de la página te guíe de vuelta a la calma de la mano de Dios."
                        />
                    </div>

                    {/* Profile Config Note */}
                    <div className="card bg-light border-0 rounded-4 p-4 text-center">
                        <h5 className="fw-bold mb-2">Configuración Importante</h5>
                        <p className="small text-muted mb-3">Recuerda agregar el teléfono de tu líder en tu perfil para que el botón de llamada funcione correctamente.</p>
                        <Link href="/dashboard/profile" className="btn btn-outline-danger rounded-pill px-4 btn-sm">
                            Configurar ahora
                        </Link>
                    </div>

                    {/* Final Button */}
                    <div className="mt-5 text-center">
                        <Link href="/dashboard/sos" className="btn btn-danger rounded-pill btn-lg px-5 shadow-lg fw-bold">
                            Ver Página de SOS
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TutorialFeature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="d-flex gap-4 align-items-start bg-light bg-opacity-50 p-4 rounded-4 border">
            <div className="bg-white p-3 rounded-4 shadow-sm shrink-0">
                {icon}
            </div>
            <div>
                <h5 className="fw-bold mb-2">{title}</h5>
                <p className="text-muted mb-0">{desc}</p>
            </div>
        </div>
    );
}

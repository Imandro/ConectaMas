"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Users,
    MessageCircle,
    Heart,
    ShieldCheck,
    HelpingHand
} from 'lucide-react';
import Link from 'next/link';

export default function CommunityTutorial() {
    return (
        <div className="container-fluid py-4 min-vh-100 bg-white">
            {/* Header */}
            <header className="d-flex align-items-center gap-3 mb-5 px-lg-4">
                <Link href="/dashboard/tutorials" className="btn btn-light rounded-circle p-2 shadow-sm">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="h4 mb-0 fw-bold">Manual de Comunidad</h1>
            </header>

            <div className="row justify-content-center px-lg-4">
                <div className="col-lg-8">
                    {/* Intro Section */}
                    <div className="text-center mb-5">
                        <div className="bg-info text-white p-4 rounded-circle d-inline-block mb-4 shadow-lg">
                            <Users size={48} />
                        </div>
                        <h2 className="fw-bold">Comunidad Conecta+ BETA</h2>
                        <p className="text-muted lead">
                            Un espacio seguro para compartir, sanar y crecer junto a otros jóvenes que entienden tus luchas.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="row g-4 mb-5">
                        <div className="col-md-6">
                            <div className="card h-100 border-0 bg-light p-4 rounded-4 shadow-sm text-center">
                                <MessageCircle className="text-info mx-auto mb-3" size={32} />
                                <h5 className="fw-bold">Foros Temáticos</h5>
                                <p className="small text-muted mb-0">Participa en discusiones sobre ansiedad, propósito, fe y mucho más en nuestros foros categorizados.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card h-100 border-0 bg-light p-4 rounded-4 shadow-sm text-center">
                                <HelpingHand className="text-primary mx-auto mb-3" size={32} />
                                <h5 className="fw-bold">Pedidos de Oración</h5>
                                <p className="small text-muted mb-0">Publica tus necesidades y deja que otros oren por ti. Recibirás una notificación cuando alguien esté intercediendo.</p>
                            </div>
                        </div>
                    </div>

                    {/* Safety Note */}
                    <div className="alert bg-info bg-opacity-10 border-info border-opacity-20 rounded-4 p-4 d-flex gap-3">
                        <ShieldCheck className="text-info shrink-0" size={32} />
                        <div>
                            <h5 className="fw-bold text-info mb-1">Comunidad Segura</h5>
                            <p className="small mb-0 opacity-75">
                                Conecta+ es un espacio de edificación. Contamos con moderadores que aseguran que todas las conversaciones sean respetuosas y llenas de amor cristiano.
                            </p>
                        </div>
                    </div>

                    {/* Final Button */}
                    <div className="mt-5 text-center">
                        <Link href="/dashboard/community" className="btn btn-info rounded-pill btn-lg px-5 shadow-lg fw-bold text-white">
                            Explorar la Comunidad
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

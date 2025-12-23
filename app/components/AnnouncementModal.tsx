"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Rocket, Heart, PartyPopper } from "lucide-react";
import Link from "next/link";

export default function AnnouncementModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if the user has already seen this specific announcement
        const hasSeen = localStorage.getItem("conecta_growth_reset_announcement");
        if (!hasSeen) {
            // Short delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("conecta_growth_reset_announcement", "true");
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                style={{
                    zIndex: 9999,
                    backgroundColor: 'rgba(11, 27, 50, 0.85)',
                    backdropFilter: 'blur(8px)'
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    className="bg-white rounded-4 w-100 shadow-2xl overflow-hidden position-relative"
                    style={{
                        maxWidth: '550px',
                        border: '2px solid rgba(255, 215, 0, 0.3)'
                    }}
                >
                    {/* Decorative Background Elements */}
                    <div className="position-absolute top-0 end-0 p-4 opacity-10">
                        <Rocket size={120} className="text-primary rotate-12" />
                    </div>

                    {/* Header/Banner */}
                    <div className="bg-primary text-white p-4 pt-5 text-center position-relative">
                        <div className="position-absolute top-0 start-50 translate-middle-x mt-n3 bg-warning rounded-circle p-3 shadow-lg" style={{ top: '0' }}>
                            <PartyPopper size={32} className="text-primary" />
                        </div>
                        <h2 className="fw-bold mt-3 mb-1" style={{ letterSpacing: '-0.5px' }}>
                            ¡Algo Increíble Sucedió!
                        </h2>
                        <p className="text-warning small fw-bold mb-0">NOTICIA IMPORTANTE PARA LA COMUNIDAD</p>
                    </div>

                    {/* Content */}
                    <div className="p-4 p-md-5 text-center">
                        <div className="mb-4">
                            <p className="text-primary lead fw-medium mb-3">
                                Estamos impactados por su apoyo. En solo 3 días:
                            </p>

                            <div className="d-flex justify-content-center gap-4 mb-4">
                                <div className="text-center">
                                    <div className="h2 fw-bold text-primary mb-0">+20,000</div>
                                    <div className="small text-muted text-uppercase">Visitas</div>
                                </div>
                                <div className="vr opacity-20"></div>
                                <div className="text-center">
                                    <div className="h2 fw-bold text-primary mb-0">+700</div>
                                    <div className="small text-muted text-uppercase">Registros</div>
                                </div>
                            </div>

                            <p className="text-muted small mb-4 px-md-3">
                                Esta "cosa loca e increíble" superó todas nuestras expectativas. Los recursos que pensamos durarían un mes se agotaron en solo 72 horas, lo que causó una interrupción técnica.
                            </p>

                            <div className="bg-light rounded-3 p-3 mb-4 text-start border-start border-4 border-warning">
                                <p className="small text-primary mb-0">
                                    <Heart size={16} className="text-danger me-2 d-inline" fill="currentColor" />
                                    <strong>Sentimos mucho las molestias:</strong> Para asegurar la estabilidad total, hemos migrado a una infraestructura mucho más potente. Necesitamos que <strong>vuelvas a crear tu cuenta</strong> para empezar juntos esta nueva etapa.
                                </p>
                            </div>
                        </div>

                        <div className="d-grid gap-2">
                            <Link
                                href="/auth/register"
                                onClick={handleClose}
                                className="btn btn-primary py-3 rounded-pill fw-bold shadow-lg transform-hover"
                            >
                                ¡VAMOS! CREAR MI CUENTA NUEVA
                            </Link>
                            <button
                                onClick={handleClose}
                                className="btn btn-link text-muted small text-decoration-none"
                            >
                                Entendido, cerrar aviso
                            </button>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="btn btn-link text-white position-absolute top-0 end-0 m-3 p-1 opacity-75 hover-opacity-100"
                        style={{ zIndex: 10 }}
                    >
                        <X size={24} />
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

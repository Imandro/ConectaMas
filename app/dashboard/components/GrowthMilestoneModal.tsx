"use client";

import { useEffect, useState } from "react";
import { Users, X, Rocket, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GrowthMilestoneModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        checkAndShowModal();
    }, []);

    const checkAndShowModal = () => {
        const STORAGE_KEY = 'growth_milestone_views';
        const MAX_VIEWS_PER_DAY = 3;
        const today = new Date().toISOString().split('T')[0];

        try {
            const data = localStorage.getItem(STORAGE_KEY);
            let views = { date: today, count: 0 };

            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.date === today) {
                    views = parsed;
                } else {
                    // Reset if it's a new day
                    views = { date: today, count: 0 };
                }
            }

            if (views.count < MAX_VIEWS_PER_DAY) {
                // Delay slightly to not conflict with other popups or load times
                setTimeout(() => setIsOpen(true), 2000);
            }
        } catch (error) {
            console.error("Error checking growth modal views:", error);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        incrementViewCount();
    };

    const incrementViewCount = () => {
        const STORAGE_KEY = 'growth_milestone_views';
        const today = new Date().toISOString().split('T')[0];

        try {
            const data = localStorage.getItem(STORAGE_KEY);
            let views = { date: today, count: 0 };

            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.date === today) views = parsed;
            }

            views.count += 1;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1070 }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="position-relative mx-3 w-100"
                        style={{ maxWidth: '360px' }}
                    >
                        <button
                            onClick={handleClose}
                            className="btn btn-dark rounded-circle position-absolute top-0 end-0 m-2 shadow-sm z-50 p-2"
                            style={{ transform: 'translate(40%, -40%)' }}
                        >
                            <X size={20} />
                        </button>

                        <div className="bg-white rounded-5 overflow-hidden shadow-2xl">
                            {/* Header Gradient */}
                            <div className="bg-primary text-white p-4 text-center position-relative overflow-hidden">
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-br from-primary to-primary-dark opacity-90"></div>
                                <div className="position-relative z-10 py-3">
                                    <div className="bg-white bg-opacity-20 d-inline-flex p-3 rounded-circle mb-3 backdrop-blur-md shadow-inner">
                                        <Users size={40} className="text-warning" />
                                    </div>
                                    <h2 className="fw-bold mb-1">¡Somos 500+!</h2>
                                    <p className="m-0 opacity-90 small">Familia Conecta+</p>
                                </div>
                                {/* Confetti/Decorations */}
                                <div className="position-absolute top-0 start-0 p-2 opacity-25">
                                    <Rocket size={80} className="text-white rotate-45" />
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="text-center mb-4">
                                    <h5 className="fw-bold text-secondary mb-2">¡Gracias por ser parte!</h5>
                                    <p className="text-muted small lh-base">
                                        Dios está haciendo cosas increíbles. Juntos estamos construyendo una generación diferente.
                                    </p>
                                </div>

                                {/* Mission Progress */}
                                <div className="bg-light rounded-4 p-3 mb-4 border border-secondary-subtle">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-bold text-primary small">Nuestra Misión</span>
                                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill">En camino</span>
                                    </div>
                                    <h3 className="fw-extrabold text-dark mb-1 d-flex align-items-center gap-2">
                                        1,000 <span className="text-muted fs-6 fw-normal">Jóvenes</span>
                                    </h3>
                                    <div className="progress rounded-pill bg-white mb-2" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-warning rounded-pill w-50" role="progressbar"></div>
                                    </div>
                                    <p className="extra-small text-muted m-0">¡Sigue invitando a tus amigos!</p>
                                </div>

                                <button
                                    onClick={handleClose}
                                    className="btn btn-primary w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 hover-scale shadow-sm"
                                >
                                    ¡Vamos por más! <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

"use client";

import { useEffect, useState } from "react";
import { X, Heart, Globe, CreditCard, ChevronRight, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";

export default function DonationMissionsModal() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        checkAndShowModal();
    }, []);

    const checkAndShowModal = () => {
        const STORAGE_KEY = 'donation_modal_views_v2';
        const MAX_VIEWS_PER_DAY = 3;
        const today = new Date().toISOString().split('T')[0];

        try {
            const data = localStorage.getItem(STORAGE_KEY);
            let views = { date: today, count: 0 };

            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.date === today) {
                    views = parsed;
                }
            }

            if (views.count < MAX_VIEWS_PER_DAY) {
                // Show after a delay so it doesn't clash with growth modal immediately
                setTimeout(() => setIsOpen(true), 15000); // 15 seconds delay
            }
        } catch (error) {
            console.error("Error checking donation modal views:", error);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        incrementViewCount();
    };

    const incrementViewCount = () => {
        const STORAGE_KEY = 'donation_modal_views_v2';
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
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1075 }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-60 backdrop-blur-md"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="position-relative mx-3 w-100"
                        style={{ maxWidth: '380px' }}
                    >
                        <div className="bg-white rounded-5 overflow-hidden shadow-2xl border border-warning border-opacity-25 pb-3">
                            {/* Header Image / Gradient */}
                            <div className="bg-warning text-dark p-4 text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)' }}>
                                <div className="position-relative z-10 pt-2">
                                    <div className="bg-white p-3 rounded-circle d-inline-flex mb-2 shadow-lg animate-bounce-custom">
                                        <Globe size={40} className="text-warning" />
                                    </div>
                                    <h3 className="fw-black m-0 text-dark" style={{ letterSpacing: '-0.5px' }}>{t.donation_modal.title}</h3>
                                    <p className="text-dark opacity-75 extra-small fw-bold tracking-widest mt-1 text-uppercase">{t.donation_modal.subtitle}</p>
                                </div>
                                {/* Decorative Circles */}
                                <div className="position-absolute top-0 start-0 bg-white opacity-25 rounded-circle" style={{ width: '100px', height: '100px', transform: 'translate(-30%, -30%)' }}></div>
                                <div className="position-absolute bottom-0 end-0 bg-white opacity-25 rounded-circle" style={{ width: '80px', height: '80px', transform: 'translate(30%, 30%)' }}></div>
                            </div>

                            <div className="px-4 py-3">
                                <p className="text-secondary small lh-base mb-3 text-center fw-medium">
                                    {t.donation_modal.description}
                                </p>

                                {/* Missions Flags */}
                                <div className="d-flex justify-content-center gap-3 mb-4">
                                    <div className="text-center">
                                        <span className="fs-1 d-block mb-1 shadow-sm rounded-circle bg-light p-1">🇧🇷</span>
                                        <span className="extra-small fw-bold text-muted text-uppercase">Brasil</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="fs-1 d-block mb-1 shadow-sm rounded-circle bg-light p-1">🇳🇮</span>
                                        <span className="extra-small fw-bold text-muted text-uppercase">Nica</span>
                                    </div>
                                    <div className="text-center align-self-center">
                                        <span className="badge bg-primary-subtle text-primary rounded-pill px-2 py-1 extra-small fw-bold">+ Naciones</span>
                                    </div>
                                </div>

                                {/* Bank Details Compact */}
                                <div className="bg-light p-3 rounded-4 border border-light-subtle mb-3 position-relative overflow-hidden">
                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                        <span className="extra-small fw-bold text-muted text-uppercase d-flex align-items-center gap-1"><CreditCard size={12} /> {t.donation_modal.bank_details}</span>
                                        <span className="badge bg-dark text-white rounded-pill px-2">Bancolombia</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <p className="m-0 fw-black fs-5 tracking-tighter text-dark font-monospace">{t.donation_modal.bank_account}</p>
                                        <button className="btn btn-sm btn-link text-primary p-0" onClick={() => { navigator.clipboard.writeText(t.donation_modal.bank_account); alert('Copiado!') }}>Copiar</button>
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <a
                                        href="https://www.paypal.me/Imandrox/1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-warning w-100 rounded-pill py-3 fw-black d-flex align-items-center justify-content-center gap-2 hover-scale shadow-sm text-dark"
                                    >
                                        <Heart size={20} fill="currentColor" className="text-danger" /> {t.donation_modal.button_support}
                                    </a>
                                    <button
                                        onClick={handleClose}
                                        className="btn btn-light w-100 rounded-pill py-2 fw-bold text-muted small"
                                    >
                                        Quizás más tarde
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

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
                        style={{ maxWidth: '320px' }}
                    >
                        <div className="bg-white rounded-4 overflow-hidden shadow-2xl border border-warning border-opacity-25 pb-2" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                            {/* Header Image / Gradient */}
                            <div className="bg-warning text-dark p-3 text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)' }}>
                                <div className="position-relative z-10 pt-1">
                                    <div className="bg-white p-2 rounded-circle d-inline-flex mb-1 shadow-sm animate-bounce-custom">
                                        <Globe size={28} className="text-warning" />
                                    </div>
                                    <h5 className="fw-black m-0 text-dark" style={{ letterSpacing: '-0.5px' }}>{t.donation_modal.title}</h5>
                                    <p className="text-dark opacity-75 extra-small fw-bold tracking-widest m-0 text-uppercase" style={{ fontSize: '0.65rem' }}>{t.donation_modal.subtitle}</p>
                                </div>
                                {/* Decorative Circles */}
                                <div className="position-absolute top-0 start-0 bg-white opacity-25 rounded-circle" style={{ width: '60px', height: '60px', transform: 'translate(-30%, -30%)' }}></div>
                                <div className="position-absolute bottom-0 end-0 bg-white opacity-25 rounded-circle" style={{ width: '50px', height: '50px', transform: 'translate(30%, 30%)' }}></div>
                            </div>

                            <div className="px-3 py-2">
                                <p className="text-secondary small lh-sm mb-2 text-center fw-medium" style={{ fontSize: '0.8rem' }}>
                                    {t.donation_modal.description}
                                </p>

                                {/* Missions Flags */}
                                <div className="d-flex justify-content-center gap-2 mb-3">
                                    <div className="text-center">
                                        <span className="fs-3 d-block mb-0 shadow-sm rounded-circle bg-light p-1">🇧🇷</span>
                                        <span className="extra-small fw-bold text-muted text-uppercase" style={{ fontSize: '0.6rem' }}>{t.donation_modal.mission_brasil}</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="fs-3 d-block mb-0 shadow-sm rounded-circle bg-light p-1">🇳🇮</span>
                                        <span className="extra-small fw-bold text-muted text-uppercase" style={{ fontSize: '0.6rem' }}>{t.donation_modal.mission_nicaragua}</span>
                                    </div>
                                </div>

                                {/* Bank Details Compact */}
                                <div className="bg-light p-2 rounded-3 border border-light-subtle mb-2 position-relative overflow-hidden">
                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                        <span className="extra-small fw-bold text-muted text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '0.65rem' }}><CreditCard size={10} /> {t.donation_modal.bank_details}</span>
                                        <span className="badge bg-dark text-white rounded-pill px-2 py-0" style={{ fontSize: '0.65rem' }}>Lafise</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <p className="m-0 fw-black tracking-tighter text-dark font-monospace" style={{ fontSize: '0.9rem' }}>{t.donation_modal.bank_account}</p>
                                        <button className="btn btn-sm btn-link text-primary p-0" style={{ fontSize: '0.75rem' }} onClick={() => { navigator.clipboard.writeText(t.donation_modal.bank_account); alert('Copiado!') }}>Copiar</button>
                                    </div>
                                </div>

                                {/* PayPal Details Compact */}
                                <div className="bg-light p-2 rounded-3 border border-light-subtle mb-3 position-relative overflow-hidden">
                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                        <span className="extra-small fw-bold text-muted text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '0.65rem' }}>
                                            <Heart size={10} /> PayPal
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <p className="m-0 fw-black tracking-tighter text-dark font-monospace" style={{ fontSize: '0.9rem' }}>@Imandrox</p>
                                        <a href="https://www.paypal.me/Imandrox/1" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary rounded-pill px-3 py-0 fw-bold" style={{ fontSize: '0.7rem' }}>Donar</a>
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <a
                                        href="https://www.paypal.me/Imandrox/1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-warning w-100 rounded-pill py-2 fw-black d-flex align-items-center justify-content-center gap-2 hover-scale shadow-sm text-dark"
                                        style={{ fontSize: '0.9rem' }}
                                    >
                                        <Heart size={16} fill="currentColor" className="text-danger" /> {t.donation_modal.button_support}
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

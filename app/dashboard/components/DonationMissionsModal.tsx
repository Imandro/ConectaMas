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
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="position-relative mx-3 w-100"
                        style={{ maxWidth: '400px' }}
                    >
                        <button
                            onClick={handleClose}
                            className="btn btn-dark rounded-circle position-absolute top-0 end-0 m-2 shadow-sm z-50 p-1"
                            style={{ width: '30px', height: '30px', transform: 'translate(30%, -30%)' }}
                        >
                            <X size={18} />
                        </button>

                        <div className="bg-white rounded-5 overflow-hidden shadow-2xl border border-warning border-opacity-25">
                            {/* Header */}
                            <div className="bg-dark text-white p-4 text-center position-relative overflow-hidden">
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-br from-gray-900 to-black opacity-90"></div>
                                <div className="position-relative z-10">
                                    <div className="bg-warning text-dark p-2 rounded-circle d-inline-flex mb-3 shadow-lg">
                                        <Globe size={32} />
                                    </div>
                                    <h3 className="fw-black m-0 text-warning">{t.donation_modal.title}</h3>
                                    <p className="text-white-50 extra-small fw-bold tracking-widest mt-1 text-uppercase">{t.donation_modal.subtitle}</p>
                                </div>
                            </div>

                            <div className="p-4">
                                <p className="text-secondary small lh-lg mb-4 text-center">
                                    {t.donation_modal.description}
                                </p>

                                {/* Missions Section */}
                                <div className="bg-light rounded-4 p-3 mb-4 border border-light-subtle">
                                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                                        <ChevronRight size={18} /> {t.donation_modal.missions_title}
                                    </h6>
                                    <div className="d-flex flex-column gap-2">
                                        <div className="bg-white p-2 rounded-3 shadow-sm d-flex align-items-center justify-content-between">
                                            <span className="fw-bold small">{t.donation_modal.mission_brasil}</span>
                                            <span className="badge bg-info-subtle text-info rounded-pill px-2">En proceso</span>
                                        </div>
                                        <div className="bg-white p-2 rounded-3 shadow-sm d-flex align-items-center justify-content-between">
                                            <span className="fw-bold small">{t.donation_modal.mission_nicaragua}</span>
                                            <span className="badge bg-info-subtle text-info rounded-pill px-2">En proceso</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="space-y-3 mb-4">
                                    {/* Changed background to white with shadow for better visibility on all devices */}
                                    <div className="bg-white p-3 rounded-4 border shadow-sm mb-2">
                                        <h6 className="fw-bold text-dark small mb-2 d-flex align-items-center gap-2">
                                            <CreditCard size={18} className="text-primary" /> {t.donation_modal.bank_details}
                                        </h6>
                                        <div className="ps-4">
                                            <p className="m-0 fw-bold text-secondary small">{t.donation_modal.bank_name}</p>
                                            <p className="m-0 fw-extrabold fs-5 tracking-tighter text-dark">{t.donation_modal.bank_account}</p>
                                        </div>
                                    </div>

                                    <a
                                        href="https://www.paypal.me/Imandrox/1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-warning w-100 rounded-pill py-3 fw-black d-flex align-items-center justify-content-center gap-2 hover-scale shadow-sm"
                                        style={{ backgroundColor: '#f3b33e', border: 'none' }}
                                    >
                                        <Heart size={20} fill="currentColor" /> {t.donation_modal.button_support}
                                    </a>
                                </div>

                                {/* Collaborators */}
                                <div className="pt-2 border-top">
                                    <p className="text-center extra-small text-muted mb-2 fw-bold text-uppercase">{t.donation_modal.collaborators_title}</p>
                                    <div className="d-flex flex-column gap-2 align-items-center">
                                        <div className="bg-success bg-opacity-10 px-3 py-1 rounded-pill d-flex align-items-center gap-2 border border-success border-opacity-20">
                                            <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                            <span className="extra-small fw-bold text-success">{t.donation_modal.collaborator_marvin}</span>
                                        </div>
                                        {/* Removed collaborator count as requested */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

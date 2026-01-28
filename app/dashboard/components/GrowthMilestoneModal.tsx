"use client";

import { useEffect, useState } from "react";
import { Users, X, TrendingUp, ChevronRight, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserCount } from "../actions";
import { useLanguage } from "@/app/LanguageContext";

export default function GrowthMilestoneModal() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        // Fetch real count
        getUserCount().then(count => setUserCount(count));

        checkAndShowModal();
    }, []);

    const checkAndShowModal = () => {
        const STORAGE_KEY = 'growth_milestone_views_v5'; // Version bump
        const MAX_VIEWS_PER_DAY = 1;
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
                // Delay slightly 
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

    const handleShare = async () => {
        const shareData = {
            title: t.growth_modal.share_title,
            text: t.growth_modal.share_text,
            url: window.location.origin
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(shareData.url);
                alert(t.growth_modal.link_copied);
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const incrementViewCount = () => {
        const STORAGE_KEY = 'growth_milestone_views_v5';
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

    const GOAL = 1500;
    const progress = Math.min((userCount / GOAL) * 100, 100);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1070 }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-40 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="position-relative mx-3 w-100"
                        style={{ maxWidth: '320px' }}
                    >
                        <button
                            onClick={handleClose}
                            className="btn btn-dark rounded-circle position-absolute top-0 end-0 m-2 shadow-sm z-50 p-1"
                            style={{ width: '30px', height: '30px', transform: 'translate(30%, -30%)' }}
                        >
                            <X size={18} />
                        </button>

                        <div className="bg-white rounded-4 overflow-hidden shadow-2xl">
                            {/* Header Compact */}
                            <div className="bg-primary text-white p-3 text-center position-relative overflow-hidden">
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-r from-primary to-blue-600 opacity-90"></div>

                                <div className="position-relative z-10 d-flex align-items-center justify-content-center gap-3">
                                    <div className="bg-white bg-opacity-20 p-2 rounded-circle backdrop-blur-md shadow-inner">
                                        <TrendingUp size={24} className="text-warning" />
                                    </div>
                                    <div className="text-start">
                                        <h4 className="fw-bold m-0 lh-1">{t.growth_modal.title}</h4>
                                        <small className="opacity-90 fw-bold">{t.growth_modal.real_users}</small>
                                    </div>
                                </div>
                                <div className="position-absolute top-0 end-0 p-1 opacity-10">
                                    <Users size={60} />
                                </div>
                            </div>

                            <div className="p-4 pt-3">
                                <div className="text-center mb-3">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="d-inline-block"
                                    >
                                        <span className="display-6 fw-extrabold text-dark d-block text-gradient-primary">
                                            {userCount > 0 ? userCount : '...'}
                                        </span>
                                        <span className="text-muted small fw-bold text-uppercase tracking-wider">{t.growth_modal.real_users}</span>
                                    </motion.div>
                                </div>

                                {/* Mission Progress */}
                                <div className="bg-light rounded-3 p-3 mb-3 border border-light-subtle">
                                    <div className="d-flex justify-content-between align-items-end mb-1">
                                        <span className="fw-bold text-primary extra-small text-uppercase">{t.growth_modal.mission_goal}</span>
                                        <span className="fw-bold text-dark small">1,000</span>
                                    </div>
                                    <div className="progress rounded-pill bg-white shadow-inner" style={{ height: '12px' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="progress-bar bg-warning rounded-pill"
                                            role="progressbar"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between mt-1">
                                        <small className="extra-small text-muted">{t.growth_modal.completed.replace('{progress}', progress.toFixed(1))}</small>
                                        <small className="extra-small text-success fw-bold">{t.growth_modal.almost_there}</small>
                                    </div>
                                </div>

                                <button
                                    onClick={handleClose}
                                    className="btn btn-primary w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2 hover-scale shadow-sm small"
                                >
                                    {t.growth_modal.button} <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

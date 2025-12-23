"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SupportFundingAd from "./SupportFundingAd";

export default function SupportAdModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        checkAndShowModal();
    }, []);

    const checkAndShowModal = () => {
        const STORAGE_KEY = 'support_ad_views';
        const MAX_VIEWS = 2;
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

            if (views.count < MAX_VIEWS) {
                setIsOpen(true);
                // Increment view count immediately to prevent double show on strict mode double-invoke
                views.count += 1;
                views.date = today; // Ensure date is set
                localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
            }
        } catch (error) {
            console.error("Error checking support ad views:", error);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="position-relative mx-3"
                        style={{ maxWidth: '400px', width: '100%' }}
                    >
                        <button
                            onClick={handleClose}
                            className="btn btn-dark rounded-circle position-absolute top-0 end-0 m-2 shadow-sm z-50 p-2"
                            style={{ transform: 'translate(30%, -30%)' }}
                        >
                            <X size={20} />
                        </button>

                        <div className="bg-white rounded-4 overflow-hidden shadow-lg">
                            <SupportFundingAd />
                            <div className="px-4 pb-4 text-center">
                                <button onClick={handleClose} className="btn btn-link text-muted text-decoration-none small">
                                    Quizás más tarde
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

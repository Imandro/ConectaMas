"use client";

import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../LanguageContext";

interface CheckinModalProps {
    hasCheckedIn: boolean;
    onCheckin: (mood: string) => void;
    isLoading: boolean;
}

export default function CheckinModal({ hasCheckedIn, onCheckin, isLoading }: CheckinModalProps) {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Only show if not checked in today
        if (!hasCheckedIn) {
            // Check if already shown today
            const lastShown = localStorage.getItem("checkin_modal_shown");
            const today = new Date().toDateString();

            if (lastShown !== today) {
                const timer = setTimeout(() => {
                    setIsOpen(true);
                    localStorage.setItem("checkin_modal_shown", today);
                }, 1500); // Show after 1.5s
                return () => clearTimeout(timer);
            }
        }
    }, [hasCheckedIn]);

    const handleMoodSelect = (mood: string) => {
        onCheckin(mood);
        setTimeout(() => setIsOpen(false), 1000);
    };

    if (!isOpen || hasCheckedIn) return null;

    const localeMap: Record<string, string> = { es: 'es-ES', en: 'en-US', pt: 'pt-BR' };

    return (
        <AnimatePresence>
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4" style={{ zIndex: 10000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-5 shadow-lg overflow-hidden"
                    style={{ maxWidth: '420px', width: '100%' }}
                >
                    {/* Header */}
                    <div className="position-relative p-4 text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="btn btn-link position-absolute top-0 end-0 m-2 text-white p-1"
                            style={{ opacity: 0.7 }}
                        >
                            <X size={20} />
                        </button>

                        <div className="bg-white p-3 rounded-circle d-inline-block shadow-sm mb-2">
                            <Heart size={40} className="text-danger" fill="#dc3545" />
                        </div>
                        <h3 className="fw-bold text-white mb-1">{t.checkin_modal.title}</h3>
                        <p className="text-white-50 small mb-0">{new Date().toLocaleDateString(localeMap[language] || 'es-ES', { day: 'numeric', month: 'long' })}</p>
                    </div>

                    {/* Content */}
                    <div className="p-4" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
                        <p className="text-center text-secondary mb-4 small">
                            {t.checkin_modal.subtitle}
                        </p>

                        <div className="d-flex justify-content-center flex-wrap gap-2 mb-4" style={{
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}>
                            {[
                                { emoji: '😔', label: t.checkin_modal.moods.sad },
                                { emoji: '😐', label: t.checkin_modal.moods.neutral },
                                { emoji: '🙂', label: t.checkin_modal.moods.good },
                                { emoji: '😄', label: t.checkin_modal.moods.happy },
                                { emoji: '🙌', label: t.checkin_modal.moods.blessed }
                            ].map((mood, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleMoodSelect(mood.emoji)}
                                    disabled={isLoading}
                                    className="btn btn-light rounded-4 p-2 p-sm-3 shadow-sm border-0 hover-scale transition-all d-flex flex-column align-items-center gap-1"
                                    style={{ width: '68px', flexShrink: 0 }}
                                >
                                    <span className="fs-2">{mood.emoji}</span>
                                    <small className="text-muted fw-medium" style={{ fontSize: '0.6rem' }}>{mood.label}</small>
                                </button>
                            ))}
                        </div>

                        <p className="text-center text-muted extra-small mb-0">
                            {t.checkin_modal.streak_keep}
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

import { useState, useEffect } from "react";
import { Instagram, X } from "lucide-react";
import { confirmInstagramFollow } from "@/app/dashboard/actions/instagram";

const SHOW_INTERVAL_DAYS = 3; // Show every 3 days

interface InstagramModalProps {
    hasFollowed: boolean;
}

export default function InstagramModal({ hasFollowed }: InstagramModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const sessionDismissed = sessionStorage.getItem("instagram_modal_dismissed");
        const lastShown = localStorage.getItem("instagram_modal_last_shown");
        const today = new Date().toDateString();

        if (!hasFollowed && !sessionDismissed) {
            // Check if enough days have passed
            if (!lastShown) {
                // First time - show after 6 seconds
                const timer = setTimeout(() => {
                    setIsOpen(true);
                    localStorage.setItem("instagram_modal_last_shown", today);
                }, 6000);
                return () => clearTimeout(timer);
            } else {
                const daysSinceLastShown = Math.floor((new Date().getTime() - new Date(lastShown).getTime()) / (1000 * 60 * 60 * 24));
                if (daysSinceLastShown >= SHOW_INTERVAL_DAYS) {
                    const timer = setTimeout(() => {
                        setIsOpen(true);
                        localStorage.setItem("instagram_modal_last_shown", today);
                    }, 6000);
                    return () => clearTimeout(timer);
                }
            }
        }
    }, [hasFollowed]);

    if (!isOpen) return null;

    const handleFollowClick = () => {
        window.open("https://www.instagram.com/_conectamass?igsh=MTBrMnJtYjI1Z3FlOA==", "_blank");
    };

    const handleConfirmFollowed = async () => {
        await confirmInstagramFollow();
        setIsOpen(false);
    };

    const handleDismissLater = () => {
        sessionStorage.setItem("instagram_modal_dismissed", "true");
        setIsOpen(false);
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4" style={{ zIndex: 9998, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white rounded-5 shadow-lg overflow-hidden animate-in fade-in zoom-in duration-300" style={{ maxWidth: '400px', width: '100%' }}>
                {/* Header */}
                <div className="position-relative overflow-hidden p-4 text-center" style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}>
                    <div className="bg-white p-3 rounded-circle d-inline-block shadow-sm mb-2 position-relative">
                        <Instagram size={48} className="text-danger" />
                        <div className="position-absolute top-0 end-0 bg-danger rounded-circle border border-2 border-white" style={{ width: '16px', height: '16px' }}></div>
                    </div>
                    <h3 className="fw-bold text-white mb-1">Síguenos en Instagram</h3>
                    <p className="text-white-50 small mb-0">@_conectamass</p>
                </div>

                {/* Content */}
                <div className="p-4 pt-3">
                    <p className="text-center text-secondary mb-4 small lh-sm">
                        Únete a nuestra comunidad en Instagram. Contenido diario, testimonios reales y motivación que transforma vidas.
                    </p>

                    <div className="d-grid gap-2">
                        <button
                            onClick={handleFollowClick}
                            className="btn btn-lg fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-sm hover-scale text-white"
                            style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', border: 'none' }}
                        >
                            <Instagram size={20} fill="white" />
                            Seguir Ahora
                        </button>

                        <button
                            onClick={handleConfirmFollowed}
                            className="btn btn-outline-primary fw-bold rounded-pill border-2 mt-2"
                        >
                            Ya los sigo, no mostrar más
                        </button>

                        <button
                            onClick={handleDismissLater}
                            className="btn btn-link text-muted text-decoration-none small fw-medium"
                        >
                            Quizás más tarde
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

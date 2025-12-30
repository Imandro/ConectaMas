"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { confirmWhatsappJoin } from "@/app/dashboard/actions/whatsapp";

interface WhatsappModalProps {
    hasJoined: boolean;
}

export default function WhatsappModal({ hasJoined }: WhatsappModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show only if not joined in DB and not dismissed in this session
        const sessionDismissed = sessionStorage.getItem("whatsapp_modal_dismissed");
        if (!hasJoined && !sessionDismissed) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [hasJoined]);

    if (!isOpen) return null;

    const handleJoinClick = () => {
        window.open("https://chat.whatsapp.com/BymmU4EoImgFxLVbUfCzBX", "_blank");
    };

    const handleConfirmJoined = async () => {
        await confirmWhatsappJoin();
        setIsOpen(false);
    };

    const handleDismissLater = () => {
        sessionStorage.setItem("whatsapp_modal_dismissed", "true");
        setIsOpen(false);
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4" style={{ zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white rounded-5 shadow-lg overflow-hidden animate-in fade-in zoom-in duration-300" style={{ maxWidth: '400px', width: '100%' }}>
                {/* Header Image / Icon */}
                <div className="bg-success bg-opacity-10 p-4 text-center">
                    <div className="bg-white p-3 rounded-circle d-inline-block shadow-sm mb-2 position-relative">
                        <MessageCircle size={48} className="text-success" fill="#25D366" color="white" />
                        <div className="position-absolute top-0 end-0 bg-danger rounded-circle border border-2 border-white" style={{ width: '16px', height: '16px' }}></div>
                    </div>
                    <h3 className="fw-bold text-dark mb-1">Únete a la Tribu</h3>
                    <p className="text-muted small mb-0">¡No camines solo! Conecta con otros.</p>
                </div>

                {/* Content */}
                <div className="p-4 pt-3">
                    <p className="text-center text-secondary mb-4 small lh-sm">
                        Sé parte de nuestro grupo exclusivo de WhatsApp. Recibe apoyo diario, noticias y motivación directamente en tu celular.
                    </p>

                    <div className="d-grid gap-2">
                        <button
                            onClick={handleJoinClick}
                            className="btn btn-success btn-lg fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-sm hover-scale"
                            style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                        >
                            <MessageCircle size={20} fill="white" />
                            Unirme Ahora
                        </button>

                        <button
                            onClick={handleConfirmJoined}
                            className="btn btn-outline-primary fw-bold rounded-pill border-2 mt-2"
                        >
                            Apartir de ahora, no mostar más
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

"use client";

import { useState } from "react";
import { createPrayerRequest, prayForRequest } from "./actions";
import { Heart, Send, Shield, User, MessageSquare, HeartHandshake } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface Prayer {
    id: string;
    content: string;
    isAnonymous: boolean;
    prayCount: number;
    createdAt: Date;
    user: {
        name: string | null;
        image: string | null;
    };
    _count?: {
        prayers: number;
    };
}

interface PrayerWallViewProps {
    initialPrayers: any[];
    currentUserId: string;
}

export default function PrayerWallView({ initialPrayers, currentUserId }: PrayerWallViewProps) {
    const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers);
    const [content, setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        const res = await createPrayerRequest(content, isAnonymous);
        if (res.success) {
            toast.success("Tu pedido ha sido publicado. ¡Estamos orando por ti!");
            setContent("");
            window.location.reload(); // Simple refresh for now
        } else {
            toast.error(res.error || "Error al publicar");
        }
        setLoading(false);
    };

    const handlePray = async (id: string) => {
        const res = await prayForRequest(id);
        if (res.success) {
            toast.success("¡Amén! Has unido tu oración.");
            // Optimistic update or refresh
            setPrayers(prayers.map(p => p.id === id ? { ...p, prayCount: p.prayCount + 1 } : p));
        } else {
            toast.error(res.error || "Ya has orado por este pedido");
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-4">
            <div className="text-center mb-5">
                <h1 className="fw-bold d-flex align-items-center justify-content-center gap-2">
                    <HeartHandshake className="text-primary" size={32} /> Muro de Oración Global
                </h1>
                <p className="text-muted">No camines solo. Comparte tu carga y oremos unos por otros.</p>
            </div>

            {/* Daily Prayer Section (Migrated from Home) */}
            <div className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden animate-fade-in">
                <div className="card-body p-0">
                    <div className="row g-0">
                        <div className="col-md-4 bg-primary text-white p-4 d-flex flex-column justify-content-center align-items-center text-center">
                            <div className="bg-white bg-opacity-25 p-3 rounded-circle mb-3">
                                <HeartHandshake size={40} />
                            </div>
                            <h4 className="fw-bold m-0">Oración Diaria</h4>
                            <p className="small opacity-75 mt-2 mb-0">Unidos en un mismo espíritu</p>
                        </div>
                        <div className="col-md-8 p-4">
                            <h5 className="fw-bold text-primary mb-3">Por la Paz y la Unidad</h5>
                            <p className="text-muted fst-italic mb-4">
                                "Señor, hoy te pedimos que tu paz, que sobrepasa todo entendimiento, guarde nuestros corazones y pensamientos. Ayúdanos a ser instrumentos de tu amor en medio de la discordia."
                            </p>
                            <div className="d-flex align-items-center justify-content-between">
                                <span className="badge bg-primary-subtle text-primary rounded-pill px-3">Día 28</span>
                                <button className="btn btn-sm btn-outline-primary rounded-pill fw-bold">
                                    Amén (1.2k)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Card */}
            <div className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
                <div className="card-body p-4 bg-primary-subtle bg-opacity-10">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <textarea
                                className="form-control border-0 shadow-sm rounded-4 p-3"
                                rows={3}
                                placeholder="¿Por qué necesitas oración hoy?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{ resize: 'none' }}
                            />
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="anonSwitch"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                />
                                <label className="form-check-label small text-muted" htmlFor="anonSwitch">
                                    Publicar anónimamente
                                </label>
                            </div>
                            <button
                                className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                                disabled={loading || !content.trim()}
                            >
                                <Send size={18} /> Publicar Pedido
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Prayers List */}
            <div className="d-grid gap-4">
                {prayers.length > 0 ? (prayers.map((prayer) => (
                    <div key={prayer.id} className="card border-0 shadow-sm rounded-4 animate-slide-up">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                {prayer.isAnonymous ? (
                                    <div className="bg-light rounded-circle p-2 shadow-sm text-muted">
                                        <Shield size={24} />
                                    </div>
                                ) : (
                                    prayer.user.image ? (
                                        <Image src={prayer.user.image} alt={prayer.user.name || "User"} width={40} height={40} className="rounded-circle shadow-sm" />
                                    ) : (
                                        <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm fw-bold" style={{ width: 40, height: 40 }}>
                                            {(prayer.user.name || "U")[0]}
                                        </div>
                                    )
                                )}
                                <div>
                                    <h6 className="fw-bold mb-0">
                                        {prayer.isAnonymous ? "Guerrero de Oración" : prayer.user.name}
                                    </h6>
                                    <small className="text-muted">{new Date(prayer.createdAt).toLocaleDateString()}</small>
                                </div>
                            </div>

                            <p className="card-text fs-5 mb-4 text-dark-emphasis">
                                "{prayer.content}"
                            </p>

                            <div className="d-flex justify-content-between align-items-center border-top pt-3">
                                <div className="text-muted small d-flex align-items-center gap-2">
                                    <Heart className="text-danger" size={14} fill="currentColor" />
                                    <span>{prayer.prayCount} personas están orando por esto</span>
                                </div>
                                <button
                                    onClick={() => handlePray(prayer.id)}
                                    className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-2"
                                >
                                    <HeartHandshake size={16} /> ¡Me uno en oración!
                                </button>
                            </div>
                        </div>
                    </div>
                ))) : (
                    <div className="text-center py-5 text-muted">
                        <MessageSquare size={48} className="mb-3 opacity-25" />
                        <p>No hay pedidos de oración recientes. ¡Sé el primero!</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .animate-slide-up {
                    animation: slideUp 0.4s ease-out forwards;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

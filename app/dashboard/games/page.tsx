"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGameRoom, joinGameRoom } from "./actions";
import { Zap, Play, Plus, Search } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import toast from "react-hot-toast";

export default function GamesLobbyPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        const res = await createGameRoom();
        if (res.success && res.room) {
            router.push(`/dashboard/games/${res.room.id}`);
        } else {
            toast.error(res.error || "Error");
        }
        setLoading(false);
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code) return;
        setLoading(true);
        const res = await joinGameRoom(code.toUpperCase());
        if (res.success && res.roomId) {
            router.push(`/dashboard/games/${res.roomId}`);
        } else {
            toast.error(res.error || "Room not found");
        }
        setLoading(false);
    };

    return (
        <div className="container py-5 animate-fade-in">
            <div className="text-center mb-5">
                <div className="bg-primary-subtle d-inline-flex p-4 rounded-circle mb-3 shadow-sm">
                    <Zap size={48} className="text-primary" />
                </div>
                <h1 className="fw-bold">Juegos Conecta+</h1>
                <p className="text-muted">Diviértete y gana XP con otros usuarios</p>
            </div>

            <div className="row g-4 justify-content-center">
                {/* Hot Potato Card */}
                <div className="col-md-5">
                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden transform-hover">
                        <div className="bg-danger p-4 text-center text-white">
                            <Zap size={40} />
                            <h3 className="mt-2 fw-bold">Papa Caliente</h3>
                        </div>
                        <div className="card-body p-4 text-center">
                            <p className="text-muted small mb-4">
                                Responde rápido y pasa la bomba antes de que explote. ¡El último en pie gana!
                            </p>

                            <div className="d-grid gap-3">
                                <button
                                    onClick={handleCreate}
                                    className="btn btn-danger btn-lg rounded-pill shadow-sm py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                                    disabled={loading}
                                >
                                    <Plus size={20} /> Crear Partida
                                </button>

                                <form onSubmit={handleJoin} className="mt-3">
                                    <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
                                        <input
                                            type="text"
                                            placeholder="Código de Sala"
                                            className="form-control border-0 px-4 fw-bold"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        />
                                        <button
                                            className="btn btn-outline-danger border-0 px-4"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            <Play size={20} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Card */}
                <div className="col-md-5">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-light border-dashed">
                        <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-5">
                            <Plus size={48} className="text-muted mb-3 opacity-50" />
                            <h4 className="text-muted fw-bold">Próximamente</h4>
                            <p className="text-muted small">
                                Trivia en tiempo real, Ahorcado Cristiano y más desafíos grupales.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .transform-hover {
                    transition: transform 0.3s ease;
                }
                .transform-hover:hover {
                    transform: translateY(-5px);
                }
                .border-dashed {
                    border: 2px dashed #dee2e6;
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

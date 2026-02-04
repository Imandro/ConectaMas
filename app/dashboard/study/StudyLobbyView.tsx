"use client";

import { useState } from "react";
import { createStudyRoom } from "./actions";
import { BookOpen, Users, Plus, Book, MessageCircle, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface StudyRoom {
    id: string;
    title: string;
    theme: string | null;
    description: string | null;
    host: {
        name: string | null;
    };
    _count: {
        messages: number;
        participants: number;
    };
}

interface StudyLobbyViewProps {
    initialRooms: StudyRoom[];
}

export default function StudyLobbyView({ initialRooms }: StudyLobbyViewProps) {
    const rooms = initialRooms;
    const [title, setTitle] = useState("");
    const [theme, setTheme] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        const res = await createStudyRoom(title, theme);
        if (res.success && res.room) {
            toast.success("Sala de estudio creada");
            router.push(`/dashboard/study/${res.room.id}`);
        } else {
            toast.error(res.error || "Error al crear sala");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto py-4">
            <div className="text-center mb-5">
                <div className="bg-success-subtle d-inline-flex p-3 rounded-circle mb-3">
                    <BookOpen size={40} className="text-success" />
                </div>
                <h1 className="fw-bold">Salas de Estudio Bíblico</h1>
                <p className="text-muted text-pretty">Únete a una sala activa para estudiar la Palabra en comunidad.</p>
            </div>

            {/* Create Room Section */}
            <div className="card border-0 shadow-sm rounded-4 mb-5 border-start border-success border-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Crear Nueva Sala</h5>
                    <form onSubmit={handleCreate} className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control rounded-pill border-0 bg-light px-4"
                                placeholder="Título de la sala (Ej. Estudio de Romanos)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control rounded-pill border-0 bg-light px-4"
                                placeholder="Tema u objetivo"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2 d-grid">
                            <button className="btn btn-success rounded-pill fw-bold" type="submit" disabled={loading}>
                                <Plus size={20} className="me-1" /> Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Active Rooms Grid */}
            <div className="row g-4">
                {rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div key={room.id} className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 h-100 transform-hover overflow-hidden">
                                <div className="card-body p-4">
                                    <div className="badge bg-success-subtle text-success rounded-pill mb-2 small fw-bold">
                                        {room.theme || "Estudio General"}
                                    </div>
                                    <h4 className="fw-bold mb-2">{room.title}</h4>
                                    <div className="d-flex align-items-center gap-2 mb-4 text-muted small">
                                        <Users size={14} /> Anfitrión: {room.host.name}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
                                        <div className="text-muted small d-flex align-items-center gap-2">
                                            <MessageCircle size={14} /> {room._count.messages} mensajes
                                            <span className="mx-1">•</span>
                                            <Users size={14} /> {room._count.participants}/20
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                onClick={() => {
                                                    const link = `${window.location.origin}/dashboard/study/${room.id}`;
                                                    navigator.clipboard.writeText(link);
                                                    toast.success("¡Link copiado!");
                                                }}
                                                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                            >
                                                Compartir
                                            </button>
                                            <button
                                                onClick={() => router.push(`/dashboard/study/${room.id}`)}
                                                className="btn btn-primary btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                                            >
                                                <Play size={14} /> Unirse
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <div className="opacity-25 mb-3">
                            <Book size={64} />
                        </div>
                        <h5 className="text-muted">No hay salas activas en este momento.</h5>
                        <p className="text-muted small">¡Anímate a crear la primera!</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .transform-hover {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .transform-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
            `}</style>
        </div>
    );
}

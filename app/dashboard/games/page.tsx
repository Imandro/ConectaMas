"use client";

import { useEffect, useState } from "react";
import { getGameRooms, createGameRoom, joinGameRoom } from "./actions";
import { Loader2, Plus, Users, Lock, Globe, Zap, PlayCircle, RefreshCw, BookOpen, Timer, Book, Puzzle, ListOrdered } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const soloGames = [
    {
        name: "Ordena el Verso",
        desc: "Toca las palabras en el orden correcto",
        href: "/dashboard/games/verse-order",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        emoji: "📖",
        icon: ListOrdered,
    },
    {
        name: "Pregunta Relámpago",
        desc: "Responde rápido antes del tiempo",
        href: "/dashboard/games/speed-quiz",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        emoji: "⚡",
        icon: Timer,
    },
    {
        name: "Empareja Libros",
        desc: "Clasifica libros por categoría",
        href: "/dashboard/games/book-match",
        gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        emoji: "📚",
        icon: Book,
    },
    {
        name: "Completa el Verso",
        desc: "Elige la palabra que falta",
        href: "/dashboard/games/fill-blank",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        emoji: "✏️",
        icon: Puzzle,
    },
    {
        name: "Clasifica el Libro",
        desc: "AT o NT? Elige rápido",
        href: "/dashboard/games/book-sort",
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        emoji: "📜",
        icon: BookOpen,
    },
];

export default function GamesDashboard() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Create Room Form
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    const router = useRouter();

    const fetchRooms = async () => {
        setRefreshing(true);
        const res = await getGameRooms();
        if (res.success) {
            setRooms(res.rooms || []);
        }
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchRooms();
        const interval = setInterval(fetchRooms, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        const res = await createGameRoom(newRoomName, isPrivate);
        if (res.success && res.roomId) {
            toast.success("Sala creada!");
            router.push(`/dashboard/games/${res.roomId}`);
        } else {
            toast.error("Error al crear sala");
        }
        setCreating(false);
        setShowCreateModal(false);
    };

    const handleJoinRoom = async (roomId: string) => {
        const res = await joinGameRoom(roomId);
        if (res.success) {
            router.push(`/dashboard/games/${roomId}`);
        } else {
            toast.error("No se pudo entrar a la sala");
        }
    };

    return (
        <div className="container py-4 animate-fade-in">
            {/* Header */}
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-black text-dark mb-1 d-flex align-items-center gap-2">
                        <span className="bg-primary text-white p-2 rounded-3 d-flex"><PlayCircle size={28} /></span>
                        Juegos
                    </h2>
                    <p className="text-secondary small m-0 fw-bold">Diviértete y aprende con la comunidad</p>
                </div>
                <button onClick={fetchRooms} disabled={refreshing} className="btn btn-light rounded-circle shadow-sm p-2">
                    <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
                </button>
            </header>

            {/* Solo Games */}
            <h5 className="fw-bold text-secondary mb-3">🎯 Juegos Individuales</h5>
            <div className="row g-3 mb-5">
                {soloGames.map((game) => (
                    <div key={game.href} className="col-12 col-sm-6 col-lg-4">
                        <div className="card border-0 shadow-sm overflow-hidden hover-scale h-100" onClick={() => router.push(game.href)} style={{ cursor: 'pointer', borderRadius: '24px', background: game.gradient }}>
                            <div className="card-body p-4 position-relative">
                                <div className="position-absolute top-0 end-0 p-3 opacity-20" style={{ fontSize: '4rem' }}>
                                    {game.emoji}
                                </div>
                                <div className="position-relative z-10">
                                    <div className="bg-white bg-opacity-25 p-2 rounded-3 d-inline-flex mb-3 shadow-sm text-white">
                                        <game.icon size={24} />
                                    </div>
                                    <h4 className="fw-bold text-white mb-1">{game.name}</h4>
                                    <p className="text-white text-opacity-75 small mb-0 fw-medium">{game.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Multiplayer Games */}
            <h5 className="fw-bold text-secondary mb-3">👥 Juegos en Vivo</h5>
            <div className="row g-3 mb-5">
                {/* Trivia Card */}
                <div className="col-12 col-md-6">
                    <div className="card border-0 shadow-sm bg-info bg-opacity-10 overflow-hidden hover-scale h-100" onClick={() => router.push('/dashboard/trivia')} style={{ cursor: 'pointer', borderRadius: '24px' }}>
                        <div className="card-body p-4 position-relative">
                            <div className="position-absolute top-0 end-0 p-3 opacity-25">
                                <Zap size={80} className="text-info" />
                            </div>
                            <div className="position-relative z-10">
                                <div className="bg-white p-2 rounded-3 d-inline-flex mb-3 shadow-sm text-info">
                                    <Zap size={24} />
                                </div>
                                <h4 className="fw-bold text-dark mb-1">Trivia Bíblica</h4>
                                <p className="text-muted small mb-0 fw-medium">Pon a prueba tu conocimiento diario.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hot Potato Banner */}
                <div className="col-12 col-md-6">
                    <div className="card border-0 shadow-sm bg-danger bg-opacity-10 overflow-hidden hover-scale h-100" onClick={() => setShowCreateModal(true)} style={{ cursor: 'pointer', borderRadius: '24px' }}>
                        <div className="card-body p-4 position-relative">
                            <div className="position-absolute top-50 end-0 translate-middle-y me-3 opacity-25" style={{ fontSize: '5rem' }}>🥔</div>
                            <div className="position-relative z-10">
                                <div className="bg-white p-2 rounded-3 d-inline-flex mb-3 shadow-sm text-danger">
                                    <PlayCircle size={24} />
                                </div>
                                <h4 className="fw-bold text-dark mb-1">Papa Caliente</h4>
                                <p className="text-muted small mb-0 fw-medium">¡No dejes que explote en tu turno!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Rooms List */}
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <h5 className="fw-bold m-0 text-secondary"><Globe size={18} className="me-2 d-inline" />Salas en Vivo</h5>
                <button className="btn btn-primary btn-sm rounded-pill px-3 fw-bold shadow-sm" onClick={() => setShowCreateModal(true)}>
                    <Plus size={16} className="me-1" /> Crear Sala
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : rooms.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4 border border-dashed">
                    <p className="text-muted fw-bold mb-2">No hay salas públicas activas</p>
                    <button className="btn btn-outline-primary rounded-pill btn-sm" onClick={() => setShowCreateModal(true)}>
                        ¡Sé el primero en crear una!
                    </button>
                </div>
            ) : (
                <div className="row g-3">
                    {rooms.map((room) => (
                        <div key={room.id} className="col-12 col-md-6">
                            <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden hover-scale" style={{ borderRadius: '20px', cursor: 'pointer' }} onClick={() => handleJoinRoom(room.id)}>
                                <div className="card-body p-3 d-flex align-items-center justify-content-between">
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <span className={`badge rounded-pill ${room.status === 'PLAYING' ? 'bg-danger' : 'bg-success'}`}>
                                                {room.status === 'PLAYING' ? 'Jugando' : 'Esperando'}
                                            </span>
                                            {room.isPrivate && <Lock size={12} className="text-muted" />}
                                        </div>
                                        <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '180px' }}>{room.name || "Sala sin nombre"}</h6>
                                        <div className="small text-muted d-flex align-items-center gap-1">
                                            <Users size={14} /> {room._count.players} jugadores
                                        </div>
                                    </div>
                                    <div className="bg-light rounded-circle p-2 text-primary">
                                        <PlayCircle size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1080, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white rounded-4 p-4 w-100 mx-3 shadow-lg animate-fade-in" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                        <h4 className="fw-bold mb-3">Crear Sala de Juego</h4>
                        <form onSubmit={handleCreateRoom}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Nombre de la Sala</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3 p-3 bg-light border-0 fw-bold"
                                    placeholder="Ej. Los Vencedores"
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    maxLength={20}
                                />
                            </div>
                            <div className="form-check form-switch mb-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="privateSwitch"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                />
                                <label className="form-check-label fw-bold text-secondary" htmlFor="privateSwitch">Sala Privada</label>
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary rounded-pill py-3 fw-bold shadow-sm" disabled={creating}>
                                    {creating ? <Loader2 size={20} className="animate-spin mx-auto" /> : "Crear y Entrar"}
                                </button>
                                <button type="button" className="btn btn-light rounded-pill py-3 fw-bold text-muted" onClick={() => setShowCreateModal(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

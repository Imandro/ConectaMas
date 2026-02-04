"use client";

import { useState, useEffect, useCallback } from "react";
import { getRoomStatus, startGame, submitGameAnswer } from "../actions";
import { Zap, Users, Shield, Clock, Award, Play } from "lucide-react";
import toast from "react-hot-toast";
import UserAvatar from "@/app/components/UserAvatar";

interface Player {
    id: string;
    userId: string;
    status: string;
    score: number;
    user: {
        name: string | null;
    };
}

interface Room {
    id: string;
    code: string;
    status: string;
    currentTurnUserId: string | null;
    bombExplodesAt: Date | null;
    players: Player[];
}

interface HotPotatoViewProps {
    initialRoom: any;
    currentUserId: string;
    roomId: string;
}

export default function HotPotatoView({ initialRoom, currentUserId, roomId }: HotPotatoViewProps) {
    const [room, setRoom] = useState<Room>(initialRoom);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const isHost = room.players[0]?.userId === currentUserId; // First to join is host
    const myPlayer = room.players.find(p => p.userId === currentUserId);
    const isMyTurn = room.currentTurnUserId === currentUserId;
    const isAlive = myPlayer?.status === "ALIVE";

    const refreshStatus = useCallback(async () => {
        const res = await getRoomStatus(roomId);
        if (res.success && res.room) {
            setRoom(res.room as Room);
        }
    }, [roomId]);

    useEffect(() => {
        const interval = setInterval(refreshStatus, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [refreshStatus]);

    useEffect(() => {
        if (room.status === "PLAYING" && room.bombExplodesAt) {
            const timer = setInterval(() => {
                const diff = new Date(room.bombExplodesAt!).getTime() - Date.now();
                setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setTimeLeft(null);
        }
    }, [room.status, room.bombExplodesAt]);

    const handleStart = async () => {
        setLoading(true);
        const res = await startGame(roomId);
        if (!res.success) toast.error(res.error || "Error");
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer || !isMyTurn || !isAlive) return;

        setLoading(true);
        const res = await submitGameAnswer(roomId, answer);
        if (res.success) {
            setAnswer("");
            if (res.exploded) {
                toast.error("¡PUM! La bomba explotó en tus manos.");
            } else {
                toast.success("¡Pasaste la bomba!");
            }
            refreshStatus();
        } else {
            toast.error(res.error || "Error");
        }
        setLoading(false);
    };

    return (
        <div className="game-container max-w-2xl mx-auto py-4">
            {/* Room Header */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                <div className="card-header bg-white border-bottom-0 p-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                            <Zap className="text-danger" fill="currentColor" /> Papa Caliente
                        </h4>
                        <p className="text-muted small mb-0">Sala: <span className="fw-bold text-primary">{room.code}</span></p>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        <div className="badge bg-light text-dark border p-2 d-flex align-items-center gap-2">
                            <Users size={16} /> {room.players.length} Jugadores
                        </div>
                        <button
                            className="btn btn-sm btn-outline-primary rounded-pill"
                            onClick={() => {
                                const link = `${window.location.origin}/dashboard/games/${roomId}`;
                                navigator.clipboard.writeText(link);
                                toast.success("¡Link copiado! Compártelo con tus amigos.");
                            }}
                        >
                            Compartir
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger rounded-pill"
                            onClick={async () => {
                                if (confirm("¿Estás seguro que quieres abandonar la sala?")) {
                                    const { leaveGameRoom } = await import("../actions");
                                    const res = await leaveGameRoom(roomId);
                                    if (res.success) {
                                        toast.success("Has abandonado la sala");
                                        window.location.href = "/dashboard/games";
                                    } else {
                                        toast.error("Error al salir");
                                    }
                                }
                            }}
                        >
                            Abandonar
                        </button>
                    </div>
                </div>

                {/* Game Logic */}
                <div className="card-body p-4 border-top text-center">
                    {room.status === "WAITING" && (
                        <div className="py-5">
                            <h5 className="fw-bold">Esperando jugadores...</h5>
                            <p className="text-muted mb-4">Mínimo 2 personas para empezar.</p>

                            {isHost ? (
                                <button
                                    onClick={handleStart}
                                    className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-sm"
                                    disabled={room.players.length < 2 || loading}
                                >
                                    <Play size={20} className="me-2" /> Empezar Juego
                                </button>
                            ) : (
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            )}
                        </div>
                    )}

                    {room.status === "PLAYING" && (
                        <div className="py-4">
                            {/* Bomb Animation Area */}
                            <div className={`mb-5 bomb-container ${isMyTurn ? 'my-turn' : ''}`}>
                                <div className={`bomb ${timeLeft !== null && timeLeft < 5 ? 'vibrating' : ''}`}>
                                    💣
                                    {timeLeft !== null && (
                                        <div className="bomb-timer badge bg-dark rounded-pill">
                                            {timeLeft}s
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3">
                                    {isMyTurn ? (
                                        <h4 className="fw-bold text-danger animate-pulse">¡TIENES LA PAPA!</h4>
                                    ) : (
                                        <h4 className="fw-bold text-muted">Turno de: {room.players.find(p => p.userId === room.currentTurnUserId)?.user.name || "Alguien"}</h4>
                                    )}
                                </div>
                            </div>

                            {/* Answer Area */}
                            {isAlive ? (
                                isMyTurn ? (
                                    <form onSubmit={handleSubmit} className="mt-4">
                                        <p className="mb-2 fw-bold text-primary small">ESCRIBE UNA PALABRA CRISTIANA:</p>
                                        <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
                                            <input
                                                type="text"
                                                className="form-control border-0 px-4"
                                                placeholder="Ej. Gracia, Jesús, Biblia..."
                                                value={answer}
                                                onChange={(e) => setAnswer(e.target.value)}
                                                autoFocus
                                                disabled={loading}
                                            />
                                            <button className="btn btn-danger px-4" type="submit" disabled={loading}>
                                                PASAR
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="alert alert-info rounded-4 border-0 shadow-sm d-flex align-items-center gap-3">
                                        <Shield className="text-primary" />
                                        <span>Estás a salvo... por ahora. ¡Prepárate!</span>
                                    </div>
                                )
                            ) : (
                                <div className="alert alert-danger rounded-4 border-0 shadow-sm d-flex align-items-center gap-3">
                                    <Zap className="text-danger" />
                                    <span>¡Has sido eliminado! Mira el resto de la partida.</span>
                                </div>
                            )}
                        </div>
                    )}

                    {room.status === "FINISHED" && (
                        <div className="py-5">
                            <Award size={64} className="text-warning mb-3" />
                            <h2 className="fw-bold">¡Juego Terminado!</h2>
                            <p className="text-muted">El ganador se lleva 50 XP</p>

                            <div className="mt-4">
                                <button onClick={() => window.location.href = '/dashboard/games'} className="btn btn-outline-primary rounded-pill px-5">
                                    Volver al Lobby
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Players List */}
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom-0 p-4">
                    <h5 className="fw-bold mb-0">Jugadores</h5>
                </div>
                <div className="list-group list-group-flush border-top">
                    {room.players.map((p) => (
                        <div key={p.id} className="list-group-item d-flex align-items-center gap-3 py-3 border-0">
                            <div className="position-relative">
                                <UserAvatar name={p.user.name} size={40} className="shadow-sm" />
                                {p.status === "ELIMINATED" && (
                                    <div className="position-absolute bottom-0 end-0 bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 16, height: 16, fontSize: '10px' }}>
                                        X
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow-1">
                                <div className={`fw-bold ${p.userId === currentUserId ? 'text-primary' : ''}`}>
                                    {p.user.name || "Anónimo"}
                                    {p.userId === currentUserId && <span className="ms-2 badge bg-primary-subtle text-primary small" style={{ fontSize: '0.6rem' }}>TÚ</span>}
                                </div>
                                <div className="text-muted small">
                                    {p.status === "ELIMINATED" ? 'EXPLOTÓ' : p.status === "WINNER" ? '¡GANADOR!' : 'VIVO'}
                                </div>
                            </div>
                            <div className="text-primary fw-bold">
                                {p.score} XP
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .bomb-container {
                    position: relative;
                }
                .bomb {
                    font-size: 8rem;
                    display: inline-block;
                    position: relative;
                    transition: all 0.3s ease;
                }
                .bomb-timer {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    font-size: 1rem;
                }
                .vibrating {
                    animation: vibrate 0.1s linear infinite;
                }
                .my-turn .bomb {
                    transform: scale(1.1);
                }
                .animate-pulse {
                    animation: pulse 1s ease-in-out infinite;
                }
                @keyframes vibrate {
                    0% { transform: rotate(0deg) translate(2px, 2px); }
                    25% { transform: rotate(0.5deg) translate(-2px, -2px); }
                    50% { transform: rotate(0deg) translate(-2px, 2px); }
                    75% { transform: rotate(-0.5deg) translate(2px, -2px); }
                    100% { transform: rotate(0deg) translate(2px, 2px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}

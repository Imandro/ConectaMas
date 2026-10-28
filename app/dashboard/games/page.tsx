"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getGameRooms, createGameRoom, joinGameRoom } from "./actions";
import { Loader2, Plus, Users, Lock, Globe, Zap, PlayCircle, RefreshCw, BookOpen, Timer, Book, Puzzle, ListOrdered, Layers3, Sparkles, Shuffle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isPollingAllowed } from '@/app/lib/networkPolicy';
import SecondaryPageShell from '@/app/components/SecondaryUI';
import { useLanguage } from '@/app/LanguageContext';
import type { GameRoomType } from '@/app/lib/games/gameTypes';

const soloGames = [
    {
        name: "verse_order",
        desc: "Ordena palabras de un versículo",
        href: "/dashboard/games/verse-order",
        surface: "#16304f",
        emoji: "📖",
        icon: ListOrdered,
    },
    {
        name: "speed_quiz",
        desc: "Responde antes de que termine el tiempo",
        href: "/dashboard/games/speed-quiz",
        surface: "#1d3b5f",
        emoji: "⚡",
        icon: Timer,
    },
    {
        name: "book_match",
        desc: "Relaciona cada libro con su categoría",
        href: "/dashboard/games/book-match",
        surface: "#29476b",
        emoji: "📚",
        icon: Book,
    },
    {
        name: "fill_blank",
        desc: "Elige la palabra que falta",
        href: "/dashboard/games/fill-blank",
        surface: "#205675",
        emoji: "✏️",
        icon: Puzzle,
    },
    {
        name: "book_sort",
        desc: "Clasifica libros por testamento",
        href: "/dashboard/games/book-sort",
        surface: "#6b551c",
        emoji: "📜",
        icon: BookOpen,
    },
    {
        name: "memory",
        desc: "Encuentra cada pareja de versículos",
        href: "/dashboard/games/memory",
        surface: "#2f5274",
        emoji: "🧠",
        icon: Layers3,
    },
    {
        name: "character_event",
        desc: "Relaciona personajes con sus historias",
        href: "/dashboard/games/character-event",
        surface: "#3d526d",
        emoji: "✨",
        icon: Sparkles,
    },
    {
        name: "bible_order",
        desc: "Coloca los libros en orden",
        href: "/dashboard/games/bible-order",
        surface: "#5d4e2b",
        emoji: "🧭",
        icon: Shuffle,
    },
];

type GameRoom = {
    id: string;
    name: string | null;
    status: string;
    isPrivate: boolean;
    type: string;
    _count: { players: number };
};

export default function GamesDashboard() {
    const { t } = useLanguage();
    const [rooms, setRooms] = useState<GameRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Create Room Form
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [roomType, setRoomType] = useState<GameRoomType>("HOT_POTATO");
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const router = useRouter();

    const fetchRooms = async (force = false) => {
        if (!navigator.onLine || (!force && !isPollingAllowed(navigator.onLine, document.hidden))) {
            setLoading(false);
            return;
        }
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
        const refreshWhenVisible = () => {
            if (isPollingAllowed(navigator.onLine, document.hidden)) fetchRooms();
        };
        window.addEventListener('online', refreshWhenVisible);
        document.addEventListener('visibilitychange', refreshWhenVisible);
        return () => {
            window.removeEventListener('online', refreshWhenVisible);
            document.removeEventListener('visibilitychange', refreshWhenVisible);
        };
    }, []);

    useEffect(() => {
        if (!showCreateModal) return;
        closeButtonRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setShowCreateModal(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [showCreateModal]);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!navigator.onLine) {
            toast.error("Sin conexión. Crear salas requiere internet.");
            return;
        }
        setCreating(true);

        const res = await createGameRoom(newRoomName, isPrivate, roomType);
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
        if (!navigator.onLine) {
            toast.error("Sin conexión. Entrar a salas requiere internet.");
            return;
        }
        const res = await joinGameRoom(roomId);
        if (res.success) {
            router.push(`/dashboard/games/${roomId}`);
        } else {
            toast.error("No se pudo entrar a la sala");
        }
    };

    return (
        <SecondaryPageShell>
        <div className="container py-4 animate-fade-in ui-game-shell">
            {/* Header */}
            <header className="ui-page-header mb-4">
                <div>
                    <h2 className="fw-black text-dark mb-1 d-flex align-items-center gap-2">
                        <span className="bg-primary text-white p-2 rounded-3 d-flex"><PlayCircle size={28} /></span>
                        {t.game_ui.hub_title}
                    </h2>
                    <p className="text-secondary small m-0 fw-bold">{t.game_ui.hub_subtitle}</p>
                </div>
                <button type="button" aria-label="Actualizar salas" onClick={() => fetchRooms(true)} disabled={refreshing} className="btn btn-light rounded-circle shadow-sm p-2 game-action">
                    <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
                </button>
            </header>

            {/* Solo Games */}
            <div className="section-header">
                <PlayCircle size={18} /> {t.game_ui.solo_title}
            </div>
            <div className="row g-3 mb-5">
                {soloGames.map((game) => (
                    <div key={game.href} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <Link href={game.href} className="game-card-link h-100" style={{ background: game.surface }}>
                            <div className="card-body p-4 position-relative">
                                <div className="position-absolute top-0 end-0 p-2 opacity-15" style={{ fontSize: '3.5rem' }}>
                                    {game.emoji}
                                </div>
                                <div className="position-relative z-10">
                                    <div className="bg-white bg-opacity-25 p-2 rounded-3 d-inline-flex mb-3 shadow-sm text-white">
                                        <game.icon size={24} />
                                    </div>
                                    <h4 className="fw-bold text-white mb-1">{game.name === "memory" ? t.game_ui.memory_title : game.name === "character_event" ? t.game_ui.character_title : game.name === "bible_order" ? t.game_ui.order_title : game.name === "verse_order" ? t.game_ui.verse_order_title : game.name === "speed_quiz" ? t.game_ui.speed_quiz_title : game.name === "book_match" ? t.game_ui.book_match_title : game.name === "fill_blank" ? t.game_ui.fill_blank_title : t.game_ui.book_sort_title}</h4>
                                    <p className="text-white text-opacity-75 small mb-0 fw-medium">{game.name === "memory" ? t.game_ui.memory_desc : game.name === "character_event" ? t.game_ui.character_desc : game.name === "bible_order" ? t.game_ui.order_desc : game.name === "verse_order" ? t.game_ui.verse_order_desc : game.name === "speed_quiz" ? t.game_ui.speed_quiz_desc : game.name === "book_match" ? t.game_ui.book_match_desc : game.name === "fill_blank" ? t.game_ui.fill_blank_desc : t.game_ui.book_sort_desc}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Multiplayer Games */}
            <div className="section-header">
                <Globe size={18} /> {t.game_ui.live_title}
            </div>
            <div className="row g-3 mb-5">
                {/* Trivia Card */}
                <div className="col-12 col-md-6">
                    <Link href="/dashboard/trivia" className="game-card-link h-100 bg-info bg-opacity-10">
                        <div className="card-body p-4 position-relative">
                            <div className="position-absolute top-0 end-0 p-3 opacity-25">
                                <Zap size={80} className="text-info" />
                            </div>
                            <div className="position-relative z-10">
                                <div className="bg-white p-2 rounded-3 d-inline-flex mb-3 shadow-sm text-info">
                                    <Zap size={24} />
                                </div>
                                <h4 className="fw-bold text-dark mb-1">{t.game_ui.trivia_title}</h4>
                                <p className="text-muted small mb-0 fw-medium">{t.game_ui.trivia_desc}</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Hot Potato Banner */}
                <div className="col-12 col-md-6">
                    <button type="button" className="game-card-link h-100 bg-danger bg-opacity-10 text-start" onClick={() => setShowCreateModal(true)}>
                        <div className="card-body p-4 position-relative">
                            <div className="position-absolute top-50 end-0 translate-middle-y me-3 opacity-25" style={{ fontSize: '5rem' }}>🥔</div>
                            <div className="position-relative z-10">
                                <div className="bg-white p-2 rounded-3 d-inline-flex mb-3 shadow-sm text-danger">
                                    <PlayCircle size={24} />
                                </div>
                                <h4 className="fw-bold text-dark mb-1">{t.game_ui.hot_potato_title}</h4>
                                <p className="text-muted small mb-0 fw-medium">{t.game_ui.hot_potato_desc}</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Active Rooms List */}
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <h5 className="fw-bold m-0 text-secondary"><Globe size={18} className="me-2 d-inline" />{t.game_ui.live_title}</h5>
                <button type="button" className="btn btn-primary btn-sm rounded-pill px-3 fw-bold shadow-sm game-action" onClick={() => setShowCreateModal(true)}>
                    <Plus size={16} className="me-1" /> {t.game_ui.create_room}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : rooms.length === 0 ? (
                <div className="text-center py-5 ui-state">
                    <p className="text-muted fw-bold mb-2">No hay salas públicas activas</p>
                    <button type="button" className="btn btn-outline-primary rounded-pill btn-sm game-action" onClick={() => setShowCreateModal(true)}>
                        ¡Sé el primero en crear una!
                    </button>
                </div>
            ) : (
                <div className="row g-3">
                    {rooms.map((room) => (
                        <div key={room.id} className="col-12 col-md-6">
                            <button type="button" className="card border-0 shadow-sm h-100 position-relative overflow-hidden hover-scale w-100 text-start" onClick={() => handleJoinRoom(room.id)}>
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
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="game-modal-backdrop" role="presentation" onMouseDown={() => setShowCreateModal(false)}>
                    <div className="game-modal p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="create-room-title" onMouseDown={(event) => event.stopPropagation()}>
                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                            <h2 id="create-room-title" className="h4 fw-bold mb-0">{t.game_ui.create_room}</h2>
                            <button ref={closeButtonRef} type="button" className="game-modal-close" aria-label={t.game_ui.close} onClick={() => setShowCreateModal(false)}><X size={20} aria-hidden="true" /></button>
                        </div>
                        <form onSubmit={handleCreateRoom}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted" htmlFor="room-name">{t.game_ui.room_name}</label>
                                <input
                                    id="room-name"
                                    type="text"
                                    className="form-control rounded-3 p-3 bg-light border-0 fw-bold"
                                    placeholder="Ej. Los Vencedores"
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    maxLength={20}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted" htmlFor="room-type">{t.game_ui.select_game}</label>
                                <select id="room-type" className="form-select rounded-3 p-3 bg-light border-0 fw-bold" value={roomType} onChange={(event) => setRoomType(event.target.value as GameRoomType)}>
                                    <option value="HOT_POTATO">{t.game_ui.hot_potato_title}</option>
                                    <option value="MEMORY">{t.game_ui.memory_title}</option>
                                    <option value="CHARACTER_EVENT">{t.game_ui.character_title}</option>
                                    <option value="BIBLE_ORDER">{t.game_ui.order_title}</option>
                                </select>
                            </div>
                            <div className="form-check form-switch mb-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="privateSwitch"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                />
                                <label className="form-check-label fw-bold text-secondary" htmlFor="privateSwitch">{t.game_ui.private_room}</label>
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary rounded-pill py-3 fw-bold shadow-sm game-action" disabled={creating}>
                                    {creating ? <Loader2 size={20} className="animate-spin mx-auto" /> : t.game_ui.create_enter}
                                </button>
                                <button type="button" className="btn btn-light rounded-pill py-3 fw-bold text-muted game-action" onClick={() => setShowCreateModal(false)}>
                                    {t.game_ui.cancel}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style jsx>{`
                .btn:focus:not(:focus-visible) {
                    outline: none !important;
                    box-shadow: none !important;
                }
                .card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
                }
                .card:active {
                    transform: translateY(-1px);
                }
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid var(--border-color);
                }
                .section-header svg {
                    opacity: 0.7;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease forwards;
                }
            `}</style>
        </div>
        </SecondaryPageShell>
    );
}

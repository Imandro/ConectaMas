"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getStudyMessages, sendStudyMessage, leaveStudyRoom, deleteStudyRoom, kickParticipant, joinStudyRoom } from "../actions";
import { Send, Book, Users, ChevronRight, Search, BookOpen, Share2, LogOut, UserMinus, Trash2, Copy } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import UserAvatar from "@/app/components/UserAvatar";

interface Message {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        name: string | null;
    };
    userId: string;
}

interface StudyRoomViewProps {
    room: {
        id: string;
        title: string;
        theme: string | null;
        host: {
            id: string;
            name: string | null;
        };
        participants?: Array<{
            user: {
                id: string;
                name: string | null;
                spiritualLevel: string | null;
            };
        }>;
    };
    initialMessages: Message[];
    currentUserId: string;
}

export default function StudyRoomView({ room, initialMessages, currentUserId }: StudyRoomViewProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [showBible, setShowBible] = useState(true);
    const [showConcordance, setShowConcordance] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const refreshMessages = useCallback(async () => {
        const res = await getStudyMessages(room.id);
        if (res.success && res.messages) {
            setMessages(res.messages as Message[]);
        }
    }, [room.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const interval = setInterval(refreshMessages, 4000); // Poll every 4s
        return () => clearInterval(interval);
    }, [refreshMessages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        const res = await sendStudyMessage(room.id, content);
        if (res.success) {
            setContent("");
            refreshMessages();
        } else {
            toast.error("Error al enviar mensaje");
        }
        setLoading(false);
    };

    return (
        <div className="study-layout row g-4" style={{ height: 'calc(100vh - 120px)' }}>
            {/* Left Column: Bible / Reference (Collapsible) */}
            {showBible && (
                <div className="col-lg-5 h-100 d-none d-lg-block border-end overflow-auto pe-4">
                    <div className="bible-viewer h-100 animate-fade-in">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-bold mb-0 text-success d-flex align-items-center gap-2">
                                <Book /> Biblia de Estudio
                            </h3>
                            <button className="btn btn-sm btn-light rounded-circle" onClick={() => setShowBible(false)}>
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <div className="input-group mb-4 shadow-sm rounded-pill overflow-hidden border">
                                    <span className="input-group-text border-0 bg-white ps-3"><Search size={16} /></span>
                                    <input type="text" className="form-control border-0" placeholder="Buscar versículo o tema..." />
                                </div>

                                <div className="bible-content">
                                    <h5 className="fw-bold mb-3 border-bottom pb-2">Referencia: {room.theme || "Tema del día"}</h5>
                                    <p className="text-secondary fst-italic mb-0">
                                        &quot;Lámpara es a mis pies tu palabra, y lumbrera a mi camino.&quot; <br />
                                        <span className="fw-bold text-success">- Salmos 119:105</span>
                                    </p>
                                    <hr />
                                    <p className="small text-muted">
                                        Esta sección se integrará con el motor de búsqueda de la Biblia del App para facilitar el estudio en grupo.
                                    </p>

                                    {showConcordance && (
                                        <div className="mt-4 p-3 bg-light rounded-4 border-start border-success border-4 animate-fade-in">
                                            <h6 className="fw-bold text-success mb-2">Glosario Rápido:</h6>
                                            <div className="small d-flex flex-column gap-2">
                                                <div><strong>Gracia:</strong> Favor inmerecido de Dios.</div>
                                                <div><strong>Fe:</strong> Certeza de lo que se espera, convicción de lo que no se ve.</div>
                                                <div><strong>Selah:</strong> Pausa para meditar.</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Study Tools */}
                        <div className="study-tools d-grid gap-3">
                            <button
                                className={`btn ${showConcordance ? 'btn-success' : 'btn-outline-success'} rounded-4 p-3 text-start shadow-sm d-flex align-items-center gap-3`}
                                onClick={() => setShowConcordance(!showConcordance)}
                            >
                                <div className="bg-success-subtle p-2 rounded-3"><BookOpen size={20} /></div>
                                <div>
                                    <div className="fw-bold small">Concordancia</div>
                                    <div className="text-muted extra-small">Diccionario y significados</div>
                                </div>
                            </button>
                            <button className="btn btn-outline-primary rounded-4 p-3 text-start shadow-sm d-flex align-items-center gap-3">
                                <div className="bg-primary-subtle p-2 rounded-3"><Users size={20} /></div>
                                <div>
                                    <div className="fw-bold small">Notas Compartidas</div>
                                    <div className="text-muted extra-small">Anotaciones del grupo</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Right Column: Chat Room */}
            <div className={`col h-100 d-flex flex-column ${showBible ? 'col-lg-7' : 'col-12'}`}>
                <div className="chat-header mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h4 className="fw-bold mb-1">{room.title}</h4>
                            <div className="small text-muted d-flex align-items-center gap-2">
                                <Users size={14} /> Anfitrión: {room.host.name}
                                {room.participants && (
                                    <>
                                        <span className="mx-1">•</span>
                                        <span>{room.participants.length}/20 participantes</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {!showBible && (
                            <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={() => setShowBible(true)}>
                                <Book size={16} /> Abrir Biblia
                            </button>
                        )}
                    </div>

                    {/* Room Controls */}
                    <div className="d-flex gap-2 flex-wrap">
                        <button
                            className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-1"
                            onClick={() => {
                                const link = `${window.location.origin}/dashboard/study/${room.id}`;
                                navigator.clipboard.writeText(link);
                                toast.success("¡Link copiado! Compártelo con otros.");
                            }}
                        >
                            <Share2 size={14} /> Compartir
                        </button>

                        <button
                            className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center gap-1"
                            onClick={async () => {
                                if (confirm("¿Estás seguro que quieres abandonar esta sala?")) {
                                    const router = useRouter();
                                    const res = await leaveStudyRoom(room.id);
                                    if (res.success) {
                                        toast.success("Has abandonado la sala");
                                        window.location.href = "/dashboard/study";
                                    } else {
                                        toast.error("Error al salir");
                                    }
                                }
                            }}
                        >
                            <LogOut size={14} /> Abandonar
                        </button>

                        {room.host.id === currentUserId && (
                            <>
                                <button
                                    className="btn btn-sm btn-outline-warning rounded-pill d-flex align-items-center gap-1"
                                    onClick={() => {
                                        // Toggle participants list
                                        const list = document.getElementById('participants-list');
                                        if (list) list.classList.toggle('d-none');
                                    }}
                                >
                                    <Users size={14} /> Gestionar
                                </button>

                                <button
                                    className="btn btn-sm btn-danger rounded-pill d-flex align-items-center gap-1"
                                    onClick={async () => {
                                        if (confirm("¿Estás seguro que quieres ELIMINAR esta sala? Esta acción no se puede deshacer.")) {
                                            const res = await deleteStudyRoom(room.id);
                                            if (res.success) {
                                                toast.success("Sala eliminada");
                                                window.location.href = "/dashboard/study";
                                            } else {
                                                toast.error(res.error || "Error al eliminar");
                                            }
                                        }
                                    }}
                                >
                                    <Trash2 size={14} /> Eliminar Sala
                                </button>
                            </>
                        )}
                    </div>

                    {/* Participants List (Collapsible) */}
                    {room.host.id === currentUserId && room.participants && (
                        <div id="participants-list" className="d-none mt-3 p-3 bg-light rounded-3 border">
                            <h6 className="fw-bold mb-3">Participantes ({room.participants.length}/20)</h6>
                            <div className="d-flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {room.participants.map((p) => (
                                    <div key={p.user.id} className="d-flex align-items-center justify-content-between p-2 bg-white rounded-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <UserAvatar name={p.user.name} size={24} />
                                            <span className="small fw-bold">{p.user.name}</span>
                                            {p.user.id === room.host.id && (
                                                <span className="badge bg-success-subtle text-success border border-success" style={{ fontSize: '0.6rem' }}>Anfitrión</span>
                                            )}
                                        </div>
                                        {p.user.id !== room.host.id && (
                                            <button
                                                className="btn btn-sm btn-outline-danger rounded-pill px-2 py-0"
                                                style={{ fontSize: '0.7rem' }}
                                                onClick={async () => {
                                                    if (confirm(`¿Expulsar a ${p.user.name}?`)) {
                                                        const res = await kickParticipant(room.id, p.user.id);
                                                        if (res.success) {
                                                            toast.success("Participante expulsado");
                                                            window.location.reload();
                                                        } else {
                                                            toast.error("Error al expulsar");
                                                        }
                                                    }
                                                }}
                                            >
                                                <UserMinus size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="chat-area flex-grow-1 bg-white rounded-4 shadow-sm border p-4 mb-3 overflow-auto d-flex flex-column">
                    <div className="messages-list d-flex flex-column gap-3">
                        {messages.map((msg, i) => (
                            <div key={msg.id || i} className={`d-flex gap-3 ${msg.userId === currentUserId ? 'flex-row-reverse align-self-end' : 'align-self-start'}`} style={{ maxWidth: '80%' }}>
                                {msg.userId !== currentUserId && (
                                    <div className="flex-shrink-0">
                                        <UserAvatar name={msg.user.name} size={32} />
                                    </div>
                                )}
                                <div className={`message-bubble p-3 rounded-4 shadow-sm ${msg.userId === currentUserId ? 'bg-primary text-white' : 'bg-light'}`}>
                                    {msg.userId !== currentUserId && <div className="fw-bold small mb-1 opacity-75">{msg.user.name}</div>}
                                    <div className="message-text">{msg.content}</div>
                                    <div className={`extra-small mt-1 opacity-50 text-end`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="flex-shrink-0">
                    <div className="chat-input shadow-sm rounded-pill overflow-hidden border d-flex bg-white">
                        <input
                            type="text"
                            className="form-control border-0 px-4 py-3"
                            placeholder="Escribe tu reflexión o pregunta..."
                            value={content}
                            onChange={(e) => setContent(e.target.value.slice(0, 120))}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
                            disabled={loading}
                            maxLength={120}
                        />
                        <button className="btn btn-primary px-4" onClick={handleSend} disabled={loading || !content.trim()}>
                            <Send size={20} />
                        </button>
                    </div>
                    <div className="text-end px-4 mt-1">
                        <small className={`extra-small ${content.length === 120 ? 'text-danger fw-bold' : 'text-muted'}`}>
                            {content.length}/120
                        </small>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .extra-small { font-size: 0.65rem; }
                .study-layout {
                    --bs-gutter-x: 2rem;
                }
                .message-bubble {
                    position: relative;
                }
                .bg-primary {
                    background-color: var(--bs-primary) !important;
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-in;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, UserMinus, Users, Heart, MessageCircle, X, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { searchUsers, addFriend, addFriendByUsername, removeFriend, getFriends, sendSupportMessage, getSupportMessages, markSupportMessageRead } from "./actions";

export default function FriendsPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSupportModal, setShowSupportModal] = useState<string | null>(null); // friendId
    const [supportMessage, setSupportMessage] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (force = false) => {
        setLoading(true);

        const cached = sessionStorage.getItem('friends_data');
        const lastFetch = sessionStorage.getItem('friends_data_time');
        const now = Date.now();

        if (cached && lastFetch && (now - parseInt(lastFetch) < 2 * 60 * 1000) && !force) {
             try {
                const { friends: f, messages: m } = JSON.parse(cached);
                setFriends(f);
                setMessages(m);
                setLoading(false);
                return;
             } catch(e) {}
        }

        const [friendsData, messagesData] = await Promise.all([getFriends(), getSupportMessages()]);
        setFriends(friendsData);
        setMessages(messagesData);
        
        sessionStorage.setItem('friends_data', JSON.stringify({ friends: friendsData, messages: messagesData }));
        sessionStorage.setItem('friends_data_time', now.toString());
        
        setLoading(false);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.length < 3) return;
        const res = await searchUsers(query);
        setResults(res);
    };

    const handleAdd = async (id: string) => {
        const res = await addFriend(id);
        if (res?.error) {
            alert(res.error);
        } else {
            alert("¡Amigo añadido!");
            setQuery("");
            setResults([]);
            loadData();
        }
    };

    const handleAddByUsername = async () => {
        if (!query) return;
        const res = await addFriendByUsername(query);
        if (res?.error) {
            alert(res.error);
        } else {
            alert("¡Amigo añadido!");
            setQuery("");
            setResults([]);
            loadData();
        }
    };

    const handleRemove = async (id: string) => {
        if (!confirm("¿Dejar de ser amigos?")) return;
        await removeFriend(id);
        loadData(true); // Force refresh
    };

    const handleSendSupport = async () => {
        if (!showSupportModal || !supportMessage) return;
        
        const res = await sendSupportMessage(showSupportModal, supportMessage);
        if (res?.error) {
            alert(res.error);
        } else {
            alert("¡Mensaje de apoyo enviado!");
            setShowSupportModal(null);
            setSupportMessage("");
        }
    };

    const handleMarkRead = async (id: string) => {
        await markSupportMessageRead(id);
        const updatedMessages = messages.map(m => m.id === id ? { ...m, read: true } : m);
        setMessages(updatedMessages);
    };

    const SUPPORT_PRESETS = [
        "¡Estoy orando por ti! 🙏",
        "¡Sigue adelante, Dios está contigo! 💪",
        "Eres valiente y amado. ❤️",
        "¡No te rindas! 🌟"
    ];

    return (
        <div className="container-fluid py-4 animate-fade-in bg-light min-vh-100">
            {/* Support Modal */}
            {showSupportModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
                    <div className="bg-white p-4 rounded-4 shadow-lg w-100" style={{ maxWidth: '400px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">Enviar Apoyo</h5>
                            <button onClick={() => setShowSupportModal(null)} className="btn btn-sm btn-light rounded-circle"><X size={20} /></button>
                        </div>
                        <p className="text-muted small">Envía un mensaje breve de ánimo. No necesitas saber sus luchas para orar por ellos.</p>
                        
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {SUPPORT_PRESETS.map(preset => (
                                <button 
                                    key={preset} 
                                    onClick={() => setSupportMessage(preset)}
                                    className={`btn btn-sm rounded-pill ${supportMessage === preset ? 'btn-primary' : 'btn-outline-primary'}`}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>

                        <textarea 
                            className="form-control mb-3" 
                            rows={3} 
                            placeholder="O escribe algo breve..."
                            value={supportMessage}
                            onChange={(e) => setSupportMessage(e.target.value)}
                            maxLength={100}
                        ></textarea>

                        <button onClick={handleSendSupport} className="btn btn-primary w-100 rounded-pill" disabled={!supportMessage}>
                            <Send size={18} className="me-2" /> Enviar Mensaje
                        </button>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="fw-bold text-primary mb-1">Comunidad Conecta+</h1>
                    <p className="text-muted small">Conecta con otros y crezcan juntos en la fe.</p>
                </div>
                <Link href="/dashboard/profile" className="btn btn-outline-primary rounded-pill px-4">
                    Volver al Perfil
                </Link>
            </div>

            {/* Received Messages Section */}
            {messages.length > 0 && (
                <div className="mb-5">
                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                        <MessageCircle className="text-primary" /> Mensajes de Apoyo Recientes
                    </h5>
                    <div className="d-flex gap-3 overflow-auto pb-3">
                        {messages.map(msg => (
                            <div key={msg.id} className={`card border-0 shadow-sm p-3 rounded-4 flex-shrink-0 ${msg.read ? 'bg-light opacity-75' : 'bg-white border-primary border-2'}`} style={{ width: '280px' }}>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-1 position-relative" style={{ width: '30px', height: '30px' }}>
                                        {msg.sender.image ? <Image src={msg.sender.image} alt={msg.sender.name || 'User'} fill className="rounded-circle object-fit-cover" /> : <span className="d-flex align-items-center justify-content-center w-100 h-100 small fw-bold text-primary">{msg.sender.name?.[0]}</span>}
                                    </div>
                                    <small className="fw-bold">{msg.sender.name}</small>
                                </div>
                                <p className="small mb-2 fst-italic">"{msg.message}"</p>
                                {!msg.read && (
                                    <button onClick={() => handleMarkRead(msg.id)} className="btn btn-sm btn-light text-primary w-100 rounded-pill py-0" style={{ fontSize: '0.8rem' }}>
                                        Marcar como leído
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="row g-4">

                {/* Left Column: Search & Discovery */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow-lg p-4 rounded-5 bg-white h-100">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                                <Search size={24} className="text-primary" />
                            </div>
                            <h5 className="fw-bold mb-0">Buscar Amigos</h5>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-muted">Búsqueda rápida</label>
                            <form onSubmit={handleSearch} className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control rounded-pill border-2 border-primary border-opacity-10"
                                    placeholder="Nombre o @usuario..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary rounded-circle p-2 shadow-sm">
                                    <Search size={20} />
                                </button>
                            </form>
                            <div className="mt-2 d-flex justify-content-center">
                                <button
                                    onClick={handleAddByUsername}
                                    className="btn btn-link btn-sm text-decoration-none text-primary fw-bold"
                                    disabled={!query}
                                >
                                    Intentar agregar directo por @usuario
                                </button>
                            </div>
                        </div>

                        {results.length > 0 ? (
                            <div className="mt-3 animate-fade-in">
                                <h6 className="text-muted small fw-bold mb-3">Resultados encontrados:</h6>
                                <div className="d-flex flex-column gap-3">
                                    {results.map(u => (
                                        <div key={u.id} className="d-flex justify-content-between align-items-center p-3 bg-light rounded-4 border border-white">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '45px', height: '45px' }}>
                                                    {u.image ? <img src={u.image} className="w-100 h-100 rounded-circle object-fit-cover" /> : u.name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="mb-0 fw-bold">{u.name}</p>
                                                    <p className="mb-0 text-muted small">@{u.username || 'usuario'}</p>
                                                </div>
                                            </div>

                                            {friends.some(f => f.id === u.id) ? (
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">Amigos</span>
                                            ) : (
                                                <button onClick={() => handleAdd(u.id)} className="btn btn-primary rounded-pill px-3 btn-sm shadow-sm">
                                                    <UserPlus size={16} className="me-1" /> Añadir
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : query.length >= 3 && (
                            <div className="text-center py-4 opacity-50">
                                <p className="small mb-0">Presiona Enter para buscar más...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Friends List */}
                <div className="col-lg-7">
                    <div className="card border-0 shadow-lg p-4 rounded-5 bg-white h-100">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                                    <Users size={24} className="text-success" />
                                </div>
                                <h5 className="fw-bold mb-0">Mis Amigos ({friends.length})</h5>
                            </div>
                        </div>

                        {loading ? (
                            <div className="d-flex justify-content-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                            </div>
                        ) : friends.length === 0 ? (
                            <div className="text-center py-5 opacity-50 border-2 border-dashed rounded-4">
                                <Users size={48} className="mb-3 text-muted" />
                                <p className="small">Aún no tienes amigos agregados.<br />¡Busca a alguien para empezar!</p>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {friends.map(friend => (
                                    <div key={friend.id} className="col-12 col-md-6">
                                        <div className="bg-light p-3 rounded-4 border border-white h-100 d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary shadow-sm overflow-hidden position-relative" style={{ width: '48px', height: '48px' }}>
                                                    {friend.image ? <Image src={friend.image} alt={friend.name} fill className="rounded-circle object-fit-cover" /> : friend.name?.[0]}
                                                </div>
                                                <div className="d-flex gap-1">
                                                    <button 
                                                        onClick={() => setShowSupportModal(friend.id)} 
                                                        className="btn btn-outline-primary btn-sm rounded-circle p-2 border-0" 
                                                        title="Enviar Apoyo"
                                                    >
                                                        <Heart size={18} />
                                                    </button>
                                                    <button onClick={() => handleRemove(friend.id)} className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0" title="Eliminar amigo">
                                                        <UserMinus size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-0">{friend.name}</h6>
                                                <p className="text-muted small mb-1">@{friend.username || '...'}</p>
                                                <span className="badge bg-primary bg-opacity-10 text-primary small rounded-pill">
                                                    Nivel: {friend.spiritualLevel || 'Explorador'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


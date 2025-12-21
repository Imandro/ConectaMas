"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, UserMinus, Users } from "lucide-react";
import Link from "next/link";
import { searchUsers, addFriend, addFriendByUsername, removeFriend, getFriends } from "./actions";

export default function FriendsPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFriends();
    }, []);

    const loadFriends = async () => {
        const data = await getFriends();
        setFriends(data);
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
            loadFriends();
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
            loadFriends();
        }
    };

    const handleRemove = async (id: string) => {
        if (!confirm("¿Dejar de ser amigos?")) return;
        await removeFriend(id);
        loadFriends();
    };

    return (
        <div className="container-fluid py-4 animate-fade-in bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="fw-bold text-primary mb-1">Comunidad Conecta+</h1>
                    <p className="text-muted small">Conecta con otros y crezcan juntos en la fe.</p>
                </div>
                <Link href="/dashboard/profile" className="btn btn-outline-primary rounded-pill px-4">
                    Volver al Perfil
                </Link>
            </div>

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
                                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary shadow-sm" style={{ width: '48px', height: '48px' }}>
                                                    {friend.image ? <img src={friend.image} className="w-100 h-100 rounded-circle object-fit-cover" /> : friend.name?.[0]}
                                                </div>
                                                <button onClick={() => handleRemove(friend.id)} className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0">
                                                    <UserMinus size={18} />
                                                </button>
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


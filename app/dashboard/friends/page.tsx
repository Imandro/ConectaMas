"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, UserMinus, Users } from "lucide-react";
import Link from "next/link";
import { searchUsers, addFriend, removeFriend, getFriends } from "./actions";

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
        await addFriend(id);
        alert("¡Amigo añadido!");
        setQuery("");
        setResults([]);
        loadFriends();
    };

    const handleRemove = async (id: string) => {
        if (!confirm("¿Dejar de ser amigos?")) return;
        await removeFriend(id);
        loadFriends();
    };

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold text-secondary mb-0">Mis Amigos</h1>
                <Link href="/dashboard/profile" className="btn btn-outline-secondary rounded-pill">
                    Volver al Perfil
                </Link>
            </div>

            {/* Search Section */}
            <div className="card border-0 shadow-sm p-4 mb-4 rounded-4">
                <h5 className="fw-bold mb-3">Buscar Nuevos Amigos</h5>
                <form onSubmit={handleSearch} className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control rounded-pill"
                        placeholder="Buscar por nombre o usuario..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary rounded-circle p-2">
                        <Search size={20} />
                    </button>
                </form>

                {results.length > 0 && (
                    <div className="mt-3">
                        <h6 className="text-muted small fw-bold">Resultados:</h6>
                        <ul className="list-group list-group-flush">
                            {results.map(u => (
                                <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                                            {u.image ? <img src={u.image} className="w-100 h-100 rounded-circle object-fit-cover" /> : u.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="mb-0 fw-bold small">{u.name}</p>
                                            <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>@{u.username || 'usuario'}</p>
                                        </div>
                                    </div>

                                    {friends.some(f => f.id === u.id) ? (
                                        <span className="badge bg-success bg-opacity-10 text-success">Ya son amigos</span>
                                    ) : (
                                        <button onClick={() => handleAdd(u.id)} className="btn btn-sm btn-outline-primary rounded-pill">
                                            <UserPlus size={16} /> Añadir
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Friends List */}
            <h5 className="fw-bold mb-3">Tu Lista ({friends.length})</h5>
            {loading ? (
                <div className="spinner-border text-primary" role="status"></div>
            ) : friends.length === 0 ? (
                <div className="text-center py-5 opacity-50">
                    <Users size={48} className="mb-3" />
                    <p>Aún no tienes amigos agregados.</p>
                </div>
            ) : (
                <div className="row g-3">
                    {friends.map(friend => (
                        <div key={friend.id} className="col-12 col-md-6">
                            <div className="card border-0 shadow-sm p-3 rounded-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 text-primary" style={{ width: '50px', height: '50px' }}>
                                            {friend.image ? <img src={friend.image} className="w-100 h-100 rounded-circle object-fit-cover" /> : friend.name?.[0]}
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0">{friend.name}</h6>
                                            <small className="text-muted">@{friend.username || '...'}</small>
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemove(friend.id)} className="btn btn-link text-danger">
                                        <UserMinus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, MessageCircle, Heart, UserMinus, ArrowLeft, Loader2, Send, Check, Users } from "lucide-react";
import Link from "next/link";
import { searchUsers, addFriend, getFriends, removeFriend, sendSupportMessage, getSupportMessages, markSupportMessageRead } from "./actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/LanguageContext";

export default function FriendsPage() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingFriends, setIsLoadingFriends] = useState(true);
    const [supportStatus, setSupportStatus] = useState<{ userId: string | null; message: string }>({ userId: null, message: "" });
    const [recentMessages, setRecentMessages] = useState<any[]>([]);

    useEffect(() => {
        loadFriends();
        loadMessages();
    }, []);

    const loadFriends = async () => {
        setIsLoadingFriends(true);
        try {
            const data = await getFriends();
            setFriends(data);
        } finally {
            setIsLoadingFriends(false);
        }
    };

    const loadMessages = async () => {
        const msgs = await getSupportMessages();
        setRecentMessages(msgs);
    };

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!searchTerm.trim()) return;
        setIsSearching(true);
        try {
            const results = await searchUsers(searchTerm);
            setSearchResults(results);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddFriend = async (friendId: string) => {
        try {
            await addFriend(friendId);
            toast.success(t.friends.add_success);
            loadFriends();
            setSearchResults(prev => prev.filter(u => u.id !== friendId));
        } catch (error) {
            toast.error("Error");
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        if (confirm(t.friends.remove_confirm)) {
            try {
                await removeFriend(friendId);
                loadFriends();
            } catch (error) {
                toast.error("Error");
            }
        }
    };

    const handleSendSupport = async () => {
        if (!supportStatus.userId || !supportStatus.message) return;
        try {
            await sendSupportMessage(supportStatus.userId, supportStatus.message);
            toast.success(t.friends.support_success);
            setSupportStatus({ userId: null, message: "" });
        } catch (error) {
            toast.error("Error");
        }
    };

    const handleMarkAsRead = async (messageId: string) => {
        await markSupportMessageRead(messageId);
        loadMessages();
    };

    const getSpiritualLevel = (level: string) => {
        if (!level) return t.spiritual_levels.exploring;
        const l = level.toLowerCase();
        if (l === 'explorador' || l === 'exploring') return t.spiritual_levels.exploring;
        if (l === 'principiante' || l === 'beginner') return t.spiritual_levels.beginner;
        if (l === 'creciendo' || l === 'growing') return t.spiritual_levels.growing;
        if (l === 'comprometido' || l === 'committed') return t.spiritual_levels.committed;
        if (l === 'líder' || l === 'leader') return t.spiritual_levels.leader;
        return level;
    };

    return (
        <div className="container-fluid py-4 min-vh-100 bg-light">
            {/* Header */}
            <div className="d-flex align-items-center gap-3 mb-4">
                <Link href="/dashboard/profile" className="btn btn-white border shadow-sm rounded-circle p-2">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h2 className="fw-bold mb-0">{t.friends.title}</h2>
                    <p className="text-muted small mb-0">{t.friends.subtitle}</p>
                </div>
                <div className="ms-auto">
                    <button
                        className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2 btn-sm"
                        onClick={() => {
                            // Quick way to get link if we don't have username in state yet: Just prompt or use generic invite
                            // Ideally, we fetch "me". For now, user knows their username.
                            // Let's copy a generic message telling them to share their username.
                            navigator.clipboard.writeText(`¡Únete a mi círculo en Conecta+! Mi usuario es: (ve a tu perfil para verlo)`);
                            toast.success("¡Texto copiado! Agrega tu usuario y compártelo.");
                        }}
                    >
                        <Heart size={16} /> <span className="d-none d-sm-inline">Invitar Amigos</span>
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* Search and Discovery */}
                <div className="col-12 col-md-5">
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <Search size={20} className="text-primary" />
                            {t.friends.search_title}
                        </h5>

                        <form onSubmit={handleSearch} className="mb-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control border-end-0"
                                    placeholder={t.friends.search_placeholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="btn btn-primary px-3" type="submit" disabled={isSearching}>
                                    {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                </button>
                            </div>
                        </form>

                        {searchResults.length > 0 ? (
                            <div className="animate-fade-in">
                                <p className="text-muted small mb-3">{t.friends.search_results} {searchResults.length}</p>
                                <div className="d-grid gap-2">
                                    {searchResults.map((user) => (
                                        <div key={user.id} className="p-3 border rounded-3 d-flex align-items-center justify-content-between bg-light bg-opacity-50">
                                            <div className="d-flex align-items-center gap-2">
                                                {user.image ? (
                                                    <img src={user.image} className="rounded-circle" style={{ width: 32, height: 32 }} />
                                                ) : (
                                                    <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32 }}>
                                                        {user.name?.[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="d-block fw-bold small">{user.name}</span>
                                                    <span className="text-muted small">@{user.username}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAddFriend(user.id)}
                                                className="btn btn-primary btn-sm rounded-pill px-3"
                                            >
                                                {t.friends.add_friend}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : searchTerm && !isSearching && (
                            <div className="text-center py-4 bg-light rounded-3">
                                <p className="text-muted small mb-0">{t.friends.search_direct}</p>
                            </div>
                        )}

                        <div className="mt-4 p-3 bg-primary bg-opacity-10 rounded-3">
                            <p className="small text-primary mb-0 d-flex align-items-center gap-2 font-italic">
                                <Heart size={14} />
                                {t.friends.search_enter}
                            </p>
                        </div>
                    </div>

                    {/* Messages Received */}
                    {recentMessages.length > 0 && (
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <MessageCircle size={20} className="text-success" />
                                {t.friends.recent_messages}
                            </h5>
                            <div className="d-grid gap-3">
                                {recentMessages.map((msg) => (
                                    <div key={msg.id} className={`p-3 border rounded-3 position-relative ${msg.read ? 'opacity-75 bg-light' : 'bg-success bg-opacity-10 border-success border-opacity-25'}`}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span className="fw-bold small text-success">@{msg.sender.username}</span>
                                            {!msg.read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(msg.id)}
                                                    className="btn btn-sm text-success p-0"
                                                    title={t.friends.mark_as_read}
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="small mb-0 fst-italic">"{msg.message}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Friends List */}
                <div className="col-12 col-md-7">
                    <div className="card border-0 shadow-sm rounded-4 p-4 min-vh-50">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                <Users size={20} className="text-primary" />
                                {t.friends.friends_title}
                            </h5>
                            <span className="badge bg-primary rounded-pill px-3">{friends.length}</span>
                        </div>

                        {isLoadingFriends ? (
                            <div className="d-flex flex-column align-items-center justify-content-center py-5">
                                <Loader2 className="animate-spin text-primary mb-2" size={32} />
                            </div>
                        ) : friends.length === 0 ? (
                            <div className="text-center py-5">
                                <Heart size={48} className="text-muted opacity-25 mb-3" />
                                <p className="text-muted">{t.friends.friends_empty}</p>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {friends.map((friend) => {
                                    return (
                                        <div key={friend.id} className="col-12">
                                            <div className="p-3 border rounded-4 bg-white hover-shadow transition">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center gap-3">
                                                        {friend.image ? (
                                                            <img src={friend.image} className="rounded-circle shadow-sm" style={{ width: 48, height: 48 }} />
                                                        ) : (
                                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: 48, height: 48 }}>
                                                                {friend.name?.[0]}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h6 className="fw-bold mb-0">{friend.name}</h6>
                                                            <div className="d-flex gap-2 align-items-center">
                                                                <span className="text-muted small">@{friend.username}</span>
                                                                <span className="badge bg-light text-secondary border rounded-pill" style={{ fontSize: '0.65rem' }}>
                                                                    {t.friends.level_label}: {getSpiritualLevel(friend.spiritualLevel)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex gap-2">
                                                        <button
                                                            onClick={() => setSupportStatus({ userId: friend.id, message: "" })}
                                                            className="btn btn-outline-success btn-sm rounded-pill d-flex align-items-center gap-1"
                                                        >
                                                            <MessageCircle size={16} />
                                                            <span className="d-none d-sm-inline">{t.friends.send_support}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveFriend(friend.id)}
                                                            className="btn btn-outline-light text-muted btn-sm rounded-circle border p-2"
                                                        >
                                                            <UserMinus size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div >
                </div >
            </div >
            {/* Support Message Modal */}
            {supportStatus.userId && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75" style={{ zIndex: 1050 }}>
                    <div className="card border-0 shadow-lg rounded-4 p-4" style={{ maxWidth: '400px', width: '90%' }}>
                        <h5 className="fw-bold mb-2">{t.friends.support_modal_title}</h5>
                        <p className="text-muted small mb-3">{t.friends.support_modal_p}</p>

                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder={t.friends.support_placeholder}
                            maxLength={50}
                            value={supportStatus.message}
                            onChange={(e) => setSupportStatus(prev => ({ ...prev, message: e.target.value }))}
                        />
                        <div className="d-flex justify-content-between mb-3">
                            <small className="text-muted">{supportStatus.message.length}/50</small>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-primary flex-grow-1 rounded-pill fw-bold"
                                onClick={handleSendSupport}
                                disabled={!supportStatus.message.trim()}
                            >
                                <Send size={16} className="me-2" />
                                {t.friends.support_send}
                            </button>
                            <button
                                className="btn btn-light rounded-pill px-3"
                                onClick={() => setSupportStatus({ userId: null, message: "" })}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

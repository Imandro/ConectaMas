"use client";

import { useState, useEffect } from "react";
import { Users, Plus, LogIn } from "lucide-react";
import Link from "next/link";
import JoinGroupModal from "./components/JoinGroupModal";

import { getMyGroups } from "./actions";

type Group = { id: string; name: string; motto: string | null };

export default function GroupsLandingPage() {
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [myGroups, setMyGroups] = useState<Group[]>([]);

    useEffect(() => {
        if (!navigator.onLine) return;
        getMyGroups().then(setMyGroups);
    }, []);

    return (
        <div className="container-fluid py-4 animate-fade-in">
            {/* Header */}
            <header className="ui-page-header mb-4">
                <div>
                    <h1 className="fw-extrabold text-dark m-0" style={{ fontSize: '2rem' }}>Grupos Pequeños</h1>
                    <p className="text-muted m-0">Crece junto a otros en tu caminar espiritual.</p>
                </div>
            </header>

            {/* Actions */}
            <div className="row g-3 mb-5">
                <div className="col-12 col-md-6">
                    <Link href="/dashboard/groups/create" className="text-decoration-none">
                        <div className="card border-0 shadow-sm bg-primary text-white hover-scale h-100">
                            <div className="card-body p-4 d-flex align-items-center justify-content-between">
                                <div>
                                    <h4 className="fw-bold mb-1">Crear un Grupo</h4>
                                    <p className="mb-0 opacity-75 small">Conviértete en líder y guía a otros.</p>
                                </div>
                                <div className="bg-white bg-opacity-25 p-3 rounded-circle">
                                    <Plus size={32} />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-12 col-md-6">
                    <button onClick={() => setShowJoinModal(true)} className="btn p-0 w-100 text-start h-100">
                        <div className="ui-surface hover-scale h-100">
                            <div className="card-body p-4 d-flex align-items-center justify-content-between">
                                <div>
                                    <h4 className="fw-bold text-dark mb-1">Unirme a un Grupo</h4>
                                    <p className="text-muted mb-0 small">Ingresa el código de acceso.</p>
                                </div>
                                <div className="bg-light text-primary p-3 rounded-circle">
                                    <LogIn size={32} />
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* My Groups List */}
            <h5 className="fw-bold text-secondary mb-3">Mis Grupos</h5>

            {myGroups.length === 0 ? (
                <div className="ui-state border-dashed">
                    <Users size={48} className="text-muted mb-3 opacity-50" />
                    <h6 className="fw-bold text-muted">Aún no perteneces a ningún grupo</h6>
                    <p className="text-muted small mb-0">¡Únete a uno o crea el tuyo para empezar!</p>
                </div>
            ) : (
                <div className="row g-3">
                    {myGroups.map(group => (
                        <div key={group.id} className="col-12 col-md-4">
                            <Link href={`/dashboard/groups/${group.id}`} className="text-decoration-none text-dark">
                                <div className="ui-surface hover-scale h-100">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
                                                <Users size={24} />
                                            </div>
                                            <span className="badge bg-light text-muted border">Miembro</span>
                                        </div>
                                        <h5 className="fw-bold mb-1 text-truncate">{group.name}</h5>
                                        <p className="text-muted small mb-3">{group.motto}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            <JoinGroupModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
        </div>
    );
}

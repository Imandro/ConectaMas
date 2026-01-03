"use client";

import { useState } from "react";
import { Plus, ShieldAlert, Trophy, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createStruggle } from "../actions";

// Define the Struggle interface based on our usage
interface Struggle {
    id: string;
    title: string;
    status: string; // "ACTIVE" | "vencido"
    startDate: string | Date;
    currentDay: number;
    completedDays: string;
    isStarted: boolean;
    totalDays?: number; // Added dynamic total days
}

export default function StruggleTracker({
    initialStruggles
}: {
    initialStruggles: Struggle[]
}) {
    const [struggles, setStruggles] = useState<Struggle[]>(initialStruggles);
    const [isAdding, setIsAdding] = useState(false);
    const [newStruggleTitle, setNewStruggleTitle] = useState("");

    const router = useRouter();

    const availableStruggles = struggles.filter(s => s.status === "ACTIVE" && !s.isStarted);
    const activeStruggles = struggles.filter(s => s.status === "ACTIVE" && s.isStarted);
    const overcomeStruggles = struggles.filter(s => s.status === "vencido");

    const handleAddStruggle = async () => {
        if (!newStruggleTitle.trim()) return;

        const res = await createStruggle(newStruggleTitle);
        if (res.success && res.struggle) {
            setStruggles(prev => [res.struggle as Struggle, ...prev]);
            setIsAdding(false);
            setNewStruggleTitle("");
        }
    };

    const renderStruggleCard = (struggle: Struggle, isAvailable: boolean = false) => {
        const totalDays = struggle.totalDays || 7;
        const progress = (struggle.currentDay / totalDays) * 100;
        return (
            <Link
                key={struggle.id}
                href={`/dashboard/luchas/${struggle.id}`}
                className={`bg-white p-3 rounded-4 border-0 position-relative overflow-hidden cursor-pointer hover-scale transition-all shadow-sm mb-3 d-block text-decoration-none ${isAvailable ? 'border-start border-4 border-warning' : 'border-start border-4 border-primary'}`}
            >
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                        <span className="fw-bold d-block text-dark fs-5">{struggle.title}</span>
                        <div className="d-flex align-items-center gap-2">
                            {isAvailable ? (
                                <div className="badge bg-warning-subtle text-warning rounded-pill">Plan por iniciar</div>
                            ) : (
                                <div className="badge bg-primary rounded-pill">Día {struggle.currentDay} / {totalDays}</div>
                            )}
                            <span className="text-muted small">Ver apartado</span>
                        </div>
                    </div>
                    <div className="text-primary">
                        <ChevronRight size={24} />
                    </div>
                </div>

                {!isAvailable && (
                    <div className="progress" style={{ height: '6px', backgroundColor: '#e2e8f0', marginTop: '10px' }}>
                        <div
                            className="progress-bar bg-primary rounded-pill"
                            role="progressbar"
                            style={{ width: `${progress}%` }}
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        ></div>
                    </div>
                )}
            </Link>
        );
    };

    return (
        <div className="card border-0 shadow-sm p-4 bg-transparent rounded-4 overflow-hidden">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold d-flex align-items-center gap-2 m-0 text-secondary">
                    <ShieldAlert className="text-primary" size={24} />
                    Resumen de Vida
                </h5>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-primary rounded-circle p-2 shadow-sm hover-scale transition-all border-0"
                >
                    {isAdding ? <X size={20} /> : <Plus size={20} />}
                </button>
            </div>

            {isAdding && (
                <div className="d-flex gap-2 mb-4 animate-fade-in p-3 bg-white rounded-4 shadow-sm border border-light">
                    <input
                        type="text"
                        value={newStruggleTitle}
                        onChange={(e) => setNewStruggleTitle(e.target.value)}
                        placeholder="Nueva área a trabajar..."
                        className="form-control rounded-pill border-0 bg-light px-4 shadow-none"
                    />
                    <button
                        onClick={handleAddStruggle}
                        className="btn btn-primary fw-bold rounded-pill px-4 shadow-sm"
                    >
                        Agregar
                    </button>
                </div>
            )}

            <div className="row g-4">
                {/* Planes Disponibles */}
                <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center justify-content-between mb-3 px-1">
                        <h6 className="fw-bold text-muted text-uppercase small m-0">Planes Disponibles ({availableStruggles.length})</h6>
                    </div>
                    {availableStruggles.length === 0 && (
                        <div className="p-4 text-center bg-white rounded-4 border border-dashed border-2 opacity-75">
                            <p className="text-muted small fst-italic m-0">No hay planes nuevos disponibles.</p>
                        </div>
                    )}
                    {availableStruggles.map(s => renderStruggleCard(s, true))}
                </div>

                {/* En Progreso */}
                <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center justify-content-between mb-3 px-1">
                        <h6 className="fw-bold text-muted text-uppercase small m-0">En Progreso ({activeStruggles.length})</h6>
                    </div>
                    {activeStruggles.length === 0 && (
                        <div className="p-4 text-center bg-white rounded-4 border border-dashed border-2 opacity-75">
                            <p className="text-muted small fst-italic m-0">No tienes planes activos aún.</p>
                        </div>
                    )}
                    {activeStruggles.map(s => renderStruggleCard(s))}
                </div>
            </div>

            {/* Victorias */}
            {overcomeStruggles.length > 0 && (
                <div className="mt-5 pt-4 border-top">
                    <h6 className="small fw-bold text-muted text-uppercase mb-4 d-flex align-items-center gap-2">
                        <Trophy size={18} className="text-warning" /> Salón de Victorias
                    </h6>
                    <div className="row g-3">
                        {overcomeStruggles.map((struggle) => (
                            <div key={struggle.id} className="col-12 col-sm-6 col-lg-4">
                                <Link
                                    href={`/dashboard/luchas/${struggle.id}`}
                                    className="p-3 bg-success-subtle border border-success border-opacity-10 rounded-4 d-flex align-items-center gap-3 hover-scale transition-all cursor-pointer text-decoration-none"
                                >
                                    <div className="bg-success text-white p-2 rounded-circle shadow-sm">
                                        <Trophy size={16} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <span className="fw-bold d-block text-success text-truncate">{struggle.title}</span>
                                        <small className="text-success-emphasis opacity-75 d-block">Vencido con éxito</small>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                .border-dashed { border-style: dashed !important; }
                .hover-scale:hover { transform: scale(1.02); }
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </div>
    );
}

"use client";

import { useState } from "react";
import { CheckCircle2, Plus, ShieldAlert, Trophy, X, ChevronRight, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { createStruggle, toggleStruggleStatus } from "../actions";
import StrugglePlanModal from "./StrugglePlanModal";

// Define the Struggle interface based on our usage
interface Struggle {
    id: string;
    title: string;
    status: string; // "ACTIVE" | "vencido"
    startDate: Date;
    currentDay: number;
    completedDays: string;
    isStarted: boolean;
}

export default function StruggleTracker({
    initialStruggles
}: {
    initialStruggles: Struggle[]
}) {
    const [struggles, setStruggles] = useState<Struggle[]>(initialStruggles);
    const [isAdding, setIsAdding] = useState(false);
    const [newStruggleTitle, setNewStruggleTitle] = useState("");
    const [selectedStruggle, setSelectedStruggle] = useState<Struggle | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const availableStruggles = struggles.filter(s => s.status === "ACTIVE" && !s.isStarted);
    const activeStruggles = struggles.filter(s => s.status === "ACTIVE" && s.isStarted);
    const overcomeStruggles = struggles.filter(s => s.status === "vencido");

    const handleAddStruggle = async () => {
        if (!newStruggleTitle.trim()) return;

        const res = await createStruggle(newStruggleTitle);
        if (res.success && res.struggle) {
            setStruggles(prev => [res.struggle as any, ...prev]);
            setIsAdding(false);
            setNewStruggleTitle("");
        }
    };

    const openStruggle = (struggle: Struggle) => {
        setSelectedStruggle(struggle);
        setIsModalOpen(true);
    };

    const renderStruggleCard = (struggle: Struggle, isAvailable: boolean = false) => {
        const progress = (struggle.currentDay / 7) * 100;
        return (
            <div
                key={struggle.id}
                onClick={() => openStruggle(struggle)}
                className={`bg-white p-3 rounded-4 border-0 position-relative overflow-hidden cursor-pointer hover-scale transition-all shadow-sm mb-3 ${isAvailable ? 'border-start border-4 border-warning' : 'border-start border-4 border-primary'}`}
            >
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                        <span className="fw-bold d-block text-dark fs-5">{struggle.title}</span>
                        <div className="d-flex align-items-center gap-2">
                            {isAvailable ? (
                                <div className="badge bg-warning-subtle text-warning rounded-pill">Plan por iniciar</div>
                            ) : (
                                <div className="badge bg-primary rounded-pill">Día {struggle.currentDay} / 7</div>
                            )}
                            <span className="text-muted small">Haz clic para ver detalles</span>
                        </div>
                    </div>
                    <div className="text-primary">
                        <ChevronRight size={24} />
                    </div>
                </div>

                {!isAvailable && (
                    <div className="progress" style={{ height: '6px', backgroundColor: '#e2e8f0' }}>
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
            </div>
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
                    className="btn btn-primary rounded-circle p-2 shadow hover-scale transition-all"
                >
                    {isAdding ? <X size={20} /> : <Plus size={20} />}
                </button>
            </div>

            {isAdding && (
                <div className="d-flex gap-2 mb-4 animate-fade-in p-3 bg-white rounded-4 shadow-sm">
                    <input
                        type="text"
                        value={newStruggleTitle}
                        onChange={(e) => setNewStruggleTitle(e.target.value)}
                        placeholder="Nueva área a trabajar..."
                        className="form-control rounded-pill border-2"
                    />
                    <button
                        onClick={handleAddStruggle}
                        className="btn btn-primary fw-bold rounded-pill px-4"
                    >
                        Agregar
                    </button>
                </div>
            )}

            <div className="row">
                {/* Planes Disponibles */}
                <div className="col-12 col-md-6">
                    <h6 className="fw-bold text-muted text-uppercase small mb-3">Planes Disponibles ({availableStruggles.length})</h6>
                    {availableStruggles.length === 0 && (
                        <p className="text-muted small fst-italic mb-4">Crea o selecciona un plan para empezar tu transformación.</p>
                    )}
                    {availableStruggles.map(s => renderStruggleCard(s, true))}
                </div>

                {/* En Progreso */}
                <div className="col-12 col-md-6">
                    <h6 className="fw-bold text-muted text-uppercase small mb-3">En Progreso ({activeStruggles.length})</h6>
                    {activeStruggles.length === 0 && (
                        <p className="text-muted small fst-italic mb-4">No tienes planes activos. ¡Inicia uno hoy!</p>
                    )}
                    {activeStruggles.map(s => renderStruggleCard(s))}
                </div>
            </div>

            {/* Victorias */}
            {overcomeStruggles.length > 0 && (
                <div className="mt-4 pt-4 border-top">
                    <h6 className="small fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2">
                        <Trophy size={16} className="text-warning" /> Salón de Victorias
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                        {overcomeStruggles.map((struggle) => (
                            <div key={struggle.id} className="p-3 bg-success-subtle border border-success-subtle rounded-4 d-flex align-items-center gap-3">
                                <div className="bg-success text-white p-2 rounded-circle">
                                    <Trophy size={16} />
                                </div>
                                <div>
                                    <span className="fw-bold d-block text-success">{struggle.title}</span>
                                    <small className="text-success-emphasis">Vencido con la gracia de Dios</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Modal */}
            {selectedStruggle && (
                <StrugglePlanModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        router.refresh();
                    }}
                    struggleId={selectedStruggle.id}
                    struggleTitle={selectedStruggle.title}
                    currentDay={selectedStruggle.currentDay}
                    completedDays={selectedStruggle.completedDays}
                    isStarted={selectedStruggle.isStarted}
                />
            )}

            <style jsx>{`
                .cursor-pointer {
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}

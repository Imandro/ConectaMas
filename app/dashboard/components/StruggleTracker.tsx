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

    const activeStruggles = struggles.filter(s => s.status === "ACTIVE");
    const overcomeStruggles = struggles.filter(s => s.status === "vencido");

    const handleOvercome = async (id: string) => {
        const res = await toggleStruggleStatus(id, "vencido");
        if (res.success) {
            setStruggles(prev => prev.map(s =>
                s.id === id ? { ...s, status: "vencido" } : s
            ));
        }
    };

    const handleAddStruggle = async () => {
        if (!newStruggleTitle.trim()) return;

        const res = await createStruggle(newStruggleTitle);
        if (res.success && res.struggle) {
            setStruggles(prev => [...prev, res.struggle as any]);
            setIsAdding(false);
            setNewStruggleTitle("");
        }
    };

    const openStruggle = (struggle: Struggle) => {
        setSelectedStruggle(struggle);
        setIsModalOpen(true);
    };

    return (
        <div className="card border-0 shadow-sm p-4 bg-white rounded-4 overflow-hidden">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold d-flex align-items-center gap-2 m-0 text-dark">
                    <ShieldAlert className="text-primary" size={20} />
                    Mi Seguimiento <span className="badge bg-light text-secondary rounded-pill fw-normal">{activeStruggles.length} Activas</span>
                </h5>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-light rounded-circle p-2 shadow-sm transition-all hover-scale"
                >
                    {isAdding ? <X size={20} /> : <Plus size={20} />}
                </button>
            </div>

            {isAdding && (
                <div className="d-flex gap-2 mb-4 animate-fade-in">
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

            <div className="d-flex flex-column gap-3">
                {activeStruggles.length === 0 && !isAdding && (
                    <div className="text-center py-4 bg-light rounded-4 border-2 border-dashed">
                        <Target className="text-muted mb-2" size={32} />
                        <p className="text-muted small fst-italic mb-0">
                            No tienes luchas activas en este momento.
                        </p>
                    </div>
                )}

                {activeStruggles.map((struggle) => {
                    const progress = (struggle.currentDay / 7) * 100;
                    return (
                        <div
                            key={struggle.id}
                            onClick={() => openStruggle(struggle)}
                            className="bg-light p-3 rounded-4 border-0 position-relative overflow-hidden cursor-pointer hover-scale transition-all shadow-sm"
                        >
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div>
                                    <span className="fw-bold d-block text-dark fs-5">{struggle.title}</span>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="badge bg-primary rounded-pill">Día {struggle.currentDay} / 7</div>
                                        <span className="text-muted small">Haz clic para leer el plan</span>
                                    </div>
                                </div>
                                <div className="text-primary">
                                    <ChevronRight size={24} />
                                </div>
                            </div>

                            {/* Simple Progress Bar */}
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
                        </div>
                    );
                })}

                {overcomeStruggles.length > 0 && (
                    <div className="mt-4 pt-3 border-top">
                        <h6 className="small fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2">
                            <Trophy size={14} className="text-warning" /> Victorias Recientes
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                            {overcomeStruggles.map((struggle) => (
                                <span key={struggle.id} className="badge bg-success-subtle text-success rounded-pill d-flex align-items-center gap-1 p-2 border border-success-subtle">
                                    <CheckCircle2 size={12} /> {struggle.title}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

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

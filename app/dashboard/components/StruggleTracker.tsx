"use client";

import { useState } from "react";
import { CheckCircle2, Plus, ShieldAlert, Trophy, X } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the Struggle interface based on our usage
interface Struggle {
    id: string;
    title: string;
    status: string; // "ACTIVE" | "OVERCOME"
    startDate: Date;
    cleanDays?: number; // Calculated field if needed or just use start date
}

export default function StruggleTracker({
    initialStruggles
}: {
    initialStruggles: Struggle[]
}) {
    // We'll hydrate state from props, but in a real app might use React Query or similar
    // For now, simpler management
    const [struggles, setStruggles] = useState<Struggle[]>(initialStruggles);
    const [isAdding, setIsAdding] = useState(false);
    const [newStruggleTitle, setNewStruggleTitle] = useState("");
    const router = useRouter();

    const activeStruggles = struggles.filter(s => s.status === "ACTIVE");
    const overcomeStruggles = struggles.filter(s => s.status === "OVERCOME");

    const handleOvercome = async (id: string) => {
        // Optimistic update
        setStruggles(prev => prev.map(s =>
            s.id === id ? { ...s, status: "OVERCOME" } : s
        ));

        // Server action call would go here (or API endpoint)
        // For simplicity in this demo, we'll assume a server action exists or create one inline
        // We will create a server action separately for this: toggleStruggleStatus
        try {
            await fetch('/api/struggles/toggle', {
                method: 'POST',
                body: JSON.stringify({ id, status: 'OVERCOME' }),
            });
            router.refresh(); // Refresh server stat
        } catch (e) {
            console.error(e);
            // Revert if failed
        }
    };

    const handleAddStruggle = async () => {
        if (!newStruggleTitle.trim()) return;

        // Server interaction mock
        try {
            await fetch('/api/struggles/create', {
                method: 'POST',
                body: JSON.stringify({ title: newStruggleTitle }),
            });
            router.refresh();
            setIsAdding(false);
            setNewStruggleTitle("");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="card border-0 shadow-sm p-4 bg-white rounded-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold d-flex align-items-center gap-2 m-0 text-dark">
                    <ShieldAlert className="text-primary" size={20} />
                    Mi Seguimiento <span className="badge bg-light text-secondary rounded-pill fw-normal">{activeStruggles.length} Activas</span>
                </h5>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-light rounded-circle p-2 shadow-sm"
                >
                    {isAdding ? <X size={20} /> : <Plus size={20} />}
                </button>
            </div>

            {isAdding && (
                <div className="d-flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newStruggleTitle}
                        onChange={(e) => setNewStruggleTitle(e.target.value)}
                        placeholder="Nueva área a trabajar..."
                        className="form-control"
                    />
                    <button
                        onClick={handleAddStruggle}
                        className="btn btn-primary fw-bold"
                    >
                        Agregar
                    </button>
                </div>
            )}

            <div className="d-flex flex-column gap-2">
                {activeStruggles.length === 0 && !isAdding && (
                    <p className="text-muted small fst-italic text-center py-3">
                        No tienes luchas activas. ¡Gloria a Dios!
                    </p>
                )}

                {activeStruggles.map((struggle) => (
                    <div key={struggle.id} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                        <div>
                            <span className="fw-bold d-block text-dark">{struggle.title}</span>
                            <span className="text-muted small">Desde {new Date(struggle.startDate).toLocaleDateString()}</span>
                        </div>
                        <button
                            onClick={() => handleOvercome(struggle.id)}
                            className="btn btn-sm btn-success-subtle text-success rounded-circle p-2"
                            title="Marcar como Superado"
                        >
                            <Trophy size={16} />
                        </button>
                    </div>
                ))}

                {overcomeStruggles.length > 0 && (
                    <div className="mt-4 pt-3 border-top">
                        <h6 className="small fw-bold text-muted text-uppercase mb-3">Victorias Recientes</h6>
                        <div className="d-flex flex-wrap gap-2">
                            {overcomeStruggles.map((struggle) => (
                                <span key={struggle.id} className="badge bg-success-subtle text-success rounded-pill d-flex align-items-center gap-1 p-2">
                                    <CheckCircle2 size={12} /> {struggle.title}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

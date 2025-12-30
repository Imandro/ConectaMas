"use client";

import { useState } from "react";
import LlamiMascot from "@/app/components/LlamiMascot";
import { updateMascotOutfit } from "./actions";
import { Loader2, Lock, CheckCircle, Palette } from "lucide-react";

interface MascotCustomizerProps {
    initialMascot: any;
    userName: string;
}

const OUTFITS = [
    { id: "none", name: "Natural", icon: "✨" },
    { id: "glasses", name: "Intelectual", icon: "👓" },
    { id: "bow", name: "Coquette", icon: "🎀" },
    { id: "cap", name: "Urbano", icon: "🧢" },
    { id: "scarf", name: "Explorador", icon: "🧣" },
    { id: "headphones", name: "Streamer", icon: "🎧" },
];

export default function MascotCustomizer({ initialMascot, userName }: MascotCustomizerProps) {
    const [selectedOutfit, setSelectedOutfit] = useState(initialMascot?.outfit || "none");
    const [isSaving, setIsSaving] = useState(false);

    // Calculate cooldown status
    const lastChange = initialMascot?.lastOutfitChange ? new Date(initialMascot.lastOutfitChange) : new Date(0);
    const unlockDate = new Date(lastChange.getTime() + (14 * 24 * 60 * 60 * 1000));
    const now = new Date();
    const isLocked = now < unlockDate;
    const daysLeft = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const handleSave = async () => {
        if (selectedOutfit === initialMascot?.outfit) return;

        setIsSaving(true);
        try {
            const res = await updateMascotOutfit(selectedOutfit);
            if (res.success) {
                alert("¡Look actualizado! Volveremos a verte en 14 días.");
                window.location.reload(); // Refresh to lock UI and show persistent state
            } else {
                alert(res.error);
            }
        } catch (e) {
            console.error(e);
            alert("Error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '2rem' }}>
            {/* Header / Preview Area */}
            <div className="card-body p-0 text-center bg-gradient-primary-dark position-relative overflow-hidden">
                {/* Conecta+ Gold/Blue Gradient Background */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 30%, #1e3a8a 0%, #0f172a 100%)', zIndex: 0 }}></div>

                <div className="position-relative py-5" style={{ zIndex: 1 }}>
                    <h2 className="text-white fw-bold mb-1 d-flex align-items-center justify-content-center gap-2">
                        <Palette className="text-warning" /> Estilo de Llami
                    </h2>
                    <p className="text-white-50 small mb-4">Personaliza a tu compañera</p>

                    <div className="d-flex justify-content-center py-4 scale-up-center">
                        <LlamiMascot
                            streak={initialMascot?.experience || 10} // Viz purposes
                            name={initialMascot?.name || "Llami"}
                            outfit={selectedOutfit}
                            level={initialMascot?.level || 1}
                        />
                    </div>
                </div>
            </div>

            {/* Controls Area */}
            <div className="card-body p-4 bg-white">
                {isLocked ? (
                    <div className="alert alert-warning border-0 bg-warning bg-opacity-10 d-flex align-items-center gap-3 rounded-4 p-4">
                        <div className="bg-warning bg-opacity-25 p-3 rounded-circle text-warning">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h5 className="fw-bold mb-1 text-dark">Estilo Bloqueado</h5>
                            <p className="mb-0 small text-secondary">
                                Llami está descansando de tanta moda. Podrás cambiarla de nuevo en <strong className="text-dark">{daysLeft} días</strong>.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="fw-bold text-secondary mb-3 small text-uppercase ls-1">Elige un accesorio:</p>
                        <div className="row g-3 row-cols-3 row-cols-md-3 mb-4">
                            {OUTFITS.map((outfit) => (
                                <div key={outfit.id} className="col">
                                    <button
                                        onClick={() => setSelectedOutfit(outfit.id)}
                                        className={`btn w-100 h-100 p-3 rounded-4 border position-relative transition-all hover-scale 
                                            ${selectedOutfit === outfit.id
                                                ? 'bg-primary bg-opacity-10 border-primary text-primary'
                                                : 'bg-light border-light text-secondary'}`}
                                    >
                                        <div className="display-6 mb-2">{outfit.icon}</div>
                                        <div className="small fw-bold">{outfit.name}</div>

                                        {selectedOutfit === outfit.id && (
                                            <div className="position-absolute top-0 end-0 m-2 text-primary">
                                                <CheckCircle size={16} fill="currentColor" className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="d-grid">
                            <button
                                onClick={handleSave}
                                disabled={isSaving || selectedOutfit === initialMascot?.outfit}
                                className="btn btn-primary btn-lg rounded-pill fw-bold py-3 shadow-sm hover-brightness"
                            >
                                {isSaving ? (
                                    <><Loader2 className="animate-spin me-2" /> Guardando...</>
                                ) : (
                                    "Confirmar Nuevo Look (Bloquea por 14 días)"
                                )}
                            </button>
                            <p className="text-center text-muted extra-small mt-3 mb-0">
                                * Para no cargar el servidor, solo puedes cambiar el estilo una vez cada 2 semanas.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

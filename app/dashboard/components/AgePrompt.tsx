"use client";

import { useState } from "react";
import { updateAge } from "@/app/dashboard/actions";
import { toast } from "react-hot-toast";
import { User } from "lucide-react";

export default function AgePrompt({ missingAge }: { missingAge: boolean }) {
    const [isOpen, setIsOpen] = useState(missingAge);
    const [age, setAge] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!age || Number(age) < 10 || Number(age) > 100) return;

        setIsSubmitting(true);
        try {
            await updateAge(Number(age));
            toast.success("Edad guardada");
            setIsOpen(false);
        } catch (error) {
            toast.error("Error al guardar");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
            <div className="card border-0 rounded-4 shadow-lg p-4 animate-fade-in mx-3" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center mb-4">
                    <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex p-3 mb-3">
                        <User size={32} />
                    </div>
                    <h4 className="fw-bold">¡Un detalle más!</h4>
                    <p className="text-muted mb-0">Para personalizar tu experiencia, necesitamos saber tu edad.</p>
                </div>

                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Tu edad (ej. 18)"
                    className="form-control form-control-lg text-center fw-bold mb-4"
                    autoFocus
                />

                <button
                    onClick={handleSubmit}
                    disabled={!age || isSubmitting}
                    className="btn btn-primary w-100 rounded-pill py-3 fw-bold"
                >
                    {isSubmitting ? "Guardando..." : "Guardar y Continuar"}
                </button>
            </div>
        </div>
    );
}

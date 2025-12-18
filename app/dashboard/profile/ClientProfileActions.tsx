"use client";

import { signOut } from "next-auth/react";
import { LogOut, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { resetAccount } from "./actions";

export default function ClientProfileActions() {
    const [isResetting, setIsResetting] = useState(false);

    const handleReset = async () => {
        if (confirm("¿Estás seguro? Esto reiniciará tu progreso de onboarding (pero no borrará tu cuenta).")) {
            setIsResetting(true);
            try {
                await resetAccount();
                // Force logout or redirect
                window.location.href = "/onboarding";
            } catch (error) {
                console.error(error);
                alert("Error al reiniciar.");
            } finally {
                setIsResetting(false);
            }
        }
    };

    return (
        <div className="d-grid gap-3">
            <button
                onClick={handleReset}
                disabled={isResetting}
                className="btn btn-light text-danger fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3"
            >
                <RefreshCcw size={20} />
                <div className="text-start">
                    <span className="d-block">Reiniciar Datos de Onboarding</span>
                    <small className="text-muted fw-normal">Vuelve a empezar el proceso de bienvenida.</small>
                </div>
            </button>

            <button
                onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = "/auth/login";
                }}
                className="btn btn-danger text-white fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3 shadow-sm"
            >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
            </button>
        </div>
    );
}

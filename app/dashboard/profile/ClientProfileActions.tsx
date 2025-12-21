"use client";

import { signOut } from "next-auth/react";
import { LogOut, RefreshCcw, Sun, Moon, Phone, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { resetAccount, updateLeaderPhone } from "./actions";
import { useTheme } from "@/app/components/ThemeProvider";

export default function ClientProfileActions({
    userRole,
    initialLeaderPhone
}: {
    userRole: string,
    initialLeaderPhone?: string | null
}) {
    const [isResetting, setIsResetting] = useState(false);
    const [leaderPhone, setLeaderPhone] = useState(initialLeaderPhone || "");
    const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleUpdatePhone = async () => {
        setIsUpdatingPhone(true);
        try {
            await updateLeaderPhone(leaderPhone);
            alert("Número de líder actualizado.");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar el número.");
        } finally {
            setIsUpdatingPhone(false);
        }
    };

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
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="btn btn-light fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3 border"
            >
                {theme === 'light' ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-warning" />}
                <div className="text-start">
                    <span className="d-block">{theme === 'light' ? 'Activar Modo Noche' : 'Activar Modo Claro'}</span>
                    <small className="text-muted fw-normal">Cambia la apariencia del app.</small>
                </div>
            </button>

            {/* Leader Phone Section */}
            <div className="card shadow-none border rounded-3 p-3 bg-light bg-opacity-50">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <Phone size={20} className="text-secondary" />
                    <div>
                        <span className="d-block fw-bold">Contacto de Liderazgo (SOS)</span>
                        <small className="text-muted fw-normal">Número telefónico para emergencias.</small>
                    </div>
                </div>
                <div className="input-group">
                    <input
                        type="tel"
                        className="form-control"
                        placeholder="+1234567890"
                        value={leaderPhone}
                        onChange={(e) => setLeaderPhone(e.target.value)}
                    />
                    <button
                        className="btn btn-primary fw-bold"
                        type="button"
                        onClick={handleUpdatePhone}
                        disabled={isUpdatingPhone}
                    >
                        {isUpdatingPhone ? '...' : 'Guardar'}
                    </button>
                </div>
            </div>

            {/* Only show reset button for ADMIN users */}
            {userRole === 'ADMIN' && (
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
            )}

            {/* Tutorial Hub Button */}
            <Link
                href="/dashboard/tutorials"
                className="btn btn-light fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3 border"
            >
                <HelpCircle size={20} className="text-primary" />
                <div className="text-start">
                    <span className="d-block">Centro de Aprendizaje</span>
                    <small className="text-muted fw-normal">Tutoriales y guías de uso.</small>
                </div>
            </Link>

            <button
                onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = "/auth/login";
                }}
                className="btn btn-outline-danger fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3"
            >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
            </button>

            <button
                onClick={async () => {
                    if (confirm("¿ESTÁS SEGURO? Esta acción es irreversible y borrará todos tus datos.")) {
                        try {
                            // Dynamic import to avoid earlier compilation issue
                            const { deleteAccount } = await import("./actions");
                            await deleteAccount();
                            await signOut({ redirect: false });
                            window.location.href = "/";
                        } catch (e) {
                            alert("Error al borrar cuenta");
                        }
                    }
                }}
                className="btn btn-danger text-white fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3 shadow-sm"
            >
                <LogOut size={20} />
                <div className="text-start">
                    <span className="d-block">Eliminar Cuenta</span>
                    <small className="fw-normal text-white-50">Acción irreversible</small>
                </div>
            </button>
        </div>
    );
}

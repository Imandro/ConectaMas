"use client";

import { signOut } from "next-auth/react";
import { LogOut, RefreshCcw, Sun, Moon, Phone, HelpCircle, Users, Edit2, User, UserCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { resetAccount, updateLeaderPhone, updateName, updateUsername } from "./actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ClientProfileActions({
    userRole,
    initialLeaderPhone,
    initialName,
    initialUsername
}: {
    userRole: string,
    initialLeaderPhone?: string | null,
    initialName?: string | null,
    initialUsername?: string | null
}) {
    const [isResetting, setIsResetting] = useState(false);
    const [leaderPhone, setLeaderPhone] = useState(initialLeaderPhone || "");
    const [name, setName] = useState(initialName || "");
    const [username, setUsername] = useState(initialUsername || "");
    const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const sessionContext = useSession();
    const update = sessionContext?.update;
    const router = useRouter();

    const handleReset = async () => {
        if (confirm("¿Estás seguro? Esto reiniciará tu progreso de onboarding (pero no borrará tu cuenta).")) {
            setIsResetting(true);
            try {
                await resetAccount();
                window.location.href = "/onboarding";
            } catch (error) {
                console.error(error);
                alert("Error al reiniciar.");
            } finally {
                setIsResetting(false);
            }
        }
    };

    const handleUpdateProfile = async () => {
        setIsUpdatingProfile(true);
        try {
            // Update Name
            if (name !== initialName) {
                const res = await updateName(name);
                if (!res.success) {
                    alert("Error nombre: " + res.error);
                    return;
                }
            }

            // Update Username
            if (username !== initialUsername) {
                const res = await updateUsername(username);
                if (!res.success) {
                    alert("Error usuario: " + res.error);
                    return;
                }
            }

            // Refresh Session
            await update({ name: name }); // Only name updates in session immediately usually
            alert("Perfil actualizado correctamente.");
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("Error al actualizar perfil.");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    return (
        <div className="d-grid gap-3">

            {/* Profile Edit Section */}
            <div className="card shadow-none border rounded-3 p-3 bg-light bg-opacity-50">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <UserCircle size={20} className="text-secondary" />
                    <div>
                        <span className="d-block fw-bold">Datos Personales</span>
                        <small className="text-muted fw-normal">Edita tu nombre y usuario.</small>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label small text-muted">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label small text-muted">Usuario (@)</label>
                    <div className="input-group">
                        <span className="input-group-text bg-white text-muted">@</span>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Solo letras, números y guiones bajos.</small>
                </div>

                <button
                    className="btn btn-primary fw-bold w-100"
                    onClick={handleUpdateProfile}
                    disabled={isUpdatingProfile || (name === initialName && username === initialUsername)}
                >
                    {isUpdatingProfile ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>


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
                        className="btn btn-outline-primary fw-bold"
                        type="button"
                        onClick={async () => {
                            setIsUpdatingPhone(true);
                            try {
                                await updateLeaderPhone(leaderPhone);
                                await update({ leaderPhone }); // Note: this field is removed from session but we keep call for now just in case
                                alert("Número de líder actualizado.");
                            } catch (error) {
                                console.error(error);
                                alert("Error al actualizar el número.");
                            } finally {
                                setIsUpdatingPhone(false);
                            }
                        }}
                        disabled={isUpdatingPhone}
                    >
                        {isUpdatingPhone ? '...' : 'Guardar'}
                    </button>
                </div>
            </div>

            {/* Friends Button */}
            <Link
                href="/dashboard/friends"
                className="btn btn-light fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3 border"
            >
                <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                    <Users size={20} className="text-success" />
                </div>
                <div className="text-start">
                    <span className="d-block">Mis Amigos</span>
                    <small className="text-muted fw-normal">Gestionar conexiones.</small>
                </div>
            </Link>

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

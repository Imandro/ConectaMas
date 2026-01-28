"use client";

import { useState } from "react";
import { X, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface JoinGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function JoinGroupModal({ isOpen, onClose }: JoinGroupModalProps) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const handleJoin = async () => {
        if (code.length < 6) return;
        setLoading(true);
        try {
            // Mock API call for now
            // const res = await joinGroupAction(code);
            await new Promise(r => setTimeout(r, 1000));
            toast.success("¡Te has unido al grupo!");
            onClose();
            router.refresh();
        } catch (e) {
            toast.error("Código inválido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 z-index-modal d-flex align-items-center justify-content-center p-3" style={{ zIndex: 1060 }}>
            <div className="bg-white rounded-4 shadow-lg w-100 p-4 animate-scale-in" style={{ maxWidth: 400 }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold m-0">Unirse a un Grupo</h5>
                    <button onClick={onClose} className="btn btn-close"></button>
                </div>

                <div className="mb-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Código de Acceso</label>
                    <input
                        type="text"
                        className="form-control form-control-lg text-center fs-2 fw-bold letter-spacing-2 text-uppercase"
                        placeholder="ABC-123"
                        maxLength={9}
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                    />
                    <div className="form-text text-center mt-2">Pídele el código a tu líder de grupo.</div>
                </div>

                <button
                    onClick={handleJoin}
                    disabled={code.length < 6 || loading}
                    className="btn btn-primary w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <>Unirme <ArrowRight size={20} /></>}
                </button>
            </div>
        </div>
    );
}

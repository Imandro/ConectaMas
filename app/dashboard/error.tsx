
'use client';

import { useEffect } from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Dashboard Error:', error);
    }, [error]);

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
            <div className="card border-0 shadow-lg p-5 text-center rounded-4" style={{ maxWidth: '500px' }}>
                <div className="bg-danger bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                    <AlertTriangle size={48} className="text-danger" />
                </div>
                <h2 className="fw-bold text-dark mb-2">Algo salió mal</h2>
                <p className="text-muted mb-4">
                    Ocurrió un error inesperado en esta sección. No te preocupes, tus datos están seguros.
                </p>

                {/* Dev hint (hidden in clean prod but useful now) */}
                <div className="alert alert-secondary text-start small mb-4 font-monospace p-3 bg-light border-0">
                    {error.message || "Error desconocido"}
                </div>

                <div className="d-flex gap-3 justify-content-center">
                    <button
                        onClick={
                            // Attempt to recover by trying to re-render the segment
                            () => reset()
                        }
                        className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
                    >
                        <RefreshCcw size={18} className="me-2" />
                        Intentar de nuevo
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold"
                    >
                        Recargar Página
                    </button>
                </div>
            </div>
        </div>
    );
}

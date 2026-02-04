'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="text-center">
                <Loader2 className="animate-spin text-primary mb-3" size={48} />
                <p className="text-muted fw-bold animate-pulse">Cargando tu espacio...</p>
            </div>
        </div>
    );
}

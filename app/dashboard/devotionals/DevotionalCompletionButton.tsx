"use client";

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DevotionalCompletionButton({ devotionalId, initialCompleted }: { devotionalId: string, initialCompleted: boolean }) {
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(initialCompleted);
    const router = useRouter();

    const handleComplete = async () => {
        if (completed || loading) return;
        setLoading(true);

        try {
            const res = await fetch('/api/devotionals/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ devotionalId }),
            });

            if (res.ok) {
                setCompleted(true);
                router.refresh(); // Refresh server components to update UI/DB state everywhere
            }
        } catch (error) {
            console.error('Error completing devotional:', error);
        } finally {
            setLoading(false);
        }
    };

    if (completed) {
        return (
            <div className="card bg-success-subtle border-0 p-4 text-center rounded-4 animate-fade-in">
                <h5 className="fw-bold text-success mb-2">¡Completado!</h5>
                <p className="text-secondary small mb-0">Has dado un paso más en tu crecimiento.</p>
            </div>
        );
    }

    return (
        <div className="card bg-light border-0 p-4 text-center rounded-4">
            <h5 className="fw-bold mb-3">¿Terminaste por hoy?</h5>
            <button
                onClick={handleComplete}
                disabled={loading}
                className="btn btn-primary btn-lg rounded-pill px-5 text-white shadow-sm hover-scale d-inline-flex align-items-center justify-content-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                Mark as Completed
            </button>
        </div>
    );
}

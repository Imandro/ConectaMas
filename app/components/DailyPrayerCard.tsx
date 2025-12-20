"use client";

import { useEffect, useState } from 'react';
import { BookHeart } from 'lucide-react';

interface DailyPrayer {
    id: string;
    dayOfYear: number;
    title: string;
    content: string;
    theme?: string;
}

export default function DailyPrayerCard() {
    const [prayer, setPrayer] = useState<DailyPrayer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/daily-prayer')
            .then(res => res.json())
            .then(data => {
                setPrayer(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching daily prayer:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="card shadow-sm border-0 bg-gradient-primary text-white">
                <div className="card-body p-4">
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!prayer) {
        return null;
    }

    return (
        <div className="card shadow-sm border-0 bg-gradient-primary text-white">
            <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                    <BookHeart size={24} className="text-warning" />
                    <h5 className="card-title mb-0 fw-bold">Oración del Día</h5>
                </div>
                {prayer.theme && (
                    <span className="badge bg-warning text-dark mb-2">{prayer.theme}</span>
                )}
                <p className="card-text lh-base opacity-90">
                    {prayer.content}
                </p>
            </div>
        </div>
    );
}

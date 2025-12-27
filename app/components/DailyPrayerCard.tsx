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
        // Cargar desde caché primero
        const cached = localStorage.getItem('daily_prayer');
        if (cached) {
            setPrayer(JSON.parse(cached));
            setLoading(false);
        }

        fetch('/api/daily-prayer')
            .then(res => res.json())
            .then(data => {
                setPrayer(data);
                localStorage.setItem('daily_prayer', JSON.stringify(data));
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
        <div className="card border-0 shadow-lg rounded-4 p-4 position-relative overflow-hidden mb-4" style={{
            background: 'linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%)',
            border: '1px solid rgba(0, 123, 255, 0.1) !important'
        }}>
            {/* Soft Decorative Elements */}
            <div className="position-absolute top-0 end-0 bg-primary opacity-5 rounded-circle"
                style={{ width: '120px', height: '120px', transform: 'translate(20%, -20%)' }}></div>
            <div className="position-absolute bottom-0 start-0 border border-info opacity-10 rounded-circle"
                style={{ width: '80px', height: '80px', transform: 'translate(-20%, 20%)' }}></div>

            <div className="position-relative z-1 text-center py-2">
                <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                    <BookHeart size={20} className="text-primary opacity-75" />
                    <h6 className="text-primary fw-bold text-uppercase small mb-0 letter-spacing-2">Oración del Día</h6>
                </div>

                <figure className="text-center mb-0">
                    <blockquote className="blockquote mb-3">
                        <p className="fs-5 fst-italic text-secondary mb-0 lh-base fw-medium">
                            "{prayer.content}"
                        </p>
                    </blockquote>
                    {prayer.theme && (
                        <figcaption className="blockquote-footer text-primary opacity-75 fw-bold mt-2 mb-0">
                            Enfoque: {prayer.theme}
                        </figcaption>
                    )}
                </figure>
            </div>
        </div>
    );
}

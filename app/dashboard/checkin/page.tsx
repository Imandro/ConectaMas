"use client";

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Smile, Frown, Meh, Save, X } from 'lucide-react';

interface Checkin {
    id: string;
    mood: string;
    note?: string;
    createdAt: string;
}

// CheckinPage is client side, so it doesn't use 'auth()' but it relies on API calls that might fail if session is invalid.
// However, the error report says "no entra al perfil" (server component) and "no aparece el registro de salud" (checkin page).
// For CheckinPage, let's verify if the API calls are being made correctly.
// There is no useSession here, but let's check if fetchHistory handles 401s properly or if the page crashes.
// The user says "exception", so it might be crashing.
// Wait, client profile actions is used inside Profile page? No, ProfilePage is server component.
// Let's check ProfilePage again.
export default function CheckinPage() {
    const [mood, setMood] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [selectedCheckin, setSelectedCheckin] = useState<Checkin | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/checkin/history');
            if (res.ok) {
                const data = await res.json();
                setCheckins(data.checkins || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        if (!mood) return;
        setIsSaving(true);

        try {
            const res = await fetch('/api/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood, note: note.trim() || undefined })
            });

            if (res.ok) {
                setMood(null);
                setNote('');
                fetchHistory(); // Refresh calendar
                alert('¡Check-in guardado!');
            }
        } catch (e) {
            console.error(e);
            alert('Error al guardar');
        } finally {
            setIsSaving(false);
        }
    };

    // Build calendar for current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();

    if (!mounted) return null;

    const getCheckinForDay = (day: number) => {
        return checkins.find(c => {
            const checkinDate = new Date(c.createdAt);
            return checkinDate.getDate() === day &&
                checkinDate.getMonth() === month &&
                checkinDate.getFullYear() === year;
        });
    };

    const getMoodColor = (mood: string) => {
        if (mood.includes('😔') || mood === 'bad') return 'bg-danger-subtle text-danger';
        if (mood.includes('😐') || mood === 'meh') return 'bg-warning-subtle text-warning';
        if (mood.includes('😄') || mood.includes('🙌') || mood === 'good') return 'bg-success-subtle text-success';
        return 'bg-success-subtle text-success';
    };

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return (
        <div className="animate-fade-in">
            <h2 className="fw-bold text-secondary mb-4">Salud Espiritual</h2>

            {/* Today's Input */}
            <div className="card border-0 shadow-sm bg-white mb-4">
                <div className="card-body p-4 text-center">
                    <h5 className="fw-bold mb-3">¿Cómo te sientes hoy?</h5>
                    <div className="d-flex justify-content-center gap-2 mb-4">
                        {/* Mood Selectors */}
                        <button onClick={() => setMood('😔')} className={`btn ${mood === '😔' ? 'btn-danger text-white' : 'btn-light text-secondary'} rounded-circle p-3 transition-all`}>
                            <Frown size={28} />
                        </button>
                        <button onClick={() => setMood('😐')} className={`btn ${mood === '😐' ? 'btn-warning text-white' : 'btn-light text-secondary'} rounded-circle p-3 transition-all`}>
                            <Meh size={28} />
                        </button>
                        <button onClick={() => setMood('😄')} className={`btn ${mood === '😄' ? 'btn-success text-white' : 'btn-light text-secondary'} rounded-circle p-3 transition-all`}>
                            <Smile size={28} />
                        </button>
                    </div>

                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="form-control bg-light border-0 mb-3"
                        rows={3}
                        placeholder="Escribe una breve nota... (Opcional)"
                        style={{ borderRadius: '12px', resize: 'none' }}
                    ></textarea>

                    <button
                        onClick={handleSave}
                        disabled={!mood || isSaving}
                        className="btn btn-primary w-100 rounded-pill py-2 shadow-sm"
                    >
                        <Save size={18} className="me-2" />
                        {isSaving ? 'Guardando...' : 'Guardar Check-in'}
                    </button>
                </div>
            </div>

            {/* History / Calendar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-secondary m-0">Tu Mes</h5>
                <button className="btn btn-sm btn-light text-muted d-flex align-items-center gap-1">
                    <CalendarIcon size={14} /> {monthNames[month]}
                </button>
            </div>

            <div className="card border-0 shadow-sm bg-white">
                <div className="card-body p-3">
                    {/* Calendar Grid */}
                    <div className="d-flex flex-wrap gap-2 justify-content-between">
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const checkin = getCheckinForDay(day);
                            const isFuture = day > today;
                            const statusClass = checkin
                                ? getMoodColor(checkin.mood)
                                : isFuture
                                    ? 'bg-light text-muted opacity-25'
                                    : 'bg-light text-muted';

                            return (
                                <div
                                    key={i}
                                    onClick={() => checkin && setSelectedCheckin(checkin)}
                                    className={`rounded-circle d-flex align-items-center justify-content-center fw-bold small ${statusClass} ${checkin ? 'cursor-pointer hover-scale' : ''}`}
                                    style={{ width: '32px', height: '32px', fontSize: '10px', cursor: checkin ? 'pointer' : 'default' }}
                                    title={checkin ? 'Click para ver detalles' : ''}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Checkin Detail Modal */}
            {selectedCheckin && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={() => setSelectedCheckin(null)}>
                    <div className="card border-0 shadow-lg p-4 bg-white rounded-4" style={{ maxWidth: '400px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold m-0">
                                {new Date(selectedCheckin.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                            </h5>
                            <button onClick={() => setSelectedCheckin(null)} className="btn btn-sm btn-light rounded-circle p-2">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="mb-3">
                            <span className="text-muted small d-block mb-1">Cómo te sentiste:</span>
                            <span className="fs-2">{selectedCheckin.mood}</span>
                        </div>
                        {selectedCheckin.note && (
                            <div>
                                <span className="text-muted small d-block mb-1">Nota:</span>
                                <p className="text-dark mb-0">{selectedCheckin.note}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

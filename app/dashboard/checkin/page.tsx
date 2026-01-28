"use client";

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Smile, Frown, Meh, Save, X } from 'lucide-react';
import { useLanguage } from "@/app/LanguageContext";

interface Checkin {
    id: string;
    mood: string;
    note?: string;
    createdAt: string;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bitácora de Bienestar | Conecta+',
    description: 'Registra tus emociones diariamente y observa tu progreso emocional y espiritual. Una herramienta para el autoconocimiento y la sanidad.',
};

export default function CheckinPage() {
    const { t, language } = useLanguage();
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
                alert(t.checkin.saved_alert);
            }
        } catch (e) {
            console.error(e);
            alert(t.checkin.error_alert);
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

    const monthNames = t.checkin.months;

    return (
        <div className="animate-fade-in">
            <div className="mb-4">
                <h2 className="fw-bold text-secondary mb-2">{t.checkin.title}</h2>
                <div className="p-3 bg-primary bg-opacity-10 rounded-4 border border-primary border-opacity-20 mb-4">
                    <p className="text-dark small mb-0">
                        <strong>¿Por qué registrar tus emociones?</strong> El autoconocimiento es el primer paso para la sanidad. Al anotar cómo te sientes cada día, podrás identificar patrones, celebrar tus días buenos y llevar tus días difíciles a la presencia de Dios con honestidad.
                    </p>
                </div>
            </div>

            {/* Today's Input */}
            <div className="card border-0 shadow-sm bg-white mb-4">
                <div className="card-body p-4 text-center">
                    <h5 className="fw-bold mb-3">{t.checkin.how_feeling}</h5>
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
                        placeholder={t.checkin.placeholder}
                        style={{ borderRadius: '12px', resize: 'none' }}
                    ></textarea>

                    <button
                        onClick={handleSave}
                        disabled={!mood || isSaving}
                        className="btn btn-primary w-100 rounded-pill py-2 shadow-sm"
                    >
                        <Save size={18} className="me-2" />
                        {isSaving ? t.checkin.saving : t.checkin.save}
                    </button>
                </div>
            </div>

            {/* History / Calendar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-secondary m-0">{t.checkin.month_history}</h5>
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
                                    title={checkin ? t.checkin.click_details : ''}
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
                                {new Date(selectedCheckin.createdAt).toLocaleDateString(language === 'es' ? 'es-ES' : language === 'en' ? 'en-US' : 'pt-BR', { day: 'numeric', month: 'long' })}
                            </h5>
                            <button onClick={() => setSelectedCheckin(null)} className="btn btn-sm btn-light rounded-circle p-2">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="mb-3">
                            <span className="text-muted small d-block mb-1">{t.checkin.mood_label}</span>
                            <span className="fs-2">{selectedCheckin.mood}</span>
                        </div>
                        {selectedCheckin.note && (
                            <div>
                                <span className="text-muted small d-block mb-1">{t.checkin.note_label}</span>
                                <p className="text-dark mb-0">{selectedCheckin.note}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

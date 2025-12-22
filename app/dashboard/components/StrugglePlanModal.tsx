"use client";

import { useState, useEffect } from "react";
import {
    X,
    CheckCircle2,
    BookOpen,
    Lightbulb,
    MessageCircle,
    Calendar,
    ChevronRight,
    ArrowLeft,
    Trophy,
    Flame,
    Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStrugglePlan, advanceStruggleDay, markStruggleAsOvercome } from "../actions";

interface StrugglePlanDay {
    dayNumber: number;
    title: string;
    bibleStudy: string;
    practicalExercise: string;
    youthAdvice: string;
    reflectionQuestions: string;
    scripture: string;
}

interface StrugglePlan {
    id: string;
    title: string;
    description: string;
    days: StrugglePlanDay[];
}

interface StrugglePlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    struggleId: string;
    struggleTitle: string;
    currentDay: number;
    completedDays: string; // "1,2,3"
}

export default function StrugglePlanModal({
    isOpen,
    onClose,
    struggleId,
    struggleTitle,
    currentDay,
    completedDays
}: StrugglePlanModalProps) {
    const [plan, setPlan] = useState<StrugglePlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [completing, setCompleting] = useState(false);
    const [showVictory, setShowVictory] = useState(false);

    const completedDaysArray = completedDays ? completedDays.split(',').map(Number) : [];

    useEffect(() => {
        if (isOpen) {
            fetchPlan();
            setSelectedDay(currentDay);
        }
    }, [isOpen, struggleTitle, currentDay]);

    async function fetchPlan() {
        setLoading(true);
        const data = await getStrugglePlan(struggleTitle);
        if (data) {
            setPlan(data as any);
        }
        setLoading(false);
    }

    async function handleCompleteDay(dayNum: number) {
        setCompleting(true);
        const res = await advanceStruggleDay(struggleId, dayNum);
        if (res.success) {
            if (dayNum === 7) {
                setShowVictory(true);
            } else {
                setSelectedDay(Math.min(dayNum + 1, 7));
            }
        }
        setCompleting(false);
    }

    async function handleMarkAsOvercome() {
        setCompleting(true);
        const res = await markStruggleAsOvercome(struggleId);
        if (res.success) {
            onClose();
        }
        setCompleting(false);
    }

    if (!isOpen) return null;

    const currentPlanDay = plan?.days.find(d => d.dayNumber === selectedDay);
    const isDayCompleted = completedDaysArray.includes(selectedDay);
    const isDayLocked = selectedDay > currentDay;

    return (
        <AnimatePresence>
            <div className="modal-backdrop show" style={{ background: 'rgba(5, 14, 38, 0.9)', backdropFilter: 'blur(8px)', zIndex: 1050 }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="modal-dialog modal-dialog-centered modal-lg"
                    style={{ zIndex: 1060 }}
                >
                    <div className="modal-content border-0 shadow-lg overflow-hidden" style={{ borderRadius: '24px', background: '#0f172a' }}>

                        {/* Header Premium */}
                        <div className="position-relative p-4 text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                            <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 10 }}>
                                <button onClick={onClose} className="btn btn-link text-white-50 p-0 hover-scale">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="bg-primary p-2 rounded-3 shadow-sm">
                                    <Flame size={24} className="text-warning" />
                                </div>
                                <div>
                                    <h4 className="fw-bold m-0 text-white">{struggleTitle}</h4>
                                    <small className="text-white-50">{plan?.description || 'Plan de transformación de 7 días'}</small>
                                </div>
                            </div>

                            {/* Timeline de Días */}
                            <div className="d-flex justify-content-between gap-1 mt-4 px-2">
                                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setSelectedDay(d)}
                                        className={`flex-grow-1 border-0 rounded-pill p-1 transition-all position-relative ${selectedDay === d ? 'active-day-tab' : ''
                                            }`}
                                        style={{
                                            height: '40px',
                                            background: completedDaysArray.includes(d) ? '#d4af37' : (d === currentDay ? '#3b82f6' : '#334155'),
                                            opacity: d > currentDay ? 0.5 : 1
                                        }}
                                    >
                                        <div className="d-flex align-items-center justify-content-center h-100">
                                            {completedDaysArray.includes(d) ? (
                                                <CheckCircle2 size={16} className="text-white" />
                                            ) : (
                                                <span className="fw-bold text-white small">{d}</span>
                                            )}
                                        </div>
                                        {d > currentDay && (
                                            <div className="position-absolute top-50 start-50 translate-middle">
                                                <Lock size={12} className="text-white-50" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contenido del Día */}
                        <div className="modal-body p-4 bg-light" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {loading ? (
                                <div className="py-5 text-center">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <p className="mt-3 text-muted">Cargando tu plan espiritual...</p>
                                </div>
                            ) : showVictory ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-5"
                                >
                                    <div className="bg-warning-subtle text-warning p-4 rounded-circle d-inline-block mb-4 shadow-sm">
                                        <Trophy size={64} />
                                    </div>
                                    <h2 className="fw-extrabold text-dark mb-3">¡VICTORIA TOTAL!</h2>
                                    <p className="text-muted fs-5 mb-4">
                                        Has completado los 7 días de este plan. <br />
                                        Tu persistencia demuestra que Dios está obrando en ti.
                                    </p>
                                    <button
                                        onClick={handleMarkAsOvercome}
                                        disabled={completing}
                                        className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow hover-scale"
                                    >
                                        {completing ? 'Guardando victoria...' : '¡He vencido esta lucha!'}
                                    </button>
                                </motion.div>
                            ) : currentPlanDay ? (
                                <div className="animate-fade-in">
                                    {/* Título del Día */}
                                    <div className="bg-white rounded-4 p-4 mb-4 shadow-sm border-start border-4 border-primary">
                                        <h5 className="fw-extrabold text-dark mb-1">Día {selectedDay}: {currentPlanDay.title}</h5>
                                        <p className="text-primary fw-bold small mb-0 italic">"{currentPlanDay.scripture}"</p>
                                    </div>

                                    {/* Sección de Estudio */}
                                    <div className="mb-4">
                                        <h6 className="d-flex align-items-center gap-2 fw-bold text-secondary mb-3">
                                            <BookOpen size={18} className="text-primary" />
                                            Estudio Táctico
                                        </h6>
                                        <div className="bg-white p-4 rounded-4 shadow-sm text-muted lh-lg">
                                            {currentPlanDay.bibleStudy.split('\n\n').map((p, i) => (
                                                <p key={i} className="mb-3">{p}</p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="row g-4">
                                        {/* Ejercicio Práctico */}
                                        <div className="col-md-6">
                                            <h6 className="d-flex align-items-center gap-2 fw-bold text-secondary mb-3">
                                                <Lightbulb size={18} className="text-warning" />
                                                Misión Práctica
                                            </h6>
                                            <div className="bg-warning-subtle p-4 rounded-4 shadow-sm border-0 h-100">
                                                <p className="text-dark-emphasis mb-0 fw-medium">
                                                    {currentPlanDay.practicalExercise}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Consejo Juvenil */}
                                        <div className="col-md-6">
                                            <h6 className="d-flex align-items-center gap-2 fw-bold text-secondary mb-3">
                                                <MessageCircle size={18} className="text-info" />
                                                Consejo Pro
                                            </h6>
                                            <div className="bg-info-subtle p-4 rounded-4 shadow-sm border-0 h-100">
                                                <p className="text-dark-emphasis mb-0 fw-medium">
                                                    {currentPlanDay.youthAdvice}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preguntas de Reflexión */}
                                    <div className="mt-4">
                                        <h6 className="d-flex align-items-center gap-2 fw-bold text-secondary mb-3">
                                            <Calendar size={18} className="text-success" />
                                            Reflexión Profunda
                                        </h6>
                                        <div className="bg-success-subtle p-4 rounded-4 shadow-sm border-0">
                                            <ul className="mb-0 text-dark-emphasis">
                                                {currentPlanDay.reflectionQuestions.split('?').filter(q => q.trim()).map((q, i) => (
                                                    <li key={i} className="mb-2 fw-medium">{q.trim()}?</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Footer de Acción */}
                                    <div className="mt-5 text-center">
                                        {isDayLocked ? (
                                            <div className="alert alert-secondary rounded-pill border-0 d-inline-flex align-items-center gap-2">
                                                <Lock size={16} /> Este contenido se desbloquea mañana
                                            </div>
                                        ) : isDayCompleted ? (
                                            <div className="text-success fw-bold d-flex align-items-center justify-content-center gap-2 py-3">
                                                <CheckCircle2 size={24} /> ¡Día completado! Sigue brillando.
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleCompleteDay(selectedDay)}
                                                disabled={completing}
                                                className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow hover-scale d-flex align-items-center gap-2 mx-auto"
                                            >
                                                {completing ? 'Guardando...' : (
                                                    <>Marcar Día {selectedDay} como Completado <ChevronRight size={20} /></>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <p className="text-muted">No pudimos encontrar el contenido para este plan. Intenta de nuevo más tarde.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <style jsx>{`
                    .active-day-tab::after {
                        content: '';
                        position: absolute;
                        bottom: -8px;
                        left: 50%;
                        transform: translateX(-50%);
                        border-left: 8px solid transparent;
                        border-right: 8px solid transparent;
                        border-bottom: 8px solid #f8f9fa;
                    }
                    .active-day-tab {
                        transform: translateY(-4px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                        border: 2px solid white !important;
                    }
                    .hover-scale:hover {
                        transform: scale(1.05);
                        opacity: 0.9;
                    }
                    .modal-backdrop {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                    }
                `}</style>
            </div>
        </AnimatePresence>
    );
}

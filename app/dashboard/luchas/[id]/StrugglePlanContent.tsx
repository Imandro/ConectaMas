"use client";

import { useState } from "react";
import {
    X,
    CheckCircle2,
    BookOpen,
    Lightbulb,
    MessageCircle,
    Calendar,
    ChevronRight,
    Trophy,
    Flame,
    Lock,
    ShieldAlert,
    ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { advanceStruggleDay, markStruggleAsOvercome, startStrugglePlan } from "../../actions";

interface StrugglePlanDay {
    dayNumber: number;
    title: string;
    description: string;
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

interface UserStruggle {
    id: string;
    title: string;
    currentDay: number;
    completedDays: string;
    isStarted: boolean;
    status: string;
}

export default function StrugglePlanContent({
    userStruggle,
    plan
}: {
    userStruggle: UserStruggle;
    plan: StrugglePlan | null;
}) {
    const [selectedDay, setSelectedDay] = useState(userStruggle.currentDay);
    const [completing, setCompleting] = useState(false);
    const [showVictory, setShowVictory] = useState(userStruggle.status === "vencido");
    const [isStarted, setIsStarted] = useState(userStruggle.isStarted);

    const totalDays = plan?.days.length || 7;
    const completedDaysArray = userStruggle.completedDays ? userStruggle.completedDays.split(',').map(Number) : [];

    async function handleStartPlan() {
        setCompleting(true);
        const res = await startStrugglePlan(userStruggle.id);
        if (res.success) {
            setIsStarted(true);
        }
        setCompleting(false);
    }

    async function handleCompleteDay(dayNum: number) {
        setCompleting(true);
        const res = await advanceStruggleDay(userStruggle.id, dayNum, totalDays);
        if (res.success) {
            if (dayNum === totalDays) {
                setShowVictory(true);
            } else {
                setSelectedDay(Math.min(dayNum + 1, totalDays));
            }
        }
        setCompleting(false);
    }

    async function handleMarkAsOvercome() {
        setCompleting(true);
        const res = await markStruggleAsOvercome(userStruggle.id, totalDays);
        if (res.success) {
            setShowVictory(true);
        }
        setCompleting(false);
    }

    const currentPlanDay = plan?.days.find(d => d.dayNumber === selectedDay);
    const isDayCompleted = completedDaysArray.includes(selectedDay);
    const isDayLocked = selectedDay > userStruggle.currentDay || !isStarted;

    return (
        <div className="max-w-4xl mx-auto pb-5">
            {/* Nav Back */}
            <nav className="d-flex align-items-center justify-content-between mb-4 px-3 px-md-0 pt-3">
                <Link href="/dashboard/luchas" className="btn btn-light rounded-circle p-2 shadow-sm hover-scale transition-all">
                    <ArrowLeft size={24} className="text-secondary" />
                </Link>
                <div className="bg-primary-subtle text-primary px-3 py-1 rounded-pill small fw-bold">
                    {isStarted ? `Día ${userStruggle.currentDay} en curso` : 'Sin iniciar'}
                </div>
            </nav>

            <div className="bg-white shadow-xl overflow-hidden border-0" style={{ borderRadius: '32px' }}>
                {/* Header Premium */}
                <div className="p-4 p-md-5 text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="d-flex align-items-center gap-4 mb-4">
                        <div className="bg-primary p-3 rounded-4 shadow-lg pulse-animation">
                            <Flame size={32} className="text-warning" />
                        </div>
                        <div>
                            <h1 className="fw-bold m-0 text-white display-6">{userStruggle.title}</h1>
                            <p className="text-white-50 m-0 lead">{plan?.description || `Plan de transformación de ${totalDays} días`}</p>
                        </div>
                    </div>

                    {/* Timeline de Días - Ahora scrollable si hay muchos días */}
                    <div className="d-flex gap-2 mt-5 overflow-x-auto pb-3 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
                        {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                            <button
                                key={d}
                                onClick={() => setSelectedDay(d)}
                                className={`flex-shrink-0 border-0 rounded-4 p-2 p-md-3 transition-all position-relative`}
                                style={{
                                    width: totalDays > 7 ? '60px' : 'calc(100% / 7)',
                                    minWidth: '60px',
                                    background: completedDaysArray.includes(d) ? '#d4af37' : (selectedDay === d ? '#3b82f6' : '#334155'),
                                    boxShadow: selectedDay === d ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
                                    opacity: (d > userStruggle.currentDay || !isStarted) && d !== selectedDay ? 0.4 : 1,
                                    transform: selectedDay === d ? 'translateY(-5px)' : 'none',
                                    scrollSnapAlign: 'start'
                                }}
                            >
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 gap-1">
                                    {completedDaysArray.includes(d) ? (
                                        <CheckCircle2 size={24} className="text-white" />
                                    ) : (
                                        <span className="fw-extrabold text-white fs-4">{d}</span>
                                    )}
                                    <span className="text-white-50 d-none d-md-block" style={{ fontSize: '0.7rem' }}>DÍA</span>
                                </div>
                                {(d > userStruggle.currentDay || !isStarted) && (
                                    <div className="position-absolute bottom-0 end-0 p-1">
                                        <Lock size={12} className="text-white-25" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenido Dinámico */}
                <div className="p-4 p-md-5" style={{ background: '#f8fafc', minHeight: '400px' }}>
                    <AnimatePresence mode="wait">
                        {showVictory ? (
                            <motion.div
                                key="victory"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-5"
                            >
                                <div className="bg-warning-subtle text-warning p-5 rounded-circle d-inline-block mb-4 shadow-xl border border-warning border-opacity-25">
                                    <Trophy size={100} />
                                </div>
                                <h1 className="fw-extrabold text-dark mb-3 display-4">¡LO HAS LOGRADO!</h1>
                                <p className="text-muted fs-4 mb-4">
                                    Has completado los {totalDays} días de este plan. <br />
                                    Tu victoria es testimonio de la gracia de Dios.
                                </p>
                                <Link href="/dashboard/luchas" className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg hover-scale">
                                    Volver a mis desafíos
                                </Link>
                            </motion.div>
                        ) : !isStarted ? (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-5 px-3"
                            >
                                <div className="bg-primary-subtle text-primary p-5 rounded-circle d-inline-block mb-4 shadow-lg border border-primary border-opacity-10">
                                    <ShieldAlert size={100} />
                                </div>
                                <h1 className="fw-bold text-dark mb-3 display-5">¿Listo para brillar?</h1>
                                <p className="text-muted mb-5 lead max-w-lg mx-auto">
                                    Este es un compromiso de {totalDays} días diseñado para fortalecer tu espíritu y darte herramientas prácticas para vencer.
                                </p>
                                <button
                                    onClick={handleStartPlan}
                                    disabled={completing}
                                    className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-extrabold shadow-2xl hover-scale pulse-animation"
                                    style={{ fontSize: '1.2rem' }}
                                >
                                    {completing ? 'Preparando camino...' : '¡INICIAR PLAN AHORA! 🚀'}
                                </button>
                            </motion.div>
                        ) : currentPlanDay ? (
                            <motion.div
                                key={`day-${selectedDay}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="animate-fade-in"
                            >
                                {/* Banner de Versículo */}
                                <div className="bg-white rounded-4 p-4 p-md-5 mb-5 shadow-sm border-start border-8 border-primary position-relative overflow-hidden">
                                    <div className="position-absolute top-0 end-0 p-4 text-primary opacity-05">
                                        <BookOpen size={120} />
                                    </div>
                                    <h2 className="fw-extrabold text-dark mb-3">Día {selectedDay}: {currentPlanDay.title}</h2>
                                    <p className="text-primary fw-bold fs-4 m-0 fst-italic">&quot;{currentPlanDay.scripture}&quot;</p>
                                </div>

                                <div className="row g-4 mb-5">
                                    {/* Estudio */}
                                    <div className="col-12">
                                        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light h-100">
                                            <h4 className="d-flex align-items-center gap-2 fw-bold text-secondary mb-4">
                                                <BookOpen size={28} className="text-primary" />
                                                Estudio Táctico
                                            </h4>
                                            <div className="text-muted lh-extra fs-5">
                                                {currentPlanDay.bibleStudy.split('\n\n').map((p, i) => (
                                                    <p key={i} className="mb-4">{p}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Misión */}
                                    <div className="col-md-6">
                                        <div className="bg-warning-subtle p-4 p-md-5 rounded-4 shadow-md border-0 h-100">
                                            <h4 className="d-flex align-items-center gap-3 fw-extrabold mb-4" style={{ color: '#856404' }}>
                                                <Lightbulb size={32} />
                                                TU MISIÓN
                                            </h4>
                                            <p className="mb-0 fw-semibold fs-5 lh-lg" style={{ color: '#856404', opacity: 0.9 }}>
                                                {currentPlanDay.practicalExercise}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Consejo */}
                                    <div className="col-md-6">
                                        <div className="bg-info-subtle p-4 p-md-5 rounded-4 shadow-md border-0 h-100 text-info-emphasis">
                                            <h4 className="d-flex align-items-center gap-3 fw-extrabold mb-4">
                                                <MessageCircle size={32} />
                                                CONSEJO PRO
                                            </h4>
                                            <p className="mb-0 fw-semibold fs-5 lh-lg">
                                                {currentPlanDay.youthAdvice}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Reflexión */}
                                <div className="bg-success-subtle p-4 p-md-5 rounded-4 shadow-md border-0 mb-5 text-success-emphasis">
                                    <h4 className="d-flex align-items-center gap-3 fw-extrabold mb-4">
                                        <Calendar size={32} />
                                        MOMENTO DE REFLEXIÓN
                                    </h4>
                                    <ul className="mb-0 fs-5 ps-3 lh-extra">
                                        {currentPlanDay.reflectionQuestions.split('?').filter(q => q.trim()).map((q, i) => (
                                            <li key={i} className="mb-3 fw-medium">{q.trim()}?</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Acción */}
                                <div className="mt-5 text-center border-top pt-5">
                                    {isDayLocked ? (
                                        <div className="alert alert-secondary rounded-pill border-0 d-inline-flex align-items-center gap-3 px-5 py-3 shadow-sm">
                                            <Lock size={24} /> <span className="fw-bold fs-5">ESTE DÍA SE DESBLOQUEARÁ MAÑANA</span>
                                        </div>
                                    ) : isDayCompleted ? (
                                        <div className="text-success fw-extrabold d-flex flex-column align-items-center gap-2 py-4">
                                            <div className="bg-success text-white p-3 rounded-circle shadow-lg mb-2">
                                                <CheckCircle2 size={40} />
                                            </div>
                                            <span className="fs-3">¡DÍA COMPLETADO!</span>
                                            <p className="text-muted fw-normal">Has avanzado con éxito. Prepárate para el siguiente reto.</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleCompleteDay(selectedDay)}
                                            disabled={completing}
                                            className="btn btn-primary btn-lg rounded-pill px-5 py-4 fw-extrabold shadow-2xl hover-scale d-flex align-items-center gap-3 mx-auto"
                                            style={{ fontSize: '1.2rem' }}
                                        >
                                            {completing ? 'Guardando progreso...' : (
                                                <>COMPLETAR DÍA {selectedDay} <ChevronRight size={28} /></>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-5">
                                <p className="text-muted fs-4">No se pudo cargar el contenido. Por favor reintenta.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
                .lh-extra {
                    line-height: 1.8;
                }
                .opacity-05 {
                    opacity: 0.05;
                }
            `}</style>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
    ChevronRight,
    X,
    Download,
    Flame,
    Book,
    AlertTriangle,
    Heart,
    Sparkles
} from 'lucide-react';
import { completeTutorialTour } from '../profile/actions';
import Link from 'next/link';

interface TourStep {
    targetId: string;
    title: string;
    content: string;
    icon: React.ReactNode;
}

const tourSteps: TourStep[] = [
    {
        targetId: 'install-step', // Virtual ID for installation
        title: 'Instala Conecta+',
        content: 'Usa Conecta+ como una App real en tu teléfono. Tendrás acceso más rápido y una mejor experiencia.',
        icon: <Download className="text-primary" size={24} />
    },
    {
        targetId: 'tour-verse',
        title: 'Tu Versículo Diario',
        content: 'Cada día Dios tiene una promesa nueva para ti. Aquí encontrarás una palabra fresca para empezar tu jornada.',
        icon: <Book className="text-primary" size={24} />
    },
    {
        targetId: 'tour-streak',
        title: 'Tu Constancia',
        content: 'Aquí verás cuántos días consecutivos has estado firme en tu propósito espiritual.',
        icon: <Sparkles className="text-success" size={24} />
    },
    {
        targetId: 'tour-llami',
        title: 'Llami: Espíritu de Fuego',
        content: 'Tu vida espiritual se refleja aquí. ¡Haz clic en Llami para ver cómo crece su llama interior!',
        icon: <Flame className="text-warning" size={24} />
    },
    {
        targetId: 'tour-sos',
        title: 'Botón de Auxilio',
        content: '¿Te sientes abrumado o tentado? Presiona este botón para encontrar paz inmediata y contactar a tu líder.',
        icon: <AlertTriangle className="text-danger" size={24} />
    },
    {
        targetId: 'tour-struggles',
        title: 'Tus Victorias',
        content: 'Registra tus desafíos diarios y mira cómo Dios te ayuda a superarlos paso a paso.',
        icon: <Heart className="text-primary" size={24} />
    },
    {
        targetId: 'tour-checkin',
        title: 'Tu Corazón Hoy',
        content: 'Comparte cómo te sientes. El app ajustará los devocionales para recomendarte lo que más necesitas.',
        icon: <Sparkles className="text-info" size={24} />
    }
];

export default function FeatureTour({ onComplete }: { onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const [isStandalone, setIsStandalone] = useState(true);

    useEffect(() => {
        setMounted(true);
        const standalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(standalone);

        // Autoforward if first step is install and we are already installed
        if (currentStep === 0 && tourSteps[0].targetId === 'install-step' && standalone) {
            setCurrentStep(1);
        }

        updateCoords();
        window.addEventListener('resize', updateCoords);
        return () => window.removeEventListener('resize', updateCoords);
    }, [currentStep]);

    const updateCoords = () => {
        const step = tourSteps[currentStep];
        if (step.targetId === 'install-step') {
            setCoords({ top: -100, left: -100, width: 0, height: 0 }); // Hide spotlight
            return;
        }
        const el = document.getElementById(step.targetId);
        if (el) {
            const rect = el.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            });
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleNext = async () => {
        let next = currentStep + 1;
        // Skip installation if already standalone
        if (next < tourSteps.length && tourSteps[next].targetId === 'install-step' && isStandalone) {
            next++;
        }

        if (next < tourSteps.length) {
            setCurrentStep(next);
        } else {
            await completeTutorialTour();
            onComplete();
        }
    };

    const handleSkip = async () => {
        await completeTutorialTour();
        onComplete();
    };

    if (!mounted) return null;

    const currentTourStep = tourSteps[currentStep];

    return createPortal(
        <div className="tour-overlay position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 10000, pointerEvents: 'none' }}>
            {/* Dark Mask */}
            <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75" style={{ pointerEvents: 'auto' }} />

            {/* Spotlight Hole */}
            {currentTourStep.targetId !== 'install-step' && (
                <motion.div
                    animate={{
                        top: coords.top - 10,
                        left: coords.left - 10,
                        width: coords.width + 20,
                        height: coords.height + 20
                    }}
                    className="position-absolute bg-transparent shadow-lg rounded-4"
                    style={{
                        zIndex: 10001,
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.75)',
                        border: '3px solid #ffcc00'
                    }}
                />
            )}

            {/* Tooltip or Centered Card */}
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    top: currentTourStep.targetId === 'install-step'
                        ? (typeof window !== 'undefined' ? window.innerHeight / 2 - 150 : '30%')
                        : (coords.top + coords.height + 25 > (typeof window !== 'undefined' ? window.innerHeight + window.scrollY - 200 : 1000)
                            ? coords.top - 200
                            : coords.top + coords.height + 25),
                    left: currentTourStep.targetId === 'install-step'
                        ? '50%'
                        : Math.min(Math.max(20, coords.left), (typeof window !== 'undefined' ? window.innerWidth - 300 : 1000)),
                    x: currentTourStep.targetId === 'install-step' ? '-50%' : 0
                }}
                className="position-absolute bg-white rounded-5 p-4 shadow-2xl"
                style={{
                    width: '320px',
                    zIndex: 10002,
                    pointerEvents: 'auto'
                }}
            >
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-light p-2 rounded-4">
                        {currentTourStep.icon}
                    </div>
                    <h5 className="fw-bold mb-0 text-dark">{currentTourStep.title}</h5>
                </div>

                <p className="small text-muted mb-4">{currentTourStep.content}</p>

                {currentTourStep.targetId === 'install-step' && (
                    <div className="alert bg-primary bg-opacity-10 border-0 rounded-4 p-3 mb-4">
                        <Link href="/dashboard/tutorials/install" className="text-decoration-none d-flex align-items-center justify-content-between">
                            <span className="small fw-bold text-primary">Ver guía paso a paso</span>
                            <ChevronRight size={16} className="text-primary" />
                        </Link>
                    </div>
                )}

                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-1">
                        {tourSteps.map((_, i) => (
                            <div key={i} className={`rounded-circle ${i === currentStep ? 'bg-primary' : 'bg-light'}`} style={{ width: '6px', height: '6px' }} />
                        ))}
                    </div>
                    <div className="d-flex gap-2">
                        <button onClick={handleSkip} className="btn btn-link btn-sm text-decoration-none text-muted fw-bold">Saltar</button>
                        <button onClick={handleNext} className="btn btn-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1">
                            {currentStep === tourSteps.length - 1 ? 'Terminar' : 'Siguiente'}
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </motion.div>

            <style jsx>{`
                .shadow-2xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
            `}</style>
        </div>,
        document.body
    );
}

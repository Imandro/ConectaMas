"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Zap } from "lucide-react";
import TriviaGame from "@/app/components/TriviaGame";
import { motion } from "framer-motion";

export default function DedicatedTriviaPage() {
    const [isComplete, setIsComplete] = useState(false);

    return (
        <div className="container-fluid py-4 min-vh-100 bg-light">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex align-items-center gap-3">
                        <Link href="/dashboard" className="btn btn-white bg-white text-primary rounded-circle p-2 shadow-sm border-0 transition-all hover-scale">
                            <ChevronLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="h2 mb-0 fw-bold text-primary">Trivia Bíblica</h1>
                            <p className="text-muted small mb-0">Desafía tu conocimiento y gana puntos para Llami</p>
                        </div>
                    </div>
                </div>

                {!isComplete ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-5 shadow-sm p-2"
                    >
                        <TriviaGame onComplete={() => setIsComplete(true)} />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-5 bg-white rounded-5 shadow-sm animate-fade-in"
                    >
                        <div className="mb-4">
                            <div className="bg-warning-subtle d-inline-flex p-4 rounded-circle mb-3">
                                <Zap size={64} className="text-warning" />
                            </div>
                            <h2 className="fw-bold text-primary">¡Trivia Completada!</h2>
                            <p className="text-muted">Has terminado tu racha diaria. ¡Vuelve mañana para más!</p>
                        </div>

                        <div className="d-flex justify-content-center gap-3">
                            <Link href="/dashboard" className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm">
                                Volver al Inicio
                            </Link>
                            <Link href="/dashboard/llami" className="btn btn-outline-warning rounded-pill px-5 py-2 fw-bold">
                                Ver a Llami
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>

            <style jsx>{`
                .max-w-4xl {
                    max-width: 900px;
                }
                .bg-warning-subtle {
                    background-color: rgba(251, 191, 36, 0.1);
                }
            `}</style>
        </div>
    );
}

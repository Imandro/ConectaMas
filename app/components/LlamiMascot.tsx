"use client";

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { getLlamiMessage } from '@/app/lib/mascot-messages';

interface LlamiMascotProps {
    streak: number;
    lastMood?: string;
}

export default function LlamiMascot({ streak, lastMood }: LlamiMascotProps) {
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    // Determinar etapa de evolución
    const getStage = () => {
        if (streak <= 7) return 'spark';
        if (streak <= 30) return 'flame';
        if (streak <= 90) return 'torch';
        if (streak <= 365) return 'sun';
        return 'star';
    };

    const stage = getStage();

    // Mensaje de bienvenida al cargar
    useEffect(() => {
        const welcomeMsg = getLlamiMessage(streak, lastMood, false);
        setMessage(welcomeMsg);
        setShowMessage(true);

        const timer = setTimeout(() => setShowMessage(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    const handleClick = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setClickCount(prev => prev + 1);

        const clickMsg = getLlamiMessage(streak, lastMood, true);
        setMessage(clickMsg);
        setShowMessage(true);

        setTimeout(() => setIsAnimating(false), 600);
        setTimeout(() => setShowMessage(false), 3000);
    };

    // Colores según etapa
    const getColors = () => {
        switch (stage) {
            case 'spark': return { primary: '#FFA500', secondary: '#FFD700' }; // Orange
            case 'flame': return { primary: '#FF6B35', secondary: '#FFB627' }; // Red-Orange
            case 'torch': return { primary: '#FF4500', secondary: '#FFD700' }; // Bright Orange
            case 'sun': return { primary: '#FFD700', secondary: '#FFA500' }; // Gold
            case 'star': return { primary: '#4169E1', secondary: '#87CEEB' }; // Blue
            default: return { primary: '#FFA500', secondary: '#FFD700' };
        }
    };

    const colors = getColors();

    // Tamaño según etapa
    const getSize = () => {
        switch (stage) {
            case 'spark': return 60;
            case 'flame': return 75;
            case 'torch': return 90;
            case 'sun': return 105;
            case 'star': return 120;
            default: return 60;
        }
    };

    const size = getSize();

    return (
        <div className="position-relative d-inline-block">
            {/* Mensaje en burbuja */}
            {showMessage && (
                <div
                    className="position-absolute bottom-100 start-50 translate-middle-x mb-2 animate-fade-in"
                    style={{ width: '200px', zIndex: 10 }}
                >
                    <div className="bg-white rounded-3 shadow-lg p-3 position-relative">
                        <p className="text-dark small mb-0 text-center fw-medium">{message}</p>
                        {/* Flecha de la burbuja */}
                        <div
                            className="position-absolute top-100 start-50 translate-middle-x"
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: '8px solid transparent',
                                borderRight: '8px solid transparent',
                                borderTop: '8px solid white',
                                marginTop: '-1px'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Mascota Llami */}
            <div
                onClick={handleClick}
                className={`position-relative cursor-pointer ${isAnimating ? 'animate-bounce' : 'animate-pulse-slow'}`}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                }}
            >
                {/* SVG de Llami */}
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 100 100"
                    className="drop-shadow-lg"
                >
                    {/* Glow effect */}
                    <defs>
                        <radialGradient id={`glow-${stage}`} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={colors.secondary} stopOpacity="0.8" />
                            <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
                        </radialGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Glow circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill={`url(#glow-${stage})`}
                        className="animate-pulse-slow"
                    />

                    {/* Cuerpo principal (forma de llama) */}
                    <path
                        d="M 50 20 Q 65 35, 60 55 Q 55 70, 50 75 Q 45 70, 40 55 Q 35 35, 50 20 Z"
                        fill={colors.primary}
                        filter="url(#glow)"
                    />

                    {/* Llama interna */}
                    <path
                        d="M 50 30 Q 58 40, 55 55 Q 52 65, 50 68 Q 48 65, 45 55 Q 42 40, 50 30 Z"
                        fill={colors.secondary}
                        opacity="0.9"
                    />

                    {/* Ojos */}
                    <circle cx="43" cy="45" r="3" fill="#2C3E50" />
                    <circle cx="57" cy="45" r="3" fill="#2C3E50" />

                    {/* Brillo en los ojos */}
                    <circle cx="44" cy="44" r="1" fill="white" />
                    <circle cx="58" cy="44" r="1" fill="white" />

                    {/* Sonrisa */}
                    <path
                        d="M 42 52 Q 50 58, 58 52"
                        stroke="#2C3E50"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Chispas decorativas (más para etapas avanzadas) */}
                    {stage !== 'spark' && (
                        <>
                            <circle cx="30" cy="30" r="2" fill={colors.secondary} opacity="0.7">
                                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="70" cy="35" r="2" fill={colors.secondary} opacity="0.7">
                                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
                            </circle>
                        </>
                    )}

                    {/* Estrella para etapa máxima */}
                    {stage === 'star' && (
                        <path
                            d="M 50 10 L 52 18 L 60 18 L 54 23 L 56 31 L 50 26 L 44 31 L 46 23 L 40 18 L 48 18 Z"
                            fill="#FFD700"
                            opacity="0.8"
                        >
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 50 50"
                                to="360 50 50"
                                dur="10s"
                                repeatCount="indefinite"
                            />
                        </path>
                    )}
                </svg>

                {/* Badge de racha */}
                <div
                    className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow"
                    style={{ width: '28px', height: '28px', fontSize: '11px' }}
                >
                    {streak}
                </div>
            </div>

            {/* Nombre */}
            <div className="text-center mt-2">
                <small className="fw-bold text-primary d-flex align-items-center justify-content-center gap-1">
                    <Sparkles size={12} />
                    Llami
                </small>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 0.6s ease-in-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .drop-shadow-lg {
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
        }
      `}</style>
        </div>
    );
}

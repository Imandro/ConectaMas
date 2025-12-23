"use client";

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { X, Phone, BookHeart, Music, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { seedSongsAction } from './seed-action';
import EnhancedMusicPlayer from '@/app/components/EnhancedMusicPlayer';
import MusicUploadModal from '@/app/components/MusicUploadModal';

export default function EmergencyPage() {
    const { data: session } = useSession();
    const [showContent, setShowContent] = useState(false);
    const [showTruths, setShowTruths] = useState(false);
    const [showMusic, setShowMusic] = useState(false); // Music player state
    const [songs, setSongs] = useState<any[]>([]);
    const [randomTruths, setRandomTruths] = useState<string[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const TRUTHS = [
        "Dios no está enojado contigo, Él está peliando por ti.",
        "Tu identidad no está en tus errores, sino en Cristo.",
        "Ninguna condenación hay para los que están en Cristo Jesús.",
        "El amor de Dios es más grande que cualquier pecado.",
        "Tus sentimientos son reales, pero no siempre son la verdad.",
        "Eres escogido, perdonado y amado eternamente.",
        "Esta prueba es temporal, pero Su gracia es eterna.",
        "Dios perfecciona su poder en tu debilidad.",
        "No estás solo; el Espíritu Santo te consuela ahora mismo.",
        "Levántate, resplandece, porque ha venido tu luz.",
    ];

    const handleShowTruths = () => {
        // Pick 5 random unique truths
        const shuffled = TRUTHS.sort(() => 0.5 - Math.random());
        setRandomTruths(shuffled.slice(0, 5));
        setShowTruths(true);
    };

    const fetchSongs = () => {
        fetch('/api/songs')
            .then(res => res.json())
            .then(data => setSongs(data))
            .catch(err => console.error("Error fetching songs:", err));
    };

    useEffect(() => {
        // Simular efecto de respiración / calma al entrar
        const timer = setTimeout(() => setShowContent(true), 500);

        // Seed songs and fetch
        seedSongsAction().then(res => {
            fetchSongs();
        });

        return () => clearTimeout(timer);
    }, []);

    const stopMusic = () => {
        setShowMusic(false);
    };

    return (
        <div className="min-vh-100 bg-primary text-white d-flex flex-column p-4 position-relative overflow-hidden">
            {/* Background decorative pulsing */}
            {/* Background decorative pulsing */}
            {/* Sphere removed as requested */}

            <div className="d-flex justify-content-end mb-4 position-relative z-1">
                <Link href="/dashboard" className="btn btn-outline-light rounded-circle p-2 border-0">
                    <X size={32} />
                </Link>
            </div>

            <div className={`flex-grow-1 d-flex flex-column justify-content-start pt-5 position-relative z-1`}>

                <h1 className="display-4 fw-bold mb-4 text-white">Respira.</h1>
                <p className="lead mb-5 opacity-75 animate-fade-in-up delay-100">
                    No has fallado todavía. Y aunque lo hicieras, Él te sigue amando. Pero hagamos una pausa de 1 minuto juntos.
                </p>

                {!showTruths ? (
                    <div className="d-grid gap-3 animate-fade-in-up delay-200">
                        <button
                            onClick={handleShowTruths}
                            className="btn bg-white btn-lg shadow-sm text-primary d-flex align-items-center justify-content-start gap-3 p-3 hover-scale transition-all"
                        >
                            <BookHeart size={24} className="text-secondary" />
                            <div className="text-start">
                                <span className="d-block fw-bold">Leer una promesa</span>
                                <small className="opacity-75">Rompe la mentira con verdad</small>
                            </div>
                        </button>

                        <button
                            onClick={() => setShowMusic(!showMusic)}
                            className="btn bg-white btn-lg shadow-sm text-primary d-flex align-items-center justify-content-start gap-3 p-3 hover-scale transition-all"
                        >
                            <Music size={24} className="text-secondary" />
                            <div className="text-start">
                                <span className="d-block fw-bold">Escuchar música</span>
                                <small className="opacity-75">Cambia la atmósfera</small>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                const phone = (session?.user as any)?.leaderPhone;
                                if (phone) {
                                    window.location.href = `tel:${phone}`;
                                } else {
                                    alert("No has configurado el número de tu líder en tu perfil.");
                                }
                            }}
                            className="btn btn-outline-light btn-lg border-2 d-flex align-items-center justify-content-start gap-3 p-3 w-100 hover-scale transition-all"
                        >
                            <Phone size={24} />
                            <div className="text-start">
                                <span className="d-block fw-bold">Llamar a un líder</span>
                                <small>No pelees solo</small>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-5 p-4 border border-white-50">
                            <h3 className="fw-bold mb-4 d-flex align-items-center gap-2 text-white"><BookHeart size={28} /> 5 Verdades para ti hoy:</h3>
                            <ul className="list-unstyled p-0 m-0 d-flex flex-column gap-3">
                                {randomTruths.map((truth, idx) => (
                                    <li key={idx} className="d-flex gap-3 align-items-start bg-white bg-opacity-10 p-3 rounded-4 border border-white-25">
                                        <span className="fw-bold text-warning user-select-none fs-5">{idx + 1}.</span>
                                        <span className="lh-base fw-medium fs-5 text-white">{truth}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setShowTruths(false)}
                                className="btn btn-light w-100 fw-bold py-3 mt-4 rounded-pill text-primary hover-scale shadow-sm"
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                )}

                {/* Music Player Overlay or Section */}
                {showMusic && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 mt-3">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-4 p-4 border border-white-50">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold m-0 d-flex align-items-center gap-2"><Music size={28} /> Música para el alma</h3>
                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="btn btn-sm btn-warning rounded-pill px-3 fw-bold d-flex align-items-center gap-1 shadow-sm"
                                        style={{ backgroundColor: '#f3b33e', color: '#0B1B32', border: 'none' }}
                                    >
                                        <Plus size={18} /> Subir
                                    </button>
                                    <button onClick={() => setShowMusic(false)} className="btn btn-sm btn-outline-light rounded-circle"><X size={20} /></button>
                                </div>
                            </div>

                            {songs.length === 0 ? (
                                <div className="text-center py-5">
                                    <Loader2 className="animate-spin mb-3 mx-auto" size={40} />
                                    <p className="opacity-75">Cargando música...</p>
                                </div>
                            ) : (
                                <EnhancedMusicPlayer songs={songs} />
                            )}
                        </div>
                    </div>
                )}

                <MusicUploadModal
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    onSuccess={fetchSongs}
                />

            </div>

            <div className="mt-auto text-center opacity-50 pb-4">
                <small>"Fiel es Dios, que no os dejará ser tentados más de lo que podéis resistir..." - 1 Cor 10:13</small>
            </div>
        </div>
    );
}

"use client";

import Link from 'next/link';
import { X, Phone, BookHeart, Music } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EmergencyPage() {
    const [showContent, setShowContent] = useState(false);
    const [showTruths, setShowTruths] = useState(false);
    const [showMusic, setShowMusic] = useState(false); // Music player state
    const [songs, setSongs] = useState<any[]>([]);
    const [currentSong, setCurrentSong] = useState<any>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [randomTruths, setRandomTruths] = useState<string[]>([]);

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

    useEffect(() => {
        // Simular efecto de respiración / calma al entrar
        const timer = setTimeout(() => setShowContent(true), 500);

        // Fetch songs
        fetch('/api/songs')
            .then(res => res.json())
            .then(data => setSongs(data))
            .catch(err => console.error("Error fetching songs:", err));

        return () => clearTimeout(timer);
    }, []);

    const playSong = (song: any) => {
        if (!song?.url) return;

        if (audio) {
            audio.pause();
        }

        const newAudio = new Audio(song.url);

        newAudio.onended = () => {
            setCurrentSong(null);
            setAudio(null);
        };

        // Handle playback promise to prevent "client-side exception"
        const playPromise = newAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Audio playback failed:", error);
                setCurrentSong(null);
                setAudio(null);
            });
        }

        setAudio(newAudio);
        setCurrentSong(song);
    };

    const stopMusic = () => {
        if (audio) {
            audio.pause();
            setAudio(null);
            setCurrentSong(null);
        }
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

            <div className={`flex-grow-1 d-flex flex-column justify-content-center position-relative z-1 transition-all ${showContent ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 1s ease' }}>

                <h1 className="display-4 fw-bold mb-4">Respira.</h1>
                <p className="lead mb-5 opacity-75">
                    No has fallado todavía. Y aunque lo hicieras, Él te sigue amando. Pero hagamos una pausa de 1 minuto juntos.
                </p>

                {!showTruths ? (
                    <div className="d-grid gap-3">
                        <button
                            onClick={handleShowTruths}
                            className="btn bg-white btn-lg shadow-sm text-primary d-flex align-items-center justify-content-start gap-3 p-3"
                        >
                            <BookHeart size={24} className="text-secondary" />
                            <div className="text-start">
                                <span className="d-block fw-bold">Leer una promesa</span>
                                <small className="opacity-75">Rompe la mentira con verdad</small>
                            </div>
                        </button>

                        <button
                            onClick={() => setShowMusic(!showMusic)}
                            className="btn bg-white btn-lg shadow-sm text-primary d-flex align-items-center justify-content-start gap-3 p-3"
                        >
                            <Music size={24} className="text-secondary" />
                            <div className="text-start">
                                <span className="d-block fw-bold">Escuchar música</span>
                                <small className="opacity-75">Cambia la atmósfera</small>
                            </div>
                        </button>

                        <button className="btn btn-outline-light btn-lg border-2 d-flex align-items-center justify-content-start gap-3 p-3">
                            <Phone size={24} />
                            <div className="text-start">
                                <span className="d-block fw-bold">Llamar a un líder</span>
                                <small>No pelees solo</small>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-4 p-4 border border-white-50">
                            <h3 className="fw-bold mb-4 d-flex align-items-center gap-2"><BookHeart size={28} /> 5 Verdades para ti hoy:</h3>
                            <ul className="list-unstyled p-0 m-0 d-flex flex-column gap-3">
                                {randomTruths.map((truth, idx) => (
                                    <li key={idx} className="d-flex gap-3 align-items-start bg-white bg-opacity-10 p-3 rounded-3">
                                        <span className="fw-bold text-warning user-select-none fs-5">{idx + 1}.</span>
                                        <span className="lh-base fw-medium fs-5">{truth}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setShowTruths(false)}
                                className="btn btn-light w-100 fw-bold py-3 mt-4 rounded-pill text-primary"
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
                                <button onClick={() => { setShowMusic(false); stopMusic(); }} className="btn btn-sm btn-outline-light rounded-circle"><X size={20} /></button>
                            </div>

                            {songs.length === 0 ? (
                                <p>Cargando música...</p>
                            ) : (
                                <ul className="list-unstyled p-0 m-0 d-flex flex-column gap-3">
                                    {songs.map((song) => (
                                        <li key={song.id} className="d-flex justify-content-between align-items-center bg-white bg-opacity-10 p-3 rounded-3">
                                            <div>
                                                <span className="d-block fw-bold fs-5">{song.title}</span>
                                                <small className="opacity-75">{song.artist}</small>
                                            </div>
                                            <button
                                                onClick={() => currentSong?.id === song.id ? stopMusic() : playSong(song)}
                                                className={`btn btn-light rounded-circle p-3 ${currentSong?.id === song.id ? 'text-primary' : 'text-secondary'}`}
                                            >
                                                {currentSong?.id === song.id ? <div className="spinner-grow spinner-grow-sm" role="status" /> : <Music size={20} />}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

            </div>

            <div className="mt-auto text-center opacity-50 pb-4">
                <small>"Fiel es Dios, que no os dejará ser tentados más de lo que podéis resistir..." - 1 Cor 10:13</small>
            </div>
        </div>
    );
}

"use client";

import Link from 'next/link';
import { X, Phone, BookHeart, Music, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { seedSongsAction } from './seed-action';
import EnhancedMusicPlayer from '@/app/components/EnhancedMusicPlayer';
import MusicUploadModal from '@/app/components/MusicUploadModal';

interface SOSClientProps {
    leaderPhone: string | null;
}

export default function SOSClient({ leaderPhone }: SOSClientProps) {
    const [showContent, setShowContent] = useState(false);
    const [showTruths, setShowTruths] = useState(false);
    const [showMusic, setShowMusic] = useState(false);
    const [songs, setSongs] = useState<any[]>([]);
    const [randomTruths, setRandomTruths] = useState<string[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showPrayer, setShowPrayer] = useState(false);
    const [currentPrayer, setCurrentPrayer] = useState('');

    // ... (Constants moved here or kept outside if static)
    const EMERGENCY_PRAYERS = [
        "Padre Celestial, en este momento de angustia te necesito más que nunca. Siento que las fuerzas me abandonan, pero sé que Tú nunca me abandonas. Llena mi corazón de Tu paz que sobrepasa todo entendimiento. Ayúdame a recordar que nunca estoy solo, que Tú siempre estás conmigo, caminando a mi lado incluso en el valle más oscuro. Dame la fortaleza para dar un paso más, para resistir un minuto más. Confío en que Tú me sostienes. Amén.",
        "Señor Jesús, siento que no puedo más con esta carga. Mi mente está agitada, mis emociones están desbordadas, y necesito Tu intervención divina ahora mismo. Toma control de esta situación que me sobrepasa. Dame la serenidad que solo Tú puedes dar, esa paz que el mundo no puede ofrecer. Ayúdame a entregarTe cada pensamiento, cada emoción, cada temor. Recuérdame que Tú venciste al mundo, y que en Ti tengo la victoria. Confío plenamente en Ti. Amén.",
        "Dios de amor infinito, en este momento tan difícil clamo a Ti con todo mi corazón. Calma la tormenta que hay en mi mente, fortalece mi espíritu que se siente débil. Recuérdame Tu promesa de nunca dejarme ni abandonarme, de estar conmigo hasta el fin del mundo. Ayúdame a sentir Tu presencia ahora mismo, a saber que me escuchas, que me ves, que te importo. Dame esperanza cuando todo parece oscuro, y fe cuando no puedo ver el camino. Amén.",
        "Espíritu Santo, ven como consolador a mi corazón quebrantado. Necesito Tu guía divina en este momento de confusión. Dame sabiduría para tomar las decisiones correctas, discernimiento para ver la verdad en medio de las mentiras, y valor para enfrentar este momento sin huir. Gracias por Tu presencia constante, por ser mi ayudador, mi consejero, mi amigo fiel. Llena cada espacio vacío de mi ser con Tu amor y Tu poder. Amén.",
        "Padre Eterno, reconozco humildemente que sin Ti no puedo hacer absolutamente nada. Esta batalla es demasiado grande para mí, pero no para Ti. Ayúdame a resistir esta tentación que me acecha, a superar este momento de debilidad. Llena este vacío que siento con Tu amor infinito e incondicional. Recuérdame quién soy en Ti: amado, perdonado, libre. Dame fuerzas para decir no a lo que me destruye y sí a lo que me edifica. Confío en Tu poder transformador. Amén."
    ];

    const TRUTHS = [
        "Dios no está enojado contigo, Él está peleando por ti.",
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
        const shuffled = TRUTHS.sort(() => 0.5 - Math.random());
        setRandomTruths(shuffled.slice(0, 5));
        setShowTruths(true);
    };

    const handleShowPrayer = () => {
        const randomIndex = Math.floor(Math.random() * EMERGENCY_PRAYERS.length);
        setCurrentPrayer(EMERGENCY_PRAYERS[randomIndex]);
        setShowPrayer(true);
    };

    const fetchSongs = () => {
        fetch('/api/songs')
            .then(res => res.json())
            .then(data => setSongs(data))
            .catch(err => console.error("Error fetching songs:", err));
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 500);
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
                                if (leaderPhone) {
                                    window.location.href = `tel:${leaderPhone}`;
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

                {showPrayer && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 mt-3">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-5 p-4 border border-white-50">
                            <h3 className="fw-bold mb-4 d-flex align-items-center gap-2 text-white"><BookHeart size={28} /> Oración de Emergencia</h3>
                            <div className="bg-white bg-opacity-10 p-4 rounded-4 border border-white-25 mb-4">
                                <p className="lh-lg fw-medium fs-5 text-white m-0 text-center" style={{ fontStyle: 'italic' }}>
                                    "{currentPrayer}"
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPrayer(false)}
                                className="btn btn-light w-100 fw-bold py-3 rounded-pill text-primary hover-scale shadow-sm"
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                )}

                <MusicUploadModal
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    onSuccess={fetchSongs}
                />

            </div>

            <div className="mt-auto text-center pb-4">
                <div className="bg-white bg-opacity-10 p-2 rounded-3">
                    <p className="extra-small text-white-50 m-0" style={{ fontSize: '10px' }}>
                        AVISO: Conecta+ es una herramienta espiritual. En caso de emergencia grave o riesgo para tu vida, llama a las autoridades (911).
                    </p>
                </div>
            </div>
        </div>
    );
}

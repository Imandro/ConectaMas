"use client";

import Link from 'next/link';
import { X, Phone, BookHeart, Music, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { seedSongsAction } from './seed-action';
import EnhancedMusicPlayer from '@/app/components/EnhancedMusicPlayer';
import MusicUploadModal from '@/app/components/MusicUploadModal';
import { useLanguage } from '@/app/LanguageContext';
import { getSOSContent } from '@/app/lib/sosData';

interface SOSClientProps {
    leaderPhone: string | null;
}

interface Song {
    id: string;
    title: string;
    artist: string;
    url: string;
    category: string;
}

export default function SOSClient({ leaderPhone }: SOSClientProps) {
    const { t, language } = useLanguage();
    const [showTruths, setShowTruths] = useState(false);
    const [showMusic, setShowMusic] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const [randomTruths, setRandomTruths] = useState<string[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showPrayer, setShowPrayer] = useState(false);
    const [currentPrayer, setCurrentPrayer] = useState('');

    const { prayers, truths } = getSOSContent(language);

    const handleShowTruths = () => {
        const shuffled = [...truths].sort(() => 0.5 - Math.random());
        setRandomTruths(shuffled.slice(0, 5));
        setShowTruths(true);
    };

    const handleShowPrayer = () => {
        const randomIndex = Math.floor(Math.random() * prayers.length);
        setCurrentPrayer(prayers[randomIndex]);
        setShowPrayer(true);
    };

    const fetchSongs = () => {
        fetch('/api/songs')
            .then(res => res.json())
            .then(data => setSongs(data))
            .catch(err => console.error("Error fetching songs:", err));
    };

    useEffect(() => {
        seedSongsAction().then(res => {
            fetchSongs();
        });
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

                <h1 className="display-4 fw-bold mb-4 text-white">{t.sos.title}</h1>
                <p className="lead mb-5 opacity-75 animate-fade-in-up delay-100">
                    {t.sos.subtitle}
                </p>

                {!showTruths ? (
                    <div className="d-grid gap-3 animate-fade-in-up delay-200">
                        <button
                            onClick={handleShowTruths}
                            className="btn bg-white btn-lg shadow-sm text-primary d-flex align-items-center justify-content-start gap-3 p-3 hover-scale transition-all"
                        >
                            <BookHeart size={24} className="text-secondary" />
                            <div className="text-start">
                                <span className="d-block fw-bold">{t.sos.promise_btn}</span>
                                <small className="opacity-75">{t.sos.promise_desc}</small>
                            </div>
                        </button>

                        <button
                            onClick={handleShowPrayer}
                            className="btn bg-white btn-lg shadow-sm text-primary d-flex align-items-center justify-content-start gap-3 p-3 hover-scale transition-all"
                        >
                            <BookHeart size={24} className="text-info" />
                            <div className="text-start">
                                <span className="d-block fw-bold">{t.sos.prayer_btn}</span>
                                <small className="opacity-75">{t.sos.prayer_desc}</small>
                            </div>
                        </button>

                        <button
                            onClick={() => setShowMusic(!showMusic)}
                            className="btn bg-white btn-lg shadow-sm text-primary d-flex align-items-center justify-content-start gap-3 p-3 hover-scale transition-all"
                        >
                            <Music size={24} className="text-secondary" />
                            <div className="text-start">
                                <span className="d-block fw-bold">{t.sos.music_btn}</span>
                                <small className="opacity-75">{t.sos.music_desc}</small>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                if (leaderPhone) {
                                    window.location.href = `tel:${leaderPhone}`;
                                } else {
                                    alert(t.sos.no_leader);
                                }
                            }}
                            className="btn btn-outline-light btn-lg border-2 d-flex align-items-center justify-content-start gap-3 p-3 w-100 hover-scale transition-all"
                        >
                            <Phone size={24} />
                            <div className="text-start">
                                <span className="d-block fw-bold">{t.sos.call_btn}</span>
                                <small>{t.sos.call_desc}</small>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-5 p-4 border border-white-50">
                            <h3 className="fw-bold mb-4 d-flex align-items-center gap-2 text-white"><BookHeart size={28} /> {t.sos.truths_title}</h3>
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
                                {t.sos.back}
                            </button>
                        </div>
                    </div>
                )}

                {showMusic && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 mt-3">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-4 p-4 border border-white-50">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold m-0 d-flex align-items-center gap-2"><Music size={28} /> {t.sos.music_title}</h3>
                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="btn btn-sm btn-warning rounded-pill px-3 fw-bold d-flex align-items-center gap-1 shadow-sm"
                                        style={{ backgroundColor: '#f3b33e', color: '#0B1B32', border: 'none' }}
                                    >
                                        <Plus size={18} /> {t.sos.upload}
                                    </button>
                                    <button onClick={() => setShowMusic(false)} className="btn btn-sm btn-outline-light rounded-circle"><X size={20} /></button>
                                </div>
                            </div>

                            {songs.length === 0 ? (
                                <div className="text-center py-5">
                                    <Loader2 className="animate-spin mb-3 mx-auto" size={40} />
                                    <p className="opacity-75">{t.sos.loading_music}</p>
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
                            <h3 className="fw-bold mb-4 d-flex align-items-center gap-2 text-white"><BookHeart size={28} /> {t.sos.prayer_title}</h3>
                            <div className="bg-white bg-opacity-10 p-4 rounded-4 border border-white-25 mb-4">
                                <p className="lh-lg fw-medium fs-5 text-white m-0 text-center" style={{ fontStyle: 'italic' }}>
                                    &quot;{currentPrayer}&quot;
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPrayer(false)}
                                className="btn btn-light w-100 fw-bold py-3 rounded-pill text-primary hover-scale shadow-sm"
                            >
                                {t.sos.back}
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
                        {t.sos.disclaimer}
                    </p>
                </div>
            </div>
        </div>
    );
}

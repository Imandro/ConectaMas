"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Song {
    id: string;
    title: string;
    artist: string;
    url: string;
}

interface EnhancedMusicPlayerProps {
    songs: Song[];
}

export default function EnhancedMusicPlayer({ songs }: EnhancedMusicPlayerProps) {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentSong = songs[currentSongIndex];

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch((e) => {
                    console.error("Playback failed:", e);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSongIndex]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setProgress((current / total) * 100);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const seekTime = (parseFloat(e.target.value) / 100) * duration;
            audioRef.current.currentTime = seekTime;
            setProgress(parseFloat(e.target.value));
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
    };

    const nextSong = () => {
        setCurrentSongIndex((prev) => (prev + 1) % songs.length);
        setIsPlaying(true);
    };

    const prevSong = () => {
        setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
        setIsPlaying(true);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    if (!currentSong) return null;

    return (
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-4 p-4 border border-white border-opacity-20 shadow-xl">
            <audio
                ref={audioRef}
                src={currentSong.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={nextSong}
                onLoadStart={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
            />

            <div className="text-center mb-4">
                <motion.div
                    key={currentSong.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2"
                >
                    <div className="bg-warning bg-opacity-20 rounded-pill d-inline-block px-3 py-1 mb-3">
                        <span className="text-warning small fw-bold">REPRODUCIENDO</span>
                    </div>
                    <h4 className="fw-bold mb-1 text-white truncate">{currentSong.title}</h4>
                    <p className="text-white-50 small mb-0">{currentSong.artist}</p>
                </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress || 0}
                    onChange={handleSeek}
                    className="w-100 accent-warning cursor-pointer"
                    style={{ height: '4px' }}
                />
                <div className="d-flex justify-content-between mt-2 px-1">
                    <span className="small text-white-50">{formatTime(audioRef.current?.currentTime || 0)}</span>
                    <span className="small text-white-50">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="d-flex align-items-center justify-content-center gap-4 mb-4">
                <button onClick={prevSong} className="btn btn-link text-white p-0 hover-scale opacity-75">
                    <SkipBack size={24} />
                </button>

                <button
                    onClick={togglePlay}
                    className="btn btn-warning rounded-circle d-flex align-items-center justify-content-center shadow-lg transform-scale-110"
                    style={{ width: '64px', height: '64px', backgroundColor: '#f3b33e' }}
                >
                    {isLoading ? (
                        <Loader2 size={32} className="animate-spin text-primary" />
                    ) : isPlaying ? (
                        <Pause size={32} className="text-primary fill-current" />
                    ) : (
                        <Play size={32} className="text-primary fill-current ms-1" />
                    )}
                </button>

                <button onClick={nextSong} className="btn btn-link text-white p-0 hover-scale opacity-75">
                    <SkipForward size={24} />
                </button>
            </div>

            {/* Volume */}
            <div className="d-flex align-items-center gap-3 bg-white bg-opacity-5 rounded-pill px-3 py-2">
                <Volume2 size={18} className="text-white-50" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-grow-1 accent-warning cursor-pointer"
                    style={{ height: '3px' }}
                />
            </div>

            {/* Playlist Preview */}
            <div className="mt-4 pt-4 border-top border-white border-opacity-10">
                <h6 className="small fw-bold text-white-50 mb-3 d-flex align-items-center gap-2">
                    <Music size={14} /> SIGUIENTES CANCIONES
                </h6>
                <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '150px' }}>
                    {songs.map((song, index) => (
                        <button
                            key={song.id}
                            onClick={() => {
                                setCurrentSongIndex(index);
                                setIsPlaying(true);
                            }}
                            className={`btn btn-link text-start p-2 rounded-3 text-decoration-none transition-all ${currentSongIndex === index
                                    ? 'bg-white bg-opacity-10 text-warning fw-bold'
                                    : 'text-white-50 hover-bg-white-10'
                                }`}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <span className="small opacity-50">{index + 1}</span>
                                <div className="truncate">
                                    <div className="small fw-bold">{song.title}</div>
                                    <div className="tiny opacity-50">{song.artist}</div>
                                </div>
                                {currentSongIndex === index && isPlaying && (
                                    <div className="ms-auto d-flex gap-1">
                                        <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="bg-warning w-1 rounded-pill" style={{ width: '2px' }} />
                                        <motion.div animate={{ height: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="bg-warning w-1 rounded-pill" style={{ width: '2px' }} />
                                        <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="bg-warning w-1 rounded-pill" style={{ width: '2px' }} />
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

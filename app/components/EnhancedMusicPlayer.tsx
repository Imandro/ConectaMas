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
    const [volume, setVolume] = useState(0.8);
    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentSong = songs[currentSongIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
            if (isPlaying) {
                audioRef.current.play().catch((e) => {
                    console.error("Playback failed:", e);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSongIndex, isMuted, volume]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            if (!isNaN(total)) {
                setProgress((current / total) * 100);
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current && duration) {
            const seekTime = (parseFloat(e.target.value) / 100) * duration;
            audioRef.current.currentTime = seekTime;
            setProgress(parseFloat(e.target.value));
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
        <div className="premium-player-container">
            <audio
                ref={audioRef}
                src={currentSong.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={nextSong}
                onLoadStart={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
            />

            {/* Header: Title & Info */}
            <div className="text-center mb-4 pt-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSong.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="fw-bold text-white mb-1" style={{ fontSize: '1.4rem', letterSpacing: '-0.5px' }}>{currentSong.title}</h2>
                        <p className="text-warning fw-medium mb-0 opacity-75 small">{currentSong.artist}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Layout: Progress Bar - TOP */}
            <div className="mb-4 px-1">
                <div className="position-relative" style={{ height: '12px' }}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress || 0}
                        onChange={handleSeek}
                        className="custom-range-input accent-warning"
                    />
                </div>
                <div className="d-flex justify-content-between mt-1 px-1">
                    <span className="tiny-text text-white opacity-40 fw-bold">{formatTime(audioRef.current?.currentTime || 0)}</span>
                    <span className="tiny-text text-white opacity-40 fw-bold">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Layout: Controls - MIDDLE */}
            <div className="d-flex align-items-center justify-content-between px-3 mb-4">
                <button className="btn btn-link text-white opacity-30 p-0 transform-hover">
                    <motion.div whileHover={{ scale: 1.2, rotate: 10 }}><svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z" /><path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9a.25.25 0 0 1-.41-.192V10.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z" /></svg></motion.div>
                </button>

                <div className="d-flex align-items-center gap-4">
                    <button onClick={prevSong} className="btn btn-link text-white p-0 btn-control opacity-70">
                        <SkipBack size={28} fill="white" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="btn-play-pause shadow-lg position-relative"
                    >
                        {isLoading ? (
                            <Loader2 size={32} className="animate-spin text-primary" />
                        ) : isPlaying ? (
                            <Pause size={36} className="text-primary fill-current" />
                        ) : (
                            <Play size={36} className="text-primary fill-current ms-1" />
                        )}
                    </button>

                    <button onClick={nextSong} className="btn btn-link text-white p-0 btn-control opacity-70">
                        <SkipForward size={28} fill="white" />
                    </button>
                </div>

                <button className="btn btn-link text-white opacity-30 p-0 transform-hover">
                    <motion.div whileHover={{ scale: 1.2, rotate: -10 }}><svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M11 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm-7 5.068v3.932a.25.25 0 0 0 .41.192l2.36-1.966c.12-.1.12-.284 0-.384L4.41 10.342a.25.25 0 0 0-.41.192z" /><path d="M2.5 5A.5.5 0 0 1 3 4.5h8a.5.5 0 0 1 0 1H3A.5.5 0 0 1 2.5 5zm11 6a.5.5 0 0 1-.5.5H5a.5.5 0 0 1 0-1h8a.5.5 0 0 1 .5.5z" /></svg></motion.div>
                </button>
            </div>

            {/* Layout: Waveform - BOTTOM */}
            <div className="player-visualizer mb-4 d-flex align-items-center justify-content-center overflow-hidden rounded-4" style={{ height: '80px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <div className="waveform-container d-flex align-items-center gap-1 px-3 w-100 justify-content-center" style={{ height: '40px' }}>
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                height: isPlaying ? [6, Math.random() * 34 + 6, 6] : 4
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 0.5 + (i % 3) * 0.1,
                                ease: "easeInOut"
                            }}
                            className="bg-warning rounded-pill"
                            style={{ width: '3px', opacity: isPlaying ? 0.7 : 0.2 }}
                        />
                    ))}
                </div>
            </div>

            {/* Playlist Section - ALWAYS VISIBLE */}
            <div className="playlist-container mt-2 pt-3 border-top border-white border-opacity-10">
                <div className="d-flex justify-content-between align-items-baseline mb-3 px-1">
                    <h6 className="tiny-text fw-bold text-white-50 m-0" style={{ letterSpacing: '1px' }}>REPRODUCIENDO AHORA</h6>
                    <span className="tiny-text text-warning opacity-50 fw-bold">{currentSongIndex + 1} de {songs.length}</span>
                </div>
                <div className="d-flex flex-column gap-2 overflow-auto pe-1" style={{ maxHeight: '140px' }}>
                    {songs.map((song, index) => (
                        <motion.button
                            key={song.id}
                            whileHover={{ scale: 1.01, x: 4, backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
                            onClick={() => {
                                setCurrentSongIndex(index);
                                setIsPlaying(true);
                            }}
                            className={`playlist-item d-flex align-items-center gap-3 p-2 rounded-3 text-start border-0 ${currentSongIndex === index
                                ? 'active-item'
                                : 'inactive-item'
                                }`}
                        >
                            <div className="item-number">{index + 1}</div>
                            <div className="flex-grow-1 overflow-hidden">
                                <div className="song-name truncate">{song.title}</div>
                                <div className="song-artist truncate smaller opacity-50">{song.artist}</div>
                            </div>
                            {currentSongIndex === index && isPlaying && (
                                <div className="playing-bars">
                                    <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="bar" />
                                    <motion.div animate={{ height: [10, 4, 10] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="bar" />
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .premium-player-container {
                    color: white;
                    padding: 4px;
                }
                .btn-play-pause {
                    width: 76px;
                    height: 76px;
                    border-radius: 50%;
                    background: #f3b33e;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 6px 20px rgba(243, 179, 62, 0.4);
                }
                .btn-play-pause:hover {
                    box-shadow: 0 10px 30px rgba(243, 179, 62, 0.6);
                    transform: scale(1.05);
                }
                .custom-range-input {
                    -webkit-appearance: none;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.1);
                    height: 5px;
                    border-radius: 3px;
                    outline: none;
                }
                .custom-range-input::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 14px;
                    height: 14px;
                    background: #f3b33e;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 12px rgba(243, 179, 62, 0.6);
                    border: 2px solid #0B1B32;
                }
                .playlist-item {
                    background: transparent;
                    transition: all 0.2s;
                    cursor: pointer;
                    outline: none !important;
                }
                .active-item {
                    background: rgba(243, 179, 62, 0.1);
                    border-left: 3px solid #f3b33e !important;
                }
                .song-name {
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                .smaller {
                    font-size: 0.7rem;
                }
                .item-number {
                    font-size: 0.7rem;
                    color: rgba(243, 179, 62, 0.5);
                    width: 16px;
                    font-weight: bold;
                    text-align: center;
                }
                .tiny-text {
                    font-size: 0.6rem;
                    letter-spacing: 0.5px;
                }
                .playing-bars {
                    display: flex;
                    gap: 2px;
                    align-items: flex-end;
                }
                .playing-bars .bar {
                    width: 2px;
                    background: #f3b33e;
                    border-radius: 1px;
                }
                .btn-control:hover {
                    opacity: 1 !important;
                    transform: scale(1.1);
                }
                .transform-hover:hover {
                    opacity: 0.8 !important;
                }
            `}</style>
        </div>
    );
}

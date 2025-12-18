"use client";

import { VideoData } from "@/app/lib/videosData";
import { Heart, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toggleVideoLike, getUserVideoInteractions, markVideoWatched } from "./actions";

interface VideoPlayerProps {
    video: VideoData;
    isActive: boolean;
    onLikeToggle?: () => void;
}

export default function VideoPlayer({ video, isActive, onLikeToggle }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [showLikeAnimation, setShowLikeAnimation] = useState(false);
    const [hasMarkedWatched, setHasMarkedWatched] = useState(false);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Load initial like state from database
    useEffect(() => {
        async function loadVideoInteraction() {
            const interaction = await getUserVideoInteractions(video.id);
            if (interaction) {
                setIsLiked(interaction.liked);
            }
        }
        loadVideoInteraction();
    }, [video.id]);

    // Auto pause/play when not active
    useEffect(() => {
        if (!videoRef.current) return;

        if (!isActive) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            // Auto play when video becomes active
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        // Mark as watched on first autoplay
                        if (!hasMarkedWatched) {
                            setHasMarkedWatched(true);
                            markVideoWatched(video.id);
                        }
                    })
                    .catch(error => {
                        console.log('Auto-play prevented:', error);
                    });
            }
        }
    }, [isActive, video.id, hasMarkedWatched]);

    const handlePlayPause = async () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();

                // Mark video as watched when first played
                if (!hasMarkedWatched) {
                    setHasMarkedWatched(true);
                    await markVideoWatched(video.id);
                }
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleMuteToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 1000);

        // Call server action
        await toggleVideoLike(video.id);
        onLikeToggle?.();
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Update progress
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            const progressPercent = (video.currentTime / video.duration) * 100;
            setProgress(progressPercent);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }, []);

    return (
        <div
            className="video-player-container position-relative w-100 bg-dark"
            style={{
                height: '100vh',
                maxHeight: '100vh',
                scrollSnapAlign: 'start'
            }}
            onClick={handlePlayPause}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={video.videoUrl}
                loop
                muted={isMuted}
                playsInline
                className="w-100 h-100 object-fit-cover"
                style={{ maxHeight: '100vh' }}
            />

            {/* Progress Bar */}
            <div
                className="position-absolute top-0 start-0 w-100"
                style={{
                    height: '3px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    zIndex: 10
                }}
            >
                <div
                    className="h-100 bg-primary transition-all"
                    style={{
                        width: `${progress}%`,
                        transition: 'width 0.1s linear'
                    }}
                />
            </div>

            {/* Overlay - Play/Pause Icon (center) */}
            {!isPlaying && (
                <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="bg-dark bg-opacity-50 rounded-circle p-4">
                        <Play size={48} className="text-white" fill="white" />
                    </div>
                </div>
            )}

            {/* Like Animation (center) */}
            {showLikeAnimation && (
                <div
                    className="position-absolute top-50 start-50 translate-middle animate-like-pop"
                    style={{ animation: 'likePop 0.8s ease-out' }}
                >
                    <Heart size={120} className="text-danger" fill="currentColor" />
                </div>
            )}

            {/* Bottom Info Overlay */}
            <div
                className="position-absolute bottom-0 start-0 end-0 p-4 pb-5"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    pointerEvents: 'none'
                }}
            >
                <div className="text-white">
                    <h5 className="fw-bold mb-2">{video.title}</h5>
                    <p className="small mb-2 opacity-75">{video.description}</p>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary rounded-pill">{video.category}</span>
                        <span className="small opacity-75">{formatDuration(video.duration)}</span>
                    </div>
                </div>
            </div>

            {/* Right Side Controls */}
            <div className="position-absolute end-0 bottom-0 p-4 pb-5 d-flex flex-column gap-4 align-items-center">
                {/* Like Button */}
                <button
                    onClick={handleLike}
                    className="btn btn-link p-0 text-white text-decoration-none"
                    style={{ pointerEvents: 'all' }}
                >
                    <div className="d-flex flex-column align-items-center gap-1">
                        <div className={`transition-all ${isLiked ? 'animate-bounce' : ''}`}>
                            <Heart
                                size={32}
                                className={isLiked ? 'text-danger' : 'text-white'}
                                fill={isLiked ? 'currentColor' : 'none'}
                                strokeWidth={2}
                            />
                        </div>
                        <span className="small fw-bold">Me gusta</span>
                    </div>
                </button>

                {/* Mute/Unmute Button */}
                <button
                    onClick={handleMuteToggle}
                    className="btn btn-link p-0 text-white text-decoration-none"
                    style={{ pointerEvents: 'all' }}
                >
                    <div className="d-flex flex-column align-items-center gap-1">
                        {isMuted ? (
                            <VolumeX size={28} strokeWidth={2} />
                        ) : (
                            <Volume2 size={28} strokeWidth={2} />
                        )}
                    </div>
                </button>
            </div>

            <style jsx>{`
                @keyframes likePop {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1.5);
                        opacity: 0;
                    }
                }
                
                .animate-bounce {
                    animation: bounce 0.5s ease;
                }
                
                @keyframes bounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
            `}</style>
        </div>
    );
}

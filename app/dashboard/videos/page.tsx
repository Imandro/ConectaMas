"use client";

import { videosData, videoCategories, VideoData } from '@/app/lib/videosData';
import { useState, useRef, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import { ArrowUp } from 'lucide-react';
import { getAllVideos } from './actions';

export default function VideosPage() {
    const [selectedCategory, setSelectedCategory] = useState('Para ti');
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [videos, setVideos] = useState<VideoData[]>(videosData); // Start with local data
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load videos from database on mount
    useEffect(() => {
        async function loadVideos() {
            try {
                const dbVideos = await getAllVideos();
                if (dbVideos && dbVideos.length > 0) {
                    setVideos(dbVideos as VideoData[]);
                }
            } catch (error) {
                console.error('Error loading videos:', error);
                // Keep using local videosData as fallback
            } finally {
                setIsLoading(false);
            }
        }
        loadVideos();
    }, []);

    const filteredVideos = selectedCategory === 'Para ti'
        ? videos
        : videos.filter(video => video.category === selectedCategory);

    // Handle scroll to snap to videos
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollPosition = container.scrollTop;
            const videoHeight = window.innerHeight;
            const newIndex = Math.round(scrollPosition / videoHeight);

            if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < filteredVideos.length) {
                setCurrentVideoIndex(newIndex);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [currentVideoIndex, filteredVideos.length]);

    const scrollToTop = () => {
        containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="videos-page-container position-fixed top-0 start-0 w-100 h-100 bg-dark">
            {/* Header with Category Filters */}
            <div
                className="position-absolute top-0 start-0 end-0 z-3 p-3 pb-2"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    paddingTop: 'calc(env(safe-area-inset-top) + 1rem)'
                }}
            >
                <h2 className="fw-bold text-white mb-3 d-none d-md-block">Videos</h2>

                {/* Category Filter Chips */}
                <div className="d-flex gap-2 overflow-auto pb-2 no-scrollbar">
                    {videoCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                setCurrentVideoIndex(0);
                                containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`btn btn-sm rounded-pill px-3 flex-shrink-0 transition-all ${selectedCategory === category
                                ? 'btn-primary text-white shadow-sm'
                                : 'btn-light text-dark border-0 bg-white bg-opacity-75'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Videos Container - Vertical Scroll */}
            <div
                ref={containerRef}
                className="videos-scroll-container h-100 overflow-y-scroll"
                style={{
                    scrollSnapType: 'y mandatory',
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {filteredVideos.length > 0 ? (
                    filteredVideos.map((video, index) => (
                        <VideoPlayer
                            key={video.id}
                            video={video}
                            isActive={index === currentVideoIndex}
                        />
                    ))
                ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-white">
                        <div className="text-center p-4">
                            <p className="mb-3">No hay videos en esta categoría aún.</p>
                            <button
                                onClick={() => setSelectedCategory('Para ti')}
                                className="btn btn-sm btn-primary rounded-pill"
                            >
                                Ver todos
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Scroll to Top Button (shown after scrolling) */}
            {currentVideoIndex > 0 && (
                <button
                    onClick={scrollToTop}
                    className="btn btn-primary rounded-circle position-fixed shadow-lg"
                    style={{
                        bottom: '100px',
                        right: '20px',
                        width: '50px',
                        height: '50px',
                        zIndex: 1000
                    }}
                >
                    <ArrowUp size={24} />
                </button>
            )}

            <style jsx>{`
                .videos-scroll-container::-webkit-scrollbar {
                    display: none;
                }
                
                .videos-scroll-container {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { Quote, ExternalLink, Download } from "lucide-react";
import Link from 'next/link';
import { toPng } from 'html-to-image';
import download from 'downloadjs';

import { verses as VERSES } from "@/app/lib/versesData";

const BACKGROUND_IMAGES = [
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1600", // Nature
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1600", // Sunrise
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1600", // Mountains
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1600", // Forest
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600", // Ocean
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1600", // Stars
];

export default function DailyVerse() {
    const [verse, setVerse] = useState(VERSES[0]);
    const [bgImage, setBgImage] = useState(BACKGROUND_IMAGES[0]);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Select verse based on day of year to keep it consistent for everyone/user for that day
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const verseIndex = dayOfYear % VERSES.length;
        const bgIndex = dayOfYear % BACKGROUND_IMAGES.length;
        
        setVerse(VERSES[verseIndex]);
        setBgImage(BACKGROUND_IMAGES[bgIndex]);
    }, []);

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (cardRef.current) {
            try {
                const dataUrl = await toPng(cardRef.current, {
                    cacheBust: true,
                    filter: (node) => {
                        return !node.classList?.contains('no-export');
                    }
                });
                download(dataUrl, `versiculo-diario-${new Date().toISOString().split('T')[0]}.png`);
            } catch (err) {
                console.error('Error downloading image:', err);
            }
        }
    };

    const getBibleLink = () => {
        try {
            // Parses "Juan 3:16" or "1 Juan 1:9"
            const parts = verse.reference.split(" ");
            let book = parts[0];
            let chapterAndVerse = parts[1];

            // Handle books with numbers like "1 Juan"
            if (!isNaN(parseInt(parts[0])) && parts.length > 2) {
                book = `${parts[0]} ${parts[1]}`;
                chapterAndVerse = parts[2];
            }

            const chapter = chapterAndVerse.split(":")[0];
            return `/dashboard/bible?book=${encodeURIComponent(book)}&chapter=${chapter}`;
        } catch (e) {
            return "/dashboard/bible";
        }
    };

    return (
        <Link href={getBibleLink()} className="text-decoration-none">
            <div 
                ref={cardRef}
                className="card border-0 shadow-lg text-white rounded-4 p-4 position-relative overflow-hidden mb-4 hover-scale transition-all"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '200px'
                }}
            >
                {/* Download Button */}
                <button 
                    onClick={handleDownload}
                    className="no-export position-absolute top-0 end-0 m-3 btn btn-sm btn-light rounded-circle p-2 shadow-sm z-3 opacity-75 hover-opacity-100"
                    title="Descargar imagen"
                >
                    <Download size={16} className="text-dark" />
                </button>

                {/* Decorative Circles */}
                <div className="position-absolute top-0 start-0 bg-white opacity-10 rounded-circle"
                    style={{ width: '100px', height: '100px', transform: 'translate(-30%, -30%)' }}></div>
                
                <div className="position-relative z-1 text-center py-4 d-flex flex-column justify-content-center h-100">
                    <h6 className="text-white-50 fw-bold text-uppercase small mb-3 letter-spacing-2">Versículo del Día</h6>
                    <figure className="text-center mb-0">
                        <blockquote className="blockquote mb-3">
                            <p className="fs-4 fw-bold fst-italic text-white mb-0 lh-base text-shadow">
                                "{verse.text}"
                            </p>
                        </blockquote>
                        <figcaption className="blockquote-footer text-white fw-medium mt-2 mb-0 fs-6">
                            {verse.reference}
                        </figcaption>
                    </figure>
                </div>
                
                <div className="position-absolute bottom-0 end-0 p-3 opacity-50">
                    <span className="small text-white-50">Conecta+</span>
                </div>
            </div>
        </Link>
    );
}

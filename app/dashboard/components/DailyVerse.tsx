"use client";

import { useEffect, useState, useRef } from "react";
import { Download } from "lucide-react";
import Link from 'next/link';
import { toPng } from 'html-to-image';
import download from 'downloadjs';

import { verses as VERSES } from "@/app/lib/versesData";

import { useLanguage } from '@/app/LanguageContext';

const BACKGROUND_GRADIENTS = [
    'linear-gradient(135deg, #0f2d4a, #1f6f8b)',
    'linear-gradient(135deg, #3b1f5f, #b56576)',
    'linear-gradient(135deg, #164a41, #4d9078)',
    'linear-gradient(135deg, #402218, #b85c38)',
    'linear-gradient(135deg, #12355b, #420039)',
    'linear-gradient(135deg, #1b2735, #4b3f72)',
];

export default function DailyVerse() {
    const { t, language } = useLanguage();
    const [verse, setVerse] = useState(VERSES[0]);
    const [background, setBackground] = useState(BACKGROUND_GRADIENTS[0]);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Select verse based on day of year to keep it consistent for everyone/user for that day
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const verseIndex = dayOfYear % VERSES.length;
        setVerse(VERSES[verseIndex]);
        setBackground(BACKGROUND_GRADIENTS[verseIndex % BACKGROUND_GRADIENTS.length]);
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

    const getVerseContent = () => {
        if (language === 'en' && verse.text_en) {
            return { text: verse.text_en, reference: verse.reference_en || verse.reference };
        }
        if (language === 'pt' && verse.text_pt) {
            return { text: verse.text_pt, reference: verse.reference_pt || verse.reference };
        }
        return { text: verse.text, reference: verse.reference };
    };

    const { text: verseText, reference: verseReference } = getVerseContent();

    const getBibleLink = () => {
        try {
            // Parses "Juan 3:16" or "1 Juan 1:9"
            const parts = verseReference.split(" ");
            let book = parts[0];
            let chapterAndVerse = parts[1];
            // Handle books with numbers like "1 Juan"
            if (!isNaN(parseInt(parts[0])) && parts.length > 2) {
                book = `${parts[0]} ${parts[1]}`;
                chapterAndVerse = parts[2];
            }

            const chapter = chapterAndVerse.split(":")[0];
            return `/dashboard/bible?book=${encodeURIComponent(book)}&chapter=${chapter}`;
        } catch {
            return "/dashboard/bible";
        }
    };

    return (
        <div
            ref={cardRef}
            className="daily-verse-card ui-surface card border-0 text-white rounded-4 p-3 p-sm-4 position-relative overflow-hidden mb-3"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.38)), ${background}`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'var(--hero-from, var(--brand-primary, #0B1B32))',
                minHeight: '184px',
            }}
        >
            <button
                onClick={handleDownload}
                aria-label={t.dashboard.download_image}
                className="no-export position-absolute top-0 end-0 m-3 btn btn-light rounded-circle p-0 d-inline-flex align-items-center justify-content-center z-3"
                style={{ width: '44px', height: '44px' }}
                title={t.dashboard.download_image}
            >
                <Download size={16} className="text-dark" />
            </button>

            <Link href={getBibleLink()} className="text-decoration-none text-white d-block h-100 position-relative z-1">

                {/* Decorative Circles */}
                <div className="position-relative text-center px-2 pt-4 pb-2 d-flex flex-column justify-content-center h-100">
                    <h6 className="text-white-50 fw-bold text-uppercase small mb-3 letter-spacing-2">{t.dashboard.daily_verse_title}</h6>
                    <figure className="text-center mb-0">
                        <blockquote className="blockquote mb-3">
                            <p className="fw-bold fst-italic text-white mb-0 lh-base text-shadow" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.45rem)' }}>
                                &ldquo;{verseText}&rdquo;
                            </p>
                        </blockquote>
                        <figcaption className="blockquote-footer text-white fw-medium mt-2 mb-0 fs-6">
                            {verseReference}
                        </figcaption>
                    </figure>
                </div>

                <div className="position-absolute bottom-0 end-0 p-3 opacity-50">
                    <span className="small text-white-50">Conecta+</span>
                </div>
            </Link>
        </div>
    );
}

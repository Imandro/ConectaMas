"use client";

import { useEffect, useState } from "react";
import { Quote, ExternalLink } from "lucide-react";
import Link from 'next/link';

import { verses as VERSES } from "@/app/lib/versesData";

export default function DailyVerse() {
    const [verse, setVerse] = useState(VERSES[0]);

    useEffect(() => {
        // Select verse based on day of year to keep it consistent for everyone/user for that day
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const verseIndex = dayOfYear % VERSES.length;
        setVerse(VERSES[verseIndex]);
    }, []);

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
            <div className="card border-0 shadow-lg bg-primary text-white rounded-4 p-4 position-relative overflow-hidden mb-4 hover-scale transition-all">
                {/* Decorative Circles */}
                <div className="position-absolute top-0 end-0 bg-warning opacity-10 rounded-circle"
                    style={{ width: '150px', height: '150px', transform: 'translate(30%, -30%)' }}></div>
                <div className="position-absolute bottom-0 start-0 border border-warning opacity-25 rounded-circle"
                    style={{ width: '100px', height: '100px', transform: 'translate(-30%, 30%)' }}></div>

                <div className="position-absolute top-0 end-0 p-3 opacity-50">
                    <ExternalLink size={16} />
                </div>

                {/* Decorative Icon Removed */}

                <div className="position-relative z-1 text-center py-2">
                    <h6 className="text-warning fw-bold text-uppercase small mb-3 letter-spacing-2">Versículo del Día</h6>
                    <figure className="text-center mb-0">
                        <blockquote className="blockquote mb-3">
                            <p className="fs-5 fst-italic text-white mb-0 lh-base">
                                "{verse.text}"
                            </p>
                        </blockquote>
                        <figcaption className="blockquote-footer text-white-50 fw-medium mt-1 mb-0">
                            {verse.reference}
                        </figcaption>
                    </figure>
                </div>
            </div>
        </Link>
    );
}

"use client";

// Metadata removed for client component

import { useState, useEffect } from 'react';
import { Book, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from "@/app/LanguageContext";
import { BIBLE_BOOKS, getBibleBookName } from '@/app/lib/bibleData';

const BOOK_MAPPING: { [key: string]: number } = {
    "Génesis": 0, "Éxodo": 1, "Levítico": 2, "Números": 3, "Deuteronomio": 4,
    "Josué": 5, "Jueces": 6, "Rut": 7, "1 Samuel": 8, "2 Samuel": 9,
    "1 Reyes": 10, "2 Reyes": 11, "1 Crónicas": 12, "2 Crónicas": 13,
    "Esdras": 14, "Nehemías": 15, "Ester": 16, "Job": 17, "Salmos": 18,
    "Proverbios": 19, "Eclesiastés": 20, "Cantares": 21, "Isaías": 22,
    "Jeremías": 23, "Lamentaciones": 24, "Ezequiel": 25, "Daniel": 26,
    "Oseas": 27, "Joel": 28, "Amós": 29, "Abdías": 30, "Jonás": 31,
    "Miqueas": 32, "Nahúm": 33, "Habacuc": 34, "Sofonías": 35, "Hageo": 36,
    "Zacarías": 37, "Malaquías": 38, "Mateo": 39, "Marcos": 40, "Lucas": 41,
    "Juan": 42, "Hechos": 43, "Romanos": 44, "1 Corintios": 45, "2 Corintios": 46,
    "Gálatas": 47, "Efesios": 48, "Filipenses": 49, "Colosenses": 50,
    "1 Tesalonicenses": 51, "2 Tesalonicenses": 52, "1 Timoteo": 53,
    "2 Timoteo": 54, "Tito": 55, "Filemón": 56, "Hebreos": 57, "Santiago": 58,
    "1 Pedro": 59, "2 Pedro": 60, "1 Juan": 61, "2 Juan": 62, "3 Juan": 63,
    "Judas": 64, "Apocalipsis": 65
};

let cachedBibleData: any = null;

interface BibleVerse {
    id: string;
    reference: string;
    text: string;
    tags?: string;
}


const FALLBACK_VERSES: BibleVerse[] = [
    {
        id: "fb1",
        reference: "1 Pedro 5:7",
        text: "Echad toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.",
        tags: "ansiedad, paz, confianza"
    },
    {
        id: "fb2",
        reference: "Filipenses 4:13",
        text: "Todo lo puedo en Cristo que me fortalece.",
        tags: "fortaleza, fe, ánimo"
    },
    {
        id: "fb3",
        reference: "Salmos 23:1",
        text: "Jehová es mi pastor; nada me faltará.",
        tags: "paz, provisión, consuelo"
    }
];

export default function BiblePage() {
    const { t, language } = useLanguage();
    const searchParams = useSearchParams();
    const initialBookName = searchParams.get('book');
    const initialChapter = searchParams.get('chapter');

    // Find book by matching any language name ideally, but for now exact match on Spanish name works as default,
    // or we should logic to find book by ID/Name across languages.
    // For simplicity, we assume the URL might have Spanish name OR we default to first book.
    // Assuming backend/API expects Spanish names for folders/data.
    const initialBook = BIBLE_BOOKS.find(b => b.name === initialBookName) || BIBLE_BOOKS[0];
    const initialChapterNum = initialChapter ? parseInt(initialChapter) : 1;

    const [selectedBook, setSelectedBook] = useState(initialBook);
    const [selectedChapter, setSelectedChapter] = useState(initialChapterNum);
    const [chapterText, setChapterText] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [helpfulVerses, setHelpfulVerses] = useState<BibleVerse[]>([]);

    // Mascot Heartbeat (Bible Reading)
    useEffect(() => {
        let timer: NodeJS.Timeout;

        const sendHeartbeat = async () => {
            try {
                await fetch('/api/mascot/heartbeat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: "BIBLE_READING" })
                });
            } catch (err) {
                console.error("Heartbeat error:", err);
            }
        };

        // Enviar un latido cada minuto de lectura
        timer = setInterval(sendHeartbeat, 60000);

        return () => clearInterval(timer);
    }, []);

    // Fetch chapter text
    useEffect(() => {
        if (!selectedBook || !selectedChapter) return;

        setLoading(true);
        
        const loadBibleChapter = async () => {
            try {
                const res = await fetch(`/api/bible?book=${encodeURIComponent(selectedBook.name)}&chapter=${selectedChapter}`);
                if (!res.ok) throw new Error("API failed");
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setChapterText(data);
            } catch (err) {
                console.warn("API failed, trying local static bible file:", err);
                try {
                    if (!cachedBibleData) {
                        const staticRes = await fetch('/bible/es_rvr.json');
                        if (!staticRes.ok) throw new Error("Static bible not available");
                        cachedBibleData = await staticRes.json();
                    }
                    const bookIdx = BOOK_MAPPING[selectedBook.name];
                    if (bookIdx === undefined) throw new Error("Book index not found");
                    const bookData = cachedBibleData[bookIdx];
                    if (!bookData) throw new Error("Book data not found");
                    const chapterIdx = selectedChapter - 1;
                    const chapterData = bookData.chapters[chapterIdx];
                    if (!chapterData) throw new Error("Chapter data not found");
                    
                    const verses = chapterData.map((v: string, index: number) => ({
                        verse: index + 1,
                        text: v
                    }));
                    
                    setChapterText({
                        reference: `${selectedBook.name} ${selectedChapter}`,
                        verses: verses,
                        text: verses.map((v: any) => `${v.verse} ${v.text}`).join(' ')
                    });
                } catch (staticErr: any) {
                    console.error("Local Bible parsing failed:", staticErr);
                    setChapterText({
                        error: "Offline",
                        reference: `${selectedBook.name} ${selectedChapter}`,
                        verses: [],
                        text: "No se pudo cargar la Biblia en modo offline. Asegúrate de haberla abierto al menos una vez online."
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        loadBibleChapter();
    }, [selectedBook, selectedChapter]);

    // Fetch helpful verses (could be personalized based on user struggles)
    useEffect(() => {
        fetch('/api/verses')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch verses");
                return res.json();
            })
            .then(data => setHelpfulVerses(data))
            .catch(err => {
                console.warn("Error fetching verses, using local fallback:", err);
                setHelpfulVerses(FALLBACK_VERSES);
            });
    }, []);

    const handlePrevChapter = () => {
        if (selectedChapter > 1) {
            setSelectedChapter(selectedChapter - 1);
        }
    };

    const handleNextChapter = () => {
        if (selectedChapter < selectedBook.chapters) {
            setSelectedChapter(selectedChapter + 1);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                {/* Main Bible Reader */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h1 className="h3 mb-0 fw-bold d-flex align-items-center gap-2">
                                    <Book className="text-primary" size={28} />
                                    {t.bible.title}
                                </h1>
                                <Link href="/dashboard" className="btn btn-outline-secondary btn-sm">
                                    {t.bible.back}
                                </Link>
                            </div>

                            {/* Book Selector */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">{t.bible.book}</label>
                                <select
                                    className="form-select"
                                    value={selectedBook.name}
                                    onChange={(e) => {
                                        const book = BIBLE_BOOKS.find(b => b.name === e.target.value);
                                        if (book) {
                                            setSelectedBook(book);
                                            setSelectedChapter(1);
                                        }
                                    }}
                                >
                                    {BIBLE_BOOKS.map(book => (
                                        <option key={book.name} value={book.name}>
                                            {getBibleBookName(book, language)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Chapter Navigation */}
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={handlePrevChapter}
                                    disabled={selectedChapter === 1}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex-grow-1">
                                    <label className="form-label fw-bold mb-1">{t.bible.chapter}</label>
                                    <select
                                        className="form-select"
                                        value={selectedChapter}
                                        onChange={(e) => setSelectedChapter(Number(e.target.value))}
                                    >
                                        {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
                                            <option key={ch} value={ch}>{ch}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={handleNextChapter}
                                    disabled={selectedChapter === selectedBook.chapters}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Chapter Text */}
                            <div className="border-top pt-4">
                                <h4 className="fw-bold mb-3 text-primary">
                                    {getBibleBookName(selectedBook, language)} {selectedChapter}
                                </h4>
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">{t.bible.loading}</span>
                                        </div>
                                    </div>
                                ) : chapterText ? (
                                    <div className="lh-lg">
                                        {chapterText.verses?.map((verse: any, idx: number) => (
                                            <p key={idx} className="mb-2">
                                                <sup className="text-primary fw-bold me-1">{verse.verse}</sup>
                                                {verse.text}
                                            </p>
                                        )) || (
                                                <p className="text-muted">
                                                    {chapterText.text || t.bible.error_loading}
                                                </p>
                                            )}
                                    </div>
                                ) : (
                                    <p className="text-muted">{t.bible.select_chapter}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Helpful Verses */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <Heart className="text-danger" size={20} />
                                {t.bible.helpful_verses}
                            </h5>
                            <p className="small text-muted mb-3">
                                {t.bible.helpful_desc}
                            </p>
                            <div className="d-flex flex-column gap-3">
                                {helpfulVerses.length === 0 ? (
                                    <p className="text-muted small">{t.bible.loading_verses}</p>
                                ) : (
                                    helpfulVerses.map(verse => (
                                        <div key={verse.id} className="border-start border-primary border-3 ps-3">
                                            <p className="small fw-bold text-primary mb-1">{verse.reference}</p>
                                            <p className="small mb-1">{verse.text}</p>
                                            <div className="d-flex gap-1 flex-wrap">
                                                {(verse.tags ?? '').split(',').filter(Boolean).map((tag, idx) => (
                                                    <span key={idx} className="badge bg-light text-dark small">
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

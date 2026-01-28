import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Biblia Digital | Conecta+',
    description: 'Explora las Sagradas Escrituras de forma fácil y accesible. Lee, estudia y medita en la Palabra de Dios diariamente.',
};

import { useState, useEffect } from 'react';
import { Book, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from "@/app/LanguageContext";
import { BIBLE_BOOKS, getBibleBookName } from '@/app/lib/bibleData';

interface BibleVerse {
    id: string;
    reference: string;
    text: string;
    tags: string;
}

export default function BiblePage() {
    const { t, language } = useLanguage();
    const searchParams = useSearchParams();
    const initialBookName = searchParams.get('book');
    const initialChapter = searchParams.get('chapter');

    // Find book by matching any language name ideally, but for now exact match on Spanish name works as default,
    // or we should logic to find book by ID/Name across languages.
    // For simplicity, we assume the URL might have Spanish name OR we default to first book.
    // Ideally URLs should use a stable ID (e.g. genesis), but the app uses names.
    // Only "Display Name" needs to change unless we want to break URLs. 
    // We will keep internal "value" as Spanish name for API compatibility if backend expects Spanish.
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
        // Note: We might need to pass language to API if text needs to be translated.
        // Assuming API might only have Spanish text for now unless we update it.
        // If we want EN/PT text, the backend needs to support it. 
        // For now, we localize the UI.
        fetch(`/api/bible?book=${encodeURIComponent(selectedBook.name)}&chapter=${selectedChapter}`)
            .then(res => res.json())
            .then(data => {
                setChapterText(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching Bible chapter:", err);
                setLoading(false);
            });
    }, [selectedBook, selectedChapter]);

    // Fetch helpful verses (could be personalized based on user struggles)
    useEffect(() => {
        fetch('/api/verses')
            .then(res => res.json())
            .then(data => setHelpfulVerses(data))
            .catch(err => console.error("Error fetching verses:", err));
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
                                                {verse.tags.split(',').map((tag, idx) => (
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

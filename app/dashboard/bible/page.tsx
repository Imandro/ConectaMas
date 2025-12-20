"use client";

import { useState, useEffect } from 'react';
import { Book, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import Link from 'next/link';

interface BibleVerse {
    id: string;
    reference: string;
    text: string;
    tags: string;
}

const BIBLE_BOOKS = [
    // Old Testament
    { name: "Génesis", chapters: 50 },
    { name: "Éxodo", chapters: 40 },
    { name: "Salmos", chapters: 150 },
    { name: "Proverbios", chapters: 31 },
    { name: "Isaías", chapters: 66 },
    // New Testament
    { name: "Mateo", chapters: 28 },
    { name: "Marcos", chapters: 16 },
    { name: "Lucas", chapters: 24 },
    { name: "Juan", chapters: 21 },
    { name: "Romanos", chapters: 16 },
    { name: "1 Corintios", chapters: 16 },
    { name: "Filipenses", chapters: 4 },
    { name: "Santiago", chapters: 5 },
    { name: "1 Juan", chapters: 5 },
    { name: "Apocalipsis", chapters: 22 },
];

export default function BiblePage() {
    const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[0]);
    const [selectedChapter, setSelectedChapter] = useState(1);
    const [chapterText, setChapterText] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [helpfulVerses, setHelpfulVerses] = useState<BibleVerse[]>([]);

    // Fetch chapter text
    useEffect(() => {
        if (!selectedBook || !selectedChapter) return;

        setLoading(true);
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
                                    La Biblia
                                </h1>
                                <Link href="/dashboard" className="btn btn-outline-secondary btn-sm">
                                    Volver
                                </Link>
                            </div>

                            {/* Book Selector */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Libro</label>
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
                                            {book.name}
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
                                    <label className="form-label fw-bold mb-1">Capítulo</label>
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
                                    {selectedBook.name} {selectedChapter}
                                </h4>
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Cargando...</span>
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
                                                    {chapterText.text || "No se pudo cargar el texto."}
                                                </p>
                                            )}
                                    </div>
                                ) : (
                                    <p className="text-muted">Selecciona un libro y capítulo.</p>
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
                                Versículos de Ayuda (NTV)
                            </h5>
                            <p className="small text-muted mb-3">
                                Versículos específicos para tus luchas
                            </p>
                            <div className="d-flex flex-column gap-3">
                                {helpfulVerses.length === 0 ? (
                                    <p className="text-muted small">Cargando versículos...</p>
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

"use client";

import Link from 'next/link';
import { Clock, BookOpen, Heart } from 'lucide-react';
import { devotionalsData } from '@/app/lib/devotionalsData';
import { useState } from 'react';

const categories = ['Para ti', 'Ansiedad', 'Identidad', 'Integridad', 'Fe', 'Relaciones', 'Oración', 'Soledad', 'Culpa', 'Ira', 'Envidia', 'Comunidad'];

export default function DevotionalsPage() {
    const [selectedCategory, setSelectedCategory] = useState('Para ti');

    const filteredDevotionals = selectedCategory === 'Para ti'
        ? devotionalsData
        : devotionalsData.filter(dev => dev.category === selectedCategory);

    return (
        <div className="animate-fade-in">
            <h2 className="fw-bold text-secondary mb-4">Devocionales</h2>

            {/* Categories Filter (Scrollable) */}
            <div className="d-flex gap-2 overflow-auto pb-2 mb-4 no-scrollbar">
                {categories.map((cat, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedCategory(cat)}
                        className={`btn btn-sm rounded-pill px-3 flex-shrink-0 transition-all ${selectedCategory === cat ? 'btn-primary text-white shadow-sm' : 'btn-light text-secondary border-0'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="row g-3">
                {filteredDevotionals.length > 0 ? (
                    filteredDevotionals.map((dev) => (
                        <div key={dev.id} className="col-12 col-md-6">
                            <Link href={`/dashboard/devotionals/${dev.id}`} className="card border-0 shadow-sm text-decoration-none hover-scale h-100">
                                <div className="d-flex h-100">
                                    {/* Thumbnail Placeholder */}
                                    <div className={`rounded-start py-5 px-4 d-flex align-items-center justify-content-center ${dev.image}`} style={{ width: '100px' }}>
                                        <BookOpen className="text-secondary opacity-50" size={32} />
                                    </div>
                                    <div className="card-body py-3">
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <span className="badge bg-light text-secondary rounded-pill fw-normal">{dev.category}</span>
                                            <Heart size={16} className="text-muted" />
                                        </div>
                                        <h6 className="fw-bold text-dark mb-1 lh-base">{dev.title}</h6>
                                        <div className="d-flex align-items-center text-muted small mt-auto">
                                            <Clock size={14} className="me-1" />
                                            {dev.time} lectura
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted">No hay devocionales en esta categoría aún.</p>
                        <button onClick={() => setSelectedCategory('Para ti')} className="btn btn-sm btn-outline-secondary rounded-pill">
                            Ver todos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import Link from 'next/link';
import { Clock, BookOpen, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { devotionalsData } from '@/app/lib/devotionalsData';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const categories = ['Para ti', 'Ansiedad', 'Identidad', 'Integridad', 'Fe', 'Relaciones', 'Oración', 'Soledad', 'Culpa', 'Ira', 'Envidia', 'Comunidad'];

export default function DevotionalsPage() {
    const [selectedCategory, setSelectedCategory] = useState('Para ti');
    const [recommendedDevotionals, setRecommendedDevotionals] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

    // Safe session hook - may be undefined during build
    let session;
    try {
        const sessionData = useSession();
        session = sessionData?.data;
    } catch (e) {
        // Session provider not available during build
        session = null;
    }

    // Calculate recommended devotionals based on user struggles
    useEffect(() => {
        if (session?.user) {
            const userEmail = (session.user as any).email;

            if (!userEmail) return;

            // Fetch user profile to get struggles
            fetch(`/api/user/profile?email=${userEmail}`)
                .then(res => res.json())
                .then(userData => {
                    const sins = userData.sinsToOvercome ? JSON.parse(userData.sinsToOvercome) : [];
                    const problems = userData.problemsFaced ? JSON.parse(userData.problemsFaced) : [];
                    const userStruggles = [...sins, ...problems];

                    // Filter devotionals that match user struggles
                    const recommended = devotionalsData.filter(dev =>
                        userStruggles.some((struggle: string) =>
                            dev.category.toLowerCase().includes(struggle.toLowerCase()) ||
                            dev.title.toLowerCase().includes(struggle.toLowerCase())
                        )
                    );

                    setRecommendedDevotionals(recommended.slice(0, 4)); // Limit to 4
                })
                .catch(err => console.error("Error fetching user profile:", err));
        }
    }, [session]);

    const filteredDevotionals = selectedCategory === 'Para ti'
        ? devotionalsData
        : devotionalsData.filter(dev => dev.category === selectedCategory);

    const getGroupName = (title: string) => {
        if (title.includes(':')) return title.split(':')[0].trim();
        const regex = /\s+D[íi]a\s+/i;
        if (regex.test(title)) return title.split(regex)[0].trim();
        return title;
    };

    const groupedDevs: Record<string, any[]> = {};
    const displayItems: any[] = [];

    filteredDevotionals.forEach(dev => {
        const groupName = getGroupName(dev.title);
        if (groupName !== dev.title) {
            if (!groupedDevs[groupName]) groupedDevs[groupName] = [];
            groupedDevs[groupName].push(dev);
        } else {
            displayItems.push(dev);
        }
    });

    Object.entries(groupedDevs).forEach(([name, devs]) => {
        if (devs.length > 1) {
            displayItems.push({ type: 'group', name, devotionals: devs });
        } else {
            displayItems.push(...devs);
        }
    });

    return (
        <div className="animate-fade-in">
            <h2 className="fw-bold text-secondary mb-4">Devocionales</h2>

            {/* Recommended Section */}
            {recommendedDevotionals.length > 0 && (
                <div className="mb-5">
                    <h5 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                        <Sparkles size={20} />
                        Recomendados para ti
                    </h5>
                    <div className="row g-3 mb-4">
                        {recommendedDevotionals.map((dev) => (
                            <div key={dev.id} className="col-12 col-md-6">
                                <Link href={`/dashboard/devotionals/${dev.id}`} className="card border-primary border-2 shadow-sm text-decoration-none hover-scale h-100">
                                    <div className="d-flex h-100">
                                        <div className={`rounded-start py-5 px-4 d-flex align-items-center justify-content-center ${dev.image}`} style={{ width: '100px', backgroundColor: '#f8f9fa' }}>
                                            <BookOpen className="text-secondary opacity-50" size={32} />
                                        </div>
                                        <div className="card-body py-3">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <span className="badge bg-primary text-white rounded-pill fw-normal">{dev.category}</span>
                                                <Heart size={16} className="text-danger" />
                                            </div>
                                            <h6 className="fw-bold text-dark mb-1">{dev.title}</h6>
                                            <div className="d-flex align-items-center text-muted small mt-auto">
                                                <Clock size={14} className="me-1" />
                                                {dev.time} lectura
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories Filter */}
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
                {displayItems.length > 0 ? (
                    displayItems.map((item, idx) => {
                        if (item.type === 'group') {
                            return (
                                <div key={`group-${idx}`} className="col-12 col-md-6">
                                    <div className="card border-0 shadow-sm hover-scale h-100 cursor-pointer"
                                        onClick={() => setSelectedGroup(item)}>
                                        <div className="d-flex h-100">
                                            <div className="bg-primary-subtle text-primary rounded-start py-5 px-4 d-flex align-items-center justify-content-center" style={{ width: '100px' }}>
                                                <BookOpen size={32} />
                                            </div>
                                            <div className="card-body py-3 d-flex flex-column justify-content-center">
                                                <h6 className="fw-bold text-dark mb-1">{item.name}</h6>
                                                <p className="text-muted small m-0">{item.devotionals.length} días de contenido</p>
                                            </div>
                                            <div className="d-flex align-items-center px-3 text-muted">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        const dev = item;
                        return (
                            <div key={dev.id} className="col-12 col-md-6">
                                <Link href={`/dashboard/devotionals/${dev.id}`} className="card border-0 shadow-sm text-decoration-none hover-scale h-100">
                                    <div className="d-flex h-100">
                                        <div className={`rounded-start py-5 px-4 d-flex align-items-center justify-content-center ${dev.image}`} style={{ width: '100px', backgroundColor: '#f8f9fa' }}>
                                            <BookOpen className="text-secondary opacity-50" size={32} />
                                        </div>
                                        <div className="card-body py-3">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <span className="badge bg-light text-secondary rounded-pill fw-normal">{dev.category}</span>
                                                <Heart size={16} className="text-muted" />
                                            </div>
                                            <h6 className="fw-bold text-dark mb-1">{dev.title}</h6>
                                            <div className="d-flex align-items-center text-muted small mt-auto">
                                                <Clock size={14} className="me-1" />
                                                {dev.time} lectura
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted">No hay devocionales en esta categoría aún.</p>
                        <button onClick={() => setSelectedCategory('Para ti')} className="btn btn-sm btn-outline-secondary rounded-pill">
                            Ver todos
                        </button>
                    </div>
                )}
            </div>

            {/* Custom React Modal for Groups */}
            {selectedGroup && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-white rounded-5 shadow-lg w-100 overflow-hidden" style={{ maxWidth: '500px' }}>
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light">
                            <h5 className="fw-bold m-0 text-primary">{selectedGroup.name}</h5>
                            <button onClick={() => setSelectedGroup(null)} className="btn-close"></button>
                        </div>
                        <div className="p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <p className="text-muted small mb-3">Selecciona un día para continuar:</p>
                            <div className="list-group gap-2">
                                {selectedGroup.devotionals.map((dev: any, dIdx: number) => (
                                    <Link
                                        key={dev.id}
                                        href={`/dashboard/devotionals/${dev.id}`}
                                        className="list-group-item list-group-item-action border-0 rounded-4 bg-light d-flex align-items-center justify-content-between p-3"
                                        onClick={() => setSelectedGroup(null)}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: '24px', height: '24px' }}>{dIdx + 1}</span>
                                            <span className="fw-bold text-dark">{dev.title}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-muted" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="p-3 text-center bg-light">
                            <button onClick={() => setSelectedGroup(null)} className="btn btn-primary rounded-pill px-4">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

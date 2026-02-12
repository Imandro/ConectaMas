"use client";

import { useEffect, useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import ResourceCard from '@/app/components/ResourceCard';

interface Resource {
    id: string;
    title: string;
    description: string;
    type: string;
    url: string;
    category: string;
    downloadCount: number;
    isPremium: boolean;
}

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        'Todos',
        'Estudio Bíblico',
        'Oración',
        'Devocionales',
        'Crecimiento Personal',
        'Consejería',
    ];

    const types = [
        { value: '', label: 'Todos los tipos' },
        { value: 'PDF', label: '📄 PDF' },
        { value: 'VIDEO', label: '🎥 Video' },
        { value: 'AUDIO', label: '🎧 Audio' },
        { value: 'GUIDE', label: '📖 Guía' },
        { value: 'WORKSHEET', label: '📝 Hoja de Trabajo' },
    ];

    useEffect(() => {
        fetchResources();
    }, [selectedCategory, selectedType]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory && selectedCategory !== 'Todos') {
                params.append('category', selectedCategory);
            }
            if (selectedType) {
                params.append('type', selectedType);
            }

            const res = await fetch(`/api/resources?${params.toString()}`);
            const data = await res.json();
            setResources(data.resources || []);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResources = resources.filter((resource) =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <header className="mb-4">
                <h1 className="fw-extrabold text-dark mb-2" style={{ fontSize: '2.5rem' }}>
                    📦 Biblioteca de Recursos
                </h1>
                <p className="text-muted fs-5">
                    Guías, estudios y materiales para tu crecimiento espiritual
                </p>
            </header>

            {/* Search Bar */}
            <div className="card border-0 shadow-sm mb-4 bg-white" style={{ borderRadius: '20px' }}>
                <div className="card-body p-3">
                    <div className="input-group">
                        <span className="input-group-text bg-transparent border-0">
                            <Search size={20} className="text-muted" />
                        </span>
                        <input
                            type="text"
                            className="form-control border-0 bg-transparent"
                            placeholder="Buscar recursos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="row g-3 mb-4">
                {/* Category Filter */}
                <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <Filter size={18} className="text-muted" />
                        <span className="fw-bold text-secondary">Categorías</span>
                    </div>
                    <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category === 'Todos' ? '' : category)}
                                className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap ${(category === 'Todos' && !selectedCategory) ||
                                        selectedCategory === category
                                        ? 'btn-primary'
                                        : 'btn-light text-dark'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Type Filter */}
                <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <Filter size={18} className="text-muted" />
                        <span className="fw-bold text-secondary">Tipo de Recurso</span>
                    </div>
                    <select
                        className="form-select rounded-pill px-4 py-2"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        {types.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            ) : (
                <section>
                    {filteredResources.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted">No se encontraron recursos</p>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {filteredResources.map((resource) => (
                                <div key={resource.id} className="col-12 col-md-6 col-lg-4">
                                    <ResourceCard resource={resource} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

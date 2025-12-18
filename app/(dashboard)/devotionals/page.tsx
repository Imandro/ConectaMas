import Link from 'next/link';
import { Clock, BookOpen, Heart } from 'lucide-react';

const devotionals = [
    { id: '1', title: 'Cuando la ansiedad ataca', category: 'Ansiedad', time: '3 min', image: 'bg-primary-subtle' },
    { id: '2', title: 'Identidad en Cristo', category: 'Identidad', time: '5 min', image: 'bg-info-subtle' },
    { id: '3', title: 'Perdonar es soltar', category: 'Renunciar', time: '4 min', image: 'bg-warning-subtle' },
    { id: '4', title: 'Pureza en un mundo sucio', category: 'Integridad', time: '6 min', image: 'bg-danger-subtle' },
];

export default function DevotionalsPage() {
    return (
        <div className="animate-fade-in">
            <h2 className="fw-bold text-secondary mb-4">Devocionales</h2>

            {/* Categories Filter (Scrollable) */}
            <div className="d-flex gap-2 overflow-auto pb-2 mb-4 no-scrollbar">
                {['Para ti', 'Ansiedad', 'Identidad', 'Pureza', 'Fe', 'Relaciones'].map((cat, i) => (
                    <button key={i} className={`btn btn-sm rounded-pill px-3 flex-shrink-0 ${i === 0 ? 'btn-primary text-white' : 'btn-light text-secondary'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="row g-3">
                {devotionals.map((dev) => (
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
                ))}
            </div>
        </div>
    );
}

import Link from 'next/link';
import { ArrowLeft, Share2, CheckCircle2 } from 'lucide-react';

export default function DevotionalDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="animate-fade-in pb-5">
            {/* Top Nav */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link href="/dashboard/devotionals" className="btn btn-light rounded-circle p-2 shadow-sm">
                    <ArrowLeft size={24} />
                </Link>
                <div className="d-flex gap-2">
                    <button className="btn btn-light rounded-circle p-2 shadow-sm">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Header */}
            <span className="badge bg-primary-subtle text-primary mb-2">Ansiedad</span>
            <h1 className="fw-bold mb-3 display-6">Cuando la ansiedad ataca</h1>

            <div className="d-flex align-items-center gap-3 text-muted mb-4 border-bottom pb-4">
                {/* Author/Date */}
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-secondary rounded-circle" style={{ width: '24px', height: '24px' }}></div>
                    <small>Pastor J.</small>
                </div>
                <small>•</small>
                <small>3 min lectura</small>
            </div>

            {/* Content */}
            <article className="typography-article mb-5 text-secondary">
                <p className="lead text-dark fw-medium">
                    "Echad toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros." - 1 Pedro 5:7
                </p>
                <p>
                    A veces sentimos que la ansiedad es un monstruo gigante que no podemos controlar. Nos despierta en la noche, nos acelera el corazón y nos roba la paz. Pero la ansiedad no es tu identidad.
                </p>
                <p>
                    Pedro nos dice que "echemos" nuestra ansiedad. La palabra griega implica un lanzamiento fuerte, decidido. No es "dejar caer", es arrojarla lejos de nosotros y ponerla sobre los hombros fuertes de Jesús.
                </p>
                <h5 className="fw-bold text-dark mt-4">Aplicación Práctica</h5>
                <ul className="list-unstyled d-flex flex-column gap-2 mt-3">
                    <li className="d-flex gap-2">
                        <div className="mt-1 d-flex align-items-center justify-content-center bg-success text-white rounded-circle" style={{ width: '20px', height: '20px', fontSize: '10px' }}>1</div>
                        <span>Escribe lo que te preocupa en un papel.</span>
                    </li>
                    <li className="d-flex gap-2">
                        <div className="mt-1 d-flex align-items-center justify-content-center bg-success text-white rounded-circle" style={{ width: '20px', height: '20px', fontSize: '10px' }}>2</div>
                        <span>Ora entregando cada punto a Dios.</span>
                    </li>
                    <li className="d-flex gap-2">
                        <div className="mt-1 d-flex align-items-center justify-content-center bg-success text-white rounded-circle" style={{ width: '20px', height: '20px', fontSize: '10px' }}>3</div>
                        <span>Rompe el papel como símbolo de fe.</span>
                    </li>
                </ul>
            </article>

            {/* Completion Action */}
            <div className="card bg-light border-0 p-4 text-center rounded-4">
                <h5 className="fw-bold mb-3">¿Terminaste por hoy?</h5>
                <button className="btn btn-primary btn-lg rounded-pill px-5 text-white shadow-sm hover-scale">
                    <CheckCircle2 className="me-2" />
                    Marcar como Completado
                </button>
            </div>

        </div>
    );
}

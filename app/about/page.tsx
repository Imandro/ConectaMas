import Link from 'next/link';
import Image from 'next/image';
import { Heart, Shield, Zap, Users, BookOpen, Star } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-vh-100 bg-light p-4 p-md-5">
            <div className="container max-width-1000 mx-auto">
                <div className="text-center mb-5 animate-fade-in">
                    <h1 className="display-4 fw-bold text-secondary font-fredoka">¿Qué es Conecta+?</h1>
                    <p className="lead text-muted">Más que una app, tu compañero en el camino de la libertad espiritual.</p>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100 p-4" style={{ borderRadius: '24px' }}>
                            <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                <Star className="text-warning" size={32} />
                            </div>
                            <h3 className="h4 fw-bold text-secondary">¿Porque es súper buena?</h3>
                            <p className="text-muted">
                                Conecta+ está diseñada específicamente para jóvenes que enfrentan desafíos modernos. No juzgamos; acompañamos.
                                Combinamos la sabiduría bíblica con una interfaz moderna y gamificada que hace que el crecimiento espiritual sea constante y motivador.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100 p-4" style={{ borderRadius: '24px' }}>
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                <Shield className="text-primary" size={32} />
                            </div>
                            <h3 className="h4 fw-bold text-secondary">Privacidad 100%</h3>
                            <p className="text-muted">
                                Entendemos que algunos temas son difíciles de hablar. En Conecta+, tu progreso y tus luchas son privadas,
                                o puedes compartirlas de forma anónima en nuestra comunidad segura.
                            </p>
                        </div>
                    </div>
                </div>

                <h2 className="text-center mb-4 fw-bold text-secondary font-fredoka">Funciones Principales</h2>

                <div className="row g-4 mb-5">
                    {[
                        { icon: <Zap className="text-warning" />, title: "Planes de 21 Días", desc: "Guías paso a paso para vencer la ansiedad, la lujuria y más." },
                        { icon: <Heart className="text-danger" />, title: "Llami tu Mascota", desc: "Cuida de Llami mientras te cuidas a ti mismo. ¡Gana puntos de llama!" },
                        { icon: <Users className="text-info" />, title: "Foros Seguros", desc: "Comparte con otros jóvenes que están pasando por lo mismo." },
                        { icon: <BookOpen className="text-success" />, title: "Biblia NTV", desc: "Versículos seleccionados específicamente para tus necesidades." }
                    ].map((feat, idx) => (
                        <div key={idx} className="col-md-3">
                            <div className="text-center p-3">
                                <div className="mb-3">{feat.icon}</div>
                                <h4 className="h6 fw-bold">{feat.title}</h4>
                                <p className="extra-small text-muted">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-5">
                    <Link href="/" className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}

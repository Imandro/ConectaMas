"use client";

import { Gift, Heart } from "lucide-react";
import Image from "next/image";

export default function SupportFundingAd() {
    return (
        <div className="card border-0 shadow-sm bg-dark text-white overflow-hidden position-relative animate-fade-in-up">
            {/* Background elements */}
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
                <Gift size={120} className="text-secondary" />
            </div>

            <div className="card-body p-4 position-relative z-10">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="position-relative">
                        <div className="rounded-circle overflow-hidden border border-2 border-warning shadow-sm" style={{ width: '60px', height: '60px' }}>
                            <Image
                                src="/images/mario-profile.jpg"
                                alt="Mario Alvarez"
                                width={60}
                                height={60}
                                className="w-100 h-100 object-fit-cover"
                            />
                        </div>
                        <div className="position-absolute bottom-0 end-0 bg-warning text-dark rounded-circle p-1 border border-dark">
                            <Heart size={12} fill="currentColor" />
                        </div>
                    </div>
                    <div>
                        <h5 className="fw-bold m-0 text-white">Hola, soy Mario Alvarez</h5>
                        <p className="small text-white-50 m-0">Desarrollador de Conecta+</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="small text-white-50 lh-base mb-3">
                        Estoy desarrollando esta app con todo mi corazón para Dios y para esta generación que tanto necesita de Él.
                        Mi sueño es llevar <strong>Conecta+ a la Google Play Store</strong> para alcanzar a miles de jóvenes más.
                    </p>

                    <div className="bg-white bg-opacity-10 p-2 rounded-3 border border-white-10 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="small fw-bold text-warning">Meta: Licencia Google Play</span>
                            <span className="fw-bold text-dark">$25 USD</span>
                        </div>
                        <p className="extra-small text-dark m-0">
                            Solo soy yo trabajando en esto, y tu granito de arena hace una diferencia enorme.
                        </p>
                    </div>
                </div>

                <a
                    href="https://www.paypal.me/Imandrox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-warning w-100 fw-bold rounded-pill text-dark shadow-sm py-3 hover-scale"
                    style={{ backgroundColor: '#f3b33e', border: 'none' }}
                >
                    <Gift size={18} className="me-2" />
                    ¡Apoyar con mi granito de arena!
                </a>
            </div>
        </div>
    );
}

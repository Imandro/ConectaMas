"use client";

import { Gift, Heart, Crown, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function SupportFundingAd() {
    const sessionContext = useSession();
    const session = sessionContext?.data;
    const isPremium = (session?.user as any)?.isPremium;

    if (isPremium) return null;

    return (
        <div className="card border-0 shadow-lg bg-dark text-white overflow-hidden position-relative animate-fade-in-up" style={{ borderRadius: '24px' }}>
            {/* Background elements */}
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
                <Crown size={120} className="text-warning rotate-12" />
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
                        <h5 className="fw-bold m-0 text-white">Sustenta Conecta+ Premium</h5>
                        <p className="small text-white-50 m-0">Aporta tu granito de arena por solo $1 al mes</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="small text-white-50 lh-base mb-3">
                        Tu apoyo me ayuda a mantener los servidores y llevar la palabra de Dios a más jóvenes.
                        Al ser <strong>Premium</strong>, tendrás una experiencia 100% libre de anuncios y me ayudarás a alcanzar la meta de la Google Play Store.
                    </p>

                    <div className="row g-2 mb-3">
                        <div className="col-12">
                            <div className="bg-white bg-opacity-10 p-2 rounded-3 border border-white-10 d-flex align-items-center gap-2">
                                <ShieldCheck size={18} className="text-warning" />
                                <span className="small">Sin anuncios de Google en toda la app</span>
                            </div>
                        </div>
                    </div>
                </div>

                <a
                    href="https://www.paypal.me/Imandrox/1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-warning w-100 fw-bold rounded-pill text-dark shadow-sm py-3 hover-scale d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#f3b33e', border: 'none' }}
                >
                    <Crown size={20} />
                    ¡Ser Premium por $1 USD!
                </a>
                <p className="text-center extra-small text-white-50 mt-3 mb-0">
                    *Al donar, mándame tu email por PayPal para activar tu insignia.
                </p>
            </div>
        </div>
    );
}

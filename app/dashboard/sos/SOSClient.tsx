"use client";

import Link from 'next/link';
import { X, Phone, BookHeart } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/app/LanguageContext';
import { getSOSContent } from '@/app/lib/sosData';

interface SOSClientProps {
    leaderPhone: string | null;
}

export default function SOSClient({ leaderPhone }: SOSClientProps) {
    const { t, language } = useLanguage();
    const [showTruths, setShowTruths] = useState(false);
    const [randomTruths, setRandomTruths] = useState<string[]>([]);
    const [showPrayer, setShowPrayer] = useState(false);
    const [currentPrayer, setCurrentPrayer] = useState('');

    const { prayers, truths } = getSOSContent(language);

    const handleShowTruths = () => {
        const shuffled = [...truths].sort(() => 0.5 - Math.random());
        setRandomTruths(shuffled.slice(0, 5));
        setShowTruths(true);
    };

    const handleShowPrayer = () => {
        const randomIndex = Math.floor(Math.random() * prayers.length);
        setCurrentPrayer(prayers[randomIndex]);
        setShowPrayer(true);
    };

    return (
        <div className="min-vh-100 bg-primary text-white d-flex flex-column p-4 position-relative overflow-hidden">
            <div className="d-flex justify-content-end mb-4 position-relative z-1">
                <Link href="/dashboard" className="btn btn-outline-light rounded-circle p-2 border-0">
                    <X size={32} />
                </Link>
            </div>

            <div className={`flex-grow-1 d-flex flex-column justify-content-start pt-5 position-relative z-1`}>

                <h1 className="display-4 fw-bold mb-4 text-white">{t.sos.title}</h1>

                {/* Spiritual Context Section for AdSense/Value */}
                <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-5 p-4 mb-4 border border-white-10 animate-fade-in-up">
                    <h2 className="h5 fw-bold text-warning mb-2">Pausa y Reconecta</h2>
                    <p className="small lh-base text-white opacity-90 mb-0">
                        La ansiedad y la tentación a menudo nos roban la perspectiva. Este espacio ha sido diseñado específicamente para ayudarte a recuperar el aliento espiritual. Antes de actuar, recuerda: Dios sigue en el trono y Su gracia es suficiente para ti hoy. Usa estas herramientas para silenciar el ruido y escuchar Su voz.
                    </p>
                </div>

                <p className="lead mb-5 opacity-75 animate-fade-in-up delay-100">
                    {t.sos.subtitle}
                </p>

                {!showTruths ? (
                    <div className="d-grid gap-3 animate-fade-in-up delay-200">
                        <button
                            onClick={handleShowTruths}
                            className="btn bg-white btn-lg shadow-sm text-primary d-flex align-items-center justify-content-start gap-3 p-3 hover-scale transition-all"
                        >
                            <BookHeart size={24} className="text-secondary" />
                            <div className="text-start">
                                <span className="d-block fw-bold">{t.sos.promise_btn}</span>
                                <small className="opacity-75">{t.sos.promise_desc}</small>
                            </div>
                        </button>

                        <button
                            onClick={handleShowPrayer}
                            className="btn bg-white btn-lg shadow-sm text-primary d-flex align-items-center justify-content-start gap-3 p-3 hover-scale transition-all"
                        >
                            <BookHeart size={24} className="text-info" />
                            <div className="text-start">
                                <span className="d-block fw-bold">{t.sos.prayer_btn}</span>
                                <small className="opacity-75">{t.sos.prayer_desc}</small>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                if (leaderPhone) {
                                    window.location.href = `tel:${leaderPhone}`;
                                } else {
                                    alert(t.sos.no_leader);
                                }
                            }}
                            className="btn btn-outline-light btn-lg border-2 d-flex align-items-center justify-content-start gap-3 p-3 w-100 hover-scale transition-all"
                        >
                            <Phone size={24} />
                            <div className="text-start">
                                <span className="d-block fw-bold">{t.sos.call_btn}</span>
                                <small>{t.sos.call_desc}</small>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-5 p-4 border border-white-50">
                            <h3 className="fw-bold mb-4 d-flex align-items-center gap-2 text-white"><BookHeart size={28} /> {t.sos.truths_title}</h3>
                            <ul className="list-unstyled p-0 m-0 d-flex flex-column gap-3">
                                {randomTruths.map((truth, idx) => (
                                    <li key={idx} className="d-flex gap-3 align-items-start bg-white bg-opacity-10 p-3 rounded-4 border border-white-25">
                                        <span className="fw-bold text-warning user-select-none fs-5">{idx + 1}.</span>
                                        <span className="lh-base fw-medium fs-5 text-white">{truth}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setShowTruths(false)}
                                className="btn btn-light w-100 fw-bold py-3 mt-4 rounded-pill text-primary hover-scale shadow-sm"
                            >
                                {t.sos.back}
                            </button>
                        </div>
                    </div>
                )}

                {showPrayer && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 mt-3">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-5 p-4 border border-white-50">
                            <h3 className="fw-bold mb-4 d-flex align-items-center gap-2 text-white"><BookHeart size={28} /> {t.sos.prayer_title}</h3>
                            <div className="bg-white bg-opacity-10 p-4 rounded-4 border border-white-25 mb-4">
                                <p className="lh-lg fw-medium fs-5 text-white m-0 text-center" style={{ fontStyle: 'italic' }}>
                                    &quot;{currentPrayer}&quot;
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPrayer(false)}
                                className="btn btn-light w-100 fw-bold py-3 rounded-pill text-primary hover-scale shadow-sm"
                            >
                                {t.sos.back}
                            </button>
                        </div>
                    </div>
                )}

            </div>

            <div className="mt-4 text-center pb-4 opacity-50 hover-opacity-100 transition-all">
                <div className="bg-white bg-opacity-10 p-3 rounded-4 mb-3 mx-auto" style={{ maxWidth: '600px' }}>
                    <h4 className="small fw-bold text-warning text-uppercase mb-2">Acompañamiento Integral</h4>
                    <p className="extra-small text-white opacity-75 m-0 lh-base">
                        Entendemos que hay momentos donde el peso parece insoportable. Conecta+ provee estas herramientas como un primer auxilio espiritual, pero te animamos a buscar acompañamiento pastoral y profesional si el riesgo es inminente. La comunidad de fe está para llevar las cargas los unos de los otros.
                    </p>
                </div>
                <div className="bg-white bg-opacity-10 p-2 rounded-3 d-inline-block">
                    <p className="extra-small text-white-50 m-0" style={{ fontSize: '10px' }}>
                        {t.sos.disclaimer}
                    </p>
                </div>
            </div>
        </div>
    );
}

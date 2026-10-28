"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Crown, Gift, ShieldCheck, Coffee, DollarSign, Users, Globe } from "lucide-react";
import { motion } from "framer-motion";
import SecondaryPageShell from "@/app/components/SecondaryUI";
import BillingCheckoutButton from "@/app/dashboard/components/BillingCheckoutButton";
import PaypalReturnHandler from "@/app/dashboard/components/PaypalReturnHandler";

const supporters = [
    { name: "Marvin Cruz Alvarado", amount: "Donó", flag: "🇳🇮" },
    { name: "+24 colaboradores", amount: "", flag: "🌎" },
];

export default function SupportPage() {
    return (
        <SecondaryPageShell>
        <PaypalReturnHandler />
        <div className="min-vh-100" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
            <div className="container py-4">
                <div className="mx-auto" style={{ maxWidth: 680 }}>
                    <div className="ui-page-header mb-4">
                        <Link href="/dashboard" className="btn btn-white bg-white text-dark rounded-circle p-2 shadow-sm border-0">
                            <ArrowLeft size={22} />
                        </Link>
                        <h1 className="h4 mb-0 fw-bold text-primary">Apoyar el Proyecto</h1>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="card border-0 shadow-lg overflow-hidden mb-4" style={{ backgroundColor: 'var(--challenge-bg, var(--brand-primary))' }}>
                            <div className="position-relative p-4 text-center text-white">
                                <div className="position-absolute top-0 end-0 p-3 opacity-10">
                                    <Crown size= {160} />
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="d-inline-flex align-items-center justify-content-center bg-warning bg-opacity-20 rounded-circle mb-3"
                                    style={{ width: 88, height: 88 }}
                                >
                                    <Heart size={40} fill="#f59e0b" color="#f59e0b" />
                                </motion.div>
                                <h2 className="fw-bold mb-2">Conecta+ es gratis ❤️</h2>
                                <p className="text-white-70 mb-0 mx-auto" style={{ maxWidth: 480 }}>
                                    Cada aporte nos ayuda a mantener los servidores, pagar la licencia de Play Store
                                    y llevar esperanza a más jóvenes en Latinoamérica.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 20 }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div className="bg-warning bg-opacity-10 p-3 rounded-3">
                                                <DollarSign size={28} className="text-warning" />
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-0">PayPal</h5>
                                                <small className="text-muted">Transferencia rápida</small>
                                            </div>
                                        </div>
                                        <p className="small text-muted mb-3">Apoyo único de $2 USD. El checkout confirma el pago automáticamente.</p>
                                        <BillingCheckoutButton productCode="SUPPORT_ONE_TIME" label="Apoyo único" className="btn btn-warning w-100 rounded-pill fw-bold py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm" />
                                        <div className="mt-2"><BillingCheckoutButton productCode="SUPPORT_MONTHLY" label="Apoyo mensual" className="btn btn-outline-primary w-100 rounded-pill fw-bold py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm" /></div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="col-md-6"><div className="card border-0 shadow-sm h-100" style={{ borderRadius: 20 }}><div className="card-body p-4"><div className="d-flex align-items-center gap-3 mb-3"><div className="bg-primary bg-opacity-10 p-3 rounded-3"><Globe size={28} className="text-primary" /></div><div><h5 className="fw-bold mb-0">Pagadito</h5><small className="text-muted">Disponible según país</small></div></div><p className="small text-muted mb-0">El método disponible aparece dentro del checkout. No compartimos datos bancarios en la app.</p></div></div></div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 20 }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <Gift size={20} className="text-warning" />
                                    ¿Por qué apoyar?
                                </h5>
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <div className="d-flex gap-2 align-items-start">
                                            <ShieldCheck size={18} className="text-success mt-1 shrink-0" />
                                            <div>
                                                <strong className="small d-block">Sin anuncios</strong>
                                                <small className="text-muted">Experiencia 100% libre de publicidad</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="d-flex gap-2 align-items-start">
                                            <Globe size={18} className="text-primary mt-1 shrink-0" />
                                            <div>
                                                <strong className="small d-block">Misiones activas</strong>
                                                <small className="text-muted">Brasil y Nicaragua</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="d-flex gap-2 align-items-start">
                                            <Users size={18} className="text-info mt-1 shrink-0" />
                                            <div>
                                                <strong className="small d-block">Comunidad</strong>
                                                <small className="text-muted">+200 jóvenes alcanzados</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="d-flex gap-2 align-items-start">
                                            <Coffee size={18} className="text-warning mt-1 shrink-0" />
                                            <div>
                                                <strong className="small d-block">Desarrollo continuo</strong>
                                                <small className="text-muted">Nuevas funciones cada mes</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 20 }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <Heart size={18} className="text-danger" />
                                    Colaboradores
                                </h5>
                                <div className="d-flex flex-column gap-2">
                                    {supporters.map((s, i) => (
                                        <div key={i} className="d-flex align-items-center gap-3 bg-light rounded-3 p-3">
                                            <span className="fs-5">{s.flag}</span>
                                            <div>
                                                <strong className="small d-block">{s.name}</strong>
                                                {s.amount && <small className="text-success fw-bold">{s.amount}</small>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-center text-muted extra-small mt-3 mb-0">
                                    ¿Donaste y no apareces? Escríbeme por Telegram o WhatsApp.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center pb-4">
                        <Link href="/dashboard" className="btn btn-outline-primary rounded-pill px-4 py-2">
                            Volver al inicio
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
        </SecondaryPageShell>
    );
}

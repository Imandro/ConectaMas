"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Download,
    Flame,
    BookOpen,
    AlertTriangle,
    Users,
    ChevronRight,
    PlayCircle,
    Info
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/app/LanguageContext';

export default function TutorialHub() {
    const { t } = useLanguage();

    const tutorials = [
        {
            id: 'install',
            title: t.tutorials.install_title,
            description: t.tutorials.install_desc,
            icon: <Download size={24} />,
            color: 'bg-primary',
            category: t.tutorials.cat_essential,
            href: '/dashboard/tutorials/install'
        },
        {
            id: 'llami',
            title: t.tutorials.llami_title,
            description: t.tutorials.llami_desc,
            icon: <Flame size={24} />,
            color: 'bg-warning',
            category: t.tutorials.cat_growth,
            href: '/dashboard/tutorials/llami'
        },
        {
            id: 'spiritual',
            title: t.tutorials.spiritual_title,
            description: t.tutorials.spiritual_desc,
            icon: <BookOpen size={24} />,
            color: 'bg-success',
            category: t.tutorials.cat_spiritual,
            href: '/dashboard/tutorials/spiritual'
        },
        {
            id: 'sos',
            title: t.tutorials.sos_title,
            description: t.tutorials.sos_desc,
            icon: <AlertTriangle size={24} />,
            color: 'bg-danger',
            category: t.tutorials.cat_support,
            href: '/dashboard/tutorials/sos'
        },
        {
            id: 'community',
            title: t.tutorials.community_title,
            description: t.tutorials.community_desc,
            icon: <Users size={24} />,
            color: 'bg-info',
            category: t.tutorials.cat_community,
            href: '/dashboard/tutorials/community'
        }
    ];

    return (
        <div className="container-fluid py-4 min-vh-100 bg-light">
            {/* Header */}
            <header className="mb-5">
                <h1 className="display-6 fw-bold text-secondary mb-2">{t.tutorials.hub_title}</h1>
                <p className="text-muted">{t.tutorials.hub_subtitle}</p>
            </header>

            {/* Featured Tutorial */}
            <section className="mb-5">
                <Link href="/dashboard/tutorials/install" className="text-decoration-none">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="card border-0 shadow-lg bg-primary text-white rounded-5 overflow-hidden"
                    >
                        <div className="card-body p-4 p-lg-5 d-flex flex-column flex-lg-row align-items-center justify-content-between gap-4">
                            <div className="text-center text-lg-start">
                                <span className="badge bg-white text-primary mb-3">{t.tutorials.recommended}</span>
                                <h2 className="fw-bold mb-3">{t.tutorials.install_guide}</h2>
                                <p className="opacity-75 mb-4">
                                    {t.tutorials.install_promo}
                                </p>
                                <button className="btn btn-light rounded-pill px-4 fw-bold d-inline-flex align-items-center gap-2">
                                    <PlayCircle size={20} />
                                    {t.tutorials.start_guide}
                                </button>
                            </div>
                            <div className="bg-white bg-opacity-20 p-4 rounded-circle">
                                <Download size={80} />
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </section>

            {/* Grid */}
            <div className="row g-4">
                {tutorials.filter(t => t.id !== 'install').map((item, idx) => (
                    <div className="col-md-6 col-lg-4" key={item.id}>
                        <Link href={item.href} className="text-decoration-none h-100">
                            <motion.div
                                whileHover={{ y: -5 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden"
                            >
                                <div className="card-body p-4">
                                    <div className={`${item.color} text-white p-3 rounded-4 d-inline-block mb-3 shadow-sm`}>
                                        {item.icon}
                                    </div>
                                    <h5 className="fw-bold text-secondary mb-2">{item.title}</h5>
                                    <p className="small text-muted mb-4">{item.description}</p>

                                    <div className="d-flex align-items-center justify-content-between mt-auto">
                                        <span className="badge bg-light text-muted fw-normal">{item.category}</span>
                                        <div className="text-primary d-flex align-items-center gap-1 fw-bold small">
                                            {t.tutorials.read_more}
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Help Section */}
            <section className="mt-5 pt-5 border-top text-center">
                <div className="bg-white p-5 rounded-5 shadow-sm border">
                    <Info size={40} className="text-primary mb-3" />
                    <h3 className="fw-bold text-secondary mb-3">{t.tutorials.need_help}</h3>
                    <p className="text-muted mb-4">{t.tutorials.help_p}</p>
                    <Link href="/dashboard/sos" className="btn btn-outline-primary rounded-pill px-5 fw-bold">
                        {t.tutorials.contact_support}
                    </Link>
                </div>
            </section>
        </div>
    );
}

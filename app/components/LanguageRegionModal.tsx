"use client";

import { useLanguage } from '@/app/LanguageContext';
import { Globe, X } from 'lucide-react';

interface LanguageRegionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LanguageRegionModal({ isOpen, onClose }: LanguageRegionModalProps) {
    const { language, region, setLanguage, setRegion, t } = useLanguage();

    if (!isOpen) return null;

    const handleSave = () => {
        setLanguage(language);
        setRegion(region);
        onClose();
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000 }}>
            <div className="bg-white p-4 rounded-4 shadow-lg text-center position-relative animate-scale-in" style={{ maxWidth: '400px', width: '90%' }}>
                <button
                    onClick={onClose}
                    className="btn btn-link position-absolute top-0 end-0 m-3 p-0 text-muted hover-text-dark"
                >
                    <X size={24} />
                </button>

                <Globe size={48} className="text-primary mb-3" />
                <h2 className="fw-bold mb-3 small">{t.language_region_modal.welcome}</h2>
                <p className="text-muted mb-4 small">{t.language_region_modal.select_prompt}</p>

                <div className="mb-3 text-start">
                    <label className="form-label fw-bold small">{t.language_region_modal.language_label}</label>
                    <select
                        className="form-select mb-2 rounded-3"
                        value={language}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value as any)}
                    >
                        <option value="es">{t.language_region_modal.spanish}</option>
                        <option value="en">{t.language_region_modal.english}</option>
                        <option value="pt">{t.language_region_modal.portuguese}</option>
                    </select>
                </div>

                <div className="mb-4 text-start">
                    <label className="form-label fw-bold small">{t.language_region_modal.region_label}</label>
                    <select
                        className="form-select rounded-3"
                        value={region}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRegion(e.target.value as any)}
                    >
                        <option value="LATAM">{t.language_region_modal.latin_america}</option>
                        <option value="ES">{t.language_region_modal.spain}</option>
                        <option value="US">{t.language_region_modal.usa}</option>
                        <option value="BR">{t.language_region_modal.brazil}</option>
                    </select>
                </div>

                <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold" onClick={handleSave}>
                    {t.language_region_modal.confirm}
                </button>
            </div>
        </div>
    );
}

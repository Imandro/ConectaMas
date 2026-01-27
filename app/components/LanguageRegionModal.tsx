"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageRegionModal() {
    const { language, region, setLanguage, setRegion } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if selections exist in localStorage. If not, show modal.
        // This runs once on mount.
        const storedLang = localStorage.getItem('app-language');
        const storedRegion = localStorage.getItem('app-region');

        if (!storedLang || !storedRegion) {
            setIsOpen(true);
        }
    }, []);

    if (!isOpen) return null;

    const handleSave = () => {
        // Validation could go here
        setLanguage(language); // Re-trigger save to storage just in case
        setRegion(region);
        setIsOpen(false);
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999 }}>
            <div className="bg-white p-4 rounded-4 shadow-lg text-center" style={{ maxWidth: '400px', width: '90%' }}>
                <Globe size={48} className="text-primary mb-3" />
                <h2 className="fw-bold mb-3">{t.language_region_modal.welcome} / Welcome / Bem-vindo</h2>
                <p className="text-muted mb-4">{t.language_region_modal.select_prompt}</p>

                <div className="mb-3 text-start">
                    <label className="form-label fw-bold small">{t.language_region_modal.language_label} / Language</label>
                    <select
                        className="form-select mb-2"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                    >
                        <option value="es">{t.language_region_modal.spanish} (Spanish)</option>
                        <option value="en">{t.language_region_modal.english} (English)</option>
                        <option value="pt">{t.language_region_modal.portuguese} (Portuguese)</option>
                    </select>
                </div>

                <div className="mb-4 text-start">
                    <label className="form-label fw-bold small">{t.language_region_modal.region_label} / Region</label>
                    <select
                        className="form-select"
                        value={region}
                        onChange={(e) => setRegion(e.target.value as any)}
                    >
                        <option value="LATAM">{t.language_region_modal.latin_america}</option>
                        <option value="ES">{t.language_region_modal.spain}</option>
                        <option value="US">{t.language_region_modal.usa}</option>
                        <option value="BR">{t.language_region_modal.brazil}</option>
                    </select>
                </div>

                <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold" onClick={handleSave}>
                    {t.language_region_modal.confirm} / Confirm
                </button>
            </div>
        </div>
    );
}

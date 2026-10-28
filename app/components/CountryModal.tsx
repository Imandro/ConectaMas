"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserCountry } from "@/app/dashboard/actions/country";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/LanguageContext";

interface CountryModalProps {
    hasSelectedCountry: boolean;
}

const LATIN_AMERICAN_COUNTRIES = [
    { code: "MX", name: "México", flag: "🇲🇽" },
    { code: "GT", name: "Guatemala", flag: "🇬🇹" },
    { code: "SV", name: "El Salvador", flag: "🇸🇻" },
    { code: "HN", name: "Honduras", flag: "🇭🇳" },
    { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
    { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
    { code: "PA", name: "Panamá", flag: "🇵🇦" },
    { code: "CO", name: "Colombia", flag: "🇨🇴" },
    { code: "VE", name: "Venezuela", flag: "🇻🇪" },
    { code: "EC", name: "Ecuador", flag: "🇪🇨" },
    { code: "PE", name: "Perú", flag: "🇵🇪" },
    { code: "BO", name: "Bolivia", flag: "🇧🇴" },
    { code: "CL", name: "Chile", flag: "🇨🇱" },
    { code: "AR", name: "Argentina", flag: "🇦🇷" },
    { code: "UY", name: "Uruguay", flag: "🇺🇾" },
    { code: "PY", name: "Paraguay", flag: "🇵🇾" },
    { code: "DO", name: "República Dominicana", flag: "🇩🇴" },
    { code: "CU", name: "Cuba", flag: "🇨🇺" },
    { code: "PR", name: "Puerto Rico", flag: "🇵🇷" },
    { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
    { code: "ES", name: "España", flag: "🇪🇸" },
    { code: "RO", name: "Rumania", flag: "🇷🇴" }
];

export default function CountryModal({ hasSelectedCountry }: CountryModalProps) {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!hasSelectedCountry) {
            // Show after other modals (age, whatsapp, instagram)
            const timer = setTimeout(() => setIsOpen(true), 10000);
            return () => clearTimeout(timer);
        }
    }, [hasSelectedCountry]);

    const handleSelectCountry = async (countryCode: string, countryName: string) => {
        if (!navigator.onLine) {
            toast.error('Sin conexión. Guardar el país requiere internet.');
            return;
        }
        setIsLoading(true);
        const result = await updateUserCountry(countryCode);

        if (result.success) {
            toast.success(t.country_modal.welcome.replace('{countryName}', countryName === "Other" ? t.country_modal.other_country : countryName), {
                icon: '🌎',
                style: { borderRadius: '15px', background: '#333', color: '#fff' }
            });
            setIsOpen(false);
        } else {
            toast.error(t.country_modal.error_save);
        }
        setIsLoading(false);
    };

    const filteredCountries = LATIN_AMERICAN_COUNTRIES.filter(country => {
        const localizedName = country.code === "OTHER" ? t.country_modal.other_country : country.code === "RO" && language === 'ro' ? t.country_modal.romania : country.name;
        return localizedName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4" style={{ zIndex: 10001, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="ui-surface-glass rounded-5 shadow-lg"
                    style={{ maxWidth: '500px', width: 'min(100% - 24px, 500px)', maxHeight: 'min(80dvh, 640px)', overflowY: 'auto' }}
                >
                    {/* Header */}
                    <div className="position-relative p-4 text-center" style={{ backgroundColor: 'var(--brand-primary, #0B1B32)' }}>
                        <div className="bg-white p-3 rounded-circle d-inline-block shadow-sm mb-2">
                            <Globe size={40} className="text-primary" />
                        </div>
                        <h3 className="fw-bold text-white mb-1">{t.country_modal.title}</h3>
                        <p className="text-white-50 small mb-0">{t.country_modal.subtitle}</p>
                    </div>

                    {/* Search */}
                    <div className="p-4 pb-2">
                        <input
                            type="text"
                            placeholder={t.country_modal.search_placeholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control rounded-pill border-2"
                            style={{ padding: '0.75rem 1.25rem' }}
                        />
                    </div>

                    {/* Country List */}
                    <div className="px-4 pb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <div className="d-grid gap-2">
                            {filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    onClick={() => handleSelectCountry(country.code, country.name)}
                                    disabled={isLoading}
                                    className="btn btn-light text-start d-flex align-items-center gap-3 p-3 rounded-4 border hover-scale"
                                    style={{ transition: 'all 0.2s' }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>{country.flag}</span>
                                    <span className="fw-medium">{country.code === "OTHER" ? t.country_modal.other_country : country.code === "RO" && language === 'ro' ? t.country_modal.romania : country.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredCountries.length === 0 && (
                        <div className="text-center text-muted p-4">
                            {t.country_modal.no_results}
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

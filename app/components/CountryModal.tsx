"use client";

import { useState, useEffect } from "react";
import { Globe, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserCountry } from "@/app/dashboard/actions/country";
import { toast } from "react-hot-toast";

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
    { code: "OTHER", name: "Otro país", flag: "🌎" }
];

export default function CountryModal({ hasSelectedCountry }: CountryModalProps) {
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
        setIsLoading(true);
        const result = await updateUserCountry(countryCode);

        if (result.success) {
            toast.success(`¡Bienvenido desde ${countryName}!`, {
                icon: '🌎',
                style: { borderRadius: '15px', background: '#333', color: '#fff' }
            });
            setIsOpen(false);
        } else {
            toast.error('Error al guardar país');
        }
        setIsLoading(false);
    };

    const filteredCountries = LATIN_AMERICAN_COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4" style={{ zIndex: 10001, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-5 shadow-lg overflow-hidden"
                    style={{ maxWidth: '500px', width: '100%', maxHeight: '80vh' }}
                >
                    {/* Header */}
                    <div className="position-relative p-4 text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <div className="bg-white p-3 rounded-circle d-inline-block shadow-sm mb-2">
                            <Globe size={40} className="text-primary" />
                        </div>
                        <h3 className="fw-bold text-white mb-1">¿Desde dónde nos conectas?</h3>
                        <p className="text-white-50 small mb-0">Ayúdanos a conocer nuestra comunidad</p>
                    </div>

                    {/* Search */}
                    <div className="p-4 pb-2">
                        <input
                            type="text"
                            placeholder="Buscar país..."
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
                                    <span className="fw-medium">{country.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredCountries.length === 0 && (
                        <div className="text-center text-muted p-4">
                            No se encontraron países
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

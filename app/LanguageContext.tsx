"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { es } from './locales/es';
import { en } from './locales/en';
import { pt } from './locales/pt';

type Language = 'es' | 'en' | 'pt';
type Region = 'LATAM' | 'US' | 'BR' | 'ES';

export const translations = { es, en, pt };

interface LanguageContextType {
    language: Language;
    region: Region;
    setLanguage: (lang: Language) => void;
    setRegion: (reg: Region) => void;
    t: typeof es; // Type inference helper, assumes all files have same structure
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('es'); // Default
    const [region, setRegion] = useState<Region>('LATAM'); // Default

    useEffect(() => {
        // Load from localStorage if available
        const storedLang = localStorage.getItem('app-language') as Language;
        const storedRegion = localStorage.getItem('app-region') as Region;

        if (storedLang) setLanguage(storedLang);
        if (storedRegion) setRegion(storedRegion);
        // If not stored, we could try navigator.language, but requirement is "Force Selection"
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('app-language', lang);
        // Here we would also sync to DB if user is logged in
    };

    const handleSetRegion = (reg: Region) => {
        setRegion(reg);
        localStorage.setItem('app-region', reg);
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, region, setLanguage: handleSetLanguage, setRegion: handleSetRegion, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

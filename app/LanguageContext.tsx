"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { es } from './locales/es';
import { en } from './locales/en';
import { pt } from './locales/pt';
import { ro } from './locales/ro';
import { updatePreferredLanguage } from './dashboard/profile/actions';
import {
    isLanguage,
    isRegion,
    resolveLanguage,
    resolveRegion,
    type Language,
    type Region,
} from './lib/languages';

export { type Language, type Region } from './lib/languages';
export const translations = { es, en, pt, ro };

const LANGUAGE_STORAGE_KEY = 'app-language';
const REGION_STORAGE_KEY = 'app-region';
const PENDING_LANGUAGE_KEY = 'app-language-pending-sync';

interface LanguageContextType {
    language: Language;
    region: Region;
    setLanguage: (lang: Language) => void;
    setRegion: (reg: Region) => void;
    t: typeof es;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
    children,
    initialLanguage,
    initialRegion,
}: {
    children: ReactNode;
    initialLanguage?: Language;
    initialRegion?: Region;
}) {
    const { status } = useSession();
    const [language, setLanguage] = useState<Language>(isLanguage(initialLanguage) ? initialLanguage : 'es');
    const [region, setRegion] = useState<Region>(isRegion(initialRegion) ? initialRegion : 'LATAM');

    const syncLanguage = useCallback(async (nextLanguage: Language) => {
        if (status !== 'authenticated') return;
        if (!navigator.onLine) {
            localStorage.setItem(PENDING_LANGUAGE_KEY, nextLanguage);
            return;
        }

        try {
            const result = await updatePreferredLanguage(nextLanguage);
            if (result.success) {
                localStorage.removeItem(PENDING_LANGUAGE_KEY);
            } else if (result.error !== 'Unauthorized') {
                localStorage.setItem(PENDING_LANGUAGE_KEY, nextLanguage);
            }
        } catch {
            localStorage.setItem(PENDING_LANGUAGE_KEY, nextLanguage);
        }
    }, [status]);

    useEffect(() => {
        const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        const storedRegion = localStorage.getItem(REGION_STORAGE_KEY);
        const nextLanguage = resolveLanguage(initialLanguage, storedLanguage, navigator.language);
        const nextRegion = resolveRegion(initialRegion, storedRegion, nextLanguage);

        setLanguage(nextLanguage);
        setRegion(nextRegion);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
        localStorage.setItem(REGION_STORAGE_KEY, nextRegion);
    }, [initialLanguage, initialRegion]);

    useEffect(() => {
        document.documentElement.lang = language;
        document.cookie = `${LANGUAGE_STORAGE_KEY}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }, [language]);

    useEffect(() => {
        if (status !== 'authenticated') return;
        const pendingLanguage = localStorage.getItem(PENDING_LANGUAGE_KEY);
        if (isLanguage(pendingLanguage)) void syncLanguage(pendingLanguage);
        else if (!initialLanguage) void syncLanguage(language);
    }, [initialLanguage, language, status, syncLanguage]);

    useEffect(() => {
        const handleOnline = () => {
            const pendingLanguage = localStorage.getItem(PENDING_LANGUAGE_KEY);
            if (isLanguage(pendingLanguage)) void syncLanguage(pendingLanguage);
        };
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, [syncLanguage]);

    const handleSetLanguage = (nextLanguage: Language) => {
        if (!isLanguage(nextLanguage)) return;
        setLanguage(nextLanguage);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
        if (nextLanguage === 'ro') {
            setRegion('RO');
            localStorage.setItem(REGION_STORAGE_KEY, 'RO');
        }
        void syncLanguage(nextLanguage);
    };

    const handleSetRegion = (nextRegion: Region) => {
        if (!isRegion(nextRegion)) return;
        setRegion(nextRegion);
        localStorage.setItem(REGION_STORAGE_KEY, nextRegion);
    };

    return (
        <LanguageContext.Provider value={{ language, region, setLanguage: handleSetLanguage, setRegion: handleSetRegion, t: translations[language] as typeof es }}>
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

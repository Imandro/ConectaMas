export const LANGUAGE_CODES = ['es', 'en', 'pt', 'ro'] as const;
export type Language = (typeof LANGUAGE_CODES)[number];

export const REGION_CODES = ['LATAM', 'US', 'BR', 'ES', 'RO'] as const;
export type Region = (typeof REGION_CODES)[number];

export function isLanguage(value: unknown): value is Language {
    return typeof value === 'string' && (LANGUAGE_CODES as readonly string[]).includes(value);
}

export function isRegion(value: unknown): value is Region {
    return typeof value === 'string' && (REGION_CODES as readonly string[]).includes(value);
}

export function detectBrowserLanguage(locale?: string): Language {
    const normalized = (locale || '').toLowerCase();
    if (normalized.startsWith('ro-') || normalized === 'ro') return 'ro';
    if (normalized.startsWith('pt-') || normalized === 'pt') return 'pt';
    if (normalized.startsWith('en-') || normalized === 'en') return 'en';
    return 'es';
}

export function resolveLanguage(accountLanguage: unknown, storedLanguage: unknown, browserLocale?: string): Language {
    if (isLanguage(accountLanguage)) return accountLanguage;
    if (isLanguage(storedLanguage)) return storedLanguage;
    return detectBrowserLanguage(browserLocale);
}

export function resolveRegion(accountRegion: unknown, storedRegion: unknown, language: Language): Region {
    if (isRegion(accountRegion)) return accountRegion;
    if (isRegion(storedRegion)) return storedRegion;
    return language === 'ro' ? 'RO' : 'LATAM';
}

export function languageLocale(language: Language): string {
    return language === 'ro' ? 'ro-RO' : language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES';
}

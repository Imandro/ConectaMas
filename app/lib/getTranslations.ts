import { es } from '../locales/es';
import { en } from '../locales/en';
import { pt } from '../locales/pt';

export type Language = 'es' | 'en' | 'pt';

export const translations = { es, en, pt };

export function getTranslations(lang: Language = 'es') {
    return translations[lang] || translations.es;
}

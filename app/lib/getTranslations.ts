import { es } from '../locales/es';
import { en } from '../locales/en';
import { pt } from '../locales/pt';
import { ro } from '../locales/ro';
import type { Language } from './languages';

export { type Language } from './languages';

export const translations = { es, en, pt, ro };

export function getTranslations(lang: Language = 'es') {
    return translations[lang] || translations.es;
}

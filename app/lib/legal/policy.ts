export const LEGAL_OPERATOR = 'Mario Alvarez';
export const LEGAL_CONTACT_EMAIL = 'marioalejandroruiz28@gmail.com';
export const LEGAL_EFFECTIVE_DATE = '2026-10-27';

export const SUPPORTED_LEGAL_LOCALES = ['es', 'en', 'pt'] as const;
export type LegalLocale = (typeof SUPPORTED_LEGAL_LOCALES)[number];

export const LEGAL_DOCUMENTS = ['TERMS', 'PRIVACY', 'COOKIES', 'REFUNDS', 'COMMUNITY', 'AGE_GATE'] as const;
export type LegalDocument = (typeof LEGAL_DOCUMENTS)[number];

export type LegalConsentInput = {
  document: LegalDocument;
  version: string;
  locale: LegalLocale;
  country: string;
  source: 'web' | 'mobile' | 'reaccept';
};

export const CURRENT_LEGAL_VERSIONS: Record<LegalDocument, string> = {
  TERMS: '2026-10-27',
  PRIVACY: '2026-10-27',
  COOKIES: '2026-10-27',
  REFUNDS: '2026-10-27',
  COMMUNITY: '2026-10-27',
  AGE_GATE: '2026-10-27',
};

export const REQUIRED_CONSENT_DOCUMENTS: readonly LegalDocument[] = [
  'TERMS',
  'PRIVACY',
  'COMMUNITY',
  'REFUNDS',
  'AGE_GATE',
];

const COUNTRY_MINIMUM_AGES: Record<string, number> = {
  MX: 13, GT: 13, SV: 13, HN: 13, NI: 13, CR: 13, PA: 13,
  CO: 13, VE: 13, EC: 13, PE: 13, BO: 13, CL: 13, AR: 13,
  UY: 13, PY: 13, DO: 13, CU: 13, PR: 13, US: 13, ES: 14, RO: 16,
};

export const SUPPORTED_COUNTRY_OPTIONS = [
  ['MX', 'México'], ['GT', 'Guatemala'], ['SV', 'El Salvador'], ['HN', 'Honduras'],
  ['NI', 'Nicaragua'], ['CR', 'Costa Rica'], ['PA', 'Panamá'], ['CO', 'Colombia'],
  ['VE', 'Venezuela'], ['EC', 'Ecuador'], ['PE', 'Perú'], ['BO', 'Bolivia'],
  ['CL', 'Chile'], ['AR', 'Argentina'], ['UY', 'Uruguay'], ['PY', 'Paraguay'],
  ['DO', 'República Dominicana'], ['CU', 'Cuba'], ['PR', 'Puerto Rico'],
  ['US', 'Estados Unidos'], ['ES', 'España'], ['RO', 'Rumania'],
] as const;

export function normalizeCountry(country: unknown): string {
  return typeof country === 'string' ? country.trim().toUpperCase() : '';
}

export function isSupportedCountry(country: unknown): boolean {
  return normalizeCountry(country) in COUNTRY_MINIMUM_AGES;
}

export function evaluateLegalAccess(
  country: string,
  age: number,
): { allowed: boolean; reason?: 'UNSUPPORTED_COUNTRY' | 'AGE_RESTRICTED' } {
  const normalizedCountry = normalizeCountry(country);
  const minimumAge = COUNTRY_MINIMUM_AGES[normalizedCountry];
  if (!minimumAge) return { allowed: false, reason: 'UNSUPPORTED_COUNTRY' };
  if (!Number.isInteger(age) || age < minimumAge || age > 120) return { allowed: false, reason: 'AGE_RESTRICTED' };
  return { allowed: true };
}

export function isLegalLocale(value: unknown): value is LegalLocale {
  return typeof value === 'string' && (SUPPORTED_LEGAL_LOCALES as readonly string[]).includes(value);
}

export function isLegalDocument(value: unknown): value is LegalDocument {
  return typeof value === 'string' && (LEGAL_DOCUMENTS as readonly string[]).includes(value);
}

export function isCurrentLegalVersion(document: LegalDocument, version: string): boolean {
  return CURRENT_LEGAL_VERSIONS[document] === version;
}

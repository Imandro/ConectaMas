import { prisma } from '@/app/lib/prisma';
import {
  CURRENT_LEGAL_VERSIONS,
  LEGAL_DOCUMENTS,
  REQUIRED_CONSENT_DOCUMENTS,
  isCurrentLegalVersion,
  isLegalDocument,
  isLegalLocale,
  normalizeCountry,
  isSupportedCountry,
  type LegalConsentInput,
  type LegalDocument,
  type LegalLocale,
} from './policy';

export type { LegalConsentInput } from './policy';

function assertValidConsent(input: LegalConsentInput) {
  if (!isLegalDocument(input.document)) throw new Error('Invalid legal document');
  if (!isLegalLocale(input.locale)) throw new Error('Invalid legal locale');
  if (!isCurrentLegalVersion(input.document, input.version)) throw new Error('Outdated legal version');
  if (!isSupportedCountry(input.country)) throw new Error('Unsupported country');
  if (!['web', 'mobile', 'reaccept'].includes(input.source)) throw new Error('Invalid consent source');
}

export async function hasCurrentLegalConsent(userId: string): Promise<boolean> {
  return (await missingCurrentLegalDocuments(userId)).length === 0;
}

export async function missingCurrentLegalDocuments(userId: string): Promise<LegalDocument[]> {
  const consents = await prisma.legalConsent.findMany({
    where: { userId, document: { in: [...REQUIRED_CONSENT_DOCUMENTS] } },
    select: { document: true, version: true },
    orderBy: { acceptedAt: 'desc' },
  });
  const current = new Set<LegalDocument>();
  for (const consent of consents) {
    const document = consent.document as LegalDocument;
    if (!current.has(document) && consent.version === CURRENT_LEGAL_VERSIONS[document]) current.add(document);
  }
  return REQUIRED_CONSENT_DOCUMENTS.filter((document) => !current.has(document));
}

export async function recordLegalConsent(userId: string, input: LegalConsentInput): Promise<void> {
  assertValidConsent(input);
  await prisma.legalConsent.create({
    data: {
      userId,
      document: input.document,
      version: input.version,
      locale: input.locale,
      country: normalizeCountry(input.country),
      source: input.source,
    },
  });
}

export async function recordCurrentLegalConsent(
  userId: string,
  country: string,
  locale: LegalLocale,
  source: LegalConsentInput['source'],
): Promise<void> {
  await prisma.$transaction(
    REQUIRED_CONSENT_DOCUMENTS.map((document) => prisma.legalConsent.create({
      data: {
        userId,
        document,
        version: CURRENT_LEGAL_VERSIONS[document],
        locale,
        country: normalizeCountry(country),
        source,
      },
    })),
  );
}

export function currentLegalConsentDocuments(): readonly LegalDocument[] {
  return LEGAL_DOCUMENTS;
}

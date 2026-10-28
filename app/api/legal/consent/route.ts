import { NextResponse } from 'next/server';
import { getApiUser } from '@/app/lib/api-auth';
import { CURRENT_LEGAL_VERSIONS, evaluateLegalAccess, normalizeCountry, isLegalLocale, REQUIRED_CONSENT_DOCUMENTS } from '@/app/lib/legal/policy';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await getApiUser(request, { id: true }, { allowWithoutLegal: true });
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const age = Number(body.age);
  const country = normalizeCountry(body.country);
  const locale = body.locale || 'es';
  const access = evaluateLegalAccess(country, age);
  if (!access.allowed) return NextResponse.json({ message: access.reason === 'AGE_RESTRICTED' ? 'No cumples la edad mínima aplicable a tu país' : 'Tu país no está habilitado todavía' }, { status: 400 });
  if (!isLegalLocale(locale)) return NextResponse.json({ message: 'Idioma legal no válido' }, { status: 400 });

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { age, country, preferredLanguage: locale } });
    await tx.legalConsent.createMany({
      data: REQUIRED_CONSENT_DOCUMENTS.map((document) => ({
        userId: user.id,
        document,
        version: CURRENT_LEGAL_VERSIONS[document],
        locale,
        country,
        source: 'reaccept',
      })),
    });
  });
  return NextResponse.json({ success: true });
}

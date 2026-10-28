import { NextResponse } from 'next/server';
import { getApiUser } from '@/app/lib/api-auth';
import { evaluateLegalAccess, CURRENT_LEGAL_VERSIONS } from '@/app/lib/legal/policy';
import { hasCurrentLegalConsent, missingCurrentLegalDocuments } from '@/app/lib/legal/consent';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const user = await getApiUser(request, { id: true, age: true, country: true, preferredLanguage: true }, { allowWithoutLegal: true });
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const access = evaluateLegalAccess(user.country || '', user.age || 0);
  const missing = await missingCurrentLegalDocuments(user.id);
  const accepted = await hasCurrentLegalConsent(user.id);
  return NextResponse.json({
    allowed: access.allowed && accepted,
    reason: access.allowed ? undefined : access.reason,
    missing,
    age: user.age,
    country: user.country,
    locale: user.preferredLanguage,
    versions: CURRENT_LEGAL_VERSIONS,
  }, { headers: { 'Cache-Control': 'no-store' } });
}

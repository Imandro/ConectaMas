import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getApiUserId } from '@/app/lib/api-auth';
import { isBillingEnabled } from '@/app/lib/billing/config';
import { googleProductCode } from '@/app/lib/billing/providers/google-play';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const userId = await getApiUserId(request);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (!isBillingEnabled('play')) return NextResponse.json({ message: 'Google Play Billing unavailable' }, { status: 503 });
    const body = await request.json().catch(() => null) as { productId?: unknown } | null;
    const productId = typeof body?.productId === 'string' ? body.productId : '';
    const productCode = googleProductCode(productId);
    if (!productCode) return NextResponse.json({ message: 'Invalid Google Play product' }, { status: 400 });
    const claim = await prisma.billingPurchaseClaim.create({
        data: { id: randomUUID(), userId, provider: 'google_play', productCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    });
    return NextResponse.json({ claimId: claim.id, expiresAt: claim.expiresAt });
}

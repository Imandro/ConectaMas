import { NextResponse } from 'next/server';
import { getApiUserId } from '@/app/lib/api-auth';
import { getGooglePlayConfig, isBillingEnabled } from '@/app/lib/billing/config';
import { getProduct } from '@/app/lib/billing/products';
import { getPremiumEntitlement, processBillingEvent } from '@/app/lib/billing/process-event';
import { acknowledgeGooglePlayPurchase, googleProductCode, googlePurchaseReference, verifyGooglePlayPurchase } from '@/app/lib/billing/providers/google-play';
import { prisma } from '@/app/lib/prisma';
import { allowBillingRequest } from '@/app/lib/billing/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const userId = await getApiUserId(request);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (!allowBillingRequest(`play-verify:${userId}`, 10)) return NextResponse.json({ message: 'Too many verification attempts' }, { status: 429 });
    if (!isBillingEnabled('play')) return NextResponse.json({ message: 'Google Play Billing unavailable' }, { status: 503 });
    const body = await request.json().catch(() => null) as { productId?: unknown; purchaseToken?: unknown; claimId?: unknown } | null;
    const productId = typeof body?.productId === 'string' ? body.productId : '';
    const purchaseToken = typeof body?.purchaseToken === 'string' ? body.purchaseToken : '';
    const claimId = typeof body?.claimId === 'string' ? body.claimId : '';
    const productCode = googleProductCode(productId);
    if (!productCode || !/^[A-Za-z0-9._-]{20,4096}$/.test(purchaseToken)) return NextResponse.json({ message: 'Invalid Google Play purchase' }, { status: 400 });
    const reference = googlePurchaseReference(purchaseToken);
    let existing = await prisma.billingTransaction.findUnique({ where: { providerResourceId: reference } });
    if (existing && existing.userId !== userId) return NextResponse.json({ message: 'Purchase belongs to another account' }, { status: 403 });
    try {
        const claim = !existing && claimId ? await prisma.billingPurchaseClaim.findUnique({ where: { id: claimId } }) : null;
        if (!existing && (!claim || claim.userId !== userId || claim.provider !== 'google_play' || claim.productCode !== productCode || claim.consumedAt || claim.expiresAt <= new Date())) {
            return NextResponse.json({ message: 'Purchase claim is required or expired' }, { status: 403 });
        }
        const event = await verifyGooglePlayPurchase({ productId, purchaseToken }, getGooglePlayConfig());
        if (event.productCode !== productCode) return NextResponse.json({ message: 'Google Play product mismatch' }, { status: 400 });
        if (!existing) {
            const product = getProduct(productCode);
            try {
                await prisma.billingTransaction.create({
                    data: {
                        userId,
                        provider: 'google_play',
                        providerResourceId: reference,
                        kind: product.kind,
                        productCode,
                        amount: product.amount,
                        currency: product.currency,
                        status: 'PENDING',
                        metadata: { googleProductId: productId },
                    },
                });
            } catch (error) {
                if (!(typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002')) throw error;
                existing = await prisma.billingTransaction.findUnique({ where: { providerResourceId: reference } });
                if (!existing || existing.userId !== userId) return NextResponse.json({ message: 'Purchase belongs to another account' }, { status: 403 });
            }
        }
        await processBillingEvent(event);
        if (claimId) await prisma.billingPurchaseClaim.updateMany({ where: { id: claimId, userId, consumedAt: null }, data: { consumedAt: new Date() } });
        if (event.state === 'ACTIVE') await acknowledgeGooglePlayPurchase({ productId, purchaseToken }, getGooglePlayConfig());
        return NextResponse.json({ entitlement: await getPremiumEntitlement(userId) });
    } catch (error) {
        console.error('Google Play verification error:', error instanceof Error ? error.message : 'unknown');
        return NextResponse.json({ message: 'Unable to verify Google Play purchase' }, { status: 502 });
    }
}

import { NextResponse } from 'next/server';
import { getApiUserId } from '@/app/lib/api-auth';
import { getPaypalConfig } from '@/app/lib/billing/config';
import { cancelPaypalSubscription } from '@/app/lib/billing/providers/paypal';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const userId = await getApiUserId(request);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await request.json().catch(() => null) as { provider?: unknown; subscriptionId?: unknown } | null;
    const provider = body?.provider;
    const subscriptionId = body?.subscriptionId;
    if (provider !== 'paypal' || typeof subscriptionId !== 'string' || !/^[A-Za-z0-9_-]+$/.test(subscriptionId)) {
        return NextResponse.json({ message: 'Only PayPal subscription cancellation is available' }, { status: 400 });
    }
    const subscription = await prisma.billingSubscription.findFirst({ where: { userId, provider: 'paypal', providerSubscriptionId: subscriptionId } });
    if (!subscription) return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });
    try {
        await cancelPaypalSubscription(subscriptionId, getPaypalConfig());
        await prisma.billingSubscription.update({ where: { id: subscription.id }, data: { status: 'CANCELLED', cancelAtPeriodEnd: true } });
        return NextResponse.json({ status: 'CANCELLED' });
    } catch (error) {
        console.error('Subscription cancellation error:', error instanceof Error ? error.message : 'unknown');
        return NextResponse.json({ message: 'Unable to cancel subscription' }, { status: 502 });
    }
}

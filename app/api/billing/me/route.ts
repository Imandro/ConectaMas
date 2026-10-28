import { NextResponse } from 'next/server';
import { getApiUserId } from '@/app/lib/api-auth';
import { getPremiumEntitlement } from '@/app/lib/billing/process-event';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';
const PRIVATE_NO_STORE_HEADERS = {
    'Cache-Control': 'private, no-store',
};

export async function GET(request: Request) {
    const userId = await getApiUserId(request);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401, headers: PRIVATE_NO_STORE_HEADERS });
    const [user, entitlement, transactions, subscriptions] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { age: true } }),
        getPremiumEntitlement(userId),
        prisma.billingTransaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20, select: { id: true, provider: true, productCode: true, amount: true, currency: true, status: true, createdAt: true, paidAt: true } }),
        prisma.billingSubscription.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' }, select: { id: true, provider: true, providerSubscriptionId: true, productCode: true, status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true } }),
    ]);
    return NextResponse.json({ requiresGuardian: typeof user?.age === 'number' && user.age < 18, entitlement, transactions, subscriptions }, { headers: PRIVATE_NO_STORE_HEADERS });
}

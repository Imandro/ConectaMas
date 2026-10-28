import { NextResponse } from 'next/server';
import { getApiUserId } from '@/app/lib/api-auth';
import { getPaypalConfig, isBillingEnabled } from '@/app/lib/billing/config';
import { capturePaypalOrder } from '@/app/lib/billing/providers/paypal';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        if (!isBillingEnabled('web')) return NextResponse.json({ message: 'Billing unavailable' }, { status: 503 });
        const body = await request.json().catch(() => null) as { orderId?: unknown } | null;
        const orderId = typeof body?.orderId === 'string' ? body.orderId : '';
        if (!/^[A-Za-z0-9_-]+$/.test(orderId)) return NextResponse.json({ message: 'Invalid order' }, { status: 400 });
        const transaction = await prisma.billingTransaction.findUnique({ where: { providerResourceId: orderId } });
        if (!transaction || transaction.provider !== 'paypal') return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        const userId = await getApiUserId(request);
        if (transaction.userId && transaction.userId !== userId) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        const result = await capturePaypalOrder(orderId, getPaypalConfig());
        return NextResponse.json({ status: 'PENDING', providerStatus: result.status ?? null });
    } catch (error) {
        console.error('PayPal capture error:', error instanceof Error ? error.message : 'unknown');
        return NextResponse.json({ message: 'Unable to capture PayPal order' }, { status: 502 });
    }
}

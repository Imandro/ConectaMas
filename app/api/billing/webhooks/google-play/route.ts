import { NextResponse } from 'next/server';
import { getGooglePlayConfig, isBillingEnabled } from '@/app/lib/billing/config';
import { verifyGooglePubSubRequest } from '@/app/lib/billing/google-pubsub';
import { processBillingEvent } from '@/app/lib/billing/process-event';
import { decodeGoogleRtdn, googleProductCode, verifyGooglePlayPurchase } from '@/app/lib/billing/providers/google-play';
import { allowBillingRequest } from '@/app/lib/billing/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    if (!isBillingEnabled('play')) return new NextResponse(null, { status: 204 });
    try {
        if (!allowBillingRequest('webhook:google-play', 120)) return NextResponse.json({ message: 'Too many webhook attempts' }, { status: 429 });
        const config = getGooglePlayConfig();
        await verifyGooglePubSubRequest(request, { audience: config.pubsubAudience });
        const envelope = await request.json() as { message?: { data?: string; messageId?: string } };
        const data = envelope.message?.data;
        if (!data) return new NextResponse(null, { status: 204 });
        const notification = decodeGoogleRtdn(data);
        if (notification.packageName !== config.packageName || !notification.subscriptionNotification?.purchaseToken || !notification.subscriptionNotification.subscriptionId) return new NextResponse(null, { status: 204 });
        const productCode = googleProductCode(notification.subscriptionNotification.subscriptionId);
        if (!productCode) return new NextResponse(null, { status: 204 });
        const event = await verifyGooglePlayPurchase({ productId: notification.subscriptionNotification.subscriptionId, purchaseToken: notification.subscriptionNotification.purchaseToken }, config);
        await processBillingEvent({ ...event, providerEventId: `rtdn:${envelope.message?.messageId || notification.eventTimeMillis || 'unknown'}:${event.providerResourceId}` });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error && error.message === 'billing transaction not found') return new NextResponse(null, { status: 204 });
        console.error('Google Play RTDN error:', error instanceof Error ? error.message : 'unknown');
        return NextResponse.json({ message: 'Invalid Google Play notification' }, { status: 400 });
    }
}

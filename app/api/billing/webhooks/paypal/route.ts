import { NextResponse } from 'next/server';
import { getPaypalConfig } from '@/app/lib/billing/config';
import { parsePaypalWebhook } from '@/app/lib/billing/providers/paypal';
import { processBillingEvent } from '@/app/lib/billing/process-event';
import { allowBillingRequest } from '@/app/lib/billing/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        if (!allowBillingRequest('webhook:paypal', 120)) return NextResponse.json({ message: 'Too many webhook attempts' }, { status: 429 });
        const event = await parsePaypalWebhook(request, getPaypalConfig());
        const result = await processBillingEvent(event);
        return NextResponse.json({ accepted: true, ...result });
    } catch (error) {
        console.error('PayPal webhook error:', error instanceof Error ? error.message : 'unknown');
        return NextResponse.json({ message: 'Invalid PayPal webhook' }, { status: 400 });
    }
}

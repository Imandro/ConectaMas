import { NextResponse } from 'next/server';
import { getPagaditoConfig } from '@/app/lib/billing/config';
import { parsePagaditoWebhook } from '@/app/lib/billing/providers/pagadito';
import { processBillingEvent } from '@/app/lib/billing/process-event';
import { allowBillingRequest } from '@/app/lib/billing/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        if (!allowBillingRequest('webhook:pagadito', 120)) return NextResponse.json({ message: 'Too many webhook attempts' }, { status: 429 });
        const event = await parsePagaditoWebhook(request, getPagaditoConfig());
        const result = await processBillingEvent(event);
        return NextResponse.json({ accepted: true, ...result });
    } catch (error) {
        console.error('Pagadito webhook error:', error instanceof Error ? error.message : 'unknown');
        return NextResponse.json({ message: 'Invalid Pagadito webhook' }, { status: 400 });
    }
}

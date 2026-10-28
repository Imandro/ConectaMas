import { NextResponse } from 'next/server';
import { getPublicAdsConfig } from '@/app/lib/ads/config';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json(getPublicAdsConfig(), {
        headers: { 'Cache-Control': 'no-store' },
    });
}

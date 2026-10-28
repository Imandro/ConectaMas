import { NextResponse } from 'next/server';
import { getAvailableProviders, getProducts } from '@/app/lib/billing/products';
import { isBillingEnabled } from '@/app/lib/billing/config';

export const dynamic = 'force-dynamic';

const PUBLIC_CACHE_HEADERS = {
    'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
};

export async function GET(request: Request) {
    const url = new URL(request.url);
    const country = (url.searchParams.get('country') || 'NI').toUpperCase();
    const channel = url.searchParams.get('channel') === 'play' ? 'play' : 'web';
    const providers = channel === 'play' ? ['google_play'] : getAvailableProviders(country);
    const products = getProducts()
        .filter((product) => channel === 'play' ? product.grantsPremium : product.providers.some((provider) => providers.includes(provider)))
        .map((product) => ({ ...product, providers: product.providers.filter((provider) => providers.includes(provider)) }));

    return NextResponse.json({
        enabled: isBillingEnabled(channel),
        country,
        channel,
        products,
    }, { headers: PUBLIC_CACHE_HEADERS });
}

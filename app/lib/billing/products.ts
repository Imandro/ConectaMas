import type { BillingProduct, PaymentProvider, ProductCode } from './types';

const LATAM_PAGADITO_COUNTRIES = new Set(['NI', 'GT', 'HN', 'SV', 'CR', 'PA', 'BZ']);

const PRODUCTS: Record<ProductCode, BillingProduct> = {
    SUPPORT_ONE_TIME: {
        code: 'SUPPORT_ONE_TIME',
        amount: 2,
        currency: 'USD',
        kind: 'SUPPORT',
        recurring: false,
        grantsPremium: false,
        providers: ['paypal', 'pagadito'],
    },
    SUPPORT_MONTHLY: {
        code: 'SUPPORT_MONTHLY',
        amount: 3,
        currency: 'USD',
        kind: 'SUPPORT',
        recurring: true,
        grantsPremium: false,
        providers: ['paypal'],
    },
    PREMIUM_MONTHLY: {
        code: 'PREMIUM_MONTHLY',
        amount: 2.99,
        currency: 'USD',
        kind: 'PREMIUM',
        recurring: true,
        grantsPremium: true,
        providers: ['paypal', 'google_play'],
    },
    PREMIUM_YEARLY: {
        code: 'PREMIUM_YEARLY',
        amount: 24.99,
        currency: 'USD',
        kind: 'PREMIUM',
        recurring: false,
        grantsPremium: true,
        providers: ['paypal', 'pagadito', 'google_play'],
    },
};

export function getProduct(code: ProductCode): BillingProduct {
    const product = PRODUCTS[code];
    if (!product) throw new Error('unknown billing product');
    return { ...product, providers: [...product.providers] };
}

export function getAvailableProviders(countryCode: string): PaymentProvider[] {
    const country = countryCode.trim().toUpperCase();
    if (LATAM_PAGADITO_COUNTRIES.has(country)) return ['pagadito', 'paypal'];
    return ['paypal'];
}

export function getProducts(): BillingProduct[] {
    return Object.values(PRODUCTS).map((product) => ({ ...product, providers: [...product.providers] }));
}

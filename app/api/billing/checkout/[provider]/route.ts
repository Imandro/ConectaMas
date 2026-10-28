import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getApiUser } from '@/app/lib/api-auth';
import { billingUrl, getPagaditoConfig, getPaypalConfig, isBillingEnabled } from '@/app/lib/billing/config';
import { getAvailableProviders, getProduct } from '@/app/lib/billing/products';
import { prisma } from '@/app/lib/prisma';
import { createPagaditoCheckout } from '@/app/lib/billing/providers/pagadito';
import { createOneTimePaypalCheckout, createPaypalSubscriptionCheckout } from '@/app/lib/billing/providers/paypal';
import type { PaymentProvider, ProductCode } from '@/app/lib/billing/types';
import { allowBillingRequest } from '@/app/lib/billing/rate-limit';

export const dynamic = 'force-dynamic';

const providers = new Set<PaymentProvider>(['paypal', 'pagadito']);

function isProductCode(value: unknown): value is ProductCode {
    return typeof value === 'string' && ['SUPPORT_ONE_TIME', 'SUPPORT_MONTHLY', 'PREMIUM_MONTHLY', 'PREMIUM_YEARLY'].includes(value);
}

export async function POST(request: Request, context: { params: { provider: string } }) {
    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
        if (!allowBillingRequest(`checkout:${ip}`, 10)) return NextResponse.json({ message: 'Too many checkout attempts' }, { status: 429 });
        const provider = context.params.provider as PaymentProvider;
        if (!providers.has(provider) || !isBillingEnabled('web')) return NextResponse.json({ message: 'Payment provider unavailable' }, { status: 503 });

        const body = await request.json().catch(() => null) as { productCode?: unknown; country?: unknown; returnPath?: unknown; cancelPath?: unknown } | null;
        if (!body || !isProductCode(body.productCode)) return NextResponse.json({ message: 'Invalid product' }, { status: 400 });

        const product = getProduct(body.productCode);
        const user = await getApiUser(request, { id: true, country: true });
        const userId = user?.id ?? null;
        const country = String(user?.country || body.country || 'NI').toUpperCase();
        if (!getAvailableProviders(country).includes(provider) || !product.providers.includes(provider)) {
            return NextResponse.json({ message: 'Provider unavailable for country or product' }, { status: 400 });
        }
        if (product.grantsPremium && !userId) return NextResponse.json({ message: 'Premium requires an account' }, { status: 401 });
        if (product.grantsPremium) {
            const [existing, pending] = await Promise.all([
                prisma.billingSubscription.findFirst({ where: { userId: userId!, productCode: { in: ['PREMIUM_MONTHLY', 'PREMIUM_YEARLY'] }, status: { in: ['PENDING', 'ACTIVE', 'PAST_DUE'] } } }),
                prisma.billingTransaction.findFirst({ where: { userId: userId!, kind: 'PREMIUM', status: 'PENDING' } }),
            ]);
            if (existing || pending) return NextResponse.json({ message: 'Premium subscription already exists or is pending' }, { status: 409 });
        }

        const reference = `conecta_${randomUUID()}`;
        const returnUrl = billingUrl(typeof body.returnPath === 'string' ? body.returnPath : '/dashboard/support?billing=return');
        const cancelUrl = billingUrl(typeof body.cancelPath === 'string' ? body.cancelPath : '/dashboard/support?billing=cancel');
        const transaction = await prisma.billingTransaction.create({
            data: {
                userId: userId ?? undefined,
                provider,
                providerResourceId: `pending:${reference}`,
                kind: product.kind,
                productCode: product.code,
                amount: product.amount,
                currency: product.currency,
                status: 'PENDING',
                metadata: { reference, country },
            },
        });

        try {
            const checkout = provider === 'paypal'
                ? product.recurring
                    ? await createPaypalSubscriptionCheckout({
                        planId: product.code === 'PREMIUM_MONTHLY' ? getPaypalConfig().premiumMonthlyPlanId : getPaypalConfig().supportMonthlyPlanId,
                        reference,
                        returnUrl,
                        cancelUrl,
                    }, getPaypalConfig())
                    : await createOneTimePaypalCheckout({ amount: product.amount, currency: product.currency, reference, description: `Conecta+ ${product.code}`, returnUrl, cancelUrl }, getPaypalConfig())
                : await createPagaditoCheckout({ reference, amount: product.amount, description: `Conecta+ ${product.code}`, returnUrl }, getPagaditoConfig());

            await prisma.billingTransaction.update({ where: { id: transaction.id }, data: { providerResourceId: checkout.providerResourceId } });
            return NextResponse.json({ transactionId: transaction.id, provider, productCode: product.code, status: 'PENDING', redirectUrl: checkout.redirectUrl });
        } catch (error) {
            await prisma.billingTransaction.update({ where: { id: transaction.id }, data: { status: 'REVERSED' } });
            throw error;
        }
    } catch (error) {
        console.error('Billing checkout error:', error instanceof Error ? error.message : 'unknown');
        return NextResponse.json({ message: 'Unable to start checkout' }, { status: 502 });
    }
}

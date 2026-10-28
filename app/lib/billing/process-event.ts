import type { PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';
import { getProduct } from './products';
import { hasPremiumAccess } from './entitlement-rules';
import type { BillingState, NormalizedBillingEvent, ProductCode } from './types';

export type BillingDatabase = Pick<PrismaClient, 'billingTransaction' | 'billingSubscription' | 'billingWebhookEvent' | 'user'>;

function isUniqueError(error: unknown) {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

function periodEnd(productCode: string, start: Date) {
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + (productCode === 'PREMIUM_MONTHLY' || productCode === 'SUPPORT_MONTHLY' ? 30 : 365));
    return end;
}

async function markWebhook(database: BillingDatabase, event: NormalizedBillingEvent, status: string) {
    await database.billingWebhookEvent.update({
        where: { provider_providerEventId: { provider: event.provider, providerEventId: event.providerEventId } },
        data: { status, processedAt: new Date() },
    });
}

export async function processBillingEvent(
    event: NormalizedBillingEvent,
    database: BillingDatabase = prisma,
): Promise<{ duplicate: boolean; status: BillingState }> {
    if (!event.providerEventId || !event.providerResourceId) throw new Error('billing event identifiers are required');

    const existing = await database.billingWebhookEvent.findUnique({
        where: { provider_providerEventId: { provider: event.provider, providerEventId: event.providerEventId } },
    });
    if (existing && existing.status !== 'PROCESSING' && existing.status !== 'REJECTED') return { duplicate: true, status: existing.status as BillingState };

    try {
        await database.billingWebhookEvent.create({
            data: {
                provider: event.provider,
                providerEventId: event.providerEventId,
                eventType: event.eventType,
                status: 'PROCESSING',
                payload: {
                    providerResourceId: event.providerResourceId,
                    internalReference: event.internalReference ?? null,
                    amount: event.amount ?? null,
                    currency: event.currency ?? null,
                    state: event.state,
                },
            },
        });
    } catch (error) {
        if (!isUniqueError(error)) throw error;
        const raced = await database.billingWebhookEvent.findUnique({
            where: { provider_providerEventId: { provider: event.provider, providerEventId: event.providerEventId } },
        });
        if (!raced || (raced.status !== 'PROCESSING' && raced.status !== 'REJECTED')) return { duplicate: true, status: (raced?.status ?? 'PENDING') as BillingState };
    }

    const transaction = await database.billingTransaction.findFirst({
        where: {
            provider: event.provider,
            OR: [
                { providerResourceId: event.providerResourceId },
                ...(event.internalReference
                    ? [{ metadata: { path: ['reference'], equals: event.internalReference } }]
                    : []),
            ],
        },
    });

    try {
        if (!transaction) throw new Error('billing transaction not found');
        const product = transaction.productCode ? getProduct(transaction.productCode as ProductCode) : null;
        if (!product) throw new Error('billing product missing');
        if (event.productCode && event.productCode !== product.code) throw new Error('billing product mismatch');
        if (event.currency && event.currency !== product.currency) throw new Error('billing currency mismatch');
        if (event.amount !== undefined && Math.abs(Number(transaction.amount) - event.amount) > 0.001) {
            throw new Error('billing amount mismatch');
        }
        if ((transaction.status === 'ACTIVE' && event.state === 'PENDING') || (['REFUNDED', 'REVERSED'].includes(transaction.status) && event.state === 'ACTIVE')) {
            await markWebhook(database, event, 'IGNORED');
            return { duplicate: false, status: transaction.status as BillingState };
        }

        await database.billingTransaction.update({
            where: { id: transaction.id },
            data: {
                status: event.state,
                paidAt: event.state === 'ACTIVE' ? (event.occurredAt ?? new Date()) : transaction.paidAt,
                metadata: {
                    ...(transaction.metadata && typeof transaction.metadata === 'object' ? transaction.metadata : {}),
                    providerResourceId: event.providerResourceId,
                    providerSubscriptionId: event.providerSubscriptionId ?? null,
                },
            },
        });

        if ((product.grantsPremium || product.recurring) && transaction.userId) {
            const subscriptionId = event.providerSubscriptionId ?? `${event.provider}:${transaction.providerResourceId}`;
            const start = event.occurredAt ?? new Date();
            await database.billingSubscription.upsert({
                where: { providerSubscriptionId: subscriptionId },
                create: {
                    userId: transaction.userId,
                    provider: event.provider,
                    providerSubscriptionId: subscriptionId,
                    productCode: product.code,
                    status: event.state,
                    currentPeriodStart: start,
                    currentPeriodEnd: event.currentPeriodEnd ?? periodEnd(product.code, start),
                    cancelAtPeriodEnd: event.state === 'CANCELLED',
                },
                update: {
                    status: event.state,
                    cancelAtPeriodEnd: event.state === 'CANCELLED',
                    ...(event.state === 'ACTIVE' ? { currentPeriodStart: start, currentPeriodEnd: event.currentPeriodEnd ?? periodEnd(product.code, start) } : {}),
                },
            });
        }
        await markWebhook(database, event, event.state);
        return { duplicate: false, status: event.state };
    } catch (error) {
        await markWebhook(database, event, 'REJECTED');
        throw error;
    }
}

export async function getPremiumEntitlement(userId: string, database: BillingDatabase = prisma) {
    const user = await database.user.findUnique({ where: { id: userId }, select: { id: true, isPremium: true } });
    if (!user) return { active: false, status: 'EXPIRED' as const, expiresAt: null, provider: null };
    if (user.isPremium) return { active: true, status: 'MANUAL' as const, expiresAt: null, provider: null };

    const subscription = await database.billingSubscription.findFirst({
        where: { userId, productCode: { in: ['PREMIUM_MONTHLY', 'PREMIUM_YEARLY'] } },
        orderBy: { updatedAt: 'desc' },
    });
    if (!subscription) return { active: false, status: 'EXPIRED' as const, expiresAt: null, provider: null };
    return {
        active: hasPremiumAccess({ status: subscription.status as BillingState, currentPeriodEnd: subscription.currentPeriodEnd }),
        status: subscription.status as BillingState,
        expiresAt: subscription.currentPeriodEnd,
        provider: subscription.provider,
    };
}

export class PremiumRequiredError extends Error {
    statusCode = 403;

    constructor() {
        super('Premium subscription required');
        this.name = 'PremiumRequiredError';
    }
}

export async function requirePremium(userId: string, database: BillingDatabase = prisma) {
    const entitlement = await getPremiumEntitlement(userId, database);
    if (!entitlement.active) throw new PremiumRequiredError();
    return entitlement;
}

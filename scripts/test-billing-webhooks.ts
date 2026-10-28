import assert from 'node:assert/strict';
import { getPremiumEntitlement, processBillingEvent } from '../app/lib/billing/process-event';
import type { NormalizedBillingEvent } from '../app/lib/billing/types';

const transactions: any[] = [];
const events: Record<string, any> = {};
const subscriptions: any[] = [];
const users = new Map([['user-1', { id: 'user-1', isPremium: false }]]);

const database: any = {
    billingTransaction: {
        async findFirst({ where }: any) {
            const clauses = where.OR ?? [where];
            return transactions.find((transaction) => transaction.provider === where.provider && clauses.some((clause: any) =>
                (clause.providerResourceId && transaction.providerResourceId === clause.providerResourceId) ||
                (clause.metadata?.equals && transaction.metadata?.reference === clause.metadata.equals),
            )) ?? null;
        },
        async update({ where, data }: any) {
            const transaction = transactions.find((item) => item.id === where.id);
            Object.assign(transaction, data);
            return transaction;
        },
    },
    billingWebhookEvent: {
        async findUnique({ where }: any) {
            return events[`${where.provider_providerEventId.provider}:${where.provider_providerEventId.providerEventId}`] ?? null;
        },
        async create({ data }: any) {
            const key = `${data.provider}:${data.providerEventId}`;
            if (events[key]) throw Object.assign(new Error('duplicate'), { code: 'P2002' });
            const event = { id: `event-${Object.keys(events).length + 1}`, ...data };
            events[key] = event;
            return event;
        },
        async update({ where, data }: any) {
            const event = events[`${where.provider_providerEventId.provider}:${where.provider_providerEventId.providerEventId}`];
            Object.assign(event, data);
            return event;
        },
    },
    billingSubscription: {
        async upsert({ where, create, update }: any) {
            const key = where.providerSubscriptionId;
            const current = subscriptions.find((subscription) => subscription.providerSubscriptionId === key);
            if (current) Object.assign(current, update);
            else subscriptions.push({ id: `sub-${subscriptions.length + 1}`, ...create });
            return subscriptions.find((subscription) => subscription.providerSubscriptionId === key);
        },
        async findFirst() {
            return subscriptions[0] ?? null;
        },
        async updateMany({ data }: any) {
            for (const subscription of subscriptions) Object.assign(subscription, data);
            return { count: subscriptions.length };
        },
    },
    user: {
        async findUnique({ where }: any) {
            return users.get(where.id) ?? null;
        },
    },
};

transactions.push({
    id: 'tx-1',
    userId: 'user-1',
    provider: 'paypal',
    providerResourceId: 'ORDER-1',
    productCode: 'PREMIUM_YEARLY',
    amount: 24.99,
    currency: 'USD',
    status: 'PENDING',
    metadata: { reference: 'ref-1' },
});

async function main() {

const activeEvent: NormalizedBillingEvent = {
    provider: 'paypal',
    providerEventId: 'event-1',
    eventType: 'PAYMENT.CAPTURE.COMPLETED',
    providerResourceId: 'CAPTURE-1',
    internalReference: 'ref-1',
    amount: 24.99,
    currency: 'USD',
    state: 'ACTIVE',
};

const first = await processBillingEvent(activeEvent, database);
assert.deepEqual(first, { duplicate: false, status: 'ACTIVE' });
assert.equal(transactions.find((transaction) => transaction.id === 'tx-1').status, 'ACTIVE');
assert.equal(subscriptions.length, 1);

const duplicate = await processBillingEvent(activeEvent, database);
assert.deepEqual(duplicate, { duplicate: true, status: 'ACTIVE' });

events['paypal:stale-event'] = { id: 'event-stale', provider: 'paypal', providerEventId: 'stale-event', status: 'PROCESSING' };
const recovered = await processBillingEvent({ ...activeEvent, providerEventId: 'stale-event' }, database);
assert.deepEqual(recovered, { duplicate: false, status: 'ACTIVE' });

await assert.rejects(
    processBillingEvent({ ...activeEvent, providerEventId: 'event-2', amount: 99 }, database),
    /billing amount mismatch/,
);
assert.equal(transactions.find((transaction) => transaction.id === 'tx-1').status, 'ACTIVE');

await assert.rejects(
    processBillingEvent({ ...activeEvent, providerEventId: 'event-product-mismatch', productCode: 'PREMIUM_MONTHLY' }, database),
    /billing product mismatch/,
);

const entitlement = await getPremiumEntitlement('user-1', database);
assert.equal(entitlement.active, true);
assert.equal(entitlement.provider, 'paypal');

const refunded = await processBillingEvent({
    ...activeEvent,
    providerEventId: 'event-3',
    eventType: 'PAYMENT.CAPTURE.REFUNDED',
    state: 'REFUNDED',
}, database);
assert.deepEqual(refunded, { duplicate: false, status: 'REFUNDED' });
assert.equal((await getPremiumEntitlement('user-1', database)).active, false);

const staleActive = await processBillingEvent({ ...activeEvent, providerEventId: 'event-stale-active-after-refund' }, database);
assert.deepEqual(staleActive, { duplicate: false, status: 'REFUNDED' });
assert.equal((await getPremiumEntitlement('user-1', database)).active, false);

console.log('billing webhook tests: PASS');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

import assert from 'node:assert/strict';
import { getAvailableProviders, getProduct } from '../app/lib/billing/products';
import { canStartPremiumCheckout, hasPremiumAccess } from '../app/lib/billing/entitlement-rules';

const now = new Date('2026-01-10T00:00:00.000Z');

assert.equal(getProduct('SUPPORT_ONE_TIME').amount, 2);
assert.equal(getProduct('PREMIUM_MONTHLY').amount, 2.99);
assert.equal(getProduct('PREMIUM_YEARLY').amount, 24.99);
assert.equal(getProduct('SUPPORT_ONE_TIME').grantsPremium, false);

assert.deepEqual(getAvailableProviders('NI'), ['pagadito', 'paypal']);
assert.deepEqual(getAvailableProviders('HN'), ['pagadito', 'paypal']);
assert.deepEqual(getAvailableProviders('AR'), ['paypal']);

assert.equal(hasPremiumAccess({ status: 'ACTIVE', currentPeriodEnd: null, now }), true);
assert.equal(hasPremiumAccess({ status: 'ACTIVE', currentPeriodEnd: new Date('2026-01-11'), now }), true);
assert.equal(hasPremiumAccess({ status: 'ACTIVE', currentPeriodEnd: new Date('2026-01-09'), now }), false);
assert.equal(hasPremiumAccess({ status: 'CANCELLED', currentPeriodEnd: new Date('2026-01-11'), now }), true);
assert.equal(hasPremiumAccess({ status: 'CANCELLED', currentPeriodEnd: new Date('2026-01-09'), now }), false);
assert.equal(hasPremiumAccess({ status: 'PAST_DUE', currentPeriodEnd: new Date('2026-01-08'), now }), true);
assert.equal(hasPremiumAccess({ status: 'PAST_DUE', currentPeriodEnd: new Date('2026-01-06'), now }), false);
assert.equal(hasPremiumAccess({ status: 'REFUNDED', currentPeriodEnd: null, now }), false);
assert.equal(hasPremiumAccess({ status: 'PENDING', currentPeriodEnd: null, now }), false);

assert.deepEqual(canStartPremiumCheckout({ hasActiveSubscription: false, hasPendingSubscription: false }), { ok: true });
assert.deepEqual(canStartPremiumCheckout({ hasActiveSubscription: true, hasPendingSubscription: false }), {
    ok: false,
    reason: 'ACTIVE_SUBSCRIPTION_EXISTS',
});
assert.deepEqual(canStartPremiumCheckout({ hasActiveSubscription: false, hasPendingSubscription: true }), {
    ok: false,
    reason: 'PENDING_SUBSCRIPTION_EXISTS',
});

console.log('billing domain tests: PASS');

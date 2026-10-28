import type { BillingState } from './types';

const PAST_DUE_GRACE_MS = 3 * 24 * 60 * 60 * 1000;

type PremiumAccessInput = {
    status: BillingState;
    currentPeriodEnd: Date | null;
    now?: Date;
};

export function hasPremiumAccess({ status, currentPeriodEnd, now = new Date() }: PremiumAccessInput): boolean {
    if (status === 'ACTIVE') return !currentPeriodEnd || currentPeriodEnd.getTime() > now.getTime();
    if (status === 'CANCELLED') return Boolean(currentPeriodEnd && currentPeriodEnd.getTime() > now.getTime());
    if (status === 'PAST_DUE') {
        return Boolean(currentPeriodEnd && currentPeriodEnd.getTime() + PAST_DUE_GRACE_MS > now.getTime());
    }
    return false;
}

export function canStartPremiumCheckout(input: {
    hasActiveSubscription: boolean;
    hasPendingSubscription: boolean;
}): { ok: true } | { ok: false; reason: 'ACTIVE_SUBSCRIPTION_EXISTS' | 'PENDING_SUBSCRIPTION_EXISTS' } {
    if (input.hasActiveSubscription) return { ok: false, reason: 'ACTIVE_SUBSCRIPTION_EXISTS' };
    if (input.hasPendingSubscription) return { ok: false, reason: 'PENDING_SUBSCRIPTION_EXISTS' };
    return { ok: true };
}

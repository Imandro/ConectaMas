export type ProductCode =
    | 'SUPPORT_ONE_TIME'
    | 'SUPPORT_MONTHLY'
    | 'PREMIUM_MONTHLY'
    | 'PREMIUM_YEARLY';

export type PaymentProvider = 'paypal' | 'pagadito' | 'google_play';
export type BillingState =
    | 'PENDING'
    | 'ACTIVE'
    | 'CANCELLED'
    | 'PAST_DUE'
    | 'SUSPENDED'
    | 'EXPIRED'
    | 'REFUNDED'
    | 'REVERSED';

export type BillingProduct = {
    code: ProductCode;
    amount: number;
    currency: 'USD';
    kind: 'SUPPORT' | 'PREMIUM';
    recurring: boolean;
    grantsPremium: boolean;
    providers: PaymentProvider[];
};

export type NormalizedBillingEvent = {
    provider: PaymentProvider;
    providerEventId: string;
    eventType: string;
    providerResourceId: string;
    providerSubscriptionId?: string;
    internalReference?: string;
    productCode?: ProductCode;
    amount?: number;
    currency?: string;
    currentPeriodEnd?: Date;
    state: BillingState;
    occurredAt?: Date;
};

export type BillingEnvironment = 'sandbox' | 'live';

function required(name: string) {
    const value = process.env[name]?.trim();
    if (!value) throw new Error(`${name} is required`);
    return value;
}

function environment(name: string): BillingEnvironment {
    const value = process.env[name] ?? 'sandbox';
    if (value !== 'sandbox' && value !== 'live') throw new Error(`${name} must be sandbox or live`);
    return value;
}

export function getPaypalConfig() {
    return {
        clientId: required('PAYPAL_CLIENT_ID'),
        clientSecret: required('PAYPAL_CLIENT_SECRET'),
        webhookId: required('PAYPAL_WEBHOOK_ID'),
        environment: environment('PAYPAL_ENVIRONMENT'),
        premiumMonthlyPlanId: required('PAYPAL_PREMIUM_MONTHLY_PLAN_ID'),
        supportMonthlyPlanId: required('PAYPAL_SUPPORT_MONTHLY_PLAN_ID'),
    };
}

export function getPagaditoConfig() {
    return {
        uid: required('PAGADITO_UID'),
        wsk: required('PAGADITO_WSK'),
        environment: environment('PAGADITO_ENVIRONMENT'),
        certHosts: (process.env.PAGADITO_CERT_HOSTS ?? '').split(',').map((host) => host.trim()).filter(Boolean),
    };
}

export function isBillingEnabled(channel: 'web' | 'play') {
    return process.env[channel === 'web' ? 'BILLING_WEB_ENABLED' : 'BILLING_PLAY_ENABLED'] === 'true';
}

export function getGooglePlayConfig() {
    return {
        packageName: required('GOOGLE_PLAY_PACKAGE_NAME'),
        serviceAccountJson: required('GOOGLE_PLAY_SERVICE_ACCOUNT_JSON'),
        pubsubAudience: required('GOOGLE_PLAY_PUBSUB_AUDIENCE'),
    };
}

export function billingUrl(path: string) {
    if (!path.startsWith('/') || path.startsWith('//')) throw new Error('invalid billing return path');
    const base = new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://conectamas.live');
    if (base.protocol !== 'https:' && process.env.NODE_ENV === 'production') throw new Error('billing app URL must use HTTPS');
    const target = new URL(path, base);
    if (target.origin !== base.origin) throw new Error('billing return URL origin not allowed');
    return target.toString();
}

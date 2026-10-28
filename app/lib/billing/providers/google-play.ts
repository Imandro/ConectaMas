import { createHash, createSign } from 'node:crypto';
import type { BillingState, NormalizedBillingEvent, ProductCode } from '../types';
import { billingFetch } from '../http';

type GooglePlayConfig = {
    packageName: string;
    serviceAccountJson: string;
    fetch?: typeof fetch;
};

const API_BASE = 'https://androidpublisher.googleapis.com/androidpublisher/v3';
const GOOGLE_PRODUCTS: Record<string, ProductCode> = {
    conecta_premium_monthly: 'PREMIUM_MONTHLY',
    conecta_premium_yearly: 'PREMIUM_YEARLY',
};

export function googleProductCode(productId: string): ProductCode | null {
    return GOOGLE_PRODUCTS[productId] ?? null;
}

export function googlePurchaseReference(purchaseToken: string) {
    return createHash('sha256').update(purchaseToken).digest('hex');
}

export function googleSubscriptionState(state: string): BillingState {
    if (state === 'SUBSCRIPTION_STATE_ACTIVE') return 'ACTIVE';
    if (state === 'SUBSCRIPTION_STATE_CANCELED') return 'CANCELLED';
    if (state === 'SUBSCRIPTION_STATE_PAUSED') return 'SUSPENDED';
    if (state === 'SUBSCRIPTION_STATE_EXPIRED') return 'EXPIRED';
    return 'PENDING';
}

function base64url(value: string | Buffer) {
    return Buffer.from(value).toString('base64url');
}

function serviceAccount(config: GooglePlayConfig) {
    let parsed: { client_email?: string; private_key?: string; token_uri?: string };
    try {
        parsed = JSON.parse(config.serviceAccountJson);
    } catch {
        throw new Error('invalid Google service account JSON');
    }
    if (!parsed.client_email || !parsed.private_key) throw new Error('Google service account credentials missing');
    return { clientEmail: parsed.client_email, privateKey: parsed.private_key, tokenUri: parsed.token_uri || 'https://oauth2.googleapis.com/token' };
}

async function accessToken(config: GooglePlayConfig) {
    const account = serviceAccount(config);
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = base64url(JSON.stringify({ iss: account.clientEmail, scope: 'https://www.googleapis.com/auth/androidpublisher', aud: account.tokenUri, iat: now, exp: now + 3600 }));
    const unsigned = `${header}.${payload}`;
    const signer = createSign('RSA-SHA256');
    signer.update(unsigned);
    signer.end();
    const assertion = `${unsigned}.${base64url(signer.sign(account.privateKey))}`;
    const response = await billingFetch(config.fetch ?? fetch, account.tokenUri, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${encodeURIComponent(assertion)}`,
    });
    const body = await response.json().catch(() => null) as { access_token?: string } | null;
    if (!response.ok || !body?.access_token) throw new Error('Google access token unavailable');
    return body.access_token;
}

async function googleRequest(path: string, config: GooglePlayConfig, init?: RequestInit) {
    const token = await accessToken(config);
    const response = await billingFetch(config.fetch ?? fetch, `${API_BASE}${path}`, {
        ...init,
        headers: { Authorization: `Bearer ${token}`, ...(init?.headers || {}) },
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(`Google Play request failed: ${response.status}`);
    return body as Record<string, any>;
}

function purchaseState(subscription: Record<string, any>, productCode: ProductCode) {
    const lineItem = Array.isArray(subscription.lineItems)
        ? subscription.lineItems.find((item: any) => googleProductCode(String(item.productId ?? '')) === productCode)
        : null;
    const expiryTime = lineItem?.expiryTime ? new Date(lineItem.expiryTime) : null;
    const state = googleSubscriptionState(String(subscription.subscriptionState ?? ''));
    return {
        state: state === 'ACTIVE' && (!expiryTime || expiryTime <= new Date()) ? 'EXPIRED' as const : state,
        expiryTime,
        lineItem,
    };
}

export async function verifyGooglePlayPurchase(input: { productId: string; purchaseToken: string }, config: GooglePlayConfig): Promise<NormalizedBillingEvent> {
    const productCode = googleProductCode(input.productId);
    if (!productCode) throw new Error('unknown Google Play product');
    if (!/^[A-Za-z0-9._-]{20,4096}$/.test(input.purchaseToken)) throw new Error('invalid Google Play purchase token');
    const subscription = await googleRequest(`/applications/${encodeURIComponent(config.packageName)}/purchases/subscriptionsv2/tokens/${encodeURIComponent(input.purchaseToken)}`, config);
    if (subscription.packageName && subscription.packageName !== config.packageName) throw new Error('Google Play package mismatch');
    const result = purchaseState(subscription, productCode);
    if (!result.lineItem) throw new Error('Google Play product mismatch');
    const amount = productCode === 'PREMIUM_MONTHLY' ? 2.99 : 24.99;
    return {
        provider: 'google_play',
        providerEventId: `verify:${googlePurchaseReference(input.purchaseToken)}`,
        eventType: 'GOOGLE_PLAY_PURCHASE_VERIFIED',
        providerResourceId: googlePurchaseReference(input.purchaseToken),
        providerSubscriptionId: googlePurchaseReference(input.purchaseToken),
        productCode,
        amount,
        currency: 'USD',
        currentPeriodEnd: result.expiryTime ?? undefined,
        state: result.state,
        occurredAt: subscription.startTime ? new Date(subscription.startTime) : undefined,
    };
}

export async function acknowledgeGooglePlayPurchase(input: { productId: string; purchaseToken: string }, config: GooglePlayConfig) {
    if (!googleProductCode(input.productId)) throw new Error('unknown Google Play product');
    await googleRequest(`/applications/${encodeURIComponent(config.packageName)}/purchases/subscriptions/${encodeURIComponent(input.productId)}/tokens/${encodeURIComponent(input.purchaseToken)}:acknowledge`, config, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ developerPayload: '' }),
    });
}

export function decodeGoogleRtdn(data: string) {
    let parsed: any;
    try {
        parsed = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
    } catch {
        throw new Error('invalid Google Play RTDN data');
    }
    return parsed as { packageName?: string; eventTimeMillis?: string; subscriptionNotification?: { notificationType?: number; purchaseToken?: string; subscriptionId?: string } };
}

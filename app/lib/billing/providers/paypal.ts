import type { NormalizedBillingEvent } from '../types';
import { billingFetch } from '../http';

type PaypalConfig = {
    fetch?: typeof fetch;
    clientId: string;
    clientSecret: string;
    environment: 'sandbox' | 'live';
    webhookId?: string;
};

type OneTimeCheckoutInput = {
    amount: number;
    currency: 'USD';
    reference: string;
    description: string;
    returnUrl: string;
    cancelUrl: string;
};

type SubscriptionCheckoutInput = {
    planId: string;
    reference: string;
    returnUrl: string;
    cancelUrl: string;
};

const jsonHeaders = { 'content-type': 'application/json' };

function apiBase(environment: PaypalConfig['environment']) {
    return environment === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

function money(value: number) {
    if (!Number.isFinite(value) || value <= 0) throw new Error('invalid billing amount');
    return value.toFixed(2);
}

async function responseJson(response: Response) {
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(`PayPal request failed: ${response.status}`);
    return body as Record<string, any>;
}

async function getAccessToken(config: PaypalConfig) {
    const fetchImpl = config.fetch ?? fetch;
    const response = await billingFetch(fetchImpl, `${apiBase(config.environment)}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });
    const body = await responseJson(response);
    if (typeof body.access_token !== 'string' || !body.access_token) throw new Error('PayPal access token missing');
    return body.access_token;
}

function approvalUrl(body: Record<string, any>) {
    const link = Array.isArray(body.links) ? body.links.find((item: any) => item.rel === 'approve') : null;
    if (!link || typeof link.href !== 'string') throw new Error('PayPal approval URL missing');
    return link.href;
}

export async function createOneTimePaypalCheckout(input: OneTimeCheckoutInput, config: PaypalConfig) {
    const fetchImpl = config.fetch ?? fetch;
    const token = await getAccessToken(config);
    const response = await billingFetch(fetchImpl, `${apiBase(config.environment)}/v2/checkout/orders`, {
        method: 'POST',
        headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: input.reference,
                custom_id: input.reference,
                description: input.description,
                amount: { currency_code: input.currency, value: money(input.amount) },
            }],
            application_context: {
                return_url: input.returnUrl,
                cancel_url: input.cancelUrl,
                user_action: 'PAY_NOW',
            },
        }),
    });
    const body = await responseJson(response);
    if (typeof body.id !== 'string') throw new Error('PayPal order ID missing');
    return { providerResourceId: body.id, redirectUrl: approvalUrl(body) };
}

export async function capturePaypalOrder(orderId: string, config: PaypalConfig) {
    if (!/^[A-Za-z0-9_-]+$/.test(orderId)) throw new Error('invalid PayPal order ID');
    const fetchImpl = config.fetch ?? fetch;
    const token = await getAccessToken(config);
    const response = await billingFetch(fetchImpl, `${apiBase(config.environment)}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
        method: 'POST',
        headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
    });
    return responseJson(response);
}

export async function createPaypalSubscriptionCheckout(input: SubscriptionCheckoutInput, config: PaypalConfig) {
    const fetchImpl = config.fetch ?? fetch;
    const token = await getAccessToken(config);
    const response = await billingFetch(fetchImpl, `${apiBase(config.environment)}/v1/billing/subscriptions`, {
        method: 'POST',
        headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            plan_id: input.planId,
            custom_id: input.reference,
            application_context: {
                return_url: input.returnUrl,
                cancel_url: input.cancelUrl,
                user_action: 'SUBSCRIBE_NOW',
            },
        }),
    });
    const body = await responseJson(response);
    if (typeof body.id !== 'string') throw new Error('PayPal subscription ID missing');
    return { providerResourceId: body.id, redirectUrl: approvalUrl(body) };
}

export async function cancelPaypalSubscription(subscriptionId: string, config: PaypalConfig) {
    if (!/^[A-Za-z0-9_-]+$/.test(subscriptionId)) throw new Error('invalid PayPal subscription ID');
    const fetchImpl = config.fetch ?? fetch;
    const token = await getAccessToken(config);
    const response = await billingFetch(fetchImpl, `${apiBase(config.environment)}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, {
        method: 'POST',
        headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: 'Cancelled by subscriber' }),
    });
    if (!response.ok && response.status !== 204) throw new Error(`PayPal cancellation failed: ${response.status}`);
}

async function verifyWebhook(body: string, request: Request, config: PaypalConfig, webhookEvent: Record<string, any>) {
    if (!config.webhookId) throw new Error('PayPal webhook ID missing');
    const headers = request.headers;
    const required = {
        auth_algo: headers.get('paypal-auth-algo'),
        cert_url: headers.get('paypal-cert-url'),
        transmission_id: headers.get('paypal-transmission-id'),
        transmission_sig: headers.get('paypal-transmission-sig'),
        transmission_time: headers.get('paypal-transmission-time'),
        webhook_id: config.webhookId,
        webhook_event: webhookEvent,
    };
    if (Object.values(required).some((value) => !value)) throw new Error('PayPal webhook headers missing');
    const token = await getAccessToken(config);
    const fetchImpl = config.fetch ?? fetch;
    const response = await billingFetch(fetchImpl, `${apiBase(config.environment)}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
        body: JSON.stringify(required),
    });
    const result = await responseJson(response);
    if (result.verification_status !== 'SUCCESS') throw new Error('invalid PayPal webhook signature');
}

function paypalState(eventType: string) {
    if (eventType.endsWith('.COMPLETED') || eventType.endsWith('.ACTIVATED')) return 'ACTIVE' as const;
    if (eventType.includes('REFUND')) return 'REFUNDED' as const;
    if (eventType.includes('REVERSED')) return 'REVERSED' as const;
    if (eventType.includes('CANCELLED')) return 'CANCELLED' as const;
    if (eventType.includes('SUSPENDED') || eventType.includes('FAILED')) return 'SUSPENDED' as const;
    return 'PENDING' as const;
}

export async function parsePaypalWebhook(request: Request, config: PaypalConfig): Promise<NormalizedBillingEvent> {
    const body = await request.text();
    let event: Record<string, any>;
    try {
        event = JSON.parse(body);
    } catch {
        throw new Error('invalid PayPal webhook JSON');
    }
    await verifyWebhook(body, request, config, event);
    const resource = event.resource ?? {};
    const eventType = String(event.event_type ?? '');
    const amount = resource.amount?.value ?? resource.amount?.total;
    const currency = resource.amount?.currency_code ?? resource.amount?.currency;
    const providerSubscriptionId = resource.billing_agreement_id ?? resource.id_token ?? resource.subscription_id;
    const orderId = resource.supplementary_data?.related_ids?.order_id;
    const nextBillingTime = resource.billing_info?.next_billing_time ?? resource.next_billing_time;
    return {
        provider: 'paypal',
        providerEventId: String(event.id ?? ''),
        eventType,
        providerResourceId: String(providerSubscriptionId ?? orderId ?? resource.id ?? event.id ?? ''),
        providerSubscriptionId: providerSubscriptionId ? String(providerSubscriptionId) : undefined,
        internalReference: resource.custom_id ?? resource.purchase_units?.[0]?.custom_id ?? resource.purchase_units?.[0]?.reference_id,
        amount: amount === undefined ? undefined : Number(amount),
        currency: currency ? String(currency) : undefined,
        currentPeriodEnd: nextBillingTime ? new Date(nextBillingTime) : undefined,
        state: paypalState(eventType),
        occurredAt: event.create_time ? new Date(event.create_time) : undefined,
    };
}

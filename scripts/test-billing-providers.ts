import assert from 'node:assert/strict';
import { createOneTimePaypalCheckout, createPaypalSubscriptionCheckout, parsePaypalWebhook } from '../app/lib/billing/providers/paypal';
import { createPagaditoCheckout, parsePagaditoWebhook } from '../app/lib/billing/providers/pagadito';

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

async function main() {

const paypalCalls: Array<{ url: string; init?: RequestInit }> = [];
const paypalFetch: typeof fetch = async (input, init) => {
    const url = String(input);
    paypalCalls.push({ url, init });
    if (url.endsWith('/v1/oauth2/token')) return jsonResponse({ access_token: 'access-token' });
    if (url.endsWith('/v2/checkout/orders')) {
        return jsonResponse({
            id: 'ORDER-1',
            links: [{ rel: 'approve', href: 'https://www.paypal.com/checkoutnow?token=ORDER-1' }],
        });
    }
    if (url.endsWith('/v1/billing/subscriptions')) {
        return jsonResponse({
            id: 'SUB-1',
            links: [{ rel: 'approve', href: 'https://www.paypal.com/subscription?token=SUB-1' }],
        });
    }
    if (url.endsWith('/v1/notifications/verify-webhook-signature')) return jsonResponse({ verification_status: 'SUCCESS' });
    throw new Error(`unexpected PayPal URL: ${url}`);
};

const oneTime = await createOneTimePaypalCheckout({
    amount: 5,
    currency: 'USD',
    reference: 'billing-ref-1',
    description: 'Apoyo Conecta+',
    returnUrl: 'https://conectaplus.app/billing/return',
    cancelUrl: 'https://conectaplus.app/billing/cancel',
}, { fetch: paypalFetch, clientId: 'client', clientSecret: 'secret', environment: 'sandbox' });
assert.equal(oneTime.providerResourceId, 'ORDER-1');
assert.match(oneTime.redirectUrl, /paypal\.com\/checkoutnow/);
assert.equal(JSON.parse(String(paypalCalls[1].init?.body)).intent, 'CAPTURE');
assert.equal(JSON.parse(String(paypalCalls[1].init?.body)).purchase_units[0].amount.value, '5.00');

const subscription = await createPaypalSubscriptionCheckout({
    planId: 'P-1',
    reference: 'billing-ref-2',
    returnUrl: 'https://conectaplus.app/billing/return',
    cancelUrl: 'https://conectaplus.app/billing/cancel',
}, { fetch: paypalFetch, clientId: 'client', clientSecret: 'secret', environment: 'sandbox' });
assert.equal(subscription.providerResourceId, 'SUB-1');

const paypalEvent = await parsePaypalWebhook(
    new Request('https://conectaplus.app/api/billing/webhooks/paypal', {
        method: 'POST',
        headers: {
            'paypal-transmission-id': 'T-1',
            'paypal-transmission-time': '2026-01-10T00:00:00Z',
            'paypal-cert-url': 'https://api-m.sandbox.paypal.com/cert',
            'paypal-auth-algo': 'SHA256withRSA',
            'paypal-transmission-sig': 'signature',
        },
        body: JSON.stringify({
            id: 'EVENT-1',
            event_type: 'PAYMENT.CAPTURE.COMPLETED',
            resource: { id: 'CAPTURE-1', amount: { value: '5.00', currency_code: 'USD' } },
        }),
    }),
    { fetch: paypalFetch, clientId: 'client', clientSecret: 'secret', environment: 'sandbox', webhookId: 'WH-1' },
);
assert.equal(paypalEvent.provider, 'paypal');
assert.equal(paypalEvent.state, 'ACTIVE');
assert.equal(paypalEvent.amount, 5);

let pagaditoStep = 0;
const pagaditoFetch: typeof fetch = async (input, init) => {
    const url = String(input);
    if (pagaditoStep++ === 0) return jsonResponse({ code: 'PG1001', value: 'connection-token' });
    assert.match(String(init?.body), /billing-ref-3/);
    return jsonResponse({ code: 'PG1002', value: 'https://sandbox.pagadito.com/checkout/token-3' });
};

const pagadito = await createPagaditoCheckout({
    reference: 'billing-ref-3',
    amount: 2,
    description: 'Apoyo Conecta+',
    returnUrl: 'https://conectaplus.app/billing/return',
}, { fetch: pagaditoFetch, uid: 'uid', wsk: 'wsk', environment: 'sandbox' });
assert.equal(pagadito.providerResourceId, 'billing-ref-3');
assert.match(pagadito.redirectUrl, /sandbox\.pagadito\.com/);

const invalidPagaditoRequest = new Request('https://conectaplus.app/api/billing/webhooks/pagadito', {
    method: 'POST',
    headers: {
        'PAGADITO-SIGNATURE': 'invalid',
        'PAGADITO-AUTH-ALGO': 'RSA-SHA256',
        'PAGADITO-CERT-URL': 'https://certs.example.invalid/pagadito.pem',
        'PAGADITO-NOTIFICATION-ID': 'N-1',
        'PAGADITO-NOTIFICATION-TIMESTAMP': '2026-01-10T00:00:00Z',
    },
    body: JSON.stringify({ id: 'EVENT-2', event_type: 'TRANSACTION.STATUS.CHANGE', resource: { status: 'COMPLETED' } }),
});
await assert.rejects(
    parsePagaditoWebhook(invalidPagaditoRequest, { fetch: async () => new Response('not a cert'), uid: 'uid', wsk: 'wsk', environment: 'sandbox', certHosts: ['certs.example.invalid'] }),
    /invalid Pagadito webhook signature/,
);

console.log('billing provider tests: PASS');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

import { createVerify } from 'node:crypto';
import type { NormalizedBillingEvent } from '../types';
import { billingFetch } from '../http';

type PagaditoConfig = {
    fetch?: typeof fetch;
    uid: string;
    wsk: string;
    environment: 'sandbox' | 'live';
    certHosts?: string[];
    wspgUrl?: string;
};

type PagaditoCheckoutInput = {
    reference: string;
    amount: number;
    description: string;
    returnUrl: string;
};

function endpoint(config: PagaditoConfig) {
    if (config.wspgUrl) return config.wspgUrl;
    return config.environment === 'live'
        ? 'https://comercios.pagadito.com/wspg/charges.php'
        : 'https://sandbox.pagadito.com/comercios/wspg/charges.php';
}

function xmlEscape(value: string) {
    return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]!));
}

function soapEnvelope(operation: string, values: Record<string, string>) {
    const args = Object.entries(values).map(([key, value]) => `<${key}>${xmlEscape(value)}</${key}>`).join('');
    return `<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:wspg"><soapenv:Body><urn:${operation}>${args}</urn:${operation}></soapenv:Body></soapenv:Envelope>`;
}

function parseResponse(text: string): Record<string, string> {
    try {
        const parsed = JSON.parse(text);
        return Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, String(value)]));
    } catch {
        const result: Record<string, string> = {};
        for (const key of ['code', 'message', 'value', 'datetime']) {
            const match = text.match(new RegExp(`<${key}[^>]*>([\\s\\S]*?)</${key}>`, 'i'));
            if (match) result[key] = match[1];
        }
        return result;
    }
}

async function callPagadito(operation: string, values: Record<string, string>, config: PagaditoConfig) {
    const fetchImpl = config.fetch ?? fetch;
    const response = await billingFetch(fetchImpl, endpoint(config), {
        method: 'POST',
        headers: { 'content-type': 'text/xml; charset=utf-8', SOAPAction: `urn:ws#${operation}` },
        body: soapEnvelope(operation, values),
    });
    if (!response.ok) throw new Error(`Pagadito request failed: ${response.status}`);
    const result = parseResponse(await response.text());
    if (!result.code) throw new Error('invalid Pagadito response');
    return result;
}

function assertPagaditoSuccess(result: Record<string, string>, code: string) {
    if (result.code !== code) throw new Error(`Pagadito request rejected: ${result.code}`);
}

export async function createPagaditoCheckout(input: PagaditoCheckoutInput, config: PagaditoConfig) {
    if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error('invalid billing amount');
    const connected = await callPagadito('connect', { uid: config.uid, wsk: config.wsk, format_return: 'json' }, config);
    assertPagaditoSuccess(connected, 'PG1001');
    const registered = await callPagadito('exec_trans', {
        token: connected.value,
        ern: input.reference,
        amount: input.amount.toFixed(2),
        details: JSON.stringify([{ quantity: '1', description: input.description, price: input.amount.toFixed(2), url_product: input.returnUrl }]),
        format_return: 'json',
        currency: 'USD',
    }, config);
    assertPagaditoSuccess(registered, 'PG1002');
    if (!registered.value) throw new Error('Pagadito checkout URL missing');
    return { providerResourceId: input.reference, redirectUrl: registered.value };
}

function crc32(value: string) {
    let crc = 0xffffffff;
    for (let index = 0; index < value.length; index += 1) {
        crc ^= value.charCodeAt(index);
        for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function header(request: Request, name: string) {
    return request.headers.get(name) ?? request.headers.get(name.toLowerCase());
}

function normalizeAlgorithm(value: string) {
    return value.toUpperCase().includes('SHA256') ? 'RSA-SHA256' : value;
}

async function verifyPagaditoWebhook(body: string, request: Request, config: PagaditoConfig, eventId: string) {
    const signature = header(request, 'PAGADITO-SIGNATURE');
    const algorithm = header(request, 'PAGADITO-AUTH-ALGO');
    const certUrl = header(request, 'PAGADITO-CERT-URL');
    const notificationId = header(request, 'PAGADITO-NOTIFICATION-ID');
    const timestamp = header(request, 'PAGADITO-NOTIFICATION-TIMESTAMP');
    if (!signature || !algorithm || !certUrl || !notificationId || !timestamp) throw new Error('Pagadito webhook headers missing');
    const certificateUrl = new URL(certUrl);
    if (certificateUrl.protocol !== 'https:' || !(config.certHosts ?? []).includes(certificateUrl.hostname)) {
        throw new Error('Pagadito certificate host not allowed');
    }
    const fetchImpl = config.fetch ?? fetch;
    const certificateResponse = await billingFetch(fetchImpl, certificateUrl, { method: 'GET', redirect: 'error' });
    if (!certificateResponse.ok) throw new Error('Pagadito certificate unavailable');
    const certificate = await certificateResponse.text();
    const signed = `${notificationId}|${timestamp}|${eventId}|${crc32(body)}|${config.wsk}`;
    try {
        const verifier = createVerify(normalizeAlgorithm(algorithm));
        verifier.update(signed);
        verifier.end();
        if (!verifier.verify(certificate, signature, 'base64')) throw new Error('invalid Pagadito webhook signature');
    } catch (error) {
        if (error instanceof Error && error.message === 'invalid Pagadito webhook signature') throw error;
        throw new Error('invalid Pagadito webhook signature');
    }
}

export async function parsePagaditoWebhook(request: Request, config: PagaditoConfig): Promise<NormalizedBillingEvent> {
    const body = await request.text();
    let event: any;
    try {
        event = JSON.parse(body);
    } catch {
        throw new Error('invalid Pagadito webhook JSON');
    }
    const eventId = String(event.id ?? '');
    await verifyPagaditoWebhook(body, request, config, eventId);
    const resource = event.resource ?? {};
    const status = String(resource.status ?? '').toUpperCase();
    const state = status === 'COMPLETED'
        ? 'ACTIVE'
        : status === 'EXPIRED'
            ? 'EXPIRED'
            : status === 'REJECTED'
                ? 'REVERSED'
                : 'PENDING';
    const total = resource.amount?.total;
    return {
        provider: 'pagadito',
        providerEventId: eventId,
        eventType: String(event.event_type ?? ''),
        providerResourceId: String(resource.token ?? resource.ern ?? resource.reference ?? eventId),
        internalReference: resource.reference ?? resource.ern,
        amount: total === undefined ? undefined : Number(total),
        currency: resource.amount?.currency ? String(resource.amount.currency) : undefined,
        state,
        occurredAt: resource.update_timestamp ? new Date(resource.update_timestamp) : undefined,
    };
}

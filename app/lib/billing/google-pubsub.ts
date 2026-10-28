import { createVerify } from 'node:crypto';
import { billingFetch } from './http';

type PubSubConfig = { audience: string; fetch?: typeof fetch };
let certificateCache: { expiresAt: number; certificates: Record<string, string> } | null = null;

function decodePart(value: string) {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as Record<string, any>;
}

async function certificates(fetchImpl: typeof fetch) {
    if (certificateCache && certificateCache.expiresAt > Date.now()) return certificateCache.certificates;
    const response = await billingFetch(fetchImpl, 'https://www.googleapis.com/oauth2/v1/certs', { redirect: 'error' });
    if (!response.ok) throw new Error('Google Pub/Sub certificates unavailable');
    const body = await response.json() as Record<string, string>;
    const cacheControl = response.headers.get('cache-control') || '';
    const maxAge = Number(cacheControl.match(/max-age=(\d+)/i)?.[1] || 300);
    certificateCache = { certificates: body, expiresAt: Date.now() + Math.min(maxAge, 3600) * 1000 };
    return body;
}

export async function verifyGooglePubSubRequest(request: Request, config: PubSubConfig) {
    const authorization = request.headers.get('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Google Pub/Sub authorization missing');
    const header = decodePart(parts[0]);
    const payload = decodePart(parts[1]);
    if (header.alg !== 'RS256' || !header.kid || (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com')) throw new Error('invalid Google Pub/Sub authorization');
    if (payload.aud !== config.audience || typeof payload.exp !== 'number' || payload.exp <= Math.floor(Date.now() / 1000)) throw new Error('invalid Google Pub/Sub claims');
    const certificate = (await certificates(config.fetch ?? fetch))[header.kid];
    if (!certificate) throw new Error('Google Pub/Sub certificate not found');
    const verifier = createVerify('RSA-SHA256');
    verifier.update(`${parts[0]}.${parts[1]}`);
    verifier.end();
    if (!verifier.verify(certificate, parts[2], 'base64url')) throw new Error('invalid Google Pub/Sub signature');
    return payload;
}

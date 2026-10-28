import type { ProviderMessage } from './prompts';

const DEFAULT_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_MODEL = 'nvidia/llama-3.3-nemotron-super-49b-v1';

export type NvidiaErrorCode = 'NOT_CONFIGURED' | 'UNAVAILABLE' | 'INVALID_RESPONSE';

export class NvidiaProviderError extends Error {
    constructor(public readonly code: NvidiaErrorCode) {
        super(code);
        this.name = 'NvidiaProviderError';
        Object.setPrototypeOf(this, NvidiaProviderError.prototype);
    }
}

function providerContent(value: unknown): string | null {
    if (typeof value === 'string') return value.trim() || null;
    if (!Array.isArray(value)) return null;
    const text = value
        .filter((part): part is { type?: string; text?: string } => typeof part === 'object' && part !== null)
        .map((part) => part.text || '')
        .join('')
        .trim();
    return text || null;
}

export async function createNvidiaResponse(messages: ProviderMessage[], timeoutMs = 30000): Promise<string> {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) throw new NvidiaProviderError('NOT_CONFIGURED');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(process.env.NVIDIA_API_URL || DEFAULT_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.NVIDIA_MODEL || DEFAULT_MODEL,
                messages,
                max_tokens: 700,
                temperature: 0.6,
                stream: false,
            }),
            signal: controller.signal,
        });

        if (!response.ok) throw new NvidiaProviderError('UNAVAILABLE');
        const payload = await response.json() as { choices?: Array<{ message?: { content?: unknown } }> };
        const content = providerContent(payload.choices?.[0]?.message?.content);
        if (!content) throw new NvidiaProviderError('INVALID_RESPONSE');
        return content;
    } catch (error) {
        if (error instanceof NvidiaProviderError) throw error;
        throw new NvidiaProviderError('UNAVAILABLE');
    } finally {
        clearTimeout(timeout);
    }
}

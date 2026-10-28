export const AI_CHAT_LIMIT = 5;
export const AI_CHAT_WINDOW_MS = 2 * 60 * 60 * 1000;
export const MAX_MESSAGE_LENGTH = 2000;
export const CHAT_HISTORY_LIMIT = 50;
export const PROVIDER_HISTORY_LIMIT = 12;

export const AI_CHAT_MODES = ['companion', 'bible', 'prayer', 'struggle'] as const;
export type AiChatMode = (typeof AI_CHAT_MODES)[number];
export type AiMessageRole = 'USER' | 'ASSISTANT';

export function isAiChatMode(value: unknown): value is AiChatMode {
    return typeof value === 'string' && (AI_CHAT_MODES as readonly string[]).includes(value);
}

export function normalizeMessage(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const normalized = value.trim();
    if (!normalized || normalized.length > MAX_MESSAGE_LENGTH) return null;
    return normalized;
}

export function firstName(value: string | null | undefined): string {
    const name = value?.trim().split(/\s+/)[0];
    return name && name.toLowerCase() !== 'invitado' ? name : 'amigo';
}

function normalizeForSearch(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

export function isCrisisSignal(value: string): boolean {
    const text = normalizeForSearch(value);
    return [
        /\bsuicid\w*\b/,
        /\b(quitarme la vida|matarme|hacerme dano|no quiero vivir|quiero morir)\b/,
        /\b(me voy a matar|me quiero matar|me voy a quitar la vida|plan para suicid\w*)\b/,
        /\b(me violaron|abuso sexual|me golpean|me estan golpeando|me están golpeando)\b/,
    ].some((pattern) => pattern.test(text));
}

export type QuotaTimestamp = { createdAt: Date | string };

export function getQuotaState(messages: QuotaTimestamp[], now = new Date()) {
    const cutoff = now.getTime() - AI_CHAT_WINDOW_MS;
    const recent = messages
        .map((message) => new Date(message.createdAt))
        .filter((createdAt) => !Number.isNaN(createdAt.getTime()) && createdAt.getTime() >= cutoff)
        .sort((a, b) => a.getTime() - b.getTime());
    const oldest = recent[0];
    const resetAt = oldest ? new Date(oldest.getTime() + AI_CHAT_WINDOW_MS) : null;
    return {
        used: recent.length,
        remaining: Math.max(0, AI_CHAT_LIMIT - recent.length),
        resetAt,
    };
}

export function formatQuotaReset(resetAt: Date | null, now = new Date()): string | null {
    if (!resetAt || resetAt.getTime() <= now.getTime()) return null;
    return resetAt.toISOString();
}

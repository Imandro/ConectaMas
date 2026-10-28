import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getApiUser } from '@/app/lib/api-auth';
import { prisma } from '@/app/lib/prisma';
import { createNvidiaResponse, NvidiaProviderError } from '@/app/lib/ai/nvidia';
import { buildProviderMessages, selectVerseForMessage, type ActiveStruggle } from '@/app/lib/ai/prompts';
import {
    AI_CHAT_LIMIT,
    AI_CHAT_WINDOW_MS,
    CHAT_HISTORY_LIMIT,
    PROVIDER_HISTORY_LIMIT,
    firstName,
    formatQuotaReset,
    getQuotaState,
    isAiChatMode,
    isCrisisSignal,
    normalizeMessage,
    type AiChatMode,
    type AiMessageRole,
} from '@/app/lib/ai/policy';

export const dynamic = 'force-dynamic';

const USER_ROLE: AiMessageRole = 'USER';
const ASSISTANT_ROLE: AiMessageRole = 'ASSISTANT';

class AiQuotaError extends Error {
    constructor(public readonly resetAt: Date | null) {
        super('AI_CHAT_QUOTA_EXCEEDED');
        this.name = 'AiQuotaError';
        Object.setPrototypeOf(this, AiQuotaError.prototype);
    }
}

type ChatUser = {
    id: string;
    name: string | null;
    preferredLanguage: string;
    aiContextEnabled: boolean;
    struggles: Array<{ title: string; status: string; currentDay: number }>;
};

function serializeMessage(message: { id: string; role: string; content: string; mode: string | null; createdAt: Date }) {
    return {
        id: message.id,
        role: message.role as AiMessageRole,
        content: message.content,
        mode: message.mode || undefined,
        createdAt: message.createdAt.toISOString(),
    };
}

async function loadQuota(userId: string, now = new Date()) {
    const messages = await prisma.aiChatMessage.findMany({
        where: {
            userId,
            role: USER_ROLE,
            createdAt: { gte: new Date(now.getTime() - AI_CHAT_WINDOW_MS) },
        },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
    });
    const quota = getQuotaState(messages, now);
    return { remaining: quota.remaining, resetAt: formatQuotaReset(quota.resetAt, now) };
}

async function reserveUserMessage(userId: string, content: string, mode: AiChatMode) {
    return prisma.$transaction(async (tx) => {
        // Serialize quota reservations per user. Neon runs PostgreSQL, so advisory locks avoid concurrent overuse.
        await tx.$queryRaw(Prisma.sql`SELECT pg_advisory_xact_lock(hashtext(${userId}))`);
        const now = new Date();
        const recent = await tx.aiChatMessage.findMany({
            where: {
                userId,
                role: USER_ROLE,
                createdAt: { gte: new Date(now.getTime() - AI_CHAT_WINDOW_MS) },
            },
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
        const quota = getQuotaState(recent, now);
        if (quota.remaining <= 0) throw new AiQuotaError(quota.resetAt);

        const message = await tx.aiChatMessage.create({
            data: { userId, role: USER_ROLE, mode, content },
        });
        const afterCreate = getQuotaState([...recent, message], now);
        return {
            message,
            remaining: afterCreate.remaining,
            resetAt: formatQuotaReset(afterCreate.resetAt, now),
        };
    });
}

async function loadMessages(userId: string, take: number) {
    const messages = await prisma.aiChatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take,
        select: { id: true, role: true, content: true, mode: true, createdAt: true },
    });
    return messages.reverse();
}

function crisisResponse(language: string) {
    if (language.toLowerCase().startsWith('en')) {
        return 'I am glad you told me. Your safety matters. Please contact emergency services or someone you trust now, and open Conecta+ SOS for immediate support. I will stay with you while you take that next step.';
    }
    return 'Me alegra que lo hayas contado. Tu seguridad importa. Contacta ahora a emergencias o a alguien de confianza y abre el espacio SOS de Conecta+ para recibir ayuda inmediata. Me quedo contigo mientras das ese siguiente paso.';
}

function responseError(message: string, status: number, details?: Record<string, unknown>) {
    return NextResponse.json({ code: message, ...details }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request) {
    const user = await getApiUser(request, {
        id: true,
        aiContextEnabled: true,
        aiContextConsentAt: true,
    }) as { id: string; aiContextEnabled: boolean; aiContextConsentAt: Date | null } | null;
    if (!user) return responseError('Unauthorized', 401);

    const [messages, quota] = await Promise.all([
        loadMessages(user.id, CHAT_HISTORY_LIMIT),
        loadQuota(user.id),
    ]);
    return NextResponse.json({
        messages: messages.map(serializeMessage),
        limit: AI_CHAT_LIMIT,
        ...quota,
        contextEnabled: user.aiContextEnabled,
        contextConsentAt: user.aiContextConsentAt?.toISOString() || null,
    }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
    const user = await getApiUser(request, {
        id: true,
        name: true,
        preferredLanguage: true,
        aiContextEnabled: true,
        struggles: { where: { status: 'ACTIVE' }, orderBy: { updatedAt: 'desc' }, take: 8, select: { title: true, status: true, currentDay: true } },
    }) as ChatUser | null;
    if (!user) return responseError('Unauthorized', 401);

    const body = await request.json().catch(() => ({})) as { message?: unknown; mode?: unknown };
    const message = normalizeMessage(body.message);
    if (!message) return responseError('INVALID_MESSAGE', 400);
    if (!isAiChatMode(body.mode)) return responseError('INVALID_MODE', 400);

    let reservation: Awaited<ReturnType<typeof reserveUserMessage>>;
    try {
        reservation = await reserveUserMessage(user.id, message, body.mode);
    } catch (error) {
        if (error instanceof AiQuotaError) {
            return responseError('AI_CHAT_QUOTA_EXCEEDED', 429, {
                remaining: 0,
                resetAt: error.resetAt?.toISOString() || null,
                limit: AI_CHAT_LIMIT,
            });
        }
        console.error('[AI_CHAT] Could not reserve message');
        return responseError('AI_UNAVAILABLE', 503);
    }

    if (isCrisisSignal(message)) {
        const assistant = await prisma.aiChatMessage.create({
            data: { userId: user.id, role: ASSISTANT_ROLE, mode: body.mode, content: crisisResponse(user.preferredLanguage) },
        });
        return NextResponse.json({
            message: serializeMessage(assistant),
            remaining: reservation.remaining,
            resetAt: reservation.resetAt,
            safety: 'sos',
        }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const verse = selectVerseForMessage(message);
    const previousMessages = user.aiContextEnabled
        ? (await loadMessages(user.id, PROVIDER_HISTORY_LIMIT + 1))
            .filter((item) => item.id !== reservation.message.id)
            .map((item) => ({ role: item.role as AiMessageRole, content: item.content }))
        : [];
    const context: Parameters<typeof buildProviderMessages>[0] = {
        firstName: firstName(user.name),
        language: user.preferredLanguage,
        mode: body.mode,
        contextEnabled: user.aiContextEnabled,
        activeStruggles: user.struggles as ActiveStruggle[],
        verse,
    };

    let answer: string;
    try {
        answer = await createNvidiaResponse(buildProviderMessages(context, previousMessages, message));
    } catch (error) {
        const code = error instanceof NvidiaProviderError ? error.code : 'UNAVAILABLE';
        console.error('[AI_CHAT] Provider unavailable:', code);
        return responseError('AI_UNAVAILABLE', 503, {
            remaining: reservation.remaining,
            resetAt: reservation.resetAt,
        });
    }

    const assistant = await prisma.aiChatMessage.create({
        data: { userId: user.id, role: ASSISTANT_ROLE, mode: body.mode, content: answer },
    });
    return NextResponse.json({
        message: serializeMessage(assistant),
        remaining: reservation.remaining,
        resetAt: reservation.resetAt,
        verse: { reference: verse.reference, text: verse.text },
        safety: 'normal',
    }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: Request) {
    const userId = (await getApiUser(request, { id: true }))?.id;
    if (!userId) return responseError('Unauthorized', 401);
    await prisma.aiChatMessage.deleteMany({ where: { userId } });
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
}

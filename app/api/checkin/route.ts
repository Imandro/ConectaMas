import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';
import {
    beginIdempotentOperation,
    finalizeIdempotentOperation,
} from '@/app/lib/idempotency';
import { decideCheckin } from '@/app/lib/conflicts/checkin';
export const dynamic = 'force-dynamic';

const OPERATION = 'CHECK_IN';

function createIdempotencyKey() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function dayKeyFromDate(value: Date) {
    return [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join('-');
}

function responseBody(value: unknown) {
    return JSON.parse(JSON.stringify(value));
}

export async function POST(req: Request) {
    let idempotencyInput: { userId: string; idempotencyKey: string; operation: string } | null = null;
    let operationStarted = false;
    try {
        const userId = await getApiUserId(req);

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { mood, note } = body;
        const bodyKey = typeof body.idempotencyKey === 'string' ? body.idempotencyKey.trim() : '';
        const idempotencyKey = req.headers.get('Idempotency-Key')?.trim() || bodyKey || createIdempotencyKey();
        idempotencyInput = { userId, idempotencyKey, operation: OPERATION };

        const idempotency = await beginIdempotentOperation(idempotencyInput);
        if (idempotency.kind === 'replay') {
            return NextResponse.json(idempotency.response, { status: idempotency.statusCode });
        }
        if (idempotency.kind === 'in_progress') {
            return NextResponse.json({
                message: 'La operación sigue procesándose. Reintenta con la misma clave.',
                retryable: true,
                idempotencyKey,
            }, { status: 409 });
        }
        operationStarted = true;

        const finish = async (body: unknown, status: number) => {
            const safeBody = responseBody(body);
            await finalizeIdempotentOperation({
                ...idempotencyInput!,
                response: safeBody,
                statusCode: status,
                status: status >= 500 ? 'FAILED' : 'COMPLETED',
            });
            return NextResponse.json(safeBody, { status });
        };

        if (!mood) {
            return finish({ message: 'Mood is required' }, 400);
        }

        const requestedDayKey = typeof body.dayKey === 'string' && body.dayKey.trim()
            ? body.dayKey.trim()
            : dayKeyFromDate(new Date());
        const todayKey = dayKeyFromDate(new Date());
        const initialDecision = decideCheckin(
            { userId, idempotencyKey, dayKey: requestedDayKey },
            [],
            todayKey,
        );

        if (initialDecision.decision === 'reject') {
            return finish({
                message: initialDecision.reason === 'future-day'
                    ? 'No puedes registrar un check-in de un día futuro'
                    : 'dayKey debe tener el formato YYYY-MM-DD y ser una fecha válida',
                dayKey: requestedDayKey,
            }, initialDecision.reason === 'future-day' ? 409 : 400);
        }

        const dayStart = new Date(`${requestedDayKey}T00:00:00`);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        const existingCheckins = await prisma.dailyCheckin.findMany({
            where: {
                userId,
                OR: [
                    { dayKey: requestedDayKey },
                    { dayKey: null, createdAt: { gte: dayStart, lt: dayEnd } },
                ],
            },
            select: { userId: true, dayKey: true, createdAt: true },
        });
        const decision = decideCheckin(
            { userId, idempotencyKey, dayKey: requestedDayKey },
            existingCheckins.map((checkin) => ({
                userId: checkin.userId,
                idempotencyKey: '',
                dayKey: checkin.dayKey || dayKeyFromDate(checkin.createdAt),
            })),
            todayKey,
        );

        if (decision.decision === 'reject') {
            return finish({
                message: decision.reason === 'future-day'
                    ? 'No puedes registrar un check-in de un día futuro'
                    : 'dayKey debe tener el formato YYYY-MM-DD y ser una fecha válida',
                dayKey: requestedDayKey,
            }, decision.reason === 'future-day' ? 409 : 400);
        }

        if (decision.decision === 'duplicate') {
            if (decision.reason === 'idempotent-retry') {
                return finish({ message: 'Check-in saved', dayKey: decision.dayKey }, 200);
            }
            return finish({ message: 'Ya has realizado tu check-in de hoy', dayKey: decision.dayKey }, 429);
        }

        // 2. Create Check-in
        await prisma.dailyCheckin.create({
            data: {
                userId: userId,
                mood,
                note: note || null,
                dayKey: decision.dayKey,
            }
        });

        // 3. Update Streak & Mascot Experience
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let streak = await prisma.streak.findUnique({
            where: { userId: userId }
        });

        if (!streak) {
            streak = await prisma.streak.create({
                data: {
                    userId: userId,
                    currentStreak: 1,
                    longestStreak: 1,
                    lastActivity: new Date(),
                }
            });
        } else {
            const lastActivity = new Date(streak.lastActivity);
            lastActivity.setHours(0, 0, 0, 0);

            if (lastActivity.getTime() === yesterday.getTime()) {
                // Consecutive day
                streak = await prisma.streak.update({
                    where: { userId: userId },
                    data: {
                        currentStreak: { increment: 1 },
                        lastActivity: new Date(),
                        longestStreak: { set: Math.max(streak.longestStreak, streak.currentStreak + 1) }
                    }
                });
            } else if (lastActivity.getTime() < yesterday.getTime()) {
                // Streak broken
                streak = await prisma.streak.update({
                    where: { userId: userId },
                    data: {
                        currentStreak: 1,
                        lastActivity: new Date(),
                    }
                });
            } else {
                // Already did an activity today (probably something else that updates streak)
                // Just update the timestamp to be safe
                streak = await prisma.streak.update({
                    where: { userId: userId },
                    data: {
                        lastActivity: new Date(),
                    }
                });
            }
        }

        // 4. Update Mascot Mood (Optional but good for Llami)
        try {
            await prisma.mascot.update({
                where: { userId: userId },
                data: {
                    mood: mood === '😔' ? 'TRISTE' : 'FELIZ',
                    lastFed: new Date(),
                    experience: { increment: 5 }
                }
            }).catch(() => null); // Ignore if mascot doesn't exist yet
        } catch { }

        return finish({
            message: 'Check-in saved',
            streak: streak.currentStreak,
            dayKey: decision.dayKey,
        }, 201);

    } catch (error) {
        console.error('Checkin Error:', error);
        const body = { message: 'Server Error' };
        if (idempotencyInput && operationStarted) {
            try {
                await finalizeIdempotentOperation({
                    ...idempotencyInput,
                    response: body,
                    statusCode: 500,
                    status: 'FAILED',
                });
            } catch (finalizeError) {
                console.error('Checkin idempotency finalize error:', finalizeError);
            }
        }
        return NextResponse.json(body, { status: 500 });
    }
}

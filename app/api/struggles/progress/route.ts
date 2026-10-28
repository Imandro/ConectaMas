import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';
import {
    beginIdempotentOperation,
    finalizeIdempotentOperation,
} from '@/app/lib/idempotency';
import { mergeProgress } from '@/app/lib/conflicts/progress';

const prismaAny = prisma;
const OPERATION = 'STRUGGLE_PROGRESS';

function createIdempotencyKey() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function responseBody(value: unknown) {
    return JSON.parse(JSON.stringify(value));
}

export async function PATCH(req: Request) {
    let idempotencyInput: { userId: string; idempotencyKey: string; operation: string } | null = null;
    let operationStarted = false;
    try {
        const userId = await getApiUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, action, dayNumber } = body;
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

        const finish = async (value: unknown, status: number) => {
            const safeValue = responseBody(value);
            await finalizeIdempotentOperation({
                ...idempotencyInput!,
                response: safeValue,
                statusCode: status,
                status: status >= 500 ? 'FAILED' : 'COMPLETED',
            });
            return NextResponse.json(safeValue, { status });
        };

        if (!id) {
            return finish({ message: 'ID is required' }, 400);
        }

        const userStruggle = await prismaAny.userStruggle.findFirst({
            where: { id, userId }
        });

        if (!userStruggle) {
            return finish({ message: 'Struggle not found' }, 404);
        }

        let updated;
        const isOfflineQueue = body.offline === true || req.headers.get('X-Sync-Queue') === '1';

        if (action === 'START') {
            if (isOfflineQueue) {
                return finish({
                    message: 'START requiere conexión y no puede llegar desde la cola offline',
                    conflict: 'online-only',
                    retryable: false,
                }, 409);
            }
            updated = await prismaAny.userStruggle.update({
                where: { id },
                data: {
                    isStarted: true,
                    startDate: new Date()
                }
            });
        } else if (action === 'ADVANCE') {
            if (dayNumber === undefined || dayNumber === null || dayNumber === '') {
                return finish({ message: 'Day number is required' }, 400);
            }

            const merge = mergeProgress(userStruggle, { action: 'ADVANCE', dayNumber: Number(dayNumber) });
            if (merge.decision === 'blocked') {
                return finish({
                    message: 'El progreso recibido entra en conflicto con el estado actual',
                    conflict: 'invalid-progress',
                    retryable: false,
                }, 409);
            }
            if (merge.decision === 'ignore') {
                return finish(userStruggle, 200);
            }

            updated = await prismaAny.userStruggle.update({
                where: { id },
                data: merge.data,
            });
        } else if (action === 'OVERCOME') {
            const merge = mergeProgress(userStruggle, { action: 'OVERCOME' });
            if (merge.decision === 'ignore') {
                return finish(userStruggle, 200);
            }
            updated = await prismaAny.userStruggle.update({
                where: { id },
                data: merge.data,
            });
        } else if (action === 'RESET') {
            if (isOfflineQueue) {
                return finish({
                    message: 'RESET requiere conexión y no puede llegar desde la cola offline',
                    conflict: 'online-only',
                    retryable: false,
                }, 409);
            }
            updated = await prismaAny.userStruggle.update({
                where: { id },
                data: {
                    status: "ACTIVE",
                    currentDay: 1,
                    completedDays: "",
                    isStarted: false,
                }
            });
        } else {
            return finish({ message: 'Invalid action' }, 400);
        }

        return finish(updated, 200);

    } catch (error) {
        console.error('Update Struggle Error:', error);
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
                console.error('Struggle idempotency finalize error:', finalizeError);
            }
        }
        return NextResponse.json(body, { status: 500 });
    }
}

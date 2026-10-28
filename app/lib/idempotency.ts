import { Prisma } from '@prisma/client';
import type { MutationReceipt, PrismaClient } from '@prisma/client';

export const MUTATION_RECEIPT_STATUS = {
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
} as const;

export const IDEMPOTENCY_PROCESSING_TTL_MS = 5 * 60 * 1000;

export type MutationReceiptStatus = (typeof MUTATION_RECEIPT_STATUS)[keyof typeof MUTATION_RECEIPT_STATUS];
export type IdempotencyResponse = Prisma.JsonValue;
export type IdempotencyInput = {
    userId: string;
    idempotencyKey: string;
    operation: string;
};

export type IdempotencyResult =
    | { kind: 'started'; receipt: MutationReceipt }
    | { kind: 'in_progress'; receipt: MutationReceipt }
    | { kind: 'replay'; receipt: MutationReceipt; response: IdempotencyResponse; statusCode: number };

export type IdempotencyDatabase = Pick<PrismaClient, 'mutationReceipt'>;

export type FinalizeIdempotentOperationInput = IdempotencyInput & {
    response: IdempotencyResponse;
    statusCode: number;
    status?: Extract<MutationReceiptStatus, 'COMPLETED' | 'FAILED'>;
};

async function getDatabase(database?: IdempotencyDatabase) {
    if (database) return database;
    return (await import('./prisma')).prisma;
}

function validateInput({ userId, idempotencyKey, operation }: IdempotencyInput) {
    if (!userId.trim()) throw new Error('userId is required');
    if (!idempotencyKey.trim()) throw new Error('idempotencyKey is required');
    if (!operation.trim()) throw new Error('operation is required');
}

function validateStatusCode(statusCode: number) {
    if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode > 599) {
        throw new Error('statusCode must be an HTTP status code');
    }
}

function assertOperation(receipt: MutationReceipt, operation: string) {
    if (receipt.operation !== operation) {
        throw new Error('idempotencyKey is already used for another operation');
    }
}

function classifyReceipt(receipt: MutationReceipt, operation: string): IdempotencyResult {
    assertOperation(receipt, operation);

    if (receipt.status === MUTATION_RECEIPT_STATUS.PROCESSING) {
        return { kind: 'in_progress', receipt };
    }

    if (
        (receipt.status === MUTATION_RECEIPT_STATUS.COMPLETED || receipt.status === MUTATION_RECEIPT_STATUS.FAILED) &&
        receipt.statusCode !== null
    ) {
        return {
            kind: 'replay',
            receipt,
            response: receipt.response,
            statusCode: receipt.statusCode,
        };
    }

    throw new Error('mutation receipt is in an invalid state');
}

async function reclaimStaleReceipt(
    input: IdempotencyInput,
    receipt: MutationReceipt,
    database: IdempotencyDatabase,
) {
    if (receipt.status !== MUTATION_RECEIPT_STATUS.PROCESSING) return null;
    if (Date.now() - receipt.updatedAt.getTime() < IDEMPOTENCY_PROCESSING_TTL_MS) return null;

    const reclaimed = await database.mutationReceipt.updateMany({
        where: {
            userId: input.userId,
            idempotencyKey: input.idempotencyKey,
            operation: input.operation,
            status: MUTATION_RECEIPT_STATUS.PROCESSING,
            updatedAt: receipt.updatedAt,
        },
        data: { updatedAt: new Date() },
    });

    if (reclaimed.count !== 1) return null;
    return getIdempotencyReceipt(input, database);
}

function isUniqueConstraintError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError
        ? error.code === 'P2002'
        : typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

export async function getIdempotencyReceipt(
    input: IdempotencyInput,
    database?: IdempotencyDatabase,
): Promise<MutationReceipt | null> {
    validateInput(input);
    const db = await getDatabase(database);
    const { userId, idempotencyKey } = input;

    const receipt = await db.mutationReceipt.findUnique({
        where: { userId_idempotencyKey: { userId, idempotencyKey } },
    });

    if (receipt) assertOperation(receipt, input.operation);
    return receipt;
}

export async function beginIdempotentOperation(
    input: IdempotencyInput,
    database?: IdempotencyDatabase,
): Promise<IdempotencyResult> {
    validateInput(input);
    const db = await getDatabase(database);
    const existing = await getIdempotencyReceipt(input, db);
    if (existing) {
        const reclaimed = await reclaimStaleReceipt(input, existing, db);
        if (reclaimed) return { kind: 'started', receipt: reclaimed };
        return classifyReceipt(existing, input.operation);
    }

    try {
        const receipt = await db.mutationReceipt.create({
            data: {
                userId: input.userId,
                idempotencyKey: input.idempotencyKey,
                operation: input.operation,
                status: MUTATION_RECEIPT_STATUS.PROCESSING,
            },
        });
        return { kind: 'started', receipt };
    } catch (error) {
        if (!isUniqueConstraintError(error)) throw error;

        const racedReceipt = await getIdempotencyReceipt(input, db);
        if (!racedReceipt) throw error;
        return classifyReceipt(racedReceipt, input.operation);
    }
}

export async function finalizeIdempotentOperation(
    input: FinalizeIdempotentOperationInput,
    database?: IdempotencyDatabase,
): Promise<MutationReceipt> {
    validateInput(input);
    validateStatusCode(input.statusCode);
    const db = await getDatabase(database);
    const status = input.status ?? MUTATION_RECEIPT_STATUS.COMPLETED;

    const result = await db.mutationReceipt.updateMany({
        where: {
            userId: input.userId,
            idempotencyKey: input.idempotencyKey,
            operation: input.operation,
            status: MUTATION_RECEIPT_STATUS.PROCESSING,
        },
        data: {
            status,
            response: input.response === null ? Prisma.JsonNull : (input.response as Prisma.InputJsonValue),
            statusCode: input.statusCode,
        },
    });

    const receipt = await getIdempotencyReceipt(input, db);
    if (!receipt) throw new Error('cannot finalize a missing mutation receipt');
    assertOperation(receipt, input.operation);

    if (result.count === 0 && receipt.status === MUTATION_RECEIPT_STATUS.PROCESSING) {
        throw new Error('mutation receipt could not be finalized');
    }

    return receipt;
}

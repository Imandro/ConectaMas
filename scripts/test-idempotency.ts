import assert from 'node:assert/strict';

import {
    beginIdempotentOperation,
    finalizeIdempotentOperation,
    IDEMPOTENCY_PROCESSING_TTL_MS,
    type IdempotencyDatabase,
} from '../app/lib/idempotency';

type Receipt = {
    id: string;
    userId: string;
    idempotencyKey: string;
    operation: string;
    status: string;
    response: unknown;
    statusCode: number | null;
    createdAt: Date;
    updatedAt: Date;
};

const receipts = new Map<string, Receipt>();
let nextId = 1;

const receiptKey = (userId: string, idempotencyKey: string) => `${userId}:${idempotencyKey}`;

const fakeDatabase = {
    mutationReceipt: {
        async findUnique({ where }: any) {
            return receipts.get(receiptKey(where.userId_idempotencyKey.userId, where.userId_idempotencyKey.idempotencyKey)) ?? null;
        },
        async create({ data }: any) {
            const key = receiptKey(data.userId, data.idempotencyKey);
            if (receipts.has(key)) {
                throw Object.assign(new Error('unique constraint'), { code: 'P2002' });
            }

            const now = new Date();
            const receipt = {
                id: `receipt-${nextId++}`,
                ...data,
                status: data.status ?? 'PROCESSING',
                response: data.response ?? null,
                statusCode: data.statusCode ?? null,
                createdAt: now,
                updatedAt: now,
            } satisfies Receipt;
            receipts.set(key, receipt);
            return receipt;
        },
        async updateMany({ where, data }: any) {
            const receipt = receipts.get(receiptKey(where.userId, where.idempotencyKey));
            if (!receipt || receipt.operation !== where.operation || receipt.status !== where.status) return { count: 0 };
            Object.assign(receipt, data, { updatedAt: new Date() });
            return { count: 1 };
        },
    },
} as unknown as IdempotencyDatabase;

async function main() {
    const input = { userId: 'user-1', idempotencyKey: 'key-1', operation: 'CHECK_IN' };
    const [first, second] = await Promise.all([
        beginIdempotentOperation(input, fakeDatabase),
        beginIdempotentOperation(input, fakeDatabase),
    ]);

    assert.equal([first, second].filter((result) => result.kind === 'started').length, 1);
    assert.equal([first, second].filter((result) => result.kind === 'in_progress').length, 1);

    await finalizeIdempotentOperation(
        { ...input, response: { ok: true, id: 'check-in-1' }, statusCode: 201 },
        fakeDatabase,
    );

    const replay = await beginIdempotentOperation(input, fakeDatabase);
    assert.equal(replay.kind, 'replay');
    if (replay.kind === 'replay') {
        assert.deepEqual(replay.response, { ok: true, id: 'check-in-1' });
        assert.equal(replay.statusCode, 201);
    }

    const repeatedFinish = await finalizeIdempotentOperation(
        { ...input, response: { ok: false }, statusCode: 500 },
        fakeDatabase,
    );
    assert.equal(repeatedFinish.statusCode, 201);

    const staleInput = { userId: 'user-1', idempotencyKey: 'stale-key', operation: 'CHECK_IN' };
    const staleDate = new Date(Date.now() - IDEMPOTENCY_PROCESSING_TTL_MS - 1);
    receipts.set(receiptKey(staleInput.userId, staleInput.idempotencyKey), {
        id: 'receipt-stale',
        ...staleInput,
        status: 'PROCESSING',
        response: null,
        statusCode: null,
        createdAt: staleDate,
        updatedAt: staleDate,
    });
    const reclaimed = await beginIdempotentOperation(staleInput, fakeDatabase);
    assert.equal(reclaimed.kind, 'started');
}

main().then(() => console.log('idempotency self-check passed'));

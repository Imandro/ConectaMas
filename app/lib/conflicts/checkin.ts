export interface CheckinPayload {
    userId: string;
    idempotencyKey: string;
    dayKey: string;
}

export interface ExistingCheckin {
    userId: string;
    idempotencyKey: string;
    dayKey: string;
}

export type CheckinDecision =
    | { decision: 'apply'; dayKey: string; idempotencyKey: string }
    | { decision: 'duplicate'; reason: 'idempotent-retry' | 'same-day'; dayKey: string }
    | { decision: 'reject'; reason: 'invalid-day-key' | 'future-day' };

function isValidDayKey(dayKey: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return false;

    const timestamp = Date.parse(`${dayKey}T00:00:00.000Z`);
    return !Number.isNaN(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === dayKey;
}

export function decideCheckin(
    payload: CheckinPayload,
    existing: readonly ExistingCheckin[],
    todayKey: string,
): CheckinDecision {
    if (!isValidDayKey(payload.dayKey)) {
        return { decision: 'reject', reason: 'invalid-day-key' };
    }

    if (payload.dayKey > todayKey) {
        return { decision: 'reject', reason: 'future-day' };
    }

    const userCheckins = existing.filter((checkin) => checkin.userId === payload.userId);

    if (userCheckins.some((checkin) => checkin.idempotencyKey === payload.idempotencyKey)) {
        return { decision: 'duplicate', reason: 'idempotent-retry', dayKey: payload.dayKey };
    }

    if (userCheckins.some((checkin) => checkin.dayKey === payload.dayKey)) {
        return { decision: 'duplicate', reason: 'same-day', dayKey: payload.dayKey };
    }

    return { decision: 'apply', dayKey: payload.dayKey, idempotencyKey: payload.idempotencyKey };
}

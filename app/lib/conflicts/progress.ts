export type ProgressState = {
    status?: string;
    currentDay?: number;
    completedDays?: string | readonly number[];
};

export type ProgressAction =
    | { action: 'ADVANCE'; dayNumber: number }
    | { action: 'OVERCOME' }
    | { action: 'START' }
    | { action: 'RESET' };

export type ProgressDecision = 'apply' | 'ignore' | 'blocked';

export type NormalizedProgress = {
    status: string;
    currentDay: number;
    completedDays: string;
};

export type ProgressMergeResult = {
    decision: ProgressDecision;
    data: NormalizedProgress;
};

const MAX_DAY = 21;
const OVERCOME_STATUS = 'vencido';

function normalizeDays(completedDays: ProgressState['completedDays']): number[] {
    const values: readonly (number | string)[] = typeof completedDays === 'string'
        ? completedDays.split(',')
        : (completedDays || []);

    return Array.from(new Set(values.map((day) => Number(day)))).filter((day) => Number.isInteger(day) && day >= 1 && day <= MAX_DAY).sort((a, b) => a - b);
}

function normalizeCurrentDay(currentDay: ProgressState['currentDay']): number {
    if (!Number.isFinite(currentDay)) return 1;
    return Math.min(Math.max(Math.trunc(currentDay as number), 1), MAX_DAY);
}

function normalizeProgress(progress: ProgressState): NormalizedProgress {
    const status = progress.status?.toLowerCase() === OVERCOME_STATUS ? OVERCOME_STATUS : (progress.status || 'ACTIVE');
    return {
        status,
        currentDay: status === OVERCOME_STATUS ? MAX_DAY : normalizeCurrentDay(progress.currentDay),
        completedDays: normalizeDays(progress.completedDays).join(','),
    };
}

function isOvercome(status: string): boolean {
    return status.toLowerCase() === OVERCOME_STATUS;
}

function sameProgress(left: NormalizedProgress, right: NormalizedProgress): boolean {
    return left.status === right.status
        && left.currentDay === right.currentDay
        && left.completedDays === right.completedDays;
}

export function mergeProgress(
    current: ProgressState,
    operation: ProgressAction,
): ProgressMergeResult {
    const normalized = normalizeProgress(current);

    if (operation.action === 'START' || operation.action === 'RESET') {
        return { decision: 'blocked', data: normalized };
    }

    if (isOvercome(normalized.status)) {
        return { decision: 'ignore', data: normalized };
    }

    if (operation.action === 'OVERCOME') {
        return {
            decision: 'apply',
            data: {
                status: OVERCOME_STATUS,
                currentDay: MAX_DAY,
                completedDays: normalized.completedDays,
            },
        };
    }

    if (!Number.isInteger(operation.dayNumber) || operation.dayNumber < 1 || operation.dayNumber > MAX_DAY) {
        return { decision: 'blocked', data: normalized };
    }

    const completedDays = normalizeDays(normalized.completedDays);
    const isDuplicate = completedDays.includes(operation.dayNumber);
    const data: NormalizedProgress = {
        status: normalized.status,
        currentDay: isDuplicate
            ? normalized.currentDay
            : Math.max(normalized.currentDay, Math.min(operation.dayNumber + 1, MAX_DAY)),
        completedDays: normalizeDays(`${normalized.completedDays},${operation.dayNumber}`).join(','),
    };

    return { decision: sameProgress(normalized, data) ? 'ignore' : 'apply', data };
}

const attempts = new Map<string, { count: number; resetAt: number }>();

// shortcut: process-local limits reset on restart; replace with shared storage before multi-instance production.

export function allowBillingRequest(key: string, limit = 12, windowMs = 60_000) {
    const now = Date.now();
    const current = attempts.get(key);
    if (!current || current.resetAt <= now) {
        attempts.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }
    if (current.count >= limit) return false;
    current.count += 1;
    return true;
}

export async function billingFetch(fetchImpl: typeof fetch, input: RequestInfo | URL, init?: RequestInit, timeoutMs = 15_000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetchImpl(input, { ...init, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

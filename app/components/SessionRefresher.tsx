"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

const SESSION_REFRESH_TTL = 24 * 60 * 60 * 1000;

export default function SessionRefresher() {
    const { data: session, update } = useSession();
    const hasRefreshed = useRef(false);
    const refreshedUser = useRef<string | null>(null);

    useEffect(() => {
        const user = session?.user as { id?: string; email?: string } | undefined;
        const userKey = user?.id || user?.email || null;
        if (!userKey) {
            refreshedUser.current = null;
            hasRefreshed.current = false;
            return;
        }

        if (refreshedUser.current !== userKey) {
            refreshedUser.current = userKey;
            hasRefreshed.current = false;
        }

        const storageKey = `conecta:session-refresh:${userKey}`;
        let refreshedAt = 0;
        try {
            refreshedAt = Number(sessionStorage.getItem(storageKey)) || 0;
        } catch {
            // Session storage may be unavailable in private browsing.
        }

        if (Date.now() - refreshedAt < SESSION_REFRESH_TTL || hasRefreshed.current) return;

        // Refresh at most once per user per day to avoid auth traffic on every app reload.
        const doRefresh = async () => {
            if (!navigator.onLine) return;
            try {
                await update({});
                try {
                    sessionStorage.setItem(storageKey, String(Date.now()));
                } catch {
                    // Session storage may be unavailable in private browsing.
                }
                hasRefreshed.current = true;
            } catch {
                // A refresh failure must not affect the active session.
            }
        };

        // Use a small timeout to let app hydrate.
        const timer = setTimeout(doRefresh, 2000);
        return () => clearTimeout(timer);
    }, [session, update]);

    return null;
}

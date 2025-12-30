"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function SessionRefresher() {
    const { data: session, update } = useSession();
    const hasRefreshed = useRef(false);

    useEffect(() => {
        if (session?.user && !hasRefreshed.current) {
            // Logic: The new "light" session shouldn't have leaderPhone or extended fields.
            // But checking for them in 'session' object might fail if Typescript stripped them 
            // even if they exist in the runtime object.
            // Safer bet: Just refresh ONCE per load to ensure clean cookie.

            // To avoid infinite loops, we simple trigger update once on mount.
            // The browser will send the old cookie, server responds with new light set-cookie.
            // The 494 error happens when SENDING, so if they loaded this, they succcessfully sent the header.
            // By triggering `update()`, we force a re-write response.

            const doRefresh = async () => {
                console.log("[SessionRefresher] Triggering session cleanup/update...");
                await update({});
                hasRefreshed.current = true;
            };

            // Using a small timeout to let app hydrate
            const timer = setTimeout(doRefresh, 2000);
            return () => clearTimeout(timer);
        }
    }, [session, update]);

    return null;
}

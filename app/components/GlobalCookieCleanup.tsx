'use client';

import { useEffect } from 'react';

export default function GlobalCookieCleanup() {
    useEffect(() => {
        // EMERGENCY COOKIE CLEANUP LOGIC
        // This runs on EVERY page load to ensure we catch the 494 error loop.

        try {
            const cookies = document.cookie.split(";");
            let cleaned = false;

            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

                // CRITERIA: Delete if it refers to next-auth OR if it's suspciously large (>100 chars? varies)
                // We target "next-auth.session-token" chunks specifically which cause the bloat.
                // We also strip any legacy keys impacting header size.

                if (
                    name.includes('next-auth') ||
                    name.includes('__Secure') || // Catch secure chunks
                    cookie.length > 2000 // Lower size threshold to catch medium-large blockers
                ) {
                    // WE MUST ATTEMPT TO DELETE ON ALL COMMON PATHS/DOMAINS
                    // because we don't know where the bad cookie was set.
                    const domains = [
                        window.location.hostname,
                        '.' + window.location.hostname,
                        window.location.hostname.replace('www.', ''),
                        '.' + window.location.hostname.replace('www.', '')
                    ];

                    const paths = ['/', '/dashboard', '/auth'];

                    domains.forEach(d => {
                        paths.forEach(p => {
                            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}; domain=${d}`;
                            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p};`; // No domain fallback
                        });
                    });

                    cleaned = true;
                }
            }

            if (cleaned) {
                console.warn("GlobalCookieCleanup: Large/Corrupt cookies have been purged to prevent 494 errors.");
                // Optional: Force reload if we cleaned something, to ensure next request is clean?
                // window.location.reload(); // Risky loop, better to just let next interaction work.
            }
        } catch (e) {
            console.error("Cookie cleanup failed", e);
        }
    }, []);

    return null; // This component renders nothing
}

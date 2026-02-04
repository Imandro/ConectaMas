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

                // Target anything related to auth or suspected bloat
                if (
                    name.includes('next-auth') ||
                    name.includes('__Secure') ||
                    name.includes('callback-url') ||
                    cookie.length > 1000 // Even lower threshold for proactive cleanup
                ) {
                    const domains = [
                        window.location.hostname,
                        '.' + window.location.hostname,
                        window.location.hostname.replace('www.', ''),
                        '.' + window.location.hostname.replace('www.', '')
                    ];

                    const paths = ['/', '/dashboard', '/auth', '/api/auth'];

                    domains.forEach(d => {
                        paths.forEach(p => {
                            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}; domain=${d}`;
                            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p};`;
                        });
                    });

                    cleaned = true;
                }
            }

            if (cleaned) {
                console.warn("GlobalCookieCleanup: Purged suspected bloat.");
                // We don't reload here unless we are specifically on an error/offline page
                // to avoid infinite refresh loops.
            }
        } catch (e) {
            console.error("Cookie cleanup failed", e);
        }
    }, []);

    return null; // This component renders nothing
}

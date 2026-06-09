import NextAuth from "next-auth";
import { authConfig } from "@/app/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    // 1. EARLY INTERVENTION: Check header size BEFORE anything else
    // This breaks the 494 loop immediately if cookies are poisoned.
    const cookieHeader = req.headers.get('cookie') || "";
    if (cookieHeader.length > 2000) {
        // If header is > 2.5KB, it's a danger zone.
        // We force clear EVERYTHING on the next response.
        const response = NextResponse.next();
        response.headers.set('Clear-Site-Data', '"cookies", "storage"');
        console.warn("CRITICAL: Detected huge cookies (Header size: " + cookieHeader.length + "). Nuking site data.");
        // We also clear specific chunks as a backup
        req.cookies.getAll().forEach(cookie => {
            if (cookie.name.includes('next-auth')) {
                response.cookies.delete(cookie.name);
            }
        });
        return response;
    }

    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isPublicPage = req.nextUrl.pathname === '/';
    const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');
    const isGuestCookie = req.cookies.get('conectaplus_guest')?.value === 'true';

    // Allow guests to access dashboard (their ID is stored in localStorage, checked client-side)
    if (isDashboardPage && !isLoggedIn && isGuestCookie) {
        // Guest access granted — continue
        const response = NextResponse.next();
        // Secondary Cleanup to keep headers small
        req.cookies.getAll().forEach(cookie => {
            if (cookie.name.includes('next-auth.callback-url') || cookie.name.includes('next-auth.csrf-token')) {
                response.cookies.delete(cookie.name);
            }
        });
        return response;
    }

    // Protect Dashboard and Onboarding
    if (isDashboardPage || req.nextUrl.pathname.startsWith('/onboarding')) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
    }

    // Redirect logged-in users away from Auth pages and Landing
    if (isLoggedIn) {
        if (isAuthPage || isPublicPage) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    const response = NextResponse.next();

    // Secondary Cleanup for logged in users to keep headers small
    if (isLoggedIn) {
        req.cookies.getAll().forEach(cookie => {
            if (cookie.name.includes('next-auth.callback-url') || cookie.name.includes('next-auth.csrf-token')) {
                response.cookies.delete(cookie.name);
            }
        });
    }

    return response;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|ads.txt|.well-known).*)'],
};

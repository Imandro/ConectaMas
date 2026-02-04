import NextAuth from "next-auth";
import { authConfig } from "@/app/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isPublicPage = req.nextUrl.pathname === '/';

    // Protect Dashboard and Onboarding
    if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/onboarding')) {
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

    // FINAL SAFEGUARD: If cookies are dangerously large, force a total site data clear.
    // This is the "Nuclear Option" requested to prevent users being stuck.
    const cookieHeader = req.headers.get('cookie') || "";
    if (cookieHeader.length > 3500) {
        // If header is > 3.5KB, we are in danger zone (Vercel limit ~4KB-8KB).
        // Sending this header tells the browser to DELETE ALL COOKIES for this origin.
        response.headers.set('Clear-Site-Data', '"cookies", "storage"');
        console.log("CRITICAL: Detected large cookie header. Wiping site data.");
        return response;
    }

    // Cleanup unnecessary cookies after login to prevent "Headers Too Large"
    if (isLoggedIn) {
        // ... (rest of cleanup logic) ...
        req.cookies.getAll().forEach(cookie => {
            if (cookie.name.includes('next-auth')) {
                response.cookies.delete(cookie.name);
            }
        });
    }

    return response;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|ads.txt).*)'],
};

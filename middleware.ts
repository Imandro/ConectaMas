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

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)'],
};

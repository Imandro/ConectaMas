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

    // Cleanup unnecessary cookies after login to prevent "Headers Too Large"
    if (isLoggedIn) {
        // Clear callback URL and CSRF token as they are only needed during the auth flow
        const cookiesToClear = [
            'next-auth.callback-url',
            'next-auth.csrf-token',
            '__Secure-next-auth.callback-url',
            '__Secure-next-auth.csrf-token'
        ];

        cookiesToClear.forEach(cookieName => {
            if (req.cookies.has(cookieName)) {
                response.cookies.delete(cookieName);
            }
        });
    }

    return response;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|ads.txt).*)'],
};

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
    // Cleanup unnecessary cookies after login to prevent "Headers Too Large"
    if (isLoggedIn) {
        // Clear callback URL and CSRF token as they are only needed during the auth flow
        // Also try to clear any "chunked" legacy cookies if possible (though we can't wildcard delete easily)
        const cookiesToClear = [
            'next-auth.callback-url',
            'next-auth.csrf-token',
            '__Secure-next-auth.callback-url',
            '__Secure-next-auth.csrf-token',
            // Add other potential culprits
            'next-auth.state',
            '__Secure-next-auth.state',
            'next-auth.pkce.code_verifier',
            '__Secure-next-auth.pkce.code_verifier'
        ];

        cookiesToClear.forEach(cookieName => {
            if (req.cookies.has(cookieName)) {
                response.cookies.delete(cookieName);
            }
        });

        // Iterate over all cookies to find and delete stale auth chunks
        // NextAuth splits large cookies into chunks like __Secure-next-auth.session-token.0, .1, etc.
        // We must clean these up if we are trying to fix a 494 error.

        req.cookies.getAll().forEach(cookie => {
            if (
                cookie.name.includes('next-auth.session-token.') ||
                cookie.name.includes('__Secure-next-auth.session-token.') ||
                cookie.name.includes('next-auth.callback-url') ||
                cookie.name.includes('next-auth.csrf-token') ||
                cookie.name.includes('next-auth.pkce') ||
                cookie.name.includes('next-auth.state')
            ) {
                // If it's a chunk or a temp cookie, nuke it.
                // NOTE: This might log the user out if we delete the *active* session chunks,
                // but that is acceptable/desired to fix the corrupted state.
                response.cookies.delete(cookie.name);
            }
        });
    }

    return response;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|ads.txt).*)'],
};

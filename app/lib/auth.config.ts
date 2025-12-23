import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },
    callbacks: {
        authorized({ auth, request: nextUrl }) {
            const isLoggedIn = !!auth?.user;

            // This logic is currently handled in middleware wrapper, 
            // but NextAuth authorized callback is the standard way.
            // For now we just return true/false to helper middleware logic.
            return isLoggedIn;
        },
    },
    providers: [], // Providers configured in auth.ts
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    trustHost: true,
} satisfies NextAuthConfig;

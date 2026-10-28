import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import { User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import { isAllowedEmail, isEmailIdentifier } from '@/app/lib/email-validation';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email o Usuario", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const rawIdentifier = credentials.identifier || (credentials as { email?: string }).email;
                const identifier = typeof rawIdentifier === 'string' ? rawIdentifier : '';
                const password = typeof credentials.password === 'string' ? credentials.password : '';

                if (!identifier || !password) return null;

                const normalizedIdentifier = identifier.trim().toLowerCase();
                if (isEmailIdentifier(normalizedIdentifier) && !isAllowedEmail(normalizedIdentifier)) return null;
                // Find user by email OR username (both lowercase)
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: { equals: normalizedIdentifier, mode: 'insensitive' } },
                            { username: { equals: normalizedIdentifier, mode: 'insensitive' } },
                            // Fallback for username without @ if user types @username (just in case)
                            { username: { equals: normalizedIdentifier.replace('@', ''), mode: 'insensitive' } }
                        ]
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        preferredLanguage: true,
                        region: true,
                        passwordHash: true,
                    },
                });

                if (!user || !user.passwordHash) {
                    return null;
                }

                const isValid = await bcrypt.compare(password, user.passwordHash);

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    preferredLanguage: user.preferredLanguage,
                    region: user.region,
                    // IMAGE REMOVED TO PREVENT 494 ERRORS
                };
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }: { token: JWT, user: User | null, trigger?: "signIn" | "signUp" | "update", session?: Session }) {
            // STRICT WHITELIST APPROACH ("Blindado")
            // Reconstructing the token with ABSOLUTELY MINIMAL data.
            // NO IMAGES allowed in the JWT.

            if (user) {
                return {
                    id: user.id || '',
                    name: user.name ? user.name.split(' ')[0] : 'Usuario',
                    email: user.email || '',
                    preferredLanguage: user.preferredLanguage,
                    region: user.region,
                };
            }

            // On session update
            if (trigger === "update" && session?.user) {
                return {
                    ...token,
                    name: session.user.name ? session.user.name.split(' ')[0] : token.name,
                    preferredLanguage: session.user.preferredLanguage || token.preferredLanguage,
                    region: session.user.region || token.region,
                    // picture blocked here too
                };
            }

            // FINAL FILTER: Ensure only minimal fields exist
            return {
                id: token.id,
                name: token.name,
                email: token.email,
                preferredLanguage: token.preferredLanguage,
                region: token.region,
                sub: token.sub,
                iat: token.iat,
                exp: token.exp,
                jti: token.jti
            };
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            if (token && session.user) {
                session.user.id = token.sub || token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.preferredLanguage = token.preferredLanguage;
                session.user.region = token.region;
            }
            return session;
        },
    },
});

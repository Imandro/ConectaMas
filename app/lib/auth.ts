import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import { User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";

console.log("NextAuth initialized with AUTH_SECRET status:", !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET));

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
                const identifier = (credentials.identifier as string || (credentials as { email?: string }).email) as string;
                const password = credentials.password as string;

                if (!identifier || !password) return null;

                const normalizedIdentifier = identifier.trim().toLowerCase();
                console.log("[Auth] Attempting authorize for:", normalizedIdentifier);

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
                });

                if (!user || !user.passwordHash) {
                    console.log("[Auth] User not found or no password hash for:", normalizedIdentifier);
                    return null;
                }

                const isValid = await bcrypt.compare(password, user.passwordHash);

                if (!isValid) {
                    console.log("[Auth] Invalid password for:", identifier);
                    return null;
                }

                console.log("[Auth] Successful authorize for:", identifier);

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
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
                console.log("[Auth] JWT Callback: Initializing token for user:", user.email);
                return {
                    id: user.id || '',
                    name: user.name ? user.name.split(' ')[0] : 'Usuario',
                    email: user.email || '',
                };
            }

            // On session update
            if (trigger === "update" && session?.user) {
                return {
                    ...token,
                    name: session.user.name ? session.user.name.split(' ')[0] : token.name,
                    // picture blocked here too
                };
            }

            // FINAL FILTER: Ensure only minimal fields exist
            return {
                id: token.id,
                name: token.name,
                email: token.email,
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
                session.user.image = undefined; // Force undefined for UI
            }
            return session;
        },
    },
});

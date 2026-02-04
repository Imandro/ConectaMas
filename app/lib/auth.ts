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
                    image: user.image,
                    // We can't return arbitrary fields here easily without updating types, 
                    // but we can fetch them in session callback
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
            // We reconstruct the token from scratch to ensure NO hidden large objects survive.

            if (user) {
                console.log("[Auth] JWT Callback: Initializing token for user:", user.email);
                // SANITIZATION: Check if image is massive (base64)
                let safePicture = user.image;
                if (safePicture && safePicture.length > 500) {
                    console.warn("[Auth] User image is too large (base64?), stripping from token to prevent 494 error.");
                    safePicture = null; // Fallback to initial/null
                }

                return {
                    id: user.id || '',
                    name: user.name ? user.name.split(' ')[0] : 'Usuario',
                    email: user.email || '',
                    picture: safePicture,
                    // Standard JWT fields handled by NextAuth automatically (sub, iat, exp, jti) usually, 
                    // but returning a fresh object might wipe them if not careful during updates.
                    // However, `token` passed in already has them. 
                    // To be safe and "blindado", we explicitly pick what we want from `token` if it exists.
                };
            }

            // On session update
            if (trigger === "update" && session?.user) {
                // If updating, we only update specific fields, but we MUST ensure we don't merge garbage.
                // Sanitize updated picture too
                const newPicture = session.user.image || token.picture;
                const safePicture = (newPicture && newPicture.length > 500) ? null : newPicture;

                return {
                    ...token, // Keep existing safe token
                    name: session.user.name ? session.user.name.split(' ')[0] : token.name,
                    picture: safePicture,
                };
            }

            // FINAL FILTER: Even if no user/trigger (just a rote check), 
            // ensure the token returned is ONLY our expected shape.
            // This strips any "zombie" fields that might be clinging to the cookie.
            return {
                id: token.id,
                name: token.name,
                email: token.email,
                picture: token.picture,
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
                session.user.image = token.picture;
                // REMOVED: leaderPhone, isPremium, etc.
            }
            return session;
        },
    },
});

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
                            { email: normalizedIdentifier },
                            { username: normalizedIdentifier }
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
            // On sign in, populate token with minimal user data
            if (user) {
                console.log("[Auth] JWT Callback: Initializing token for user:", user.email);
                token.id = user.id || '';
                // Store only first name to save space
                token.name = user.name ? user.name.split(' ')[0] : 'Usuario';
                token.email = user.email || '';
                token.picture = user.image;
            }

            // On session update, we might want to allow updating the name/image
            if (trigger === "update" && session?.user) {
                if (session.user.name) token.name = session.user.name.split(' ')[0];
                if (session.user.image) token.picture = session.user.image;
            }

            // AGGRESSIVE CLEANUP: Remove old legacy fields to ensure cookie deflates
            // Short codes used previously: lp, st, co, ip
            delete token.lp;
            delete token.st;
            delete token.co;
            delete token.ip;
            // Full names just in case
            delete token.leaderPhone;
            delete token.hasSeenTutorialTour;
            delete token.hasCompletedOnboarding;
            delete token.isPremium;
            delete token.role; // Permissions handling moved to DB

            return token;
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

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

console.log("NextAuth initialized with AUTH_SECRET status:", !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET));

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email o Usuario", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    return null;
                }

                const identifier = credentials.identifier as string;
                const password = credentials.password as string;

                console.log("[Auth] Attempting authorize for:", identifier);

                // Find user by email OR username
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: identifier.toLowerCase() },
                            { username: identifier } // Username comparison (case sensitive or not? usually case insensitive but lets keep simple first)
                        ]
                    },
                });

                if (!user || !user.passwordHash) {
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
        async jwt({ token, user, trigger, session }: { token: any, user: any, trigger?: string, session?: any }) {
            // On sign in, populate token with user data
            if (user) {
                console.log("[Auth] JWT Callback: Initializing token for user:", user.email);
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.picture = user.image;
            }

            // On session update, refresh user data from database
            if (token.sub) {
                try {
                    const dbUser = await (prisma as any).user.findUnique({
                        where: { id: token.sub },
                        select: {
                            name: true,
                            email: true,
                            image: true,
                            leaderPhone: true,
                            hasSeenTutorialTour: true,
                            hasCompletedOnboarding: true,
                            isPremium: true
                        }
                    });

                    if (dbUser) {
                        token.name = dbUser.name;
                        token.email = dbUser.email;
                        token.picture = dbUser.image;
                        token.leaderPhone = dbUser.leaderPhone;
                        token.hasSeenTutorialTour = dbUser.hasSeenTutorialTour;
                        token.hasCompletedOnboarding = dbUser.hasCompletedOnboarding;
                        token.isPremium = dbUser.isPremium;
                    }
                } catch (error) {
                    console.error("JWT callback error:", error);
                }
            }

            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (token && session.user) {
                session.user.id = token.sub || token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.leaderPhone = token.leaderPhone;
                session.user.hasSeenTutorialTour = token.hasSeenTutorialTour;
                session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;
                session.user.isPremium = token.isPremium;
            }
            return session;
        },
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
        csrfToken: {
            name: `next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
});

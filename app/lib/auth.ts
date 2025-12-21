import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
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
                    return null;
                }

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
        async session({ session, token }: { session: any, token: any }) {
            if (token && session.user) {
                session.user.id = token.sub;

                try {
                    const user = await (prisma as any).user.findUnique({
                        where: { id: token.sub },
                        select: {
                            leaderPhone: true,
                            hasSeenTutorialTour: true,
                            hasCompletedOnboarding: true
                        }
                    });

                    if (user) {
                        session.user.leaderPhone = (user as any).leaderPhone;
                        session.user.hasSeenTutorialTour = (user as any).hasSeenTutorialTour;
                        session.user.hasCompletedOnboarding = (user as any).hasCompletedOnboarding;
                    }
                } catch (error) {
                    console.error("Session callback prisma error:", error);
                }
            }
            return session;
        },
    },
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "change_me_in_production",
    trustHost: true,
    debug: process.env.NODE_ENV === "development",
});

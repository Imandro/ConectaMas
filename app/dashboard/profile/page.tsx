import { auth } from "@/app/lib/auth";
export const dynamic = "force-dynamic";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import ProfileView, { type ProfileUser } from "./ProfileView";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/auth/login");
    }

    let user;
    try {
        user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                name: true,
                email: true,

                gender: true,
                spiritualLevel: true,
                hasCompletedOnboarding: true,
                role: true,
                leaderPhone: true,
                username: true,
                lastUsernameChange: true,
                age: true,
                // New Fields
                bio: true,
                profileType: true,

                country: true,
                league: true,
                weeklyXP: true,
                totalXP: true,
            }
        });
    } catch {
        const fallbackUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                name: true,
                email: true,

            }
        });

        user = fallbackUser ? {
            ...fallbackUser,
            gender: null,
            spiritualLevel: "Explorador",
            username: null,
            lastUsernameChange: null,
            age: null,
        } : null;
    }

    if (!user) {
        redirect("/auth/login");
    }

    return <ProfileView user={user as ProfileUser} />;
}

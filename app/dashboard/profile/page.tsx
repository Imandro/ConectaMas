import { auth } from "@/app/lib/auth";
export const dynamic = "force-dynamic";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import ProfileView from "./ProfileView";

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
                bannerUrl: true,
                country: true,
                league: true,
                weeklyXP: true,
                totalXP: true,
            } as any
        });
    } catch (e) {
        user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                name: true,
                email: true,

            }
        });

        if (user) {
            const u = user as any;
            u.gender = null;
            u.spiritualLevel = "Explorador";
            u.hasCompletedOnboarding = true;
            u.username = null;
            u.lastUsernameChange = null;
            u.age = null;
        }
    }

    if (!user) {
        redirect("/auth/login");
    }

    return <ProfileView user={user} />;
}

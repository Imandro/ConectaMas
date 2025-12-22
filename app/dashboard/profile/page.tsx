import { auth } from "@/app/lib/auth";
export const dynamic = "force-dynamic";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { LogOut, RefreshCcw, User } from "lucide-react";
import ClientProfileActions from "./ClientProfileActions";
import ProfileHeader from "./ProfileHeader";
import PushNotificationManager from "@/app/components/PushNotificationManager";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/auth/login");
    }

    let user;
    try {
        // Attempt to fetch with gender (requires updated Prisma Client)
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
            } as any
        });
    } catch (e) {
        // Fallback: Fetch MINIMAL data if Schema is outdated (avoids crash)
        user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                name: true,
                email: true,
                // Exclude ALL potentially new fields to prevent crash
            }
        });

        // Manual patch for missing fields so UI doesn't break
        if (user) {
            const u = user as any;
            u.gender = null;
            u.spiritualLevel = "Explorador"; // Default
            u.hasCompletedOnboarding = true; // Assume true to not block, or false.
        }
    }

    if (!user) {
        redirect("/auth/login");
    }

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <h1 className="fw-bold text-secondary mb-4">Mi Perfil</h1>

            <ProfileHeader
                user={{
                    name: (user as any).name,
                    email: (user as any).email,
                    image: (user as any).image,
                    spiritualLevel: (user as any).spiritualLevel
                }}
            />

            <div className="border-top pt-4">
                <div className="row g-3">
                    <div className="col-6">
                        <label className="small text-muted fw-bold">Género</label>
                        <p className="fw-medium">
                            {/* @ts-ignore: Gender might be missing in old client gen */}
                            {user.gender === 'MALE' ? 'Hombre 👨' : user.gender === 'FEMALE' ? 'Mujer 👩' : 'No especificado'}
                        </p>
                    </div>
                </div>
            </div>

            <PushNotificationManager />

            <div className="card border-0 shadow-sm bg-white rounded-4 p-4">
                <h5 className="fw-bold mb-4">Ajustes de Cuenta</h5>

                <ClientProfileActions
                    userRole={(user as any).role || 'USER'}
                    initialLeaderPhone={(user as any).leaderPhone}
                />
            </div>
        </div >
    );
}

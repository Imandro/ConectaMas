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
                username: true,
                lastUsernameChange: true,
                age: true,
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
                    spiritualLevel: (user as any).spiritualLevel,
                    username: (user as any).username,
                    lastUsernameChange: (user as any).lastUsernameChange ? (user as any).lastUsernameChange.toISOString() : null,
                    age: (user as any).age
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

                <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase">Legal</h6>
                    <a href="/terms" target="_blank" className="text-decoration-none text-muted small d-flex align-items-center gap-2">
                        <span className="bg-light p-1 rounded-circle"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></span>
                        Términos y Condiciones
                    </a>
                </div>
            </div>
        </div >
    );
}

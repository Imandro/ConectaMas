import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import MascotCustomizer from "./MascotCustomizer";
import { getMascotData } from "./actions";

export default async function MascotPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/login");

    // Fetch or create functionality handled in component/action interaction, 
    // but initially we need data.
    // Let's rely on the action's "getOrCreate" equivalent or just fetch here safely.
    let mascot = await prisma.mascot.findUnique({
        where: { userId: session.user.id }
    });

    // Pre-create if missing for page load stability
    if (!mascot) {
        mascot = await prisma.mascot.create({
            data: {
                userId: session.user.id,
                name: session.user.name?.split(' ')[0] || "Llami",
                outfit: "none",
                // Allow immediate first change
                lastOutfitChange: new Date(Date.now() - (15 * 24 * 60 * 60 * 1000))
            }
        });
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <MascotCustomizer
                        initialMascot={mascot}
                        userName={session.user.name || "Viajero"}
                    />
                </div>
            </div>
        </div>
    );
}

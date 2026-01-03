import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { ShieldAlert, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import StruggleTracker from "../components/StruggleTracker";

export default async function LuchasPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/login");
    }

    const userId = (session.user as any).id;

    const prismaAny = prisma as any;
    const struggles = await prismaAny.userStruggle.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
    });

    const plans = await prismaAny.strugglePlan.findMany({
        include: { days: { select: { id: true } } }
    });

    // Attach totalDays to each struggle based on matching plan title
    const strugglesWithTotalDays = struggles.map(s => {
        const plan = plans.find((p: any) => p.title.toLowerCase().includes(s.title.toLowerCase()) || s.title.toLowerCase().includes(p.title.toLowerCase()));
        return {
            ...s,
            totalDays: plan?.days?.length || 7
        };
    });

    // Serialize Dates to strings for Client Component compatibility
    const serializableStruggles = JSON.parse(JSON.stringify(strugglesWithTotalDays));

    return (
        <div className="container py-4 min-vh-100 animate-fade-in">
            {/* Header */}
            <header className="d-flex align-items-center gap-3 mb-5">
                <Link href="/dashboard" className="btn btn-light rounded-circle p-2 shadow-sm hover-scale transition-all">
                    <ArrowLeft size={24} className="text-secondary" />
                </Link>
                <div>
                    <h2 className="fw-bold text-secondary m-0">Mi Seguimiento 🛡️</h2>
                    <p className="text-muted m-0">Gestiona tus planes de transformación y victorias.</p>
                </div>
            </header>

            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <StruggleTracker initialStruggles={serializableStruggles} />
                </div>
            </div>

        </div>
    );
}

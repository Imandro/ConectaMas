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

    const struggles = await prisma.userStruggle.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
    });

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
                    <StruggleTracker initialStruggles={struggles as any} />
                </div>
            </div>

        </div>
    );
}

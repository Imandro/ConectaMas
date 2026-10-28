import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import StruggleTracker from "../components/StruggleTracker";
import { getTranslations, Language } from "@/app/lib/getTranslations";
import { Metadata } from 'next';
import SecondaryPageShell from '@/app/components/SecondaryUI';

type Struggle = Record<string, unknown> & { title: string };
type StrugglePlan = { title: string; days: { id: string }[] };

export const metadata: Metadata = {
    title: 'Transformación | Conecta+',
    description: 'Gestiona tus planes de crecimiento espiritual y celebra tus victorias. Un camino paso a paso hacia la madurez.',
};

export default async function LuchasPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { preferredLanguage: true }
    });

    const t = getTranslations((user?.preferredLanguage as Language) || 'es');
    const userId = session.user.id;

    const prismaAny = prisma as unknown as {
        userStruggle: { findMany: (args: Record<string, unknown>) => Promise<Struggle[]> };
        strugglePlan: { findMany: (args: Record<string, unknown>) => Promise<StrugglePlan[]> };
    };
    const struggles = await prismaAny.userStruggle.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
    });

    const plans = await prismaAny.strugglePlan.findMany({
        include: { days: { select: { id: true } } }
    });

    // Attach totalDays to each struggle based on matching plan title
    const strugglesWithTotalDays = struggles.map((s: Struggle) => {
        const plan = plans.find((p: StrugglePlan) => p.title.toLowerCase().includes(s.title.toLowerCase()) || s.title.toLowerCase().includes(p.title.toLowerCase()));
        return {
            ...s,
            totalDays: plan?.days?.length || 7
        };
    });

    // Serialize Dates to strings for Client Component compatibility
    const serializableStruggles = JSON.parse(JSON.stringify(strugglesWithTotalDays));

    return (
        <SecondaryPageShell>
        <div className="container py-4 min-vh-100 animate-fade-in">
            {/* Header */}
            <header className="ui-page-header mb-5">
                <Link href="/dashboard" className="btn btn-light rounded-circle p-2 shadow-sm hover-scale transition-all">
                    <ArrowLeft size={24} className="text-secondary" />
                </Link>
                <div>
                    <h2 className="fw-bold text-secondary m-0">{t.struggles.title}</h2>
                    <p className="text-muted m-0">{t.struggles.subtitle}</p>
                </div>
            </header>

            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <StruggleTracker initialStruggles={serializableStruggles} />
                </div>
            </div>

        </div>
        </SecondaryPageShell>
    );
}

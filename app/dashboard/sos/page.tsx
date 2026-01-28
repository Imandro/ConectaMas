export const dynamic = 'force-dynamic';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Auxilio Espiritual (SOS) | Conecta+',
    description: 'Encuentra paz en momentos de crisis. Acceso inmediato a oraciones, verdades bíblicas y música de adoración para fortalecer tu alma.',
};

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import SOSClient from "./SOSClient";

export default async function EmergencyPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    // Fetch minimal data for functionality (Authorization Layer)
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { leaderPhone: true }
    });

    return <SOSClient leaderPhone={user?.leaderPhone || null} />;
}

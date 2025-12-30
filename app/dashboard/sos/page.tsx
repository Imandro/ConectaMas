export const dynamic = 'force-dynamic';

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

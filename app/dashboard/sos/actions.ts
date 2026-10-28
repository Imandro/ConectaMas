"use server";

import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function getLeaderPhone() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { leaderPhone: true },
    });

    return user?.leaderPhone || null;
}

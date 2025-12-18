'use server';

import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function submitOnboarding(data: {
    spiritualStatus: string;
    sinsToOvercome: string[];
    problemsFaced: string[];
    connectionMethods: string[];
    gender: string;
}) {
    const session = await auth();

    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    const {
        spiritualStatus,
        sinsToOvercome,
        problemsFaced,
        connectionMethods,
        gender
    } = data;

    // Validate required fields
    if (!spiritualStatus || !gender) {
        throw new Error('Spiritual status and gender are required');
    }

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            spiritualStatus,
            sinsToOvercome: JSON.stringify(sinsToOvercome),
            problemsFaced: JSON.stringify(problemsFaced),
            connectionMethods: JSON.stringify(connectionMethods),
            gender,
            hasCompletedOnboarding: true,
        }
    });

    return { success: true };
}

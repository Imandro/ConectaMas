'use server';

import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function submitOnboarding(data: {
    spiritualStatus: string;
    sinsToOvercome: string[];
    problemsFaced: string[];
    connectionMethods: string[];
    gender: string;
    mascotName?: string;
    leaderPhone?: string;
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
        gender,
        mascotName,
        leaderPhone
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
            leaderPhone,
            hasCompletedOnboarding: true,
            // Create or update Mascot
            mascot: {
                upsert: {
                    create: {
                        name: mascotName || 'Llami',
                        mood: 'FELIZ'
                    },
                    update: {
                        name: mascotName || 'Llami'
                    }
                }
            }
        }
    });

    // Create UserStruggle records for tracking
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
        const strugglesToCreate = [
            ...sinsToOvercome.map(s => ({ title: s, type: 'SIN' })),
            ...problemsFaced.map(p => ({ title: p, type: 'PROBLEM' })),
            ...(connectionMethods.includes("Leer la Biblia diariamente") || connectionMethods.includes("Estudiar la Palabra más profundo")
                ? [{ title: "Lectura Bíblica", type: 'CONNECTION' }]
                : [])
        ];

        for (const item of strugglesToCreate) {
            // Check if already exists to avoid duplicates if re-running
            const exists = await prisma.userStruggle.findFirst({
                where: { userId: user.id, title: item.title }
            });

            if (!exists) {
                await prisma.userStruggle.create({
                    data: {
                        userId: user.id,
                        title: item.title,
                        status: 'ACTIVE',
                        startDate: new Date(),
                    }
                });
            }
        }
    }

    return { success: true };
}

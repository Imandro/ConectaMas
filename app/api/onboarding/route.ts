import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const userId = await getApiUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const {
            spiritualStatus,
            sinsToOvercome,
            problemsFaced,
            connectionMethods,
            gender,
            age,
            mascotName,
            leaderPhone
        } = data;

        // Validate required fields
        if (!spiritualStatus || !gender || !age) {
            return NextResponse.json({ message: 'Spiritual status, gender and age are required' }, { status: 400 });
        }

        // Update User
        await prisma.user.update({
            where: { id: userId },
            data: {
                spiritualStatus,
                sinsToOvercome: JSON.stringify(sinsToOvercome || []),
                problemsFaced: JSON.stringify(problemsFaced || []),
                connectionMethods: JSON.stringify(connectionMethods || []),
                gender,
                age: Number(age),
                leaderPhone: leaderPhone || null,
                hasCompletedOnboarding: true,
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

        // Create UserStruggle records
        const strugglesToCreate = [
            ...(sinsToOvercome || []).map((s: string) => ({ title: s, type: 'SIN' })),
            ...(problemsFaced || []).map((p: string) => ({ title: p, type: 'PROBLEM' })),
            ...((connectionMethods || []).includes("Leer la Biblia diariamente") || (connectionMethods || []).includes("Estudiar la Palabra más profundo")
                ? [{ title: "Lectura Bíblica", type: 'CONNECTION' }]
                : [])
        ];

        for (const item of strugglesToCreate) {
            const exists = await prisma.userStruggle.findFirst({
                where: { userId, title: item.title }
            });

            if (!exists) {
                await prisma.userStruggle.create({
                    data: {
                        userId,
                        title: item.title,
                        status: 'ACTIVE',
                        isStarted: false
                    }
                });
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: unknown) {
        console.error('Onboarding API Error:', error);
        return NextResponse.json({
            message: 'Server Error',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

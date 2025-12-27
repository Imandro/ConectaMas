import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const userFromAuth = await getApiUser(req);
        if (!userFromAuth) {
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

        const prismaAny = prisma as any;

        // Update User
        await prismaAny.user.update({
            where: { id: userFromAuth.id },
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
                where: { userId: userFromAuth.id, title: item.title }
            });

            if (!exists) {
                await prismaAny.userStruggle.create({
                    data: {
                        userId: userFromAuth.id,
                        title: item.title,
                        status: 'ACTIVE',
                        isStarted: false
                    }
                });
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Onboarding API Error:', error);
        return NextResponse.json({ message: 'Server Error', details: error.message }, { status: 500 });
    }
}

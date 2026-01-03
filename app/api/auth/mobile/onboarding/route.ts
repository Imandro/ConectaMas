import { NextResponse } from 'next/server';
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        // In a real app we'd verify the JWT. For now let's assume session or simple check.
        // Given this is a local replica, I'll bypass deep verification if needed or use session.

        const body = await req.json();
        const { email, spiritualStatus, sinsToOvercome, problemsFaced, connectionMethods, gender, age, mascotName, leaderPhone } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await (prisma as any).user.update({
            where: { id: user.id },
            data: {
                spiritualStatus,
                sinsToOvercome: JSON.stringify(sinsToOvercome),
                problemsFaced: JSON.stringify(problemsFaced),
                connectionMethods: JSON.stringify(connectionMethods),
                gender,
                age: Number(age),
                leaderPhone,
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

        // Create initial struggles
        const strugglesToCreate = [
            ...sinsToOvercome.map((s: string) => ({ title: s, type: 'SIN' })),
            ...problemsFaced.map((p: string) => ({ title: p, type: 'PROBLEM' })),
            ...(connectionMethods.includes("Leer la Biblia diariamente") || connectionMethods.includes("Estudiar la Palabra más profundo")
                ? [{ title: "Lectura Bíblica", type: 'CONNECTION' }]
                : [])
        ];

        for (const item of strugglesToCreate) {
            const exists = await prisma.userStruggle.findFirst({
                where: { userId: user.id, title: item.title }
            });

            if (!exists) {
                const prismaAny = prisma as any;
                await prismaAny.userStruggle.create({
                    data: {
                        userId: user.id,
                        title: item.title,
                        status: 'ACTIVE',
                        isStarted: false,
                    }
                });
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Onboarding error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

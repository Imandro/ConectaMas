import { NextResponse } from 'next/server';
import { prisma } from "@/app/lib/prisma";
import { getApiUser } from '@/app/lib/api-auth';
import { evaluateLegalAccess } from '@/app/lib/legal/policy';

export async function POST(req: Request) {
    try {
        const user = await getApiUser(req, { id: true, age: true, country: true });
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { spiritualStatus, sinsToOvercome, problemsFaced, connectionMethods, gender, age, mascotName, leaderPhone } = body;
        const parsedAge = age === undefined || age === null ? user.age ?? 0 : Number(age);
        const legalAccess = evaluateLegalAccess(user.country || '', parsedAge);
        if (!legalAccess.allowed) return NextResponse.json({ error: 'Edad o país no permitido' }, { status: 400 });
        const sins = Array.isArray(sinsToOvercome) ? sinsToOvercome.filter((item): item is string => typeof item === 'string') : [];
        const problems = Array.isArray(problemsFaced) ? problemsFaced.filter((item): item is string => typeof item === 'string') : [];
        const methods = Array.isArray(connectionMethods) ? connectionMethods.filter((item): item is string => typeof item === 'string') : [];

        await (prisma as any).user.update({
            where: { id: user.id },
            data: {
                spiritualStatus,
                sinsToOvercome: JSON.stringify(sins),
                problemsFaced: JSON.stringify(problems),
                connectionMethods: JSON.stringify(methods),
                gender,
                age: parsedAge,
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
            ...sins.map((s: string) => ({ title: s, type: 'SIN' })),
            ...problems.map((p: string) => ({ title: p, type: 'PROBLEM' })),
            ...(methods.includes("Leer la Biblia diariamente") || methods.includes("Estudiar la Palabra más profundo")
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

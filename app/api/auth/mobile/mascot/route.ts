import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';

const prismaAny = prisma as any;

export async function GET(req: Request) {
    try {
        const user = await getApiUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        let mascot = await prismaAny.mascot.findUnique({
            where: { userId: user.id },
            include: {
                user: {
                    select: {
                        hasSeenLlamiTutorial: true
                    }
                }
            }
        });

        if (!mascot) {
            mascot = await prismaAny.mascot.create({
                data: {
                    userId: user.id,
                    name: "Llami",
                    level: 1,
                    experience: 0,
                    flamePoints: 10,
                },
                include: {
                    user: {
                        select: {
                            hasSeenLlamiTutorial: true
                        }
                    }
                }
            });
        }

        return NextResponse.json({
            id: mascot.id,
            name: mascot.name,
            level: mascot.level,
            experience: mascot.experience,
            flamePoints: mascot.flamePoints,
            mood: mascot.mood,
            lastFed: mascot.lastFed ? new Date(mascot.lastFed).toISOString() : null,
            user: {
                hasSeenLlamiTutorial: mascot.user?.hasSeenLlamiTutorial || false
            }
        });

    } catch (error) {
        console.error('Mascot Load Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getApiUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { action, name } = body;

        const mascot = await prismaAny.mascot.findUnique({ where: { userId: user.id } });
        if (!mascot) return NextResponse.json({ message: 'Mascot not found' }, { status: 404 });

        if (action === 'FEED') {
            const lastFed = new Date(mascot.lastFed);
            const now = new Date();
            const hoursSinceLastFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);

            if (hoursSinceLastFed < 4) {
                const remainingHours = Math.ceil(4 - hoursSinceLastFed);
                return NextResponse.json({ message: `Llami está lleno. Intenta en ${remainingHours}h.` }, { status: 400 });
            }

            if (mascot.flamePoints < 5) {
                return NextResponse.json({ message: "No tienes suficientes puntos." }, { status: 400 });
            }

            let newExp = mascot.experience + 20;
            let newLevel = mascot.level;
            if (newExp >= 100) {
                newLevel += 1;
                newExp -= 100;
            }

            const updated = await prismaAny.mascot.update({
                where: { userId: user.id },
                data: {
                    experience: newExp,
                    level: newLevel,
                    flamePoints: mascot.flamePoints - 5,
                    lastFed: new Date(),
                    mood: "FELIZ"
                }
            });

            return NextResponse.json({ success: true, mascot: updated });
        } else if (action === 'RENAME') {
            if (!name || name.trim().length < 2) return NextResponse.json({ message: 'Nombre inválido' }, { status: 400 });

            const updated = await prismaAny.mascot.update({
                where: { userId: user.id },
                data: { name: name.trim() }
            });
            return NextResponse.json({ success: true, mascot: updated });
        } else if (action === 'COMPLETE_TUTORIAL') {
            await prismaAny.user.update({
                where: { id: user.id },
                data: { hasSeenLlamiTutorial: true }
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Mascot Action Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

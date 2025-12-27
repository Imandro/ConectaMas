import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const userFromAuth = await getApiUser(req);

        if (!userFromAuth) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userFromAuth.id },
            select: {
                name: true,
                hasSeenTutorialTour: true,
                age: true,
                streak: {
                    select: { currentStreak: true }
                },
                checkins: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { id: true, mood: true, createdAt: true }
                },
                struggles: {
                    where: { status: 'ACTIVE' },
                    select: { id: true, title: true, currentDay: true, status: true, isStarted: true }
                },
                mascot: {
                    select: { name: true, level: true, experience: true, flamePoints: true, mood: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const stats = {
            name: user.name || 'Campeón',
            streak: (user as any).streak?.currentStreak || 0,
            lastCheckin: (user as any).checkins[0] || null,
            struggles: (user as any).struggles || [],
            mascot: (user as any).mascot || null,
            hasSeenTutorialTour: (user as any).hasSeenTutorialTour || false,
            age: (user as any).age || null,
        };

        return NextResponse.json(JSON.parse(JSON.stringify(stats)));

    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                streak: true,
                checkins: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                struggles: true,
                mascot: true,
            } as any
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name || 'Campeón',
            streak: (user as any).streak?.currentStreak || 0,
            lastCheckin: (user as any).checkins[0] || null,
            struggles: (user as any).struggles || [],
            mascot: (user as any).mascot || null,
            hasSeenTutorialTour: (user as any).hasSeenTutorialTour || false,
        });

    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

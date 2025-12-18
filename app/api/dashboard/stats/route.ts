import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/route';

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
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name || 'Campeón',
            streak: user.streak?.currentStreak || 0,
            lastCheckin: user.checkins[0] || null,
            struggles: user.struggles || [],
        });

    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

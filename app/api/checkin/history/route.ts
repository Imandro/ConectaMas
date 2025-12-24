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
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Get current month's checkins
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const checkins = await prisma.dailyCheckin.findMany({
            where: {
                userId: user.id,
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            },
            select: {
                id: true,
                mood: true,
                note: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ checkins });

    } catch (error) {
        console.error('Checkin History Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

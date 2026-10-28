import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const userId = await getApiUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const struggles = await prisma.userStruggle.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json(struggles, { status: 200 });

    } catch (error) {
        console.error('Fetch Struggles Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

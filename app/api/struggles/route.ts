import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';

const prismaAny = prisma as any;

export async function GET(req: Request) {
    try {
        const user = await getApiUser(req);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const struggles = await prismaAny.userStruggle.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json(struggles, { status: 200 });

    } catch (error) {
        console.error('Fetch Struggles Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

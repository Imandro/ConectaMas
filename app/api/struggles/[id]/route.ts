import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await getApiUser(req);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        const userStruggle = await prisma.userStruggle.findFirst({
            where: { id, userId: user.id }
        });

        if (!userStruggle) {
            return NextResponse.json({ message: 'Struggle not found' }, { status: 404 });
        }

        // Find associated plan by title
        const plan = await prisma.strugglePlan.findFirst({
            where: {
                title: {
                    contains: userStruggle.title,
                    mode: 'insensitive'
                }
            },
            include: {
                days: {
                    orderBy: { dayNumber: 'asc' }
                }
            }
        });

        return NextResponse.json({ userStruggle, plan }, { status: 200 });

    } catch (error) {
        console.error('Get Struggle Detail Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

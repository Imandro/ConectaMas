import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { title } = await req.json();

        if (!title) {
            return NextResponse.json({ message: 'Title is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const struggle = await prisma.userStruggle.create({
            data: {
                userId: user.id,
                title,
                status: 'ACTIVE',
                startDate: new Date(),
            }
        });

        return NextResponse.json(struggle, { status: 201 });

    } catch (error) {
        console.error('Create Struggle Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

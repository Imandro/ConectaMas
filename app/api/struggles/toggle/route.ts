import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ message: 'ID and Status required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Verify ownership
        const struggle = await prisma.userStruggle.findFirst({
            where: { id, userId: user.id }
        });

        if (!struggle) {
            return NextResponse.json({ message: 'Struggle not found' }, { status: 404 });
        }

        const updated = await prisma.userStruggle.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updated, { status: 200 });

    } catch (error) {
        console.error('Toggle Struggle Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

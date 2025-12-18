import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { devotionalId } = await req.json();

        if (!devotionalId) {
            return NextResponse.json({ message: 'Devotional ID is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Safety check for stale Prisma Client
        const delegate = (prisma as any).userDevotional;
        if (!delegate) {
            console.error("Prisma Client out of date: userDevotional missing");
            return NextResponse.json({ message: 'System update pending. Restart server.' }, { status: 503 });
        }

        // Create or ignore if exists
        await delegate.upsert({
            where: {
                userId_devotionalId: {
                    userId: user.id,
                    devotionalId: devotionalId
                }
            },
            update: {}, // No update needed, just ensure it exists
            create: {
                userId: user.id,
                devotionalId: devotionalId
            }
        });

        return NextResponse.json({ message: 'Devotional marked as completed' }, { status: 200 });

    } catch (error) {
        console.error('Devotional Completion Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

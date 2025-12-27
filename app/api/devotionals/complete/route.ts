import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const user = await getApiUser(req);

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { devotionalId } = await req.json();

        if (!devotionalId) {
            return NextResponse.json({ message: 'Devotional ID is required' }, { status: 400 });
        }

        // Safety check for stale Prisma Client
        const delegate = (prisma as any).userDevotional;
        if (!delegate) {
            console.error("Prisma Client out of date: userDevotional missing");
            return NextResponse.json({ message: 'System update pending. Restart server.' }, { status: 503 });
        }

        // Check if already completed to avoid double XP
        const existingCompletion = await delegate.findUnique({
            where: {
                userId_devotionalId: {
                    userId: user.id,
                    devotionalId: devotionalId
                }
            }
        });

        if (!existingCompletion) {
            // Mark as completed
            await delegate.create({
                data: {
                    userId: user.id,
                    devotionalId: devotionalId
                }
            });

            // Grant Mascot XP
            const mascotDelegate = (prisma as any).mascot;
            if (mascotDelegate) {
                const mascot = await mascotDelegate.findUnique({ where: { userId: user.id } });
                if (mascot) {
                    let newExp = (mascot.experience || 0) + 25;
                    let newLevel = mascot.level || 1;
                    if (newExp >= 100) {
                        newLevel += 1;
                        newExp -= 100;
                    }
                    await mascotDelegate.update({
                        where: { userId: user.id },
                        data: { experience: newExp, level: newLevel }
                    });
                } else {
                    // Create mascot if not exists
                    await mascotDelegate.create({
                        data: {
                            userId: user.id,
                            experience: 25,
                            level: 1,
                            flamePoints: 10
                        }
                    });
                }
            }
        }

        return NextResponse.json({ message: 'Devotional marked as completed' }, { status: 200 });

    } catch (error) {
        console.error('Devotional Completion Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

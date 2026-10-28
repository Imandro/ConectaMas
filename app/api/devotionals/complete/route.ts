import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const userId = await getApiUserId(req);

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { devotionalId } = await req.json();

        if (!devotionalId) {
            return NextResponse.json({ message: 'Devotional ID is required' }, { status: 400 });
        }

        // Check if already completed to avoid double XP
        const existingCompletion = await prisma.userDevotional.findUnique({
            where: {
                userId_devotionalId: {
                    userId,
                    devotionalId: devotionalId
                }
            }
        });

        if (!existingCompletion) {
            // Mark as completed
            await prisma.userDevotional.create({
                data: {
                    userId,
                    devotionalId: devotionalId
                }
            });

            // Grant Mascot XP
            const mascot = await prisma.mascot.findUnique({ where: { userId } });
            if (mascot) {
                let newExp = mascot.experience + 25;
                let newLevel = mascot.level;
                if (newExp >= 100) {
                    newLevel += 1;
                    newExp -= 100;
                }
                await prisma.mascot.update({
                    where: { userId },
                    data: { experience: newExp, level: newLevel }
                });
            } else {
                // Create mascot if not exists
                await prisma.mascot.create({
                    data: {
                        userId,
                        experience: 25,
                        flamePoints: 10
                    }
                });
            }
        }

        return NextResponse.json({ message: 'Devotional marked as completed' }, { status: 200 });

    } catch (error) {
        console.error('Devotional Completion Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

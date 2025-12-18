import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { mood, note } = await req.json();

        if (!mood) {
            return NextResponse.json({ message: 'Mood is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // 1. Create Check-in
        const checkin = await prisma.dailyCheckin.create({
            data: {
                userId: user.id,
                mood,
                note: note || null,
            }
        });

        // 2. Update Streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let streak = await prisma.streak.findUnique({
            where: { userId: user.id }
        });

        if (!streak) {
            // New Streak
            streak = await prisma.streak.create({
                data: {
                    userId: user.id,
                    currentStreak: 1,
                    longestStreak: 1,
                    lastActivity: new Date(),
                }
            });
        } else {
            // Check if last activity was yesterday (continue streak) or older (reset)
            const lastActivity = new Date(streak.lastActivity);
            lastActivity.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day
                streak = await prisma.streak.update({
                    where: { userId: user.id },
                    data: {
                        currentStreak: { increment: 1 },
                        lastActivity: new Date(),
                        longestStreak: { set: Math.max(streak.longestStreak, streak.currentStreak + 1) }
                    }
                });
            } else if (diffDays > 1) {
                // Streak broken
                streak = await prisma.streak.update({
                    where: { userId: user.id },
                    data: {
                        currentStreak: 1,
                        lastActivity: new Date(),
                    }
                });
            } else {
                // Same day, update activity time but don't increment streak
                streak = await prisma.streak.update({
                    where: { userId: user.id },
                    data: {
                        lastActivity: new Date(),
                    }
                });
            }
        }

        return NextResponse.json({ message: 'Check-in saved', streak: streak.currentStreak }, { status: 201 });

    } catch (error) {
        console.error('Checkin Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

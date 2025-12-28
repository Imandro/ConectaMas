import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const userFromAuth = await getApiUser(req);

        if (!userFromAuth) {
            console.log("[Checkin API] Unauthorized access attempt");
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { mood, note } = await req.json();

        if (!mood) {
            return NextResponse.json({ message: 'Mood is required' }, { status: 400 });
        }

        const userId = userFromAuth.id;
        console.log(`[Checkin API] Processing check-in for user ${userId} with mood ${mood}`);

        // 1. Bloquear si ya hubo check-in hoy (ZONA HORARIA LOCAL DEL SERVIDOR O UTC)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);

        const existingCheckin = await prisma.dailyCheckin.findFirst({
            where: {
                userId: userId,
                createdAt: {
                    gte: todayStart,
                    lt: tomorrowStart
                }
            }
        });

        if (existingCheckin) {
            console.log(`[Checkin API] User ${userId} already checked in today`);
            return NextResponse.json({ message: 'Ya has realizado tu check-in de hoy' }, { status: 429 });
        }

        // 2. Create Check-in
        await prisma.dailyCheckin.create({
            data: {
                userId: userId,
                mood,
                note: note || null,
            }
        });

        // 3. Update Streak & Mascot Experience
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let streak = await prisma.streak.findUnique({
            where: { userId: userId }
        });

        if (!streak) {
            console.log(`[Checkin API] Creating first streak for user ${userId}`);
            streak = await prisma.streak.create({
                data: {
                    userId: userId,
                    currentStreak: 1,
                    longestStreak: 1,
                    lastActivity: new Date(),
                }
            });
        } else {
            const lastActivity = new Date(streak.lastActivity);
            lastActivity.setHours(0, 0, 0, 0);

            if (lastActivity.getTime() === yesterday.getTime()) {
                // Consecutive day
                console.log(`[Checkin API] Incrementing streak for user ${userId}`);
                streak = await prisma.streak.update({
                    where: { userId: userId },
                    data: {
                        currentStreak: { increment: 1 },
                        lastActivity: new Date(),
                        longestStreak: { set: Math.max(streak.longestStreak, streak.currentStreak + 1) }
                    }
                });
            } else if (lastActivity.getTime() < yesterday.getTime()) {
                // Streak broken
                console.log(`[Checkin API] Streak broken for user ${userId}. Resetting to 1.`);
                streak = await prisma.streak.update({
                    where: { userId: userId },
                    data: {
                        currentStreak: 1,
                        lastActivity: new Date(),
                    }
                });
            } else {
                // Already did an activity today (probably something else that updates streak)
                // Just update the timestamp to be safe
                console.log(`[Checkin API] User ${userId} already had activity today. Updating timestamp.`);
                streak = await prisma.streak.update({
                    where: { userId: userId },
                    data: {
                        lastActivity: new Date(),
                    }
                });
            }
        }

        // 4. Update Mascot Mood (Optional but good for Llami)
        try {
            await prisma.mascot.update({
                where: { userId: userId },
                data: {
                    mood: mood === '😔' ? 'TRISTE' : 'FELIZ',
                    lastFed: new Date(),
                    experience: { increment: 5 }
                }
            }).catch(() => null); // Ignore if mascot doesn't exist yet
        } catch (e) { }

        return NextResponse.json({
            message: 'Check-in saved',
            streak: streak.currentStreak
        }, { status: 201 });

    } catch (error) {
        console.error('Checkin Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

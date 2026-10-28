import { NextResponse } from 'next/server';
import { getApiUser } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';
const PRIVATE_NO_STORE_HEADERS = {
    'Cache-Control': 'private, no-store',
};

type DashboardUser = {
    name: string | null;
    hasSeenTutorialTour: boolean;
    hasJoinedWhatsapp: boolean;
    hasFollowedInstagram: boolean;
    country: string | null;
    age: number | null;
    lastChallengeCompleted: Date | null;
    streak: { currentStreak: number } | null;
    checkins: Array<{ id: string; mood: string | null; createdAt: Date }>;
    struggles: Array<{ id: string; title: string; currentDay: number; status: string; isStarted: boolean }>;
    mascot: { name: string | null; level: number; experience: number; flamePoints: number; mood: string } | null;
};

export async function GET(req: Request) {
    try {
        const user = await getApiUser(req, {
            name: true,
            hasSeenTutorialTour: true,
            hasJoinedWhatsapp: true,
            hasFollowedInstagram: true,
            country: true,
            age: true,
            lastChallengeCompleted: true,
            streak: { select: { currentStreak: true } },
            checkins: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: { id: true, mood: true, createdAt: true }
            },
            struggles: {
                where: { status: 'ACTIVE' },
                select: { id: true, title: true, currentDay: true, status: true, isStarted: true }
            },
            mascot: {
                select: { name: true, level: true, experience: true, flamePoints: true, mood: true }
            }
        });

        const dashboardUser = user as unknown as DashboardUser | null;
        if (!dashboardUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401, headers: PRIVATE_NO_STORE_HEADERS });
        }

        const stats = {
            name: dashboardUser.name || 'Campeón',
            streak: dashboardUser.streak?.currentStreak || 0,
            lastCheckin: dashboardUser.checkins[0] || null,
            struggles: dashboardUser.struggles || [],
            mascot: dashboardUser.mascot || null,
            hasSeenTutorialTour: dashboardUser.hasSeenTutorialTour || false,
            hasJoinedWhatsapp: dashboardUser.hasJoinedWhatsapp || false,
            hasFollowedInstagram: dashboardUser.hasFollowedInstagram || false,
            country: dashboardUser.country || null,
            age: dashboardUser.age || null,
            lastChallengeCompleted: dashboardUser.lastChallengeCompleted || null,
        };

        return NextResponse.json(stats, { headers: PRIVATE_NO_STORE_HEADERS });

    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500, headers: PRIVATE_NO_STORE_HEADERS });
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const userId = await getApiUserId();
        if (!userId) {
            return NextResponse.json({ count: 0 });
        }

        // Count unread forum notifications
        const count = await prisma.forumNotification.count({
            where: {
                userId: userId,
                isRead: false
            }
        });

        // Cap at 99+ for UI
        return NextResponse.json({ count });
    } catch (error) {
        console.error('Notification Count Error:', error);
        return NextResponse.json({ count: 0 });
    }
}

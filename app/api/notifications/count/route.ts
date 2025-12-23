import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ count: 0 });
        }

        const userId = (session.user as any).id;
        const user = await (prisma as any).user.findUnique({
            where: { id: userId },
            select: { lastForumCheck: true }
        });

        // Count unread forum notifications
        const count = await (prisma as any).forumNotification.count({
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

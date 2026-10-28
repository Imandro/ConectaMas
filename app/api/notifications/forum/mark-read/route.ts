import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const userId = await getApiUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { notificationId } = body;

        if (notificationId) {
            // Mark specific notification as read
            await prisma.forumNotification.update({
                where: {
                    id: notificationId,
                    userId: userId // Ensure user owns this notification
                },
                data: {
                    isRead: true
                }
            });
        } else {
            // Mark all notifications as read
            await prisma.forumNotification.updateMany({
                where: {
                    userId: userId,
                    isRead: false
                },
                data: {
                    isRead: true
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Mark Read Error:', error);
        return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
    }
}

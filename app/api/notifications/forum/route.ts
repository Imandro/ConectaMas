import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const userId = await getApiUserId();
        if (!userId) {
            return NextResponse.json({ notifications: [] });
        }

        // Fetch notifications with post and category details
        const notifications = await prisma.forumNotification.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                type: true,
                createdAt: true,
                isRead: true,
                postId: true,
                post: {
                    select: {
                        id: true,
                        title: true,
                        categoryId: true,
                        category: {
                            select: {
                                name: true,
                                icon: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20 // Limit to 20 most recent
        });

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error('Notification List Error:', error);
        return NextResponse.json({ notifications: [] });
    }
}

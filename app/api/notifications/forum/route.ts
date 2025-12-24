import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ notifications: [] });
        }

        const userId = (session.user as any).id;

        // Fetch notifications with post and category details
        const notifications = await (prisma as any).forumNotification.findMany({
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

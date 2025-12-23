import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

const prismaClient = prisma as any;

// POST /api/forums/posts/[id]/replies - Create reply to a post
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prismaClient.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { content, isAnonymous } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Verify post exists
        const post = await prismaClient.forumPost.findUnique({
            where: { id: params.id }
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const reply = await prismaClient.forumReply.create({
            data: {
                content,
                postId: params.id,
                userId: user.id,
                isAnonymous: isAnonymous || false,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        isCounselor: true,
                    }
                }
            }
        });

        // Create notification for post author if they're not the one replying
        if (post.userId !== user.id) {
            try {
                await prismaClient.forumNotification.create({
                    data: {
                        userId: post.userId,
                        type: 'NEW_REPLY',
                        postId: params.id,
                        replyId: reply.id,
                        isRead: false
                    }
                });
            } catch (notifError) {
                console.error('Error creating notification:', notifError);
                // Don't fail the reply creation if notification fails
            }
        }

        return NextResponse.json(reply, { status: 201 });
    } catch (error) {
        console.error('Error creating reply:', error);
        return NextResponse.json({ error: 'Error creating reply' }, { status: 500 });
    }
}

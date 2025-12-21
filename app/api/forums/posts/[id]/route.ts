import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

const prismaClient = prisma as any;

// GET /api/forums/posts/[id] - Get single post with replies
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        const currentUserEmail = session?.user?.email;

        let currentUserId = null;
        if (currentUserEmail) {
            const currentUser = await prismaClient.user.findUnique({
                where: { email: currentUserEmail },
                select: { id: true }
            });
            currentUserId = currentUser?.id;
        }

        const post = await prismaClient.forumPost.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        name: true,
                        isCounselor: true,
                    }
                },
                category: true,
                replies: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        user: {
                            select: {
                                name: true,
                                isCounselor: true,
                            }
                        }
                    }
                }
            }
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Sanitize anonymous data & Add Ownership
        const sanitizedPost = {
            ...post,
            user: post.isAnonymous ? null : post.user,
            isOwner: currentUserId && post.userId === currentUserId,
            replies: post.replies.map((reply: any) => ({
                ...reply,
                user: reply.isAnonymous ? null : reply.user,
                isOwner: currentUserId && reply.userId === currentUserId
            }))
        };

        return NextResponse.json(sanitizedPost);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Error fetching post' }, { status: 500 });
    }
}

// DELETE /api/forums/posts/[id] - Delete post (author or admin only)
export async function DELETE(
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

        const post = await prismaClient.forumPost.findUnique({
            where: { id: params.id }
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if user is author or admin
        if (post.userId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prismaClient.forumPost.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Error deleting post' }, { status: 500 });
    }
}

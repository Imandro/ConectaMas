import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';

const prismaClient = prisma as any;

// GET /api/forums/posts/[id] - Get single post with replies
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const currentUser = await getApiUser(request);
        const currentUserId = currentUser?.id;

        const post = await prismaClient.forumPost.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                isAnonymous: true,
                userId: true,
                categoryId: true,
                user: {
                    select: {
                        name: true,
                        isCounselor: true,
                    }
                },
                category: {
                    select: {
                        name: true,
                        icon: true,
                    }
                },
                replies: {
                    orderBy: { createdAt: 'asc' },
                    take: 50, // Limitar a 50 respuestas para ahorrar recursos
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        isAnonymous: true,
                        userId: true,
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
        const user = await getApiUser(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

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
            return NextResponse.json({ error: 'Contenido requerido' }, { status: 400 });
        }

        // --- LIMITES DE RECURSOS (FREE TIER OPTIMIZATION) ---
        if (content.length > 1500) return NextResponse.json({ error: 'Contenido demasiado largo (máx 1500)' }, { status: 400 });

        // Cuota diaria (máx 10 replies)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const repliesToday = await prismaClient.forumReply.count({
            where: {
                userId: user.id,
                createdAt: { gte: today }
            }
        });

        if (repliesToday >= 10) {
            return NextResponse.json({ error: 'Límite de 10 respuestas diarias alcanzado' }, { status: 429 });
        }
        // ---------------------------------------------------

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
                // Auto-cleanup: Borrar notificaciones viejas para el autor (más de 30)
                const notifCount = await prismaClient.forumNotification.count({
                    where: { userId: post.userId }
                });

                if (notifCount >= 30) {
                    const oldest = await prismaClient.forumNotification.findMany({
                        where: { userId: post.userId },
                        orderBy: { createdAt: 'asc' },
                        take: 10,
                        select: { id: true }
                    });
                    await prismaClient.forumNotification.deleteMany({
                        where: { id: { in: oldest.map((n: any) => n.id) } }
                    });
                }

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
            }
        }

        return NextResponse.json(reply, { status: 201 });
    } catch (error) {
        console.error('Error creating reply:', error);
        return NextResponse.json({ error: 'Error creating reply' }, { status: 500 });
    }
}

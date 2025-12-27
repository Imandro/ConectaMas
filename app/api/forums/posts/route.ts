import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';

const prismaClient = prisma as any;

// GET /api/forums/posts - List posts (with optional categoryId filter)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');

        const where = categoryId ? { categoryId } : {};

        const posts = await prismaClient.forumPost.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 20, // Reducido de 50 para ahorrar recursos
            select: {
                id: true,
                title: true,
                content: true, // Lo necesitamos para el preview, pero limitaremos el 'take'
                createdAt: true,
                isAnonymous: true,
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
                _count: {
                    select: { replies: true }
                }
            }
        });

        // Hide user info for anonymous posts
        const sanitizedPosts = posts.map((post: any) => ({
            ...post,
            user: post.isAnonymous ? null : post.user,
        }));

        return NextResponse.json(sanitizedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
    }
}

// POST /api/forums/posts - Create new post
export async function POST(request: NextRequest) {
    try {
        const user = await getApiUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // User is already fetched by getApiUser

        const body = await request.json();
        const { title, content, categoryId, isAnonymous } = body;

        if (!title || !content || !categoryId) {
            return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
        }

        // --- LIMITES DE RECURSOS (FREE TIER OPTIMIZATION) ---
        if (title.length > 100) return NextResponse.json({ error: 'Título demasiado largo (máx 100)' }, { status: 400 });
        if (content.length > 3000) return NextResponse.json({ error: 'Contenido demasiado largo (máx 3000)' }, { status: 400 });

        // Cuota diaria (máx 3 posts)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const postsToday = await prismaClient.forumPost.count({
            where: {
                userId: user.id,
                createdAt: { gte: today }
            }
        });

        if (postsToday >= 3) {
            return NextResponse.json({ error: 'Has alcanzado el límite de 3 publicaciones por día' }, { status: 429 });
        }
        // ---------------------------------------------------

        const post = await prismaClient.forumPost.create({
            data: {
                title,
                content,
                categoryId,
                userId: user.id,
                isAnonymous: isAnonymous || false,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        isCounselor: true,
                    }
                },
                category: true,
            }
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
    }
}

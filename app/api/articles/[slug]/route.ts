import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/articles/[slug] - Get a specific article
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        const article = await prisma.article.findUnique({
            where: { slug },
            include: {
                userReads: {
                    select: {
                        userId: true,
                        completed: true,
                        progress: true,
                    },
                },
            },
        });

        if (!article || !article.isPublished) {
            return NextResponse.json(
                { error: 'Artículo no encontrado' },
                { status: 404 }
            );
        }

        // Increment view count
        await prisma.article.update({
            where: { slug },
            data: {
                views: {
                    increment: 1,
                },
            },
        });

        // Get related articles (same category, exclude current)
        const relatedArticles = await prisma.article.findMany({
            where: {
                category: article.category,
                slug: {
                    not: slug,
                },
                isPublished: true,
            },
            take: 3,
            orderBy: {
                views: 'desc',
            },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                coverImage: true,
                category: true,
                readTime: true,
                publishedAt: true,
            },
        });

        return NextResponse.json({
            article: {
                ...article,
                views: article.views + 1, // Return updated count
            },
            relatedArticles,
        });
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json(
            { error: 'Error al cargar el artículo' },
            { status: 500 }
        );
    }
}

// POST /api/articles/[slug] - Mark article as read or update progress
export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { slug } = params;
        const body = await request.json();
        const { progress = 100, completed = true } = body;

        const article = await prisma.article.findUnique({
            where: { slug },
        });

        if (!article) {
            return NextResponse.json(
                { error: 'Artículo no encontrado' },
                { status: 404 }
            );
        }

        const userRead = await prisma.userArticleRead.upsert({
            where: {
                userId_articleId: {
                    userId: session.user.id,
                    articleId: article.id,
                },
            },
            update: {
                progress,
                completed,
                readAt: new Date(),
            },
            create: {
                userId: session.user.id,
                articleId: article.id,
                progress,
                completed,
            },
        });

        return NextResponse.json({ success: true, userRead });
    } catch (error) {
        console.error('Error marking article as read:', error);
        return NextResponse.json(
            { error: 'Error al guardar progreso' },
            { status: 500 }
        );
    }
}

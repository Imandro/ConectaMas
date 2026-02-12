import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/articles - Get all articles with optional filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: any = {
            isPublished: true,
        };

        if (category) {
            where.category = category;
        }

        if (featured === 'true') {
            where.isFeatured = true;
        }

        const articles = await prisma.article.findMany({
            where,
            orderBy: {
                publishedAt: 'desc',
            },
            take: limit,
            skip: offset,
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                coverImage: true,
                category: true,
                tags: true,
                author: true,
                readTime: true,
                views: true,
                isFeatured: true,
                publishedAt: true,
            },
        });

        const total = await prisma.article.count({ where });

        return NextResponse.json({
            articles,
            total,
            hasMore: offset + limit < total,
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json(
            { error: 'Error al cargar artículos' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';
const PUBLIC_CACHE_HEADERS = {
    'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
};

// GET /api/forums/categories - List all forum categories
export async function GET() {
    try {
        const categories = await prisma.forumCategory.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                _count: {
                    select: { posts: true }
                }
            }
        });

        return NextResponse.json(categories, { headers: PUBLIC_CACHE_HEADERS });
    } catch (error) {
        console.error('Error fetching forum categories:', error);
        return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
    }
}

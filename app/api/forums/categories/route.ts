import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

const prismaClient = prisma as any;

// GET /api/forums/categories - List all forum categories
export async function GET() {
    try {
        const categories = await prismaClient.forumCategory.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching forum categories:', error);
        return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
    }
}

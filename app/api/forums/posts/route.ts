import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

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
            take: 50, // Limit to 50 posts
            include: {
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
        const { title, content, categoryId, isAnonymous } = body;

        if (!title || !content || !categoryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

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

import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

const prismaClient = prisma as any;

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tags = searchParams.get('tags'); // e.g., "Ansiedad,Miedo"

        let verses;
        if (tags) {
            // Filter verses that contain any of the requested tags
            const tagArray = tags.split(',');
            verses = await prismaClient.bibleVerse.findMany({
                where: {
                    OR: tagArray.map(tag => ({
                        tags: {
                            contains: tag.trim()
                        }
                    }))
                }
            });
        } else {
            // Return all verses if no tags specified
            verses = await prismaClient.bibleVerse.findMany();
        }

        return NextResponse.json(verses);
    } catch (error) {
        console.error("Error fetching verses:", error);
        return NextResponse.json({ error: "Error fetching verses" }, { status: 500 });
    }
}

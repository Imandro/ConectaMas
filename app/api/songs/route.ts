import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Type assertion to bypass potential stale type definitions
const prismaClient = prisma as any;

export async function GET() {
    try {
        const songs = await prismaClient.song.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
        return NextResponse.json({ error: "Error fetching songs" }, { status: 500 });
    }
}

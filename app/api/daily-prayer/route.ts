import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

const prismaClient = prisma as any;

export async function GET() {
    try {
        // Calculate current day of year (1-365)
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        const prayer = await prismaClient.dailyPrayer.findUnique({
            where: { dayOfYear }
        });

        if (!prayer) {
            return NextResponse.json({ error: "Prayer not found for today" }, { status: 404 });
        }

        return NextResponse.json(prayer);
    } catch (error) {
        console.error("Error fetching daily prayer:", error);
        return NextResponse.json({ error: "Error fetching prayer" }, { status: 500 });
    }
}

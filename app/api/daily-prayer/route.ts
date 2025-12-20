import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

const prismaClient = prisma as any;

export async function GET() {
    try {
        // Calculate current day of year (1-365)
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        let dayOfYear = Math.floor(diff / oneDay);

        // Ensure dayOfYear is within 1-365 range
        if (dayOfYear < 1) dayOfYear = 1;
        if (dayOfYear > 365) dayOfYear = 365;

        let prayer = await prismaClient.dailyPrayer.findFirst({
            where: { dayOfYear }
        });

        // Fallback: If no prayer for today, get the very first one available
        if (!prayer) {
            prayer = await prismaClient.dailyPrayer.findFirst();
        }

        if (!prayer) {
            // Ultimate fallback: return a hardcoded default prayer if DB is empty
            return NextResponse.json({
                id: "default",
                title: "Oración de Paz",
                content: "Señor, en este día busco tu paz y tu guía. Que tu luz ilumine cada paso que doy y que mi corazón descanse en tu amor infinito. Amén.",
                theme: "Paz"
            });
        }

        return NextResponse.json(prayer);
    } catch (error) {
        console.error("Error fetching daily prayer:", error);
        return NextResponse.json({ error: "Error fetching prayer" }, { status: 500 });
    }
}

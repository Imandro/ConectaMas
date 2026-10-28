import { NextResponse } from 'next/server';
import { getDailyPrayerForDate } from '@/app/lib/dailyPrayerData';
import { isLanguage } from '@/app/lib/languages';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';
const PUBLIC_CACHE_HEADERS = {
    'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
};

export async function GET(request: Request) {
    try {
        const languageParam = new URL(request.url).searchParams.get('language');
        const language = isLanguage(languageParam) ? languageParam : 'es';
        return NextResponse.json(getDailyPrayerForDate(new Date(), language), { headers: { ...PUBLIC_CACHE_HEADERS, 'Content-Language': language } });
    } catch (error) {
        console.error("Error fetching daily prayer:", error);
        return NextResponse.json({ error: "Error fetching prayer" }, { status: 500 });
    }
}

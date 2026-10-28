import { NextResponse } from 'next/server';
import { verses } from '@/app/lib/versesData';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';
const PUBLIC_CACHE_HEADERS = {
    'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
};

function normalize(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

const LOCAL_VERSES = verses.map((verse, index) => ({
    id: `local-${index}`,
    reference: verse.reference,
    text: verse.text,
    tags: '',
    searchText: normalize(`${verse.reference} ${verse.text}`),
}));

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tags = searchParams.get('tags'); // e.g., "Ansiedad,Miedo"

        const tagArray = tags
            ? tags.split(',').map(tag => normalize(tag.trim().slice(0, 50))).filter(Boolean).slice(0, 10)
            : [];
        const filteredVerses = tagArray.length === 0
            ? (tags ? [] : LOCAL_VERSES)
            : LOCAL_VERSES.filter(verse => tagArray.some(tag => verse.searchText.includes(tag)));
        const result = filteredVerses.slice(0, 20).map((verse) => ({
            id: verse.id,
            reference: verse.reference,
            text: verse.text,
            tags: verse.tags,
        }));

        return NextResponse.json(result, { headers: PUBLIC_CACHE_HEADERS });
    } catch (error) {
        console.error("Error fetching verses:", error);
        return NextResponse.json({ error: "Error fetching verses" }, { status: 500 });
    }
}

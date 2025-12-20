import { NextRequest, NextResponse } from 'next/server';

// Proxy to Bible API to avoid CORS issues
// Using bible-api.com which provides Reina Valera
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const book = searchParams.get('book'); // e.g., "Juan"
        const chapter = searchParams.get('chapter'); // e.g., "3"

        if (!book || !chapter) {
            return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
        }

        // Fetch from bible-api.com (Reina Valera)
        const response = await fetch(`https://bible-api.com/${book}+${chapter}?translation=rvr`);

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch Bible chapter" }, { status: 500 });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching Bible:", error);
        return NextResponse.json({ error: "Error fetching Bible" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Book name mapping from Spanish to ABíbliaDigital abbreviations
const BOOK_MAPPING: { [key: string]: string } = {
    "Génesis": "gn", "Éxodo": "ex", "Levítico": "lv", "Números": "nm", "Deuteronomio": "dt",
    "Josué": "js", "Jueces": "jz", "Rut": "rt", "1 Samuel": "1sm", "2 Samuel": "2sm",
    "1 Reyes": "1rs", "2 Reyes": "2rs", "1 Crónicas": "1cr", "2 Crónicas": "2cr",
    "Esdras": "ed", "Nehemías": "ne", "Ester": "et", "Job": "jb", "Salmos": "sl",
    "Proverbios": "pv", "Eclesiastés": "ec", "Cantares": "ct", "Isaías": "is",
    "Jeremías": "jr", "Lamentaciones": "lm", "Ezequiel": "ez", "Daniel": "dn",
    "Oseas": "os", "Joel": "jl", "Amós": "am", "Abdías": "ob", "Jonás": "jn",
    "Miqueas": "mq", "Nahúm": "na", "Habacuc": "hc", "Sofonías": "sf", "Hageo": "ag",
    "Zacarías": "zc", "Malaquías": "ml", "Mateo": "mt", "Marcos": "mc", "Lucas": "lc",
    "Juan": "jo", "Hechos": "at", "Romanos": "rm", "1 Corintios": "1co", "2 Corintios": "2co",
    "Gálatas": "gl", "Efesios": "ef", "Filipenses": "fl", "Colosenses": "cl",
    "1 Tesalonicenses": "1ts", "2 Tesalonicenses": "2ts", "1 Timoteo": "1tm",
    "2 Timoteo": "2tm", "Tito": "tt", "Filemón": "fm", "Hebreos": "hb", "Santiago": "tg",
    "1 Pedro": "1pe", "2 Pedro": "2pe", "1 Juan": "1jo", "2 Juan": "2jo", "3 Juan": "3jo",
    "Judas": "jd", "Apocalipsis": "ap"
};

// Using ABíbliaDigital API which provides reliable Reina Valera text
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const book = searchParams.get('book'); // e.g., "Juan"
        const chapter = searchParams.get('chapter'); // e.g., "3"

        if (!book || !chapter) {
            return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
        }

        // Get book abbreviation
        const bookAbbr = BOOK_MAPPING[book];
        if (!bookAbbr) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        // Fetch from ABíbliaDigital API (Reina Valera 1960)
        const response = await fetch(`https://www.abibliadigital.com.br/api/verses/rvr/${bookAbbr}/${chapter}`);

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch Bible chapter" }, { status: 500 });
        }

        const data = await response.json();

        // Transform to match expected format
        const transformed = {
            reference: `${book} ${chapter}`,
            verses: data.verses.map((v: any) => ({
                verse: v.number,
                text: v.text
            })),
            text: data.verses.map((v: any) => `${v.number} ${v.text}`).join(' ')
        };

        return NextResponse.json(transformed);
    } catch (error) {
        console.error("Error fetching Bible:", error);
        return NextResponse.json({ error: "Error fetching Bible" }, { status: 500 });
    }
}

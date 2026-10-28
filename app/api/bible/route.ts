import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
const PUBLIC_CACHE_HEADERS = {
    'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
};

type BibleBook = { chapters: string[][] };

const BIBLE_FILE_PATH = path.join(process.cwd(), 'public', 'bible', 'es_rvr.json');
let BIBLE_DATA_CACHE: BibleBook[] | null | undefined;

function loadBibleData(): BibleBook[] | null {
    if (BIBLE_DATA_CACHE !== undefined) return BIBLE_DATA_CACHE;
    if (!fs.existsSync(BIBLE_FILE_PATH)) {
        BIBLE_DATA_CACHE = null;
        return BIBLE_DATA_CACHE;
    }

    try {
        let fileContent = fs.readFileSync(BIBLE_FILE_PATH, 'utf8');
        if (fileContent.charCodeAt(0) === 0xFEFF) {
            fileContent = fileContent.slice(1);
        }

        const parsed: unknown = JSON.parse(fileContent);
        if (!Array.isArray(parsed)) throw new Error('Bible data must be an array');

        BIBLE_DATA_CACHE = parsed as BibleBook[];
    } catch (error) {
        console.error('[BIBLE] Invalid local data:', error instanceof Error ? error.message : 'unknown error');
        BIBLE_DATA_CACHE = null;
    }
    return BIBLE_DATA_CACHE;
}

// Book name mapping from Spanish to indices in es_rvr.json
const BOOK_MAPPING: { [key: string]: number } = {
    "Génesis": 0, "Éxodo": 1, "Levítico": 2, "Números": 3, "Deuteronomio": 4,
    "Josué": 5, "Jueces": 6, "Rut": 7, "1 Samuel": 8, "2 Samuel": 9,
    "1 Reyes": 10, "2 Reyes": 11, "1 Crónicas": 12, "2 Crónicas": 13,
    "Esdras": 14, "Nehemías": 15, "Ester": 16, "Job": 17, "Salmos": 18,
    "Proverbios": 19, "Eclesiastés": 20, "Cantares": 21, "Isaías": 22,
    "Jeremías": 23, "Lamentaciones": 24, "Ezequiel": 25, "Daniel": 26,
    "Oseas": 27, "Joel": 28, "Amós": 29, "Abdías": 30, "Jonás": 31,
    "Miqueas": 32, "Nahúm": 33, "Habacuc": 34, "Sofonías": 35, "Hageo": 36,
    "Zacarías": 37, "Malaquías": 38, "Mateo": 39, "Marcos": 40, "Lucas": 41,
    "Juan": 42, "Hechos": 43, "Romanos": 44, "1 Corintios": 45, "2 Corintios": 46,
    "Gálatas": 47, "Efesios": 48, "Filipenses": 49, "Colosenses": 50,
    "1 Tesalonicenses": 51, "2 Tesalonicenses": 52, "1 Timoteo": 53,
    "2 Timoteo": 54, "Tito": 55, "Filemón": 56, "Hebreos": 57, "Santiago": 58,
    "1 Pedro": 59, "2 Pedro": 60, "1 Juan": 61, "2 Juan": 62, "3 Juan": 63,
    "Judas": 64, "Apocalipsis": 65
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const book = searchParams.get('book');
        const chapter = searchParams.get('chapter');

        if (!book || !chapter) {
            return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
        }

        const bookIndex = BOOK_MAPPING[book];

        if (bookIndex === undefined) {
            return NextResponse.json({
                error: "Book not found",
                reference: `${book} ${chapter}`,
                verses: [],
                text: `El libro "${book}" no está en nuestra base de datos local.`
            }, { status: 200 });
        }

        const bibleData = loadBibleData();
        if (!bibleData) {
            return NextResponse.json({
                error: "Database missing",
                reference: `${book} ${chapter}`,
                verses: [],
                text: "Lo sentimos, el archivo de la Biblia en español no se encuentra disponible localmente."
            }, { status: 200 });
        }

        const bookData = bibleData[bookIndex];

        if (!bookData) {
            return NextResponse.json({
                error: "Data missing",
                reference: `${book} ${chapter}`,
                verses: [],
                text: `No se encontró el texto de ${book} en nuestra base de datos.`
            }, { status: 200 });
        }

        const chapterIdx = parseInt(chapter) - 1;
        const chapterData = bookData.chapters[chapterIdx];

        if (!chapterData) {
            return NextResponse.json({
                error: "Chapter not found",
                reference: `${book} ${chapter}`,
                verses: [],
                text: `El capítulo ${chapter} de ${book} no está disponible.`
            }, { status: 200 });
        }

        const verses: Array<{ verse: number; text: string }> = chapterData.map((v: string, index: number) => ({
            verse: index + 1,
            text: v
        }));

        return NextResponse.json({
            reference: `${book} ${chapter}`,
            verses: verses,
            text: verses.map((v) => `${v.verse} ${v.text}`).join(' ')
        }, { headers: PUBLIC_CACHE_HEADERS });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown Bible error';
        console.error("[BIBLE] FATAL ERROR:", message);
        return NextResponse.json({
            error: "Error interno",
            reference: "",
            verses: [],
            text: `Error al procesar la Biblia: ${message}`
        }, { status: 200 });
    }
}

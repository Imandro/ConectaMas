import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = (formData as any).get("file") as File;
        const title = (formData as any).get("title") as string;
        const artist = (formData as any).get("artist") as string;

        if (!file || !title || !artist) {
            return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
        }

        // --- LIMITES DE RECURSOS (FREE TIER OPTIMIZATION) ---
        // 1. Tamaño de archivo (10MB máx)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "Archivo demasiado grande. Máximo 10MB." }, { status: 400 });
        }

        // 2. Metadatos
        if (title.length > 50) return NextResponse.json({ error: "Título demasiado largo (máx 50)" }, { status: 400 });
        if (artist.length > 50) return NextResponse.json({ error: "Artista demasiado largo (máx 50)" }, { status: 400 });

        // 3. Cuota total por usuario (ej: máx 5 canciones para no saturar disco)
        const prismaAny = prisma as any;
        const userSongsCount = await prismaAny.song.count(); // Para demo, limite global simple o por usuario si hubiera relación
        if (userSongsCount >= 50) { // Límite global para el servidor demo
            return NextResponse.json({ error: "Límite de almacenamiento del servidor alcanzado." }, { status: 429 });
        }
        // ---------------------------------------------------

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure the music directory exists
        const musicDir = join(process.cwd(), "public", "music");
        try {
            await mkdir(musicDir, { recursive: true });
        } catch (e) {
            // Directory might already exist
        }

        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const path = join(musicDir, filename);
        await writeFile(path, buffer);

        const url = `/music/${filename}`;

        const song = await prismaAny.song.create({
            data: {
                title,
                artist,
                url,
                category: "SOS",
            },
        });

        return NextResponse.json(song);
    } catch (error: any) {
        console.error("Error upload API:", error);
        return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
    }
}

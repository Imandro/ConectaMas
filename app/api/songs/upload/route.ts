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
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const artist = formData.get("artist") as string;

        if (!file || !title || !artist) {
            return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
        }

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

        const prismaAny = prisma as any;
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

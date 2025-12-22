"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function seedSongsAction() {
    // Seed logging removed
    const prismaAny = prisma as any;

    const songs = [
        {
            id: "local-song-1",
            title: "1000 Pedazos",
            artist: "Un Corazón",
            url: "/music/1000-pedazos.mp3",
            category: "Adoración",
        },
        {
            id: "local-song-2",
            title: "Trust In God",
            artist: "Elevation Worship",
            url: "/music/trust-in-god.mp3",
            category: "Confianza",
        },
        {
            id: "local-song-3",
            title: "Solo Hay Uno",
            artist: "Joel Rocco ft. Enoc Parra",
            url: "/music/solo-hay-uno.mp3",
            category: "Adoración",
        },
        {
            id: "local-song-4",
            title: "Los Brazos de Papá",
            artist: "Grupo Grace ft. OASIS MINISTRY",
            url: "/music/brazos-de-papa.mp3",
            category: "Consuelo",
        }
    ];

    try {
        // Clear existing songs to avoid duplicates or stale data
        await prismaAny.song.deleteMany({});

        for (const song of songs) {
            await prismaAny.song.upsert({
                where: { id: song.id },
                update: song,
                create: song,
            });
        }
        // Success logging removed
        revalidatePath('/dashboard/sos');
        return { success: true };
    } catch (error) {
        console.error('❌ Error seeding songs:', error);
        return { success: false, error: String(error) };
    }
}

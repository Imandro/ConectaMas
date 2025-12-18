import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const prismaWithSong = prisma as any

export async function seedSongs() {
    console.log('🎵 Seeding songs...')

    const songs = [
        {
            id: "song-1",
            title: "1000 Pedazos",
            artist: "Un Corazón",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder MP3
            category: "Adoración",
        }
    ]

    for (const song of songs) {
        await prismaWithSong.song.upsert({
            where: { id: song.id },
            update: song,
            create: song,
        })
    }

    console.log(`✅ Seeded ${songs.length} songs`)
}

if (require.main === module) {
    seedSongs()
        .then(async () => {
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
}

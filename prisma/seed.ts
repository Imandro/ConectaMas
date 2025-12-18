import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const prismaAny = prisma as any

async function main() {
    console.log('🌱 Starting database seed...')

    // --- SONGS ---
    console.log('🎵 Seeding songs...')
    const songs = [
        {
            id: "song-1",
            title: "1000 Pedazos",
            artist: "Un Corazón",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder
            category: "Adoración",
        }
    ]

    for (const song of songs) {
        await prismaAny.song.upsert({
            where: { id: song.id },
            update: song,
            create: song,
        })
    }

    // --- VIDEOS ---
    console.log('🎬 Seeding videos...')
    const videos = [
        // Testimonios
        {
            id: "video-1",
            title: "Mi encuentro con Dios",
            description: "Testimonio de transformación personal",
            videoUrl: "https://sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 45,
            category: "Testimonios",
            tags: JSON.stringify(["transformación", "fe", "testimonio"]),
        },
        // ... (truncated for brevity in this thought trace, but I will include a few to be safe)
        {
            id: "video-11",
            title: "Cómo orar efectivamente",
            description: "Principios de la oración",
            videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 95,
            category: "Oración",
            tags: JSON.stringify(["oración", "comunicación", "Dios"]),
        },
    ]

    for (const video of videos) {
        await prismaAny.video.upsert({
            where: { id: video.id },
            update: video,
            create: video,
        })
    }

    console.log('🌳 Database seed completed')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

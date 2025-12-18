import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
// Type assertion temporal hasta que se regenere el cliente de Prisma
const prismaWithVideo = prisma as any

async function seedVideos() {
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
        {
            id: "video-2",
            title: "Liberado de las adicciones",
            description: "Historia de sanidad y restauración",
            videoUrl: "https://sample-videos.com/video/mp4/720/big_buck_bunny_720p_2mb.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 60,
            category: "Testimonios",
            tags: JSON.stringify(["sanidad", "restauración", "libertad"]),
        },
        // Adoración
        {
            id: "video-3",
            title: "Momento de adoración",
            description: "Tiempo íntimo de alabanza",
            videoUrl: "https://sample-videos.com/video/mp4/720/big_buck_bunny_720p_5mb.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 90,
            category: "Adoración",
            tags: JSON.stringify(["alabanza", "adoración", "música"]),
        },
        {
            id: "video-4",
            title: "Canción de gratitud",
            description: "Agradeciendo por Su fidelidad",
            videoUrl: "https://sample-videos.com/video/mp4/720/big_buck_bunny_720p_10mb.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 75,
            category: "Adoración",
            tags: JSON.stringify(["gratitud", "alabanza", "fidelidad"]),
        },
        // Enseñanza
        {
            id: "video-5",
            title: "¿Qué es la fe?",
            description: "Entendiendo la fe bíblica",
            videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 120,
            category: "Enseñanza",
            tags: JSON.stringify(["fe", "doctrina", "biblia"]),
        },
        {
            id: "video-6",
            title: "El amor de Dios",
            description: "Comprendiendo Su amor incondicional",
            videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_2MB.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 100,
            category: "Enseñanza",
            tags: JSON.stringify(["amor", "gracia", "salvación"]),
        },
        // Motivación
        {
            id: "video-7",
            title: "No te rindas",
            description: "Mensaje de aliento para seguir adelante",
            videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_5MB.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 55,
            category: "Motivación",
            tags: JSON.stringify(["ánimo", "perseverancia", "esperanza"]),
        },
        {
            id: "video-8",
            title: "Eres valioso",
            description: "Tu identidad en Cristo",
            videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 65,
            category: "Motivación",
            tags: JSON.stringify(["identidad", "valor", "propósito"]),
        },
        // Relaciones
        {
            id: "video-9",
            title: "Amistades según Dios",
            description: "Construyendo relaciones saludables",
            videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 80,
            category: "Relaciones",
            tags: JSON.stringify(["amistad", "comunidad", "relaciones"]),
        },
        {
            id: "video-10",
            title: "Honrando a nuestros padres",
            description: "Relaciones familiares según la Biblia",
            videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 70,
            category: "Relaciones",
            tags: JSON.stringify(["familia", "padres", "honor"]),
        },
        // Oración
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
        {
            id: "video-12",
            title: "El poder de la intercesión",
            description: "Orando por otros",
            videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_2MB.mp4",
            thumbnailUrl: "/placeholder-thumb.jpg",
            duration: 85,
            category: "Oración",
            tags: JSON.stringify(["intercesión", "oración", "poder"]),
        },
    ]

    for (const video of videos) {
        await prismaWithVideo.video.upsert({
            where: { id: video.id },
            update: video,
            create: video,
        })
    }

    console.log(`✅ Seeded ${videos.length} videos`)
}

seedVideos()
    .catch((e) => {
        console.error('Error seeding videos:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

// Placeholder data for videos - replace URLs with actual videos tomorrow
export interface VideoData {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number; // in seconds
    category: string;
    tags: string[];
}

export const videosData: VideoData[] = [
    // Testimonios
    {
        id: "video-1",
        title: "Mi encuentro con Dios",
        description: "Testimonio de transformación personal",
        videoUrl: "https://sample-videos.com/placeholder1.mp4", // Placeholder
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 45,
        category: "Testimonios",
        tags: ["transformación", "fe", "testimonio"]
    },
    {
        id: "video-2",
        title: "Liberado de las adicciones",
        description: "Historia de sanidad y restauración",
        videoUrl: "https://sample-videos.com/placeholder2.mp4",
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 60,
        category: "Testimonios",
        tags: ["sanidad", "restauración", "libertad"]
    },

    // Adoración
    {
        id: "video-3",
        title: "Momento de adoración",
        description: "Tiempo íntimo de alabanza",
        videoUrl: "https://sample-videos.com/placeholder3.mp4",
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 90,
        category: "Adoración",
        tags: ["alabanza", "adoración", "música"]
    },
    {
        id: "video-4",
        title: "Canción de gratitud",
        description: "Agradeciendo por Su fidelidad",
        videoUrl: "https://sample-videos.com/placeholder4.mp4",
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 75,
        category: "Adoración",
        tags: ["gratitud", "alabanza", "fidelidad"]
    },

    // Enseñanza
    {
        id: "video-5",
        title: "¿Qué es la fe?",
        description: "Entendiendo la fe bíblica",
        videoUrl: "https://sample-videos.com/placeholder5.mp4",
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 120,
        category: "Enseñanza",
        tags: ["fe", "doctrina", "biblia"]
    },
    {
        id: "video-6",
        title: "El amor de Dios",
        description: "Comprendiendo Su amor incondicional",
        videoUrl: "https://sample-videos.com/placeholder6.mp4",
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 100,
        category: "Enseñanza",
        tags: ["amor", "gracia", "salvación"]
    },

    // Motivación
    {
        id: "video-7",
        title: "No te rindas",
        description: "Mensaje de aliento para seguir adelante",
        videoUrl: "https://sample-videos.com/placeholder7.mp4",
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 55,
        category: "Motivación",
        tags: ["ánimo", "perseverancia", "esperanza"]
    },
    {
        id: "video-8",
        title: "Eres valioso",
        description: "Tu identidad en Cristo",
        videoUrl: "https://sample-videos.com/placeholder8.mp4",
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 65,
        category: "Motivación",
        tags: ["identidad", "valor", "propósito"]
    },

    // Relaciones
    {
        id: "video-9",
        title: "Amistades según Dios",
        description: "Construyendo relaciones saludables",
        videoUrl: "https://sample-videos.com/placeholder9.mp4",
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 80,
        category: "Relaciones",
        tags: ["amistad", "comunidad", "relaciones"]
    },
    {
        id: "video-10",
        title: "Honrando a nuestros padres",
        description: "Relaciones familiares según la Biblia",
        videoUrl: "https://sample-videos.com/placeholder10.mp4",
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 70,
        category: "Relaciones",
        tags: ["familia", "padres", "honor"]
    },

    // Oración
    {
        id: "video-11",
        title: "Cómo orar efectivamente",
        description: "Principios de la oración",
        videoUrl: "https://sample-videos.com/placeholder11.mp4",
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 95,
        category: "Oración",
        tags: ["oración", "comunicación", "Dios"]
    },
    {
        id: "video-12",
        title: "El poder de la intercesión",
        description: "Orando por otros",
        videoUrl: "https://sample-videos.com/placeholder12.mp4",
        thumbnailUrl: "/placeholder-thumb.jpg",
        duration: 85,
        category: "Oración",
        tags: ["intercesión", "oración", "poder"]
    },
];

export const videoCategories = [
    "Para ti",
    "Testimonios",
    "Adoración",
    "Enseñanza",
    "Motivación",
    "Relaciones",
    "Oración",
    "Identidad",
    "Fe"
];

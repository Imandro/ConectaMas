import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedResources() {
    const resources = [
        // Estudio Bíblico
        {
            title: "Plan de Lectura Bíblica en 1 Año",
            description: "Guía completa para leer toda la Biblia en 365 días con reflexiones diarias",
            type: "PDF",
            url: "https://example.com/plan-lectura-biblica-1-ano.pdf",
            category: "Estudio Bíblico",
        },
        {
            title: "Guía de Estudio: Evangelio de Juan",
            description: "Estudio profundo del Evangelio de Juan con preguntas de reflexión y aplicación",
            type: "GUIDE",
            url: "https://example.com/guia-juan.pdf",
            category: "Estudio Bíblico",
        },
        {
            title: "Cómo Estudiar la Biblia Efectivamente",
            description: "Video tutorial sobre métodos de estudio bíblico inductivo",
            type: "VIDEO",
            url: "https://example.com/como-estudiar-biblia.mp4",
            category: "Estudio Bíblico",
        },

        // Oración
        {
            title: "Diario de Oración - 30 Días",
            description: "Plantilla de diario para registrar tus oraciones y respuestas de Dios",
            type: "WORKSHEET",
            url: "https://example.com/diario-oracion-30-dias.pdf",
            category: "Oración",
        },
        {
            title: "Guía de Oración Intercesora",
            description: "Aprende a interceder efectivamente por otros con esta guía práctica",
            type: "GUIDE",
            url: "https://example.com/guia-oracion-intercesora.pdf",
            category: "Oración",
        },
        {
            title: "Música de Adoración para Oración",
            description: "Playlist de música instrumental cristiana para momentos de oración",
            type: "AUDIO",
            url: "https://example.com/musica-oracion.mp3",
            category: "Oración",
        },

        // Devocionales
        {
            title: "Devocionales para Jóvenes - Semana 1",
            description: "7 días de devocionales enfocados en identidad en Cristo",
            type: "PDF",
            url: "https://example.com/devocionales-jovenes-semana1.pdf",
            category: "Devocionales",
        },
        {
            title: "Devocional Matutino: 5 Minutos con Dios",
            description: "Devocionales cortos pero poderosos para comenzar tu día",
            type: "PDF",
            url: "https://example.com/devocional-matutino.pdf",
            category: "Devocionales",
        },

        // Crecimiento Personal
        {
            title: "Hoja de Trabajo: Identificando Tus Dones Espirituales",
            description: "Cuestionario y guía para descubrir tus dones espirituales",
            type: "WORKSHEET",
            url: "https://example.com/dones-espirituales.pdf",
            category: "Crecimiento Personal",
        },
        {
            title: "Plan de Crecimiento Espiritual - 90 Días",
            description: "Programa estructurado de 90 días para profundizar tu fe",
            type: "GUIDE",
            url: "https://example.com/plan-90-dias.pdf",
            category: "Crecimiento Personal",
        },
        {
            title: "Estableciendo Metas Espirituales",
            description: "Video sobre cómo establecer y alcanzar metas espirituales significativas",
            type: "VIDEO",
            url: "https://example.com/metas-espirituales.mp4",
            category: "Crecimiento Personal",
        },
        {
            title: "Diario de Gratitud Cristiano",
            description: "Plantilla de diario para cultivar un corazón agradecido",
            type: "WORKSHEET",
            url: "https://example.com/diario-gratitud.pdf",
            category: "Crecimiento Personal",
        },

        // Consejería
        {
            title: "Guía para Superar la Ansiedad con Fe",
            description: "Recurso completo con estrategias bíblicas y prácticas para manejar la ansiedad",
            type: "GUIDE",
            url: "https://example.com/superar-ansiedad.pdf",
            category: "Consejería",
        },
        {
            title: "Rompiendo Cadenas de Adicción",
            description: "Plan de recuperación basado en principios bíblicos",
            type: "GUIDE",
            url: "https://example.com/rompiendo-adiccion.pdf",
            category: "Consejería",
        },
        {
            title: "Sanando Heridas Emocionales",
            description: "Serie de audio sobre sanidad interior y restauración emocional",
            type: "AUDIO",
            url: "https://example.com/sanidad-emocional.mp3",
            category: "Consejería",
        },
    ];

    console.log('Seeding resources...');

    for (const resource of resources) {
        await prisma.resource.create({
            data: resource,
        });
    }

    console.log(`✅ Seeded ${resources.length} resources`);
}

// Run if called directly
if (require.main === module) {
    seedResources()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

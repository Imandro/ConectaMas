const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMoreResources() {
    const resources = [
        // Más Estudio Bíblico
        {
            title: "Método de Estudio Bíblico Inductivo",
            description: "Guía paso a paso para estudiar la Biblia profundamente: observación, interpretación y aplicación",
            type: "GUIDE",
            url: "https://example.com/metodo-estudio-inductivo.pdf",
            category: "Estudio Bíblico",
        },
        {
            title: "Panorama del Antiguo Testamento",
            description: "Video serie de 12 episodios explicando la historia y teología del AT",
            type: "VIDEO",
            url: "https://example.com/panorama-antiguo-testamento.mp4",
            category: "Estudio Bíblico",
        },
        {
            title: "Panorama del Nuevo Testamento",
            description: "Video serie de 10 episodios sobre la vida de Cristo y las epístolas",
            type: "VIDEO",
            url: "https://example.com/panorama-nuevo-testamento.mp4",
            category: "Estudio Bíblico",
        },
        {
            title: "Hoja de Trabajo: Estudio de Personajes Bíblicos",
            description: "Plantilla para estudiar profundamente personajes de la Biblia",
            type: "WORKSHEET",
            url: "https://example.com/estudio-personajes.pdf",
            category: "Estudio Bíblico",
        },

        // Más Oración
        {
            title: "30 Días de Guerra Espiritual en Oración",
            description: "Plan de oración enfocado en victoria espiritual y rompimiento de fortalezas",
            type: "GUIDE",
            url: "https://example.com/30-dias-guerra-espiritual.pdf",
            category: "Oración",
        },
        {
            title: "Oraciones Bíblicas: Orando la Palabra",
            description: "Colección de oraciones basadas en pasajes bíblicos para diferentes situaciones",
            type: "PDF",
            url: "https://example.com/oraciones-biblicas.pdf",
            category: "Oración",
        },
        {
            title: "Música Instrumental para Intercesión",
            description: "2 horas de música solemne para momentos de intercesión profunda",
            type: "AUDIO",
            url: "https://example.com/musica-intercesion.mp3",
            category: "Oración",
        },

        // Evangelismo
        {
            title: "Cómo Compartir Tu Testimonio en 3 Minutos",
            description: "Guía práctica con plantilla para escribir y compartir tu testimonio efectivamente",
            type: "GUIDE",
            url: "https://example.com/compartir-testimonio.pdf",
            category: "Evangelismo",
        },
        {
            title: "Respondiendo Objeciones Comunes al Evangelio",
            description: "Manual con respuestas bíblicas a 20 objeciones frecuentes sobre el cristianismo",
            type: "GUIDE",
            url: "https://example.com/respondiendo-objeciones.pdf",
            category: "Evangelismo",
        },
        {
            title: "Tarjetas del Plan de Salvación",
            description: "Tarjetas imprimibles con el plan de salvación usando el método de los colores",
            type: "PDF",
            url: "https://example.com/tarjetas-salvacion.pdf",
            category: "Evangelismo",
        },

        // Discipulado
        {
            title: "Fundamentos de la Fe Cristiana - Curso Completo",
            description: "Curso de 12 semanas para nuevos creyentes cubriendo doctrinas esenciales",
            type: "GUIDE",
            url: "https://example.com/fundamentos-fe.pdf",
            category: "Discipulado",
        },
        {
            title: "Plan de Lectura Bíblica Cronológica",
            description: "Lee la Biblia en orden cronológico en 1 año con contexto histórico",
            type: "PDF",
            url: "https://example.com/lectura-cronologica.pdf",
            category: "Discipulado",
        },
        {
            title: "Disciplinas Espirituales para Jóvenes",
            description: "Video curso sobre oración, ayuno, meditación, servicio y otras disciplinas",
            type: "VIDEO",
            url: "https://example.com/disciplinas-espirituales.mp4",
            category: "Discipulado",
        },

        // Adoración
        {
            title: "Playlist: Adoración Profunda",
            description: "50 canciones de adoración íntima y profunda en español",
            type: "AUDIO",
            url: "https://example.com/adoracion-profunda.mp3",
            category: "Adoración",
        },
        {
            title: "Guía de Adoración Personal",
            description: "Cómo crear momentos significativos de adoración a solas con Dios",
            type: "GUIDE",
            url: "https://example.com/adoracion-personal.pdf",
            category: "Adoración",
        },

        // Santidad y Pureza
        {
            title: "Venciendo la Pornografía: Plan de Batalla",
            description: "Estrategias bíblicas y prácticas para libertad de adicción pornográfica",
            type: "GUIDE",
            url: "https://example.com/venciendo-pornografia.pdf",
            category: "Pureza",
        },
        {
            title: "Pacto de Pureza Digital",
            description: "Documento de compromiso con estrategias de rendición de cuentas online",
            type: "WORKSHEET",
            url: "https://example.com/pacto-pureza-digital.pdf",
            category: "Pureza",
        },
        {
            title: "Límites Saludables en el Noviazgo",
            description: "Guía práctica para establecer y mantener límites físicos y emocionales",
            type: "GUIDE",
            url: "https://example.com/limites-noviazgo.pdf",
            category: "Relaciones",
        },

        // Salud Mental y Emocional
        {
            title: "Superando la Depresión con Fe",
            description: "Recurso que combina verdades bíblicas con estrategias de salud mental",
            type: "GUIDE",
            url: "https://example.com/superando-depresion.pdf",
            category: "Salud Mental",
        },
        {
            title: "Diario de Emociones Cristiano",
            description: "Plantilla para procesar emociones a la luz de la Palabra de Dios",
            type: "WORKSHEET",
            url: "https://example.com/diario-emociones.pdf",
            category: "Salud Mental",
        },
        {
            title: "Afirmaciones Bíblicas Contra la Ansiedad",
            description: "Audio de 30 minutos con versículos y afirmaciones para paz mental",
            type: "AUDIO",
            url: "https://example.com/afirmaciones-ansiedad.mp3",
            category: "Salud Mental",
        },
    ];

    console.log('🌱 Seeding additional Christian resources...');

    for (const resource of resources) {
        await prisma.resource.create({
            data: resource,
        });
    }

    console.log(`✅ Seeded ${resources.length} additional resources`);
}

async function main() {
    console.log('🚀 Starting additional resources seed...');

    try {
        await seedMoreResources();
        console.log('✨ Additional resources seed completed!');
    } catch (error) {
        console.error('❌ Error during seed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

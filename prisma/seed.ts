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

    // --- DAILY PRAYERS ---
    console.log('🙏 Seeding Daily Prayers...')

    const prayerTemplates = [
        {
            theme: 'Fe',
            content: 'Padre celestial, aumenta mi fe hoy. Ayúdame a confiar en ti incluso cuando no veo el camino. Que mi fe no se base en circunstancias, sino en tu fidelidad eterna. En el nombre de Jesús, Amén.'
        },
        {
            theme: 'Esperanza',
            content: 'Señor de esperanza, llena mi corazón de tu paz. Cuando todo parezca oscuro, recuérdame que tú eres mi luz. Que mi esperanza esté anclada en tus promesas que nunca fallan. Amén.'
        },
        {
            theme: 'Amor',
            content: 'Dios de amor, enséñame a amar como tú amas. Que tu amor fluya a través de mí hacia otros. Ayúdame a perdonar, a ser paciente y a mostrar compasión. En tu nombre, Amén.'
        },
        {
            theme: 'Perdón',
            content: 'Padre misericordioso, gracias por tu perdón inmerecido. Ayúdame a perdonar a quienes me han herido, así como tú me has perdonado. Libera mi corazón de resentimiento. Amén.'
        },
        {
            theme: 'Fuerza',
            content: 'Señor todopoderoso, dame fuerzas para enfrentar este día. Cuando me sienta débil, recuérdame que tu poder se perfecciona en mi debilidad. Sé mi fortaleza y mi refugio. Amén.'
        },
        {
            theme: 'Paz',
            content: 'Príncipe de paz, calma las tormentas de mi corazón. Que tu paz que sobrepasa todo entendimiento guarde mi mente y mis pensamientos. En medio del caos, tú eres mi paz. Amén.'
        },
        {
            theme: 'Sabiduría',
            content: 'Dios de sabiduría, guíame en todas mis decisiones. Dame discernimiento para conocer tu voluntad. Que tu Palabra ilumine mi camino y dirija mis pasos. En Cristo, Amén.'
        },
        {
            theme: 'Gratitud',
            content: 'Padre bueno, gracias por tus bendiciones diarias. Ayúdame a tener un corazón agradecido en toda circunstancia. Que nunca olvide tu fidelidad y tu amor constante. Amén.'
        },
        {
            theme: 'Protección',
            content: 'Señor mi protector, cúbreme bajo tus alas. Guárdame del mal y de toda tentación. Que tus ángeles acampen alrededor de mí y de mis seres queridos. Amén.'
        },
        {
            theme: 'Sanidad',
            content: 'Dios sanador, toca mi cuerpo, mente y espíritu. Restaura lo que está quebrantado y sana mis heridas. Confío en tu poder sanador y en tu amor restaurador. Amén.'
        },
        {
            theme: 'Provisión',
            content: 'Jehová Jireh, mi proveedor, confío en que suplirás todas mis necesidades. Ayúdame a no afanarme, sino a buscar primero tu reino. Gracias por tu fidelidad. Amén.'
        },
        {
            theme: 'Paciencia',
            content: 'Señor paciente, enséñame a esperar en tu tiempo perfecto. Dame paciencia en las pruebas y en las relaciones. Que aprenda a descansar en tu soberanía. Amén.'
        }
    ];

    const totalDays = 365;
    for (let i = 0; i < totalDays; i++) {
        const template = prayerTemplates[i % prayerTemplates.length];
        await prismaAny.dailyPrayer.upsert({
            where: { dayOfYear: i + 1 },
            update: {
                title: `Oración del día ${i + 1}`,
                content: template.content,
                theme: template.theme
            },
            create: {
                dayOfYear: i + 1,
                title: `Oración del día ${i + 1}`,
                content: template.content,
                theme: template.theme
            },
        })
    }

    console.log('✅ 365 Daily Prayers seeded')

    // --- FORUM CATEGORIES ---
    console.log('🗣️ Seeding Forum Categories...')

    const forumCategories = [
        { name: 'Ansiedad', description: 'Comparte y encuentra apoyo sobre ansiedad y preocupaciones', icon: '😰' },
        { name: 'Depresión', description: 'Un espacio seguro para hablar sobre depresión y tristeza', icon: '😔' },
        { name: 'Adicciones', description: 'Apoyo en la lucha contra adicciones de todo tipo', icon: '🚫' },
        { name: 'Lujuria', description: 'Venciendo la tentación sexual juntos en Cristo', icon: '💪' },
        { name: 'Relaciones', description: 'Consejos sobre relaciones, familia y amistades', icon: '❤️' },
        { name: 'Fe y Dudas', description: 'Preguntas sobre la fe cristiana y la Biblia', icon: '🙏' },
        { name: 'Testimonios', description: 'Comparte tu historia de transformación y victoria', icon: '✨' },
        { name: 'Oración', description: 'Peticiones de oración y apoyo espiritual', icon: '🕊️' },
    ];

    for (const category of forumCategories) {
        await prismaAny.forumCategory.upsert({
            where: { name: category.name },
            update: category,
            create: category,
        });
    }

    console.log('✅ 8 Forum Categories seeded')

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


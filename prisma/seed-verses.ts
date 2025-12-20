import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const prismaAny = prisma as any

export async function seedVerses() {
    console.log('📖 Seeding Curated Verses...')

    const verses = [
        {
            reference: "Filipenses 4:6-7",
            text: "No se preocupen por nada; en cambio, oren por todo. Díganle a Dios lo que necesitan y denle gracias por todo lo que él ha hecho. Así experimentarán la paz de Dios...",
            tags: "Ansiedad,Preocupación,Miedo",
            book: "Filipenses",
            chapter: 4,
            verseNum: 6
        },
        {
            reference: "Salmos 23:4",
            text: "Aun cuando yo pase por el valle más oscuro, no temeré, porque tú estás a mi lado...",
            tags: "Miedo,Soledad,Tristeza",
            book: "Salmos",
            chapter: 23,
            verseNum: 4
        },
        {
            reference: "1 Corintios 10:13",
            text: "Las tentaciones que enfrentan en su vida no son distintas de las que otros atraviesan. Y Dios es fiel; no permitirá que la tentación sea mayor de lo que puedan soportar...",
            tags: "Tentación,Lujuria,Vicios",
            book: "1 Corintios",
            chapter: 10,
            verseNum: 13
        },
        {
            reference: "1 Juan 1:9",
            text: "Pero si confesamos nuestros pecados a Dios, él es fiel y justo para perdonarnos nuestros pecados y limpiarnos de toda maldad.",
            tags: "Culpa,Perdón,Pecado",
            book: "1 Juan",
            chapter: 1,
            verseNum: 9
        },
        {
            reference: "Mateo 11:28",
            text: "Luego dijo Jesús: «Vengan a mí todos los que están cansados y llevan cargas pesadas, y yo les daré descanso.",
            tags: "Cansancio,Estrés,Cargas",
            book: "Mateo",
            chapter: 11,
            verseNum: 28
        },
        // Add more as needed
    ]

    for (const v of verses) {
        // Basic deduplication check logic would go here, but for seed we just create/update
        // As we don't have unique constraint on reference in basic definition, we delete first or findFirst
        const existing = await prismaAny.bibleVerse.findFirst({
            where: { reference: v.reference }
        })

        if (existing) {
            await prismaAny.bibleVerse.update({
                where: { id: existing.id },
                data: v
            })
        } else {
            await prismaAny.bibleVerse.create({
                data: v
            })
        }
    }

    console.log('✅ Curated verses seeded')
}

// Execute seeding
seedVerses()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

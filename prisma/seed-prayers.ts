import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const prismaAny = prisma as any

export async function seedPrayers() {
    console.log('🙏 Seeding Daily Prayers...')

    const prayers = []
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    let dayCounter = 1;
    const totalDays = 365;

    // Generic themes for rotation
    const themes = ['Fe', 'Esperanza', 'Amor', 'Perdón', 'Fuerza', 'Paz', 'Sabiduría', 'Gratitud'];

    for (let i = 0; i < totalDays; i++) {
        const theme = themes[i % themes.length];
        prayers.push({
            dayOfYear: i + 1,
            title: `Oración del día ${i + 1}`,
            content: `Señor, en este día quiero pedirte por mi ${theme.toLowerCase()}. Ayúdame a confiar plenamente en ti y a entregar mis cargas. Que tu paz que sobrepasa todo entendimiento guarde mi corazón y mis pensamientos. En el nombre de Jesús, Amén.`,
            theme: theme
        })
    }

    // Insert in batches
    for (const prayer of prayers) {
        await prismaAny.dailyPrayer.upsert({
            where: { dayOfYear: prayer.dayOfYear },
            update: prayer,
            create: prayer,
        })
    }

    console.log('✅ 365 Prayers seeded')
}

// Execute seeding
seedPrayers()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

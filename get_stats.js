const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getStats() {
    try {
        const users = await prisma.user.findMany({
            select: {
                country: true,
                age: true,
                sinsToOvercome: true
            }
        });

        const total = users.length;
        const countries = {};
        const ages = { '12-14': 0, '15-19': 0, '20-24': 0, '25-30': 0, 'Otros': 0 };
        const struggles = {};

        users.forEach(u => {
            const c = u.country || 'No especificado';
            countries[c] = (countries[c] || 0) + 1;

            if (u.age && u.age >= 12 && u.age <= 14) ages['12-14']++;
            else if (u.age && u.age >= 15 && u.age <= 19) ages['15-19']++;
            else if (u.age && u.age >= 20 && u.age <= 24) ages['20-24']++;
            else if (u.age && u.age >= 25 && u.age <= 30) ages['25-30']++;
            else ages['Otros']++;

            try {
                if (u.sinsToOvercome) {
                    const sins = JSON.parse(u.sinsToOvercome);
                    if (Array.isArray(sins)) {
                        sins.forEach((s) => {
                            struggles[s] = (struggles[s] || 0) + 1;
                        });
                    }
                }
            } catch (e) { }
        });

        console.log('--- STATS START ---');
        console.log(JSON.stringify({ total, countries, ages, struggles }, null, 2));
        console.log('--- STATS END ---');
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

getStats();

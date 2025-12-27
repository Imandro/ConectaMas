
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const update = await prisma.user.updateMany({
        data: { hasSeenCommunityTutorial: true }
    });
    console.log(`Updated ${update.count} users to have seen the community tutorial.`);
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

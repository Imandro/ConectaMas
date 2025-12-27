
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting database repair...");

    const users = await prisma.user.findMany({
        include: { mascot: true }
    });

    console.log(`Found ${users.length} users to check.`);

    let updatedCount = 0;
    let mascotCreatedCount = 0;

    for (const user of users) {
        let needsUpdate = false;
        let updateData = {};

        // 1. Check Mascot
        if (!user.mascot) {
            console.log(`Creating mascot for user ${user.id} (${user.email})`);
            await prisma.mascot.create({
                data: {
                    userId: user.id,
                    name: "Llami",
                    level: 1,
                    experience: 0,
                    flamePoints: 10,
                    mood: "FELIZ"
                }
            });
            mascotCreatedCount++;
        }

        // 2. Check Spiritual Level
        if (!user.spiritualLevel) {
            updateData.spiritualLevel = "Explorador";
            needsUpdate = true;
        }

        // 3. Force Onboarding completion to unblock dashboard
        if (!user.hasCompletedOnboarding) {
            updateData.hasCompletedOnboarding = true;
            needsUpdate = true;
        }

        // 4. Fix potential loop tutorials
        if (!user.hasSeenLlamiTutorial) {
            updateData.hasSeenLlamiTutorial = true;
            needsUpdate = true;
        }

        // 5. Gender fix (optional, just to be safe)
        if (user.gender === null) {
            // Don't force gender, let them choose, but ensure fields aren't breaking logic
        }

        if (needsUpdate) {
            await prisma.user.update({
                where: { id: user.id },
                data: updateData
            });
            updatedCount++;
        }
    }

    console.log(`Repair Complete.`);
    console.log(`- Created Mascots: ${mascotCreatedCount}`);
    console.log(`- Updated User Profiles: ${updatedCount}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

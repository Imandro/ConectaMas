import { PrismaClient } from '@prisma/client';
import { pdfResources } from './seeds/pdf_resources_data';

const prisma = new PrismaClient();

export async function seedPdfResources() {
    console.log('🧹 Cleaning existing resources...');
    await prisma.resource.deleteMany({});

    console.log(`🌱 Seeding ${pdfResources.length} new PDF resources...`);

    for (const resource of pdfResources) {
        await prisma.resource.create({
            data: {
                ...resource,
                downloadCount: Math.floor(Math.random() * 200) + 50 // Give some initial social proof
            }
        });
    }

    console.log('✅ PDF Resources seeding completed!');
}

if (require.main === module) {
    seedPdfResources()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

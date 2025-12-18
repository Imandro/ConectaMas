
const { PrismaClient } = require('@prisma/client');

async function main() {
    const url = 'postgresql://postgres:Conecta%2B2801@db.clochnlqzhaxwlvxgnta.supabase.co:5432/postgres?sslmode=require';
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url,
            },
        },
    });

    try {
        console.log('Testing connection to Supabase...');
        const result = await prisma.$queryRaw`SELECT 1 as connected`;
        console.log('Successfully connected:', result);
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

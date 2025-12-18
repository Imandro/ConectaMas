
const { PrismaClient } = require('@prisma/client');

async function testRegistration() {
    const url = 'postgresql://postgres:Conecta%2B2801@db.clochnlqzhaxwlvxgnta.supabase.co:5432/postgres?sslmode=require';
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url,
            },
        },
    });

    const testEmail = `test-${Date.now()}@example.com`;

    try {
        console.log(`Attempting to create diagnostic user with email: ${testEmail}...`);

        // Check connection first
        await prisma.$connect();
        console.log('Connected to DB.');

        // Attempt creation matching the register/route.ts logic
        const newUser = await prisma.user.create({
            data: {
                name: 'Diagnostic User',
                email: testEmail,
                passwordHash: 'dummy_hash',
                role: 'USER',
                spiritualLevel: 'Explorador',
            },
        });

        console.log('Success! User created:', newUser.id);

        // Clean up
        await prisma.user.delete({ where: { id: newUser.id } });
        console.log('Diagnostic user deleted.');

    } catch (error) {
        console.error('DIAGNOSTIC FAILURE:');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        if (error.meta) console.error('Error Meta:', error.meta);
    } finally {
        await prisma.$disconnect();
    }
}

testRegistration();

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count()
    .then(c => console.log('User count:', c))
    .catch(e => console.error('Error:', e))
    .finally(() => prisma.$disconnect());

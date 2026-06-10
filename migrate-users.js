const { PrismaClient } = require('@prisma/client');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const sqlitePath = path.join(__dirname, 'prisma', 'dev.db');
const sqlite = new DatabaseSync(sqlitePath);

const rows = sqlite.prepare('SELECT * FROM User').all();
console.log('Found ' + rows.length + ' users in SQLite');

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

function toDate(v) {
  if (!v) return new Date();
  if (typeof v === 'number') return new Date(v);
  return new Date(v);
}

async function migrate() {
  for (const u of rows) {
    try {
      const data = {
        id: u.id,
        email: u.email || undefined,
        passwordHash: u.passwordHash,
        name: u.name || undefined,
        username: u.email ? u.email.split('@')[0] : undefined,
        role: u.role || 'USER',
        spiritualLevel: u.spiritualLevel || 'Explorador',
        createdAt: toDate(u.createdAt),
        updatedAt: toDate(u.updatedAt),
        isAnonymous: false,
        hasCompletedOnboarding: u.hasCompletedOnboarding === 1,
        hasSeenTutorialTour: u.hasSeenTutorialTour === 1,
        isCounselor: u.isCounselor === 1,
      };

      await prisma.user.upsert({
        where: { id: u.id },
        update: data,
        create: data,
      });
      console.log('Migrated: ' + u.email);
    } catch (e) {
      console.error('Error: ' + (u.email || u.id) + ' - ' + e.message);
    }
  }
  await prisma.$disconnect();
  sqlite.close();
  console.log('Done');
}

migrate().catch(e => { console.error(e); process.exit(1); });

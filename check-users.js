const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
p.user.findMany({ select: { id: true, email: true, name: true, username: true } }).then(users => {
  console.log('Users in Neon: ' + users.length);
  users.forEach(u => console.log(' - ' + u.id + ' | email=' + u.email + ' | name=' + u.name + ' | username=' + u.username));
  p.$disconnect();
});

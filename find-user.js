const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
p.user.findFirst({ where: { email: 'mari01alv51@gmail.com' } }).then(u => {
  if (u) console.log('Found: ' + u.id + ' ' + u.email + ' ' + u.name + ' username=' + u.username);
  else console.log('User not found');
  return p.user.findMany({ where: { email: null }, select: { id: true, email: true } });
}).then(nullEmails => {
  console.log('Users with null email: ' + nullEmails.length);
  nullEmails.forEach(u => console.log('  ' + u.id));
  p.$disconnect();
});

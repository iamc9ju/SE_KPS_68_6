
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { URL } = require('url');
require('dotenv').config();

async function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;
  const parsed = new URL(dbUrl);
  const hostname = parsed.hostname;
  const pool = new Pool({
    host: hostname,
    port: Number(parsed.port) || 5432,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.split('/')[1],
    ssl: { rejectUnauthorized: false, servername: hostname },
    connectionTimeoutMillis: 15000,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

async function main() {
  const prisma = await createPrismaClient();
  try {
    const users = await prisma.user.findMany({
      include: {
        patient: true,
        nutritionist: true,
        foodPartner: true,
        admin: true
      }
    });

    console.log(`Total Users: ${users.length}`);
    users.forEach(u => {
      let name = 'N/A';
      if (u.patient) name = `${u.patient.firstName} ${u.patient.lastName}`;
      else if (u.nutritionist) name = `${u.nutritionist.firstName} ${u.nutritionist.lastName}`;
      else if (u.foodPartner) name = u.foodPartner.partnerName;
      else if (u.admin) name = `${u.admin.firstName} ${u.admin.lastName}`;
      
      console.log(`- Role: ${u.role}, Email: ${u.email}, Name: ${name}, UID: ${u.userId}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);

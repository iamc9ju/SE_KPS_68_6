
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
    const nutritionists = await prisma.nutritionist.findMany({
      where: { lastName: { contains: 'วราพิพัฒน์พล' } },
      include: { user: true }
    });

    console.log(`Found ${nutritionists.length} nutritionists with that last name`);
    nutritionists.forEach(n => {
      console.log(`- ID: ${n.nutritionistId}, Name: ${n.firstName} ${n.lastName}, Email: ${n.user?.email}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);


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
    const apps = await prisma.appointment.findMany({
      include: {
        nutritionist: { select: { firstName: true, lastName: true, user: { select: { email: true } } } },
        patient: { select: { firstName: true, lastName: true, user: { select: { email: true } } } }
      }
    });

    console.log(`Total Appointments: ${apps.length}`);
    apps.forEach(a => {
      console.log(`- ApptID: ${a.appointmentId}`);
      console.log(`  Nutri: ${a.nutritionist?.firstName} ${a.nutritionist?.lastName} (${a.nutritionist?.user?.email})`);
      console.log(`  Patient: ${a.patient?.firstName} ${a.patient?.lastName} (${a.patient?.user?.email})`);
      console.log(`  Start: ${a.startTime}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);

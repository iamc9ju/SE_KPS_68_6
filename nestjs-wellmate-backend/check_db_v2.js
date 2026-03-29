
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { URL } = require('url');
require('dotenv').config();

async function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL is not defined');

  const parsed = new URL(dbUrl);
  const hostname = parsed.hostname;
  
  const pool = new Pool({
    host: hostname,
    port: Number(parsed.port) || 5432,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.split('/')[1],
    ssl: {
      rejectUnauthorized: false,
      servername: hostname,
    },
    connectionTimeoutMillis: 15000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

async function main() {
  const prisma = await createPrismaClient();
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        nutritionist: { include: { user: true } },
        patient: { include: { user: true } }
      }
    });

    console.log(`Total Appointments: ${appointments.length}`);
    appointments.forEach(a => {
      console.log(`- ID: ${a.appointmentId}, Nutri: ${a.nutritionist?.user?.email}, Patient: ${a.patient?.user?.email}, Date: ${a.startTime}, Status: ${a.status}`);
    });

    const users = await prisma.user.findMany({
      where: { role: 'nutritionist' },
      include: { nutritionist: true }
    });
    console.log(`\nNutritionist Users: ${users.length}`);
    users.forEach(u => {
      console.log(`- UserID: ${u.userId}, Email: ${u.email}, NutriID: ${u.nutritionist?.nutritionistId}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);


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
    const email = 'thananrada@wellmate.com';
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        nutritionist: {
          include: {
            appointments: {
               include: { patient: { include: { user: true } } }
            }
          }
        }
      }
    });

    if (!user) {
      console.log(`User ${email} NOT FOUND`);
    } else {
      console.log(`User: ${user.email}, Role: ${user.role}`);
      const nutri = user.nutritionist;
      if (!nutri) {
        console.log(`Nutritionist record NOT FOUND for ${email}`);
      } else {
        console.log(`Nutritionist ID: ${nutri.nutritionistId}, Status: ${nutri.verificationStatus}`);
        console.log(`Total appointments for this nutritionist: ${nutri.appointments.length}`);
        nutri.appointments.forEach(a => {
           console.log(`- ID: ${a.appointmentId}, Patient: ${a.patient?.user?.email}, Date: ${a.startTime}, Status: ${a.status}`);
        });
      }
    }

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);

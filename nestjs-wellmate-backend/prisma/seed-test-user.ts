const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');
const { execSync } = require('child_process');
const { URL } = require('url');
require('dotenv').config();

async function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL is not defined');

  const parsed = new URL(dbUrl);
  const hostname = parsed.hostname;
  let ip = hostname;
  try {
    const output = execSync(`dig +short A ${hostname}`).toString().trim();
    const lines = output.split('\n');
    for (const line of lines) {
      if (/^\d+\.\d+\.\d+\.\d+$/.test(line)) {
        ip = line;
        break;
      }
    }
  } catch (e) {
    console.warn('DNS Resolution failed, falling back to hostname');
  }

  const pool = new Pool({
    host: ip,
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
  const passwordHash = await bcrypt.hash('password123', 10);

  const testUser = {
    email: 'testuser@example.com',
    firstName: 'สมชาย',
    lastName: 'สายลุย',
    role: 'patient',
  };

  let user = await prisma.user.findUnique({ where: { email: testUser.email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: testUser.email,
        passwordHash,
        role: testUser.role,
        phone: '0812345678',
      },
    });
    console.log(`Created user ${testUser.email}`);
  }

  const patient = await prisma.patient.findUnique({
    where: { userId: user.userId },
  });

  if (!patient) {
    await prisma.patient.create({
      data: {
        userId: user.userId,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
      },
    });
    console.log(`Created patient ${testUser.firstName} ${testUser.lastName}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);

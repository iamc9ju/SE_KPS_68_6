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
  
  const categories = [
    { name: 'ข้าว', description: 'เมนูจานเดียวและข้าวสวย' },
    { name: 'Salad', description: 'สลัดและผักสด' },
    { name: 'Set menu', description: 'อาหารชุด' },
    { name: 'เครื่องดื่ม', description: 'น้ำดื่มและเครื่องดื่มต่างๆ' },
    { name: 'ของว่าง', description: 'ขนมและของกินเล่น' },
    { name: 'ก๋วยเตี๋ยว', description: 'เมนูเส้นและก๋วยเตี๋ยว' },
    { name: 'ขนมหวาน', description: 'ของหวานและไอศกรีม' },
  ];

  console.log('Seeding categories...');

  for (const category of categories) {
    await prisma.menuCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Seeding completed.');
  await prisma.$disconnect();
}

main().catch(console.error);

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL is not defined');

const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    { name: 'เมนูโซเดียมต่ำ', description: 'อาหารที่จำกัดปริมาณโซเดียม เหมาะสำหรับผู้ควบคุมความดันโลหิต' },
    { name: 'เมนูโปรตีนสูง', description: 'เน้นสารอาหารโปรตีน เพื่อการซ่อมแซมส่วนที่สึกหรอและเสริมสร้างกล้ามเนื้อ' },
    { name: 'เมนูคาร์บต่ำ', description: 'จำกัดปริมาณคาร์โบไฮเดรต สำหรับการควบคุมน้ำหนัก' },
    { name: 'เมนูน้ำตาลน้อย', description: 'อาหารที่มีดัชนีน้ำตาลต่ำ เหมาะสำหรับผู้ควบคุมระดับน้ำตาลในเลือด' },
    { name: 'เมนูใยอาหารสูง', description: 'อุดมด้วยกากใยจากผักและธัญพืช ช่วยระบบขับถ่ายและลดการดูดซึมไขมัน' },
    { name: 'อาหารเจ/มังสวิรัติ', description: 'อาหารทางเลือกที่ไม่ใช้เนื้อสัตว์' },
    { name: 'เซตเมนูสุขภาพ', description: 'ชุดอาหารที่จัดสมดุลทางโภชนาการครบ 5 หมู่' },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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

  console.log('Connected to database. Starting seeding...');

  const restaurantsData = [
    {
      email: 'organic@wellmate.com',
      name: 'Organic Garden',
      description: 'อาหารคลีนจากฟาร์มออร์แกนิค สดใหม่ทุกวันเพื่อสุขภาพที่ดีของคุณ',
      logo_url: 'https://images.unsplash.com/photo-1466632311177-a3d1436f9591?q=80&w=200&auto=format&fit=crop',
      cover_image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop',
      categories: ['สลัด', 'อาหารคลีน', 'มังสวิรัติ'],
      items: [
        {
          name: 'สลัดอกไก่ควินัว',
          description: 'อกไก่นุ่มๆ ทานคู่กับควินัวและผักหลากสี ราดด้วยน้ำสลัดงาญี่ปุ่นสูตรคลีน',
          price: 185,
          caloriesKcal: 320,
          imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
          category: 'สลัด'
        },
        {
          name: 'ก๋วยเตี๋ยวลุยสวนผักออร์แกนิค',
          description: 'แป้งบางนุ่ม ห่อผักสดหลากหลายชนิด พร้อมน้ำจิ้มรสเด็ดเผ็ดกำลังดี',
          price: 120,
          caloriesKcal: 180,
          imageUrl: 'https://images.unsplash.com/photo-1544413647-b51046402d15?q=80&w=800&auto=format&fit=crop',
          category: 'ของว่าง'
        }
      ]
    },
    {
      email: 'salmon@wellmate.com',
      name: 'Salmon & Soul',
      description: 'สุดยอดเมนูปลาแซลมอนนอร์เวย์ ปรุงแบบไขมันต่ำ แต่อิ่มอร่อยและมีคุณค่าทางโภชนาการสูง',
      logo_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=200&auto=format&fit=crop',
      cover_image_url: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=1200&auto=format&fit=crop',
      categories: ['อาหารทะเล', 'โปรตีนสูง', 'คีโต'],
      items: [
        {
          name: 'แซลมอนย่างเกลือและหน่อไม้ฝรั่ง',
          description: 'แซลมอนชิ้นโตย่างสุกกำลังดี เสิร์ฟพร้อมหน่อไม้ฝรั่งและมันฝรั่งอบ',
          price: 320,
          caloriesKcal: 450,
          imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop',
          category: 'จานหลัก'
        }
      ]
    },
    {
      email: 'smoothie@wellmate.com',
      name: 'Smoothie Sun',
      description: 'น้ำผักผลไม้สกัดเย็นและสมูทตี้สูตรพิเศษ ไม่เติมน้ำตาล วิตามินเต็มเปี่ยม',
      logo_url: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?q=80&w=200&auto=format&fit=crop',
      cover_image_url: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=1200&auto=format&fit=crop',
      categories: ['เครื่องดื่ม', 'ผลไม้', 'ดีท็อกซ์'],
      items: [
        {
          name: 'อาซาอิเบอร์รี่บูสท์',
          description: 'สมูทตี้อาซาอิเบอร์รี่เข้มข้น ท็อปด้วยกราโนล่าและผลไม้สด ช่วยต้านอนุมูลอิสระ',
          price: 165,
          caloriesKcal: 280,
          imageUrl: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?q=80&w=800&auto=format&fit=crop',
          category: 'เครื่องดื่ม'
        }
      ]
    }
  ];

  for (const rest of restaurantsData) {
    // 1. Create or Find User
    let user = await prisma.user.findFirst({ where: { email: rest.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: rest.email,
          passwordHash,
          role: 'food_partner',
          phone: `081000000${restaurantsData.indexOf(rest)}`,
        },
      });
      console.log(`Created partner user: ${rest.email}`);
    }

    // 2. Create or Find FoodPartner
    let partner = await prisma.foodPartner.findFirst({
      where: { partnerName: rest.name }
    });

    if (!partner) {
      partner = await prisma.foodPartner.create({
        data: {
          userId: user.userId,
          partnerName: rest.name,
          description: rest.description,
          logoUrl: rest.logo_url,
          coverImageUrl: rest.cover_image_url,
          categories: rest.categories,
          isActive: true,
        }
      });
      console.log(`Created food partner: ${rest.name}`);
    }

    // 3. Create Menu Items
    for (const item of rest.items) {
      const existing = await prisma.menuItem.findFirst({
        where: { name: item.name, foodPartnerId: partner.foodPartnerId }
      });
      if (!existing) {
        await prisma.menuItem.create({ data: { ...item, foodPartnerId: partner.foodPartnerId } });
        console.log(`Added menu item: ${item.name}`);
      }
    }
  }

  await prisma.$disconnect();
  console.log('Seeding completed successfully!');
}

main().catch((e) => {
  console.error('Seeding failed:', e);
  process.exit(1);
});

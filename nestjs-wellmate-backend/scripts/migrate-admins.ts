import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

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
  const users = await prisma.user.findMany({
    where: {
      role: 'admin',
      admin: null,
    },
  });

  console.log(`Found ${users.length} admin users without profile.`);

  for (const user of users) {
    await prisma.admin.create({
      data: {
        userId: user.userId,
        firstName: 'Admin',
        lastName: user.email.split('@')[0],
      },
    });
    console.log(`Created admin profile for ${user.email}`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

import { UserRole, VerificationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaService();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const firstNames = [
    'ชลธิดา', 'ธิติพงศ์', 'กานต์สินี', 'นวพล', 'รัตนา',
    'วีระพล', 'พิมพ์ชนก', 'ภาคิน', 'นภัสสร', 'ปกรจันทร์',
  ];
  const lastNames = [
    'ชวนชิม', 'ใจดี', 'รักสุขภาพ', 'มั่นคง', 'สุขสันต์',
    'แข็งแรง', 'สดใส', 'มีชัย', 'ใจเย็น', 'มั่นใจ',
  ];

  for (let i = 0; i < 10; i++) {
    const email = `mocknutri${i + 1}@example.com`;
    const phone = `08199988${i.toString().padStart(2, '0')}`;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: UserRole.nutritionist,
          phone,
        },
      });
      console.log(`Created user ${email}`);
    }

    const nutritionist = await prisma.nutritionist.findUnique({
      where: { userId: user.userId },
    });

    if (!nutritionist) {
      await prisma.nutritionist.create({
        data: {
          userId: user.userId,
          // ใส่เฉพาะฟิลด์ที่มีใน Schema จริงๆ
          firstName: firstNames[i],
          lastName: lastNames[i],
          consultationFee: 500 + i * 50,
          verificationStatus: VerificationStatus.approved,
        },
      });
      console.log(`Created nutritionist ${firstNames[i]} ${lastNames[i]}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
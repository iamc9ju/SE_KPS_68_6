import { PrismaClient, UserRole, VerificationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  const email = 'thananrada@wellmate.com';
  
  // จะใช้ path รูปภาพจากเครื่อง Local เพื่อให้พอดีกับรูปที่อัปโหลดมา
  const profileImageUrl = '/images/thananrada.jpg';

  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: UserRole.nutritionist,
        phone: '0899887766',
        profileImageUrl,
      },
    });
    console.log(`Created User record: ${email}`);
  } else {
    user = await prisma.user.update({
      where: { email },
      data: { role: UserRole.nutritionist, profileImageUrl }
    });
    console.log(`Updated User record: ${email}`);
  }

  const nutritionist = await prisma.nutritionist.findUnique({
    where: { userId: user.userId },
  });

  if (!nutritionist) {
    await prisma.nutritionist.create({
      data: {
        userId: user.userId,
        firstName: 'ธนัญรดา',
        lastName: 'วราพิพัฒน์พล',
        consultationFee: 500,
        verificationStatus: VerificationStatus.approved,
      },
    });
    console.log(`Created Nutritionist record for ธนัญรดา`);
  } else {
    await prisma.nutritionist.update({
      where: { userId: user.userId },
      data: { firstName: 'ธนัญรดา', lastName: 'วราพิพัฒน์พล' }
    });
    console.log(`Updated Nutritionist record for ธนัญรดา`);
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

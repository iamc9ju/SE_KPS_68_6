import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const schedules = await prisma.nutritionistSchedule.findMany();
  console.log('Schedules:', JSON.stringify(schedules, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

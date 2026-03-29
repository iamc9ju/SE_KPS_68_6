
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Database Diagnostic ---');
  
  const appointments = await prisma.appointment.findMany({
    include: {
      nutritionist: {
        include: { user: true }
      },
      patient: {
        include: { user: true }
      }
    }
  });

  console.log(`Total Appointments: ${appointments.length}`);
  appointments.forEach(a => {
    console.log(`- ID: ${a.appointmentId}, Nutri: ${a.nutritionist?.user?.email}, Patient: ${a.patient?.user?.email}, Date: ${a.startTime}, Status: ${a.status}`);
  });

  const nutritionists = await prisma.nutritionist.findMany({
    include: { user: true }
  });

  console.log(`\nTotal Nutritionists: ${nutritionists.length}`);
  nutritionists.forEach(n => {
    console.log(`- ID: ${n.nutritionistId}, UserID: ${n.userId}, Email: ${n.user?.email}`);
  });

  const users = await prisma.user.findMany({
    where: { role: 'nutritionist' }
  });
  console.log(`\nUsers with role 'nutritionist': ${users.length}`);
  users.forEach(u => {
    console.log(`- ID: ${u.userId}, Email: ${u.email}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const totalUsers = await (this.prisma as any).user.count();
    const totalOrders = await (this.prisma as any).order.count();
    const totalPartners = await (this.prisma as any).foodPartner.count();
    const totalAppointments = await (this.prisma as any).appointment.count();

    const pendingAppointments = await (this.prisma as any).appointment.count({
      where: { status: 'pending' },
    });

    const recentAppointments = await (this.prisma as any).appointment.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: true,
        nutritionist: true,
      },
    });

    const topNutritionists = await (this.prisma as any).nutritionist.findMany({
      take: 3,
      include: {
        _count: { select: { appointments: true } },
        user: true,
      },
      orderBy: { appointments: { _count: 'desc' } },
    });

    return {
      stats: { totalUsers, totalOrders, totalPartners, totalAppointments, pendingAppointments },
      recentAppointments: recentAppointments.map(a => ({
        id: a.appointmentId,
        name: a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : 'ไม่ระบุ',
        nutritionist: a.nutritionist ? `${a.nutritionist.firstName} ${a.nutritionist.lastName}` : 'ไม่ระบุ',
        time: a.startTime,
        status: a.status,
        type: a.type,
      })),
      topNutritionists: topNutritionists.map(n => ({
        id: n.nutritionistId,
        name: `${n.firstName} ${n.lastName}`,
        appointments: n._count.appointments,
        img: n.user.profileImageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop',
        rating: 4.8,
      })),
    };
  }

  async getPartners() {
    const partners = await (this.prisma as any).foodPartner.findMany({
      include: {
        _count: { select: { menuItems: true, partnerOrders: true } },
      },
    });
    return partners;
  }

  async getUsers() {
    const users = await (this.prisma as any).user.findMany({
      include: {
        patient: {
          include: { _count: { select: { appointments: true } } },
        },
        nutritionist: {
          include: { _count: { select: { appointments: true } } },
        },
        foodPartner: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return users.map(u => {
      let appointments = 0;
      let name = 'ไม่ระบุ';
      
      if (u.role === 'patient' && u.patient) {
        appointments = u.patient._count?.appointments || 0;
        name = `${u.patient.firstName} ${u.patient.lastName}`;
      } else if (u.role === 'nutritionist' && u.nutritionist) {
        appointments = u.nutritionist._count?.appointments || 0;
        name = `${u.nutritionist.firstName} ${u.nutritionist.lastName}`;
      } else if (u.role === 'food_partner' && u.foodPartner) {
        name = u.foodPartner.partnerName;
      }

      return {
        id: u.userId,
        name,
        email: u.email,
        phone: u.phone || '-',
        role: u.role,
        status: u.deletedAt ? 'inactive' : 'active',
        joined: u.createdAt,
        appointments,
        img: u.profileImageUrl || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120&h=120&fit=crop'
      };
    });
  }
}

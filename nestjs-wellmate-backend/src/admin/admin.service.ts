import { Injectable } from '@nestjs/common';
import { VerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private mapUser(u: any) {
    let appointments = 0;
    let name = "Unknown";

    if (u.role === "patient" && u.patient) {
      appointments = u.patient._count?.appointments || 0;
      name = `${u.patient.firstName} ${u.patient.lastName}`;
    } else if (u.role === "nutritionist" && u.nutritionist) {
      appointments = u.nutritionist._count?.appointments || 0;
      name = `${u.nutritionist.firstName} ${u.nutritionist.lastName}`;
    } else if (u.role === "food_partner" && u.foodPartner) {
      name = u.foodPartner.partnerName;
    }

    return {
      id: u.userId,
      name,
      email: u.email,
      phone: u.phone || "-",
      role: u.role,
      status: u.deletedAt ? "inactive" : "active",
      joined: u.createdAt,
      appointments,
      img: u.profileImageUrl || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120&h=120&fit=crop"
    };
  }

    private mapPartner(p: any) {
    return {
      id: p.foodPartnerId,
      name: p.partnerName,
      owner: p.bankAccountName || "-",
      email: p.contactEmail || "-",
      phone: p.contactPhone || "-",
      address: p.addressLine1 || "-",
      status: p.isActive ? "active" : "inactive",
      menu: p._count?.menuItems || 0,
      orders: p._count?.partnerOrders || 0,
      revenue: null,
      commission: p.commissionRate ? Number(p.commissionRate) : 15,
      joined: p.joinedAt,
      rating: null,
      category: p.categories?.[0] || "-",
      img: p.logoUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=120&fit=crop",
      banner: p.coverImageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop"
    };
  }

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
    return partners.map(p => this.mapPartner(p));
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
    return users.map(u => this.mapUser(u));
  }

  async setUserActive(userId: string, isActive: boolean) {
    const user = await (this.prisma as any).user.update({
      where: { userId },
      data: { deletedAt: isActive ? null : new Date() },
      include: {
        patient: { include: { _count: { select: { appointments: true } } } },
        nutritionist: { include: { _count: { select: { appointments: true } } } },
        foodPartner: true
      }
    });
    return this.mapUser(user);
  }

  async deleteUser(userId: string) {
    const user = await (this.prisma as any).user.update({
      where: { userId },
      data: { deletedAt: new Date() },
      include: {
        patient: { include: { _count: { select: { appointments: true } } } },
        nutritionist: { include: { _count: { select: { appointments: true } } } },
        foodPartner: true
      }
    });
    return this.mapUser(user);
  }

  async setPartnerActive(foodPartnerId: number, isActive: boolean) {
    const partner = await (this.prisma as any).foodPartner.update({
      where: { foodPartnerId },
      data: { isActive },
      include: { _count: { select: { menuItems: true, partnerOrders: true } } }
    });
    return this.mapPartner(partner);
  }

  async deletePartner(foodPartnerId: number) {
    const partner = await (this.prisma as any).foodPartner.update({
      where: { foodPartnerId },
      data: { isActive: false },
      include: { _count: { select: { menuItems: true, partnerOrders: true } } }
    });
    return this.mapPartner(partner);
  }

  async getNutritionists(status?: VerificationStatus) {
    const where: any = { deletedAt: null };
    if (status) where.verificationStatus = status;

    const nutritionists = await (this.prisma as any).nutritionist.findMany({
      where,
      include: {
        user: { select: { email: true, phone: true, profileImageUrl: true } },
        nutritionistSpecialties: {
          select: { specialty: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return nutritionists.map((n: any) => ({
      id: n.nutritionistId,
      name: `${n.firstName} ${n.lastName}`.trim(),
      expertise: n.nutritionistSpecialties?.map((s: any) => s.specialty?.name).filter(Boolean).join(', ') || '-',
      exp: '-',
      status: n.verificationStatus,
      email: n.user?.email || '-',
      phone: n.user?.phone || '-',
      license: n.licenseNumber || '-',
      education: '-',
      bio: '-',
      licenseDocumentUrl: n.licenseDocumentUrl || null,
      profileImageUrl: n.user?.profileImageUrl || null,
      createdAt: n.createdAt,
    }));
  }

  async approveNutritionist(nutritionistId: string) {
    const updated = await (this.prisma as any).nutritionist.update({
      where: { nutritionistId },
      data: { verificationStatus: 'approved', verifiedAt: new Date() },
      include: {
        user: { select: { email: true, phone: true, profileImageUrl: true } },
        nutritionistSpecialties: {
          select: { specialty: { select: { name: true } } },
        },
      },
    });
    return this.getNutritionistsMapSingle(updated);
  }

  async rejectNutritionist(nutritionistId: string) {
    const updated = await (this.prisma as any).nutritionist.update({
      where: { nutritionistId },
      data: { verificationStatus: 'rejected', verifiedAt: new Date() },
      include: {
        user: { select: { email: true, phone: true, profileImageUrl: true } },
        nutritionistSpecialties: {
          select: { specialty: { select: { name: true } } },
        },
      },
    });
    return this.getNutritionistsMapSingle(updated);
  }

  private getNutritionistsMapSingle(n: any) {
    return {
      id: n.nutritionistId,
      name: `${n.firstName} ${n.lastName}`.trim(),
      expertise: n.nutritionistSpecialties?.map((s: any) => s.specialty?.name).filter(Boolean).join(', ') || '-',
      exp: '-',
      status: n.verificationStatus,
      email: n.user?.email || '-',
      phone: n.user?.phone || '-',
      license: n.licenseNumber || '-',
      education: '-',
      bio: '-',
      licenseDocumentUrl: n.licenseDocumentUrl || null,
      profileImageUrl: n.user?.profileImageUrl || null,
      createdAt: n.createdAt,
    };
  }
}

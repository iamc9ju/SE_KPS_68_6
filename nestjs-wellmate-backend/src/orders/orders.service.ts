import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma, OrderStatus, PaymentStatus, UserRole } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateOrderDto, userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new ForbiddenException('Only patients can create orders');
    }

    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData: any[] = []; // ใช้ any เพื่อเลี่ยง Error ของ Type ชั่วคราว

      for (const itemRequest of dto.items) {
        const menuItem = await tx.menuItem.findUnique({
          where: { menuItemId: itemRequest.menuItemId },
        });

        if (!menuItem) {
          throw new NotFoundException(`Menu item #${itemRequest.menuItemId} not found`);
        }

        if (menuItem.stockQuantity < itemRequest.quantity) {
          throw new BadRequestException(`Not enough stock for ${menuItem.name}`);
        }

        const priceAtOrder = Number(menuItem.price);
        totalAmount += priceAtOrder * itemRequest.quantity;

        orderItemsData.push({
          menuItemId: itemRequest.menuItemId,
          quantity: itemRequest.quantity,
          unitPrice: priceAtOrder,
        });

        await tx.menuItem.update({
          where: { menuItemId: itemRequest.menuItemId },
          data: {
            stockQuantity: { decrement: itemRequest.quantity },
            isOutOfStock: menuItem.stockQuantity - itemRequest.quantity <= 0,
          },
        });
      }

      const order = await tx.order.create({
        data: {
          patientId: patient.patientId,
          subtotal: totalAmount,
          total: totalAmount,
          deliveryAddress: dto.deliveryAddress,
          status: OrderStatus.pending,
          paymentStatus: PaymentStatus.UNPAID,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      return this.mapOrder(order);
    });
  }

  async findAll(userId: string, role: string) {
    const where: Prisma.OrderWhereInput = {};

    if (role === UserRole.patient) {
      const patient = await this.prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new NotFoundException('Patient profile not found');
      where.patientId = patient.patientId;
    } else if (role === UserRole.food_partner) {
      const partner = await this.prisma.foodPartner.findUnique({ where: { userId } });
      if (!partner) throw new NotFoundException('Food Partner profile not found');
      where.orderItems = {
        some: { menuItem: { foodPartnerId: partner.foodPartnerId } },
      };
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        orderItems: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => this.mapOrder(o));
  }

  async findOne(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderId: id },
      include: {
        orderItems: { include: { menuItem: true } },
      },
    });

    if (!order) throw new NotFoundException(`Order #${id} not found`);

    if (role === UserRole.patient) {
      const patient = await this.prisma.patient.findUnique({ where: { userId } });
      if (!patient || order.patientId !== patient.patientId) throw new ForbiddenException();
    } else if (role === UserRole.food_partner) {
      const partner = await this.prisma.foodPartner.findUnique({ where: { userId } });
      if (!partner) throw new ForbiddenException();
      const hasPartnerItems = order.orderItems.some(
        (i) => i.menuItem.foodPartnerId === partner.foodPartnerId,
      );
      if (!hasPartnerItems) throw new ForbiddenException();
    }

    return this.mapOrder(order);
  }

  async updateStatus(id: string, status: OrderStatus, userId: string, role: string) {
    await this.findOne(id, userId, role);
    const updated = await this.prisma.order.update({
      where: { orderId: id },
      data: { status },
      include: {
        orderItems: { include: { menuItem: true } },
      },
    });
    return this.mapOrder(updated);
  }

  private mapOrder(order: any) {
    return {
      orderId: order?.orderId,
      patientId: order?.patientId,
      totalAmount: Number(order?.total || 0),
      status: order?.status,
      paymentStatus: order?.paymentStatus,
      deliveryAddress: order?.deliveryAddress,
      createdAt: order?.createdAt,
      items: (order?.orderItems || []).map((i: any) => ({
        orderItemId: i.orderItemId,
        menuItemId: i.menuItemId,
        name: i.menuItem?.name,
        imageUrl: i.menuItem?.imageUrl,
        quantity: i.quantity,
        priceAtOrder: Number(i.unitPrice || 0),
        totalPrice: Number(i.unitPrice || 0) * (i.quantity || 0),
      })),
    };
  }
}
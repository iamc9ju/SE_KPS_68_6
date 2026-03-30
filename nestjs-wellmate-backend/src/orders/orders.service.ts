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
import { PaymentsService } from '../payments/payments.service';

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    patient: {
      select: {
        firstName: true;
        lastName: true;
      };
    };
    orderItems: {
      include: {
        menuItem: {
          include: {
            foodPartner: {
              select: {
                partnerName: true;
                address: true;
                addressLine1: true;
                district: true;
                province: true;
                latitude: true;
                longitude: true;
              };
            };
          };
        };
      };
    };
  };
}>;

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(dto: CreateOrderDto, userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new ForbiddenException('Only patients can create orders');
    }

    const createdOrder = await this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] =
        [];

      for (const itemRequest of dto.items) {
        const menuItem = await tx.menuItem.findUnique({
          where: { menuItemId: itemRequest.menuItemId },
        });

        if (!menuItem) {
          throw new NotFoundException(
            `Menu item #${itemRequest.menuItemId} not found`,
          );
        }

        if (menuItem.stockQuantity < itemRequest.quantity) {
          throw new BadRequestException(
            `Not enough stock for ${menuItem.name}`,
          );
        }

        const priceAtOrder = Number(menuItem.price);
        const totalPrice = priceAtOrder * itemRequest.quantity;
        totalAmount += totalPrice;

        orderItemsData.push({
          menuItemId: itemRequest.menuItemId,
          foodPartnerId: menuItem.foodPartnerId,
          quantity: itemRequest.quantity,
          unitPrice: priceAtOrder,
          priceAtOrder: priceAtOrder,
          totalPrice,
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
          contactPhone: dto.contactPhone,
          status: OrderStatus.pending,
          paymentStatus: PaymentStatus.UNPAID,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          patient: { select: { firstName: true, lastName: true } },
          orderItems: {
            include: {
              menuItem: {
                include: {
                  foodPartner: {
                    select: {
                      partnerName: true,
                      address: true,
                      addressLine1: true,
                      district: true,
                      province: true,
                      latitude: true,
                      longitude: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return order;
    });

    // --- Omise QR Integration ---
    try {
      const orderData = await this.prisma.order.findUnique({
        where: { orderId: createdOrder.orderId },
        include: { patient: { select: { firstName: true, lastName: true } } },
      });

      if (!orderData) throw new NotFoundException('Order not found');

      const { chargeId, qrCodeUrl } = await this.paymentsService.createPromptPayCharge(
        Number(orderData.total),
        {
          orderId: orderData.orderId,
          customerName: `${orderData.patient.firstName} ${orderData.patient.lastName}`,
          type: 'FOOD_ORDER',
        },
      );

      // Update order with Omise charge info
      const finalOrder = await this.prisma.order.update({
        where: { orderId: createdOrder.orderId },
        data: { chargeId, qrCodeUrl },
        include: {
          patient: { select: { firstName: true, lastName: true } },
          orderItems: {
            include: {
              menuItem: {
                include: {
                  foodPartner: {
                    select: {
                      partnerName: true,
                      address: true,
                      addressLine1: true,
                      district: true,
                      province: true,
                      latitude: true,
                      longitude: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return this.mapOrder(finalOrder);
    } catch (paymentError) {
      this.logger.error(`Failed to create Omise charge for order ${createdOrder.orderId}:`, paymentError);
      // We return the order anyway, but it won't have a qrCodeUrl
      const existingOrder = await this.findOne(createdOrder.orderId, userId, UserRole.patient);
      return existingOrder;
    }
  }

  async findAll(userId: string, role: string) {
    const where: Prisma.OrderWhereInput = {};
    let partnerId: number | null = null;

    if (role === UserRole.patient) {
      const patient = await this.prisma.patient.findUnique({
        where: { userId },
      });
      if (!patient) throw new NotFoundException('Patient profile not found');
      where.patientId = patient.patientId;
    } else if (role === UserRole.food_partner) {
      const partner = await this.prisma.foodPartner.findUnique({
        where: { userId },
      });
      if (!partner)
        throw new NotFoundException('Food Partner profile not found');
      partnerId = partner.foodPartnerId;
      where.orderItems = {
        some: {
          menuItem: {
            foodPartnerId: partner.foodPartnerId,
          },
        },
      };
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        patient: { select: { firstName: true, lastName: true } },
        orderItems: {
          include: {
            menuItem: {
              include: {
                foodPartner: {
                  select: {
                    partnerName: true,
                    address: true,
                    addressLine1: true,
                    district: true,
                    province: true,
                    latitude: true,
                    longitude: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => this.mapOrder(o, partnerId));
  }

  async findOne(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderId: id },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        orderItems: {
          include: {
            menuItem: {
              include: {
                foodPartner: {
                  select: {
                    partnerName: true,
                    address: true,
                    addressLine1: true,
                    district: true,
                    province: true,
                    latitude: true,
                    longitude: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new NotFoundException(`Order #${id} not found`);
    let partnerId: number | null = null;

    if (role === UserRole.patient) {
      const patient = await this.prisma.patient.findUnique({
        where: { userId },
      });
      if (!patient || order.patientId !== patient.patientId)
        throw new ForbiddenException();
    } else if (role === UserRole.food_partner) {
      const partner = await this.prisma.foodPartner.findUnique({
        where: { userId },
      });
      if (!partner) throw new ForbiddenException();
      partnerId = partner.foodPartnerId;

      const hasPartnerItems = order.orderItems.some(
        (i) => i.menuItem.foodPartnerId === partner.foodPartnerId,
      );
      if (!hasPartnerItems) throw new ForbiddenException();
    }

    return this.mapOrder(order as unknown as OrderWithItems, partnerId);
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    userId: string,
    role: string,
  ) {
    await this.findOne(id, userId, role);

    const updated = await this.prisma.order.update({
      where: { orderId: id },
      data: { status },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        orderItems: {
          include: {
            menuItem: {
              include: {
                foodPartner: {
                  select: {
                    partnerName: true,
                    address: true,
                    addressLine1: true,
                    district: true,
                    province: true,
                    latitude: true,
                    longitude: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.mapOrder(updated as unknown as OrderWithItems);
  }

  async checkAndUpdatePaymentStatus(orderId: string, userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });
    if (!patient) throw new ForbiddenException('Only patients can check payment');

    const order = await this.prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.patientId !== patient.patientId)
      throw new ForbiddenException('Not your order');

    // Already paid
    if (order.paymentStatus === 'PAID') {
      return { paymentStatus: 'PAID', status: order.status };
    }

    // No charge to check
    if (!order.chargeId) {
      return { paymentStatus: order.paymentStatus, status: order.status };
    }

    // Check directly from Omise
    try {
      const charge = await this.paymentsService.retrieveCharge(order.chargeId);

      if (charge.status === 'successful') {
        const updated = await this.prisma.order.update({
          where: { orderId },
          data: {
            paymentStatus: 'PAID',
            status: 'preparing',
          },
        });
        this.logger.log(`Order ${orderId} payment confirmed via direct check`);
        return { paymentStatus: 'PAID', status: updated.status };
      }

      return { paymentStatus: order.paymentStatus, chargeStatus: charge.status };
    } catch (error) {
      this.logger.error(`Failed to check charge status for order ${orderId}:`, error);
      return { paymentStatus: order.paymentStatus, status: order.status };
    }
  }

  private mapOrder(order: OrderWithItems, partnerId?: number | null) {
    const items =
      partnerId != null
        ? order.orderItems.filter(
            (i) => i.menuItem.foodPartnerId === partnerId,
          )
        : order.orderItems;
    const primaryPartner = items[0]?.menuItem?.foodPartner;
    const subtotal = items.reduce(
      (sum, i) => sum + Number(i.totalPrice || Number(i.unitPrice) * i.quantity),
      0,
    );
    return {
      orderId: order.orderId,
      patientId: order.patientId,
      customerName: [order.patient?.firstName, order.patient?.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() || undefined,
      totalAmount: partnerId != null ? subtotal : Number(order.total),
      status: order.status,
      paymentStatus: order.paymentStatus,
      deliveryAddress: order.deliveryAddress,
      deliveryLatitude: order.deliveryLatitude
        ? Number(order.deliveryLatitude)
        : undefined,
      deliveryLongitude: order.deliveryLongitude
        ? Number(order.deliveryLongitude)
        : undefined,
      contactPhone: order.contactPhone,
      qrCodeUrl: order.qrCodeUrl,
      createdAt: order.createdAt,
      partner: primaryPartner
        ? {
            partnerName: primaryPartner.partnerName,
            address: primaryPartner.address || undefined,
            addressLine1: primaryPartner.addressLine1 || undefined,
            district: primaryPartner.district || undefined,
            province: primaryPartner.province || undefined,
            latitude: primaryPartner.latitude
              ? Number(primaryPartner.latitude)
              : undefined,
            longitude: primaryPartner.longitude
              ? Number(primaryPartner.longitude)
              : undefined,
          }
        : undefined,
      items: items.map((i) => ({
        orderItemId: i.orderItemId,
        menuItemId: i.menuItemId,
        name: i.menuItem.name,
        imageUrl: i.menuItem.imageUrl,
        quantity: i.quantity,
        priceAtOrder: Number(i.priceAtOrder || i.unitPrice),
        totalPrice: Number(i.totalPrice || Number(i.unitPrice) * i.quantity),
      })),
    };
  }
}

import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import type { Express } from 'express';
import { FindMenuItemsQueryDto } from './dto/find-menu-items-query.dto';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto/menu-item-request.dto';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class FoodMenuService {
  private readonly logger = new Logger(FoodMenuService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(query: FindMenuItemsQueryDto) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      q,
      foodPartnerId,
      maxCalories,
      isAvailable,
      categoryId,
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.MenuItemWhereInput = {};

    if (foodPartnerId) where.foodPartnerId = foodPartnerId;
    if (isAvailable !== undefined) where.isAvailable = isAvailable;
    if (maxCalories) where.caloriesKcal = { lte: maxCalories };
    if (categoryId) where.categoryId = categoryId;

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    try {
      const [data, total] = await Promise.all([
        this.prisma.menuItem.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            foodPartner: {
              select: { partnerName: true, foodPartnerId: true },
            },
            category: true,
            setComponents: {
              include: {
                component: true,
              },
            },
          },
        }),
        this.prisma.menuItem.count({ where }),
      ]);

      return {
        data: this.mapItems(data),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching menu items: ${error.message}`);
      throw new BadRequestException('Invalid query parameters');
    }
  }

  async findOne(id: number) {
    const item = await this.prisma.menuItem.findUnique({
      where: { menuItemId: id },
      include: {
        foodPartner: {
          select: {
            partnerName: true,
            foodPartnerId: true,
            description: true,
            address: true,
          },
        },
        category: true,
        setComponents: {
          include: {
            component: true,
          },
        },
      },
    });

    if (!item) throw new NotFoundException(`MenuItem #${id} not found`);
    return this.mapItem(item);
  }

  async create(dto: CreateMenuItemDto, userId: string) {
    const partner = await this.prisma.foodPartner.findUnique({
      where: { userId },
    });

    if (!partner) {
      throw new ForbiddenException('User is not registered as a Food Partner');
    }

    const { components, ...rest } = dto;

    const newItem = await this.prisma.menuItem.create({
      data: {
        ...rest,
        foodPartnerId: partner.foodPartnerId,
        price: new Prisma.Decimal(dto.price),
        proteinG: dto.proteinG ? new Prisma.Decimal(dto.proteinG) : null,
        carbsG: dto.carbsG ? new Prisma.Decimal(dto.carbsG) : null,
        fatG: dto.fatG ? new Prisma.Decimal(dto.fatG) : null,
        isSet: dto.isSet ?? false,
        setComponents:
          dto.isSet && components
            ? {
                create: components.map((c) => ({
                  componentItemId: c.componentItemId,
                  quantity: c.quantity ?? 1,
                })),
              }
            : undefined,
      },
      include: {
        foodPartner: { select: { partnerName: true, foodPartnerId: true } },
        category: true,
        setComponents: {
          include: {
            component: true,
          },
        },
      },
    });

    return this.mapItem(newItem);
  }

  async update(
    id: number,
    dto: UpdateMenuItemDto,
    userId: string,
    role: string,
  ) {
    await this.verifyOwnership(id, userId, role);

    const { components, ...rest } = dto;

    const updatedItem = await this.prisma.menuItem.update({
      where: { menuItemId: id },
      data: {
        ...rest,
        price: dto.price ? new Prisma.Decimal(dto.price) : undefined,
        proteinG: dto.proteinG ? new Prisma.Decimal(dto.proteinG) : undefined,
        carbsG: dto.carbsG ? new Prisma.Decimal(dto.carbsG) : undefined,
        fatG: dto.fatG ? new Prisma.Decimal(dto.fatG) : undefined,
        isSet: dto.isSet,
        setComponents:
          dto.isSet && components
            ? {
                deleteMany: {},
                create: components.map((c) => ({
                  componentItemId: c.componentItemId,
                  quantity: c.quantity ?? 1,
                })),
              }
            : dto.isSet === false
              ? { deleteMany: {} }
              : undefined,
      },
      include: {
        foodPartner: { select: { partnerName: true, foodPartnerId: true } },
        category: true,
        setComponents: {
          include: {
            component: true,
          },
        },
      },
    });

    return this.mapItem(updatedItem);
  }

  async remove(id: number, userId: string, role: string) {
    await this.verifyOwnership(id, userId, role);
    return this.prisma.menuItem.delete({ where: { menuItemId: id } });
  }

  async uploadImage(file: Express.Multer.File) {
    const uploadResult = await this.cloudinaryService.uploadFile(
      file,
      'food_menus',
      'auto',
    );
    const url = (uploadResult as { secure_url?: string }).secure_url;
    if (!url) {
      throw new BadRequestException('Image upload failed');
    }
    return { url };
  }

  async findAllCategories() {
    return this.prisma.menuCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  private async verifyOwnership(itemId: number, userId: string, role: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { menuItemId: itemId },
      include: { foodPartner: true },
    });

    if (!item) throw new NotFoundException(`MenuItem #${itemId} not found`);

    if (role !== UserRole.admin && item.foodPartner.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this item',
      );
    }

    return item;
  }

  private mapItems(items: any[]) {
    return items.map((item) => this.mapItem(item));
  }

  private mapItem(item: any) {
    return {
      ...item,
      price: Number(item.price),
      proteinG: item.proteinG ? Number(item.proteinG) : null,
      carbsG: item.carbsG ? Number(item.carbsG) : null,
      fatG: item.fatG ? Number(item.fatG) : null,
      components: item.setComponents
        ? item.setComponents.map((sc: any) => ({
            ...sc.component,
            price: Number(sc.component.price),
            quantity: sc.quantity,
          }))
        : [],
    };
  }
}

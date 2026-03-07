import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserWithRelation } from './interface/user';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      this.logger.warn(
        `Registration attempt with existing email: ${dto.email}`,
      );
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await this.passwordService.hash(dto.password);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          phone: dto.phone,
          role: dto.role,
        },
      });

      if (dto.role === 'patient') {
        await tx.patient.create({
          data: {
            userId: user.userId,
            firstName: dto.firstName!,
            lastName: dto.lastName!,
          },
        });
      } else if (dto.role === 'nutritionist') {
        await tx.nutritionist.create({
          data: {
            userId: user.userId,
            firstName: dto.firstName!,
            lastName: dto.lastName!,
          },
        });
      } else if (dto.role === 'food_partner') {
        await tx.foodPartner.create({
          data: {
            userId: user.userId,
            name:
              dto.partnerName ||
              `${dto.firstName || ''} ${dto.lastName || ''}`.trim(),
          },
        });
      }

      return user;
    });

    this.logger.log(
      `New ${dto.role} registered: ${result.userId} (${dto.email})`,
    );
    return { message: 'Registration successful', userId: result.userId };
  }

  /**
   * Validate credentials and return user data only.
   * Token creation is handled by the controller via TokenService.
   */
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    return this.flattenUser(user);
  }

  async logout(refreshToken: string) {
    // Delegated to controller → tokenService.revokeToken()
    // This method exists for backward compat / orchestration if needed
  }

  async logoutAllDevices(userId: string) {
    // Delegated to controller → tokenService.revokeAllTokens()
  }

  async getMe(userId: string) {
    const userBase = await this.prisma.user.findUnique({
      where: { userId },
      select: { role: true },
    });

    if (!userBase) {
      throw new UnauthorizedException('User not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { userId },
      include: {
        patient: userBase.role === 'patient',
        nutritionist: userBase.role === 'nutritionist',
        foodPartner: userBase.role === 'food_partner',
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.flattenUser(user);
  }

  // Private helpers

  private async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { patient: true, nutritionist: true, foodPartner: true },
    });

    if (
      !user ||
      !(await this.passwordService.compare(pass, user.passwordHash))
    ) {
      this.logger.warn(`Failed login attempt: ${email}`);
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    return user;
  }

  private flattenUser(user: UserWithRelation) {
    const {
      userId,
      phone,
      email,
      role,
      is2faEnabled,
      createdAt,
      patient,
      nutritionist,
      foodPartner,
    } = user;

    let firstName = '';
    let lastName = '';

    if (role === 'patient' && patient) {
      firstName = patient.firstName;
      lastName = patient.lastName;
    } else if (role === 'nutritionist' && nutritionist) {
      firstName = nutritionist.firstName;
      lastName = nutritionist.lastName;
    } else if (role === 'food_partner' && foodPartner) {
      return {
        userId,
        phone,
        email,
        partnerName: foodPartner.name,
        role,
        is2faEnabled,
        createdAt,
      };
    }

    return {
      userId,
      phone,
      email,
      firstName,
      lastName,
      role,
      is2faEnabled,
      createdAt,
    };
  }
}

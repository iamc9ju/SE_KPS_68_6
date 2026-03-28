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
  ) { }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      this.logger.warn(
        `Registration attempt with existing email: ${dto.email}`,
      );
      throw new ConflictException('อีเมลนี้ถูกใช้งานไปแล้ว');
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
            // แก้ไข: แยก firstName และ lastName ตามที่ Schema ต้องการ
            first_name: dto.firstName || '',
            last_name: dto.lastName || '',
          },
        });
      } else if (dto.role === 'nutritionist') {
        await tx.nutritionist.create({
          data: {
            userId: user.userId,
            // แก้ไข: แยก firstName และ lastName
            first_name: dto.firstName || '',
            last_name: dto.lastName || '',
            //email: dto.email,
            //phone: '',
            //expertise: 'Not specified',
            //exp: '',           // 👈 แก้ตรงนี้เป็นสตริงว่างครับ
            //education: '',
            //bio: '',
          },
        });
      } else if (dto.role === 'food_partner') {
        await tx.foodPartner.create({
          data: {
            userId: user.userId,
            partnerName:
              dto.partnerName ||
              `${dto.firstName || ''} ${dto.lastName || ''}`.trim(),
          },
        });
      }

      return user;
    });

    // Fetch full user with relations for flattening
    const fullUser = await this.prisma.user.findUnique({
      where: { userId: result.userId },
      include: {
        patient: true,
        nutritionist: true,
        foodPartner: true,
      },
    });

    this.logger.log(
      `New ${dto.role} registered: ${result.userId} (${dto.email})`,
    );

    if (!fullUser) {
      throw new UnauthorizedException('การลงทะเบียนไม่สำเร็จ');
    }

    // Cast fullUser ให้ตรงกับ UserWithRelation
    return {
      message: 'Registration successful',
      data: this.flattenUser(fullUser as unknown as UserWithRelation),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    return this.flattenUser(user as unknown as UserWithRelation);
  }

  async logout(refreshToken: string) { }

  async logoutAllDevices(userId: string) { }

  async getMe(userId: string) {
    const userBase = await this.prisma.user.findUnique({
      where: { userId },
      select: { role: true },
    });

    if (!userBase) {
      throw new UnauthorizedException('ไม่พบผู้ใช้ในระบบ');
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
      throw new UnauthorizedException('ไม่พบข้อมูลผู้ใช้');
    }

    return this.flattenUser(user as unknown as UserWithRelation);
  }

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
      profileImageUrl,
      createdAt,
      patient,
      nutritionist,
      foodPartner,
    } = user;

    // แก้ไข: ประกาศตัวแปรสำหรับชื่อเพื่อใช้ด้านล่าง
    let firstName = '';
    let lastName = '';
    let roleId: string | number | undefined;

    if (role === 'patient' && patient) {
      firstName = patient.first_name || '';  // <--- แก้กลับมาใช้แบบนี้ถ้า Autocomplete แนะนำ
      lastName = patient.last_name || '';    // <--- แก้กลับมาใช้แบบนี้ถ้า Autocomplete แนะนำ
      roleId = patient.patientId;

      return {
        userId,
        phone,
        email,
        firstName, // คืนค่า firstName แทนการใช้ split 
        lastName,  // คืนค่า lastName
        name: `${firstName} ${lastName}`.trim(), // รวมเป็น name ให้ Frontend เผื่อเรียกใช้
        role,
        is2faEnabled,
        profileImageUrl,
        createdAt,
        patientId: roleId,
        isProfileComplete: patient.isProfileComplete,
      };
    } else if (role === 'nutritionist' && nutritionist) {
      firstName = nutritionist.first_name || '';
      lastName = nutritionist.last_name || '';
      roleId = nutritionist.nutritionistId;
      return {
        userId,
        phone,
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(), // รวมเป็น name ให้ Frontend เผื่อเรียกใช้
        role,
        is2faEnabled,
        profileImageUrl,
        createdAt,
        nutritionistId: roleId,
        isProfileComplete: true, // Nutritionists don't have this requirement yet
      };
    } else if (role === 'food_partner' && foodPartner) {
      return {
        userId,
        phone,
        email,
        partnerName: foodPartner.partnerName,
        foodPartnerId: foodPartner.foodPartnerId,
        role,
        is2faEnabled,
        profileImageUrl,
        createdAt,
        isProfileComplete: true,
      };
    }

    return {
      userId,
      phone,
      email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      role,
      is2faEnabled,
      profileImageUrl,
      createdAt,
      isProfileComplete: true,
    };
  }
}
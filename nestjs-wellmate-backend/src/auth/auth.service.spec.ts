import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import { compare } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '@prisma/client';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let passwordService: PasswordService;
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    patient: {
      create: jest.fn(),
    },
    nutritionist: {
      create: jest.fn(),
    },
    foodPartner: {
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  const mockPasswordService = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.patient,
    };

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-id',
      });
      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: registerDto.email,
        },
      });
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should successfully register a new patient user', async () => {
      // Arrange
      const mockCreatedUser = { userId: 'new-uuid', email: registerDto.email };
      const mockHash = 'hashedPassword123';
      mockPrismaService.user.findUnique.mockResolvedValue(null); // ไม่ซ้ำ
      mockPasswordService.hash.mockResolvedValue(mockHash);
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
      mockPrismaService.patient.create.mockResolvedValue({});
      // Act
      const result = await authService.register(registerDto);
      // Assert
      expect(passwordService.hash).toHaveBeenCalledWith(registerDto.password);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          passwordHash: mockHash,
          phone: undefined,
          role: registerDto.role,
        },
      });
      expect(mockPrismaService.patient.create).toHaveBeenCalledWith({
        data: {
          userId: mockCreatedUser.userId,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
        },
      });
      expect(result).toEqual({
        message: 'Registration successful',
        userId: mockCreatedUser.userId,
      });
    });
    it('should successfully register a new nutritionist user', async () => {
      // Arrange
      const nutritionistDto: RegisterDto = {
        ...registerDto,
        role: UserRole.nutritionist,
      };
      const mockCreatedUser = {
        userId: 'nutri-uuid',
        email: nutritionistDto.email,
      };
      const mockHash = 'hashedPassword123';

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue(mockHash);
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
      mockPrismaService.nutritionist.create.mockResolvedValue({});

      // Act
      const result = await authService.register(nutritionistDto);

      // Assert
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ role: UserRole.nutritionist }),
      });
      // ต้องมั่นใจว่าไปเรียกฝั่ง nutritionist.create ไม่ใช่ patient.create
      expect(mockPrismaService.nutritionist.create).toHaveBeenCalledWith({
        data: {
          userId: mockCreatedUser.userId,
          firstName: nutritionistDto.firstName,
          lastName: nutritionistDto.lastName,
        },
      });
      expect(mockPrismaService.patient.create).not.toHaveBeenCalled();
    });

    it('should successfully register a new food_partner user', async () => {
      // Arrange
      const foodPartnerDto: RegisterDto = {
        email: 'partner@example.com',
        password: 'password123',
        role: UserRole.food_partner,
        partnerName: 'ร้านอาหารสุขภาพ ABC',
      };
      const mockCreatedUser = {
        userId: 'partner-uuid',
        email: foodPartnerDto.email,
      };
      const mockHash = 'hashedPassword123';

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue(mockHash);
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
      mockPrismaService.foodPartner.create.mockResolvedValue({});

      // Act
      const result = await authService.register(foodPartnerDto);

      // Assert
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ role: UserRole.food_partner }),
      });
      expect(mockPrismaService.foodPartner.create).toHaveBeenCalledWith({
        data: {
          userId: mockCreatedUser.userId,
          partnerName: 'ร้านอาหารสุขภาพ ABC',
        },
      });
      expect(mockPrismaService.patient.create).not.toHaveBeenCalled();
      expect(mockPrismaService.nutritionist.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Registration successful',
        userId: mockCreatedUser.userId,
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException on wrong credentials', async () => {
      // Arrange
      const loginDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should flatten and return user data on successful login', async () => {
      // Arrange
      const loginDto = {
        email: 'correct@example.com',
        password: 'correctpassword',
      };
      const mockUserBase = {
        userId: 'uuid-123',
        email: loginDto.email,
        passwordHash: 'hashedPass',
        role: 'patient',
        is2faEnabled: false,
        createdAt: new Date(),
        patient: { firstName: 'John', lastName: 'Doe' },
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserBase);
      mockPasswordService.compare.mockResolvedValue(true);
      // Act
      const result = await authService.login(loginDto);
      // Assert
      expect(mockPasswordService.compare).toHaveBeenCalledWith(
        loginDto.password,
        'hashedPass',
      );
      expect(result.firstName).toBe('John'); // ตรวจจสอบ logic ว่า flattenUser ทำงานถูกไหม
      expect(result.userId).toBe('uuid-123');
      expect(result).not.toHaveProperty('passwordHash'); // รหัสผ่านห้ามหบุดออกไปเด็ดขาด!
    });
  });

  describe('getMe', () => {
    it('should throw UnauthorizedException if user base is not found', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.getMe('invalid-user-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return flattened user data for a nutritionist', async () => {
      // Arrange
      const userId = 'nutri-123';
      const mockUserBase = { role: UserRole.nutritionist };
      const mockFullUser = {
        userId,
        email: 'doctor@example.com',
        role: UserRole.nutritionist,
        is2faEnabled: false,
        createdAt: new Date(),
        nutritionist: { firstName: 'Doctor', lastName: 'Strange' },
      };

      // ครั้งแรก findUnique เอา role, ครั้งสอง เอา full user beserta relation
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(mockUserBase)
        .mockResolvedValueOnce(mockFullUser);

      // Act
      const result = await authService.getMe(userId);

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(2);
      expect(result.firstName).toBe('Doctor');
      expect(result.role).toBe(UserRole.nutritionist);
    });
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });
});

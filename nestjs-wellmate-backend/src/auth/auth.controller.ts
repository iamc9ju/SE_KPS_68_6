import {
  Body,
  Controller,
  Ip,
  Post,
  Get,
  Res,
  Req,
  Headers,
  UseGuards,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { Response, Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly accessTokenMaxAge: number;
  private readonly refreshTokenMaxAge: number;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {
    const accessExpiry = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRY',
      '1h',
    );
    const refreshDays = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRY_DAYS',
      7,
    );
    this.accessTokenMaxAge = this.parseExpiryToMs(accessExpiry);
    this.refreshTokenMaxAge = refreshDays * 24 * 60 * 60 * 1000;
  }

  @Post('register')
  @ApiOperation({ summary: 'สมัครสมาชิก' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  async register(
    @Body() dto: RegisterDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) response: Response,
    @Headers('x-device-id') deviceId?: string,
  ) {
    const result = await this.authService.register(dto);
    const user = result.data;

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.userId,
      email: user.email,
      role: user.role,
    });
    const refreshToken = await this.tokenService.createRefreshToken(
      user.userId,
      ip,
      userAgent,
      deviceId,
    );

    this.setAuthCookies(response, accessToken, refreshToken);

    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'เข้าสู่ระบบ' })
  @ApiResponse({ status: 201, description: 'Login successful — set cookies' })
  @ApiResponse({ status: 401, description: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) response: Response,
    @Headers('x-device-id') deviceId?: string,
  ) {
    const user = await this.authService.login(dto);

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.userId,
      email: user.email,
      role: user.role,
    });
    const refreshToken = await this.tokenService.createRefreshToken(
      user.userId,
      ip,
      userAgent,
      deviceId,
    );

    this.setAuthCookies(response, accessToken, refreshToken);

    return {
      message: 'Login successful',
      data: user,
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'ต่ออายุ token' })
  @ApiResponse({ status: 201, description: 'Refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Headers('x-device-id') deviceId?: string,
  ) {
    const refreshToken = request.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.tokenService.rotateRefreshToken(
      refreshToken,
      ip,
      userAgent,
      deviceId,
    );

    this.setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

    return { message: 'Refreshed successfully' };
  }

  @Post('sign-out')
  @ApiOperation({ summary: 'ออกจากระบบ' })
  @ApiResponse({ status: 201, description: 'Logged out successfully' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refreshToken'];

    this.clearAuthCookies(response);

    if (refreshToken) {
      await this.tokenService.revokeToken(refreshToken);
    }

    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out-all')
  @ApiOperation({ summary: 'ออกจากระบบทุกอุปกรณ์' })
  @ApiResponse({ status: 201, description: 'Logged out from all devices' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logoutAll(@CurrentUser('sub') userId: string) {
    await this.tokenService.revokeAllTokens(userId);
    return { message: 'Logged out from all devices' };
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'ดึงข้อมูล user ที่ login อยู่' })
  @ApiResponse({ status: 200, description: 'User fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@CurrentUser('sub') userId: string) {
    const data = await this.authService.getMe(userId);
    return {
      message: 'User fetched successfully',
      data,
    };
  }

  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? 'strict' : 'lax') as 'strict' | 'lax',
      path: '/',
    };

    response.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: this.accessTokenMaxAge,
    });
    response.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: this.refreshTokenMaxAge,
    });
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'อัปโหลดภาพโปรไฟล์' })
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new UnauthorizedException('No image file provided');
    }

    // 1. Upload to Cloudinary
    const result = await this.cloudinaryService.uploadImage(file);
    const imageUrl = (result as any).secure_url;

    // 2. Save URL to Database
    await this.prismaService.user.update({
      where: { userId: user.userId },
      data: { profileImageUrl: imageUrl },
    });

    return {
      message: 'Avatar updated successfully',
      imageUrl,
    };
  }

  private clearAuthCookies(response: Response) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
  }

  private parseExpiryToMs(expiry: string): number {
    const match = expiry.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return 60 * 60 * 1000;

    const value = parseInt(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * (multipliers[unit] || 60 * 60 * 1000);
  }
}

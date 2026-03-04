import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  private readonly bcryptRounds: number;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiryMs: number;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.bcryptRounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
    this.accessTokenExpiry = this.configService.get<string>(
      'JWT_EXPIRATION',
      '1h',
    );
    const refreshDays = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRY_DAYS',
      7,
    );
    this.refreshTokenExpiryMs = refreshDays * 24 * 60 * 60 * 1000;
  }

  /**
   * สร้าง JWT Access Token
   */
  generateAccessToken(payload: {
    sub: string;
    email: string;
    role: string;
  }): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.accessTokenExpiry as any,
    });
  }

  /**
   * สร้าง Refresh Token ใหม่และบันทึกลง DB
   * format: {tokenId}.{secret}
   */
  async createRefreshToken(
    userId: string,
    ip: string,
    userAgent: string,
    deviceId?: string,
  ): Promise<string> {
    const tokenId = crypto.randomUUID();
    const secret = crypto.randomBytes(32).toString('hex');
    const secretHash = await bcrypt.hash(secret, this.bcryptRounds);

    await this.prisma.refreshToken.create({
      data: {
        id: tokenId,
        userId,
        secretHash,
        family: crypto.randomUUID(),
        deviceId,
        ipAddress: ip || null,
        userAgent,
        expiresAt: new Date(Date.now() + this.refreshTokenExpiryMs),
      },
    });

    return `${tokenId}.${secret}`;
  }

  /**
   * Rotate Refresh Token:
   * 1. ตรวจสอบ token เก่า
   * 2. ตรวจ reuse detection (family-based)
   * 3. Mark token เก่า usedAt
   * 4. สร้าง token ใหม่ใน family เดียวกัน
   * 5. สร้าง access token ใหม่
   */
  async rotateRefreshToken(
    oldRefreshToken: string,
    ip?: string,
    userAgent?: string,
    deviceId?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [tokenId, secret] = oldRefreshToken.split('.');

    if (!tokenId || !secret) {
      throw new UnauthorizedException('Invalid refresh token format');
    }

    const token = await this.prisma.refreshToken.findUnique({
      where: { id: tokenId },
      include: { user: true },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (token.revokedAt || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired or revoked');
    }

    // Reuse detection — ถ้า token ถูกใช้แล้ว = มีคน steal token
    if (token.usedAt) {
      await this.prisma.refreshToken.updateMany({
        where: { family: token.family },
        data: { revokedAt: new Date() },
      });
      this.logger.warn(
        `Token reuse detected for user ${token.userId}, family ${token.family}`,
      );
      throw new UnauthorizedException(
        'Token reuse detected - all sessions revoked',
      );
    }

    // Verify secret
    const isValid = await bcrypt.compare(secret, token.secretHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Rotate: mark old → create new
    const newTokenId = crypto.randomUUID();
    const newSecret = crypto.randomBytes(32).toString('hex');
    const newRefreshToken = `${newTokenId}.${newSecret}`;
    const newSecretHash = await bcrypt.hash(newSecret, this.bcryptRounds);

    await this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.update({
        where: { id: tokenId },
        data: { usedAt: new Date() },
      });

      await tx.refreshToken.create({
        data: {
          id: newTokenId,
          userId: token.userId,
          secretHash: newSecretHash,
          family: token.family,
          deviceId: deviceId ?? token.deviceId,
          ipAddress: ip ?? token.ipAddress,
          userAgent: userAgent ?? token.userAgent,
          expiresAt: new Date(Date.now() + this.refreshTokenExpiryMs),
        },
      });
    });

    const accessToken = this.generateAccessToken({
      sub: token.user.userId,
      email: token.user.email,
      role: token.user.role,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * Revoke single refresh token (logout จากอุปกรณ์เดียว)
   */
  async revokeToken(refreshToken: string): Promise<void> {
    const [tokenId, secret] = refreshToken.split('.');
    if (!tokenId || !secret) {
      throw new UnauthorizedException('Invalid refresh token format');
    }

    const token = await this.prisma.refreshToken.findUnique({
      where: { id: tokenId },
    });

    if (!token || token.revokedAt) {
      return;
    }

    const isValid = await bcrypt.compare(secret, token.secretHash);
    if (isValid) {
      await this.prisma.refreshToken.update({
        where: { id: tokenId },
        data: { revokedAt: new Date() },
      });
    }
  }

  /**
   * Revoke ทุก refresh token ของ user (logout จากทุกอุปกรณ์)
   */
  async revokeAllTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }
}

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool;

  constructor() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not defined');

    const pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 10000,
      max: 5,
    });

    const adapter = new PrismaPg(pool);
    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
    this.pool = pool;

    this.logger.log('Prisma Service Initialized with DATABASE_URL');
  }

  async onModuleInit() {
    await this.$connect();
  }

  async $disconnect() {
    await super.$disconnect();
    if (this.pool) {
      await this.pool.end();
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma Service Destroyed and DB Pool Closed');
  }
}

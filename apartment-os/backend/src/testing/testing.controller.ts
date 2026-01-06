import {
  Controller,
  Delete,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('testing')
export class TestingController {
  constructor(private prisma: PrismaService) {}

  @Delete('reset-db')
  async resetDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException(
        'Bu endpoint sadece test ortamında çalışır.',
      );
    }

    try {
      const tablenames = await this.prisma.$queryRaw<
        Array<{ tablename: string }>
      >`
        SELECT tablename FROM pg_tables WHERE schemaname='public'
      `;

      const tables = tablenames
        .map(({ tablename }) => tablename)
        .filter((name) => name !== '_prisma_migrations')
        .map((name) => `"public"."${name}"`)
        .join(', ');

      if (tables.length > 0) {
        await this.prisma.$executeRawUnsafe(
          `TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE;`,
        );
      }

      return { message: 'Database reset successful' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Database reset failed');
    }
  }
}

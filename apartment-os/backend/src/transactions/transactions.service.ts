import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from '../prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto, managerId: string) {
    const { propertyId, unitId, type } = createTransactionDto;

    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, managerId },
    });

    if (!property) {
      throw new ForbiddenException('Bu site için işlem yapma yetkiniz yok.');
    }

    if (type === TransactionType.INCOME && unitId) {
      const unit = await this.prisma.unit.findFirst({
        where: {
          id: unitId,
          block: { propertyId },
        },
      });

      if (!unit) {
        throw new BadRequestException('Seçilen daire bu siteye ait değil.');
      }
    }

    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        amount: createTransactionDto.amount,
      },
    });
  }

  async findAllByProperty(propertyId: string, managerId: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, managerId },
    });
    if (!property) throw new ForbiddenException('Erişim yetkiniz yok.');

    return this.prisma.transaction.findMany({
      where: { propertyId },
      orderBy: { date: 'desc' },
      include: {
        unit: {
          include: { block: true },
        },
      },
    });
  }

  // Statistics (for dashboard)
  async getStats(propertyId: string, managerId: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, managerId },
    });
    if (!property) throw new ForbiddenException();

    const aggregations = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: { propertyId },
      _sum: {
        amount: true,
      },
    });

    let income = 0;
    let expense = 0;

    aggregations.forEach((agg) => {
      if (agg.type === TransactionType.INCOME) income = Number(agg._sum.amount);
      if (agg.type === TransactionType.EXPENSE)
        expense = Number(agg._sum.amount);
    });

    return {
      income,
      expense,
      balance: income - expense,
    };
  }
}

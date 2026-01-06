import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(managerId: string) {
    // Occupancy
    const totalUnits = await this.prisma.unit.count({
      where: { block: { property: { managerId } } },
    });

    const filledUnits = await this.prisma.unit.count({
      where: {
        block: { property: { managerId } },
        residents: { some: {} },
      },
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const transactions = await this.prisma.transaction.groupBy({
      by: ['type', 'date'],
      where: {
        property: { managerId },
        date: { gte: sixMonthsAgo },
      },
      _sum: { amount: true },
    });

    const monthlyStats = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = d.toLocaleString('tr-TR', { month: 'long' });
      const year = d.getFullYear();
      const month = d.getMonth();

      const income = transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            t.type === TransactionType.INCOME &&
            tDate.getMonth() === month &&
            tDate.getFullYear() === year
          );
        })
        .reduce((acc, curr) => acc + Number(curr._sum.amount || 0), 0);

      const expense = transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            t.type === TransactionType.EXPENSE &&
            tDate.getMonth() === month &&
            tDate.getFullYear() === year
          );
        })
        .reduce((acc, curr) => acc + Number(curr._sum.amount || 0), 0);

      monthlyStats.unshift({ month: monthKey, income, expense });
    }

    const totalProperties = await this.prisma.property.count({
      where: { managerId },
    });
    const totalResidents = await this.prisma.resident.count({
      where: { unit: { block: { property: { managerId } } } },
    });

    return {
      occupancy: {
        total: totalUnits,
        filled: filledUnits,
        empty: totalUnits - filledUnits,
      },
      chartData: monthlyStats,
      counts: { properties: totalProperties, residents: totalResidents },
    };
  }
}

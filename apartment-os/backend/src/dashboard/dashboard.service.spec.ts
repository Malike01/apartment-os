import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma.service';
import { TransactionType } from '@prisma/client';

const mockPrismaService = {
  unit: { count: jest.fn() },
  property: { count: jest.fn() },
  resident: { count: jest.fn() },
  transaction: { groupBy: jest.fn() },
};

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should calculate summary stats correctly', async () => {
    // 1. ARRANGE
    const userId = 'user-1';

    mockPrismaService.unit.count
      .mockResolvedValueOnce(10) // totalUnits
      .mockResolvedValueOnce(6); // filledUnits

    mockPrismaService.property.count.mockResolvedValue(2);
    mockPrismaService.resident.count.mockResolvedValue(15);

    // [{ type: 'INCOME', _sum: { amount: 5000 }, date: ... }]
    const mockGroupedTransactions = [
      {
        type: TransactionType.INCOME,
        _sum: { amount: 5000 },
        date: new Date(),
      },
      {
        type: TransactionType.EXPENSE,
        _sum: { amount: 2000 },
        date: new Date(),
      },
    ];

    mockPrismaService.transaction.groupBy.mockResolvedValue(
      mockGroupedTransactions,
    );

    // 2. ACT
    const result = await service.getSummary(userId);

    // 3. ASSERT
    expect(result.occupancy).toEqual({
      total: 10,
      filled: 6,
      empty: 4,
    });

    expect(result.counts).toEqual({
      properties: 2,
      residents: 15,
    });

    expect(result.chartData).toHaveLength(6);

    const currentMonthData = result.chartData[result.chartData.length - 1];
    expect(currentMonthData.income).toBe(5000);
    expect(currentMonthData.expense).toBe(2000);
  });
});

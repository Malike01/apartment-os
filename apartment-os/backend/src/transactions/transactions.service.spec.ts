import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { createMockTransaction } from '../../test/factories/transaction.factory';
import { createMockProperty } from '../../test/factories/property.factory';

const mockPrismaService = {
  property: { findFirst: jest.fn() },
  unit: { findFirst: jest.fn() },
  transaction: {
    create: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const managerId = 'manager-1';

    it('should create transaction if manager owns property', async () => {
      // 1. ARRANGE
      const property = createMockProperty({ managerId });
      const dto = {
        type: TransactionType.EXPENSE,
        amount: 100,
        category: 'Temizlik',
        description: 'Deterjan',
        propertyId: property.id,
      };

      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(property);
      jest
        .spyOn(prisma.transaction, 'create')
        .mockResolvedValue(createMockTransaction(dto as any));

      // 2. ACT
      await service.create(dto, managerId);

      // 3. ASSERT
      expect(prisma.transaction.create).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if property does not belong to manager', async () => {
      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(null);

      const dto = {
        type: TransactionType.EXPENSE,
        amount: 10,
        category: 'Test',
        description: 'Test',
        propertyId: 'fake',
      };

      await expect(service.create(dto, managerId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if unit does not belong to property (Income Integrity)', async () => {
      // 1. ARRANGE
      const property = createMockProperty({ managerId });
      const dto = {
        type: TransactionType.INCOME,
        amount: 500,
        category: 'Aidat',
        description: 'Ocak Aidatı',
        propertyId: property.id,
        unitId: 'unit-xyz',
      };

      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(property);
      // ...bu daire bu sitede değil!
      jest.spyOn(prisma.unit, 'findFirst').mockResolvedValue(null);

      // 2. ACT & 3. ASSERT
      await expect(service.create(dto, managerId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getStats', () => {
    it('should calculate income, expense and balance correctly', async () => {
      // 1. ARRANGE
      const managerId = 'manager-1';
      const property = createMockProperty({ managerId });

      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(property);

      const mockAggregations = [
        { type: TransactionType.INCOME, _sum: { amount: 1000 } },
        { type: TransactionType.EXPENSE, _sum: { amount: 400 } },
      ];

      jest
        .spyOn(prisma.transaction, 'groupBy')
        .mockResolvedValue(mockAggregations as any);

      // 2. ACT
      const result = await service.getStats(property.id, managerId);

      // 3. ASSERT
      expect(result.income).toBe(1000);
      expect(result.expense).toBe(400);
      expect(result.balance).toBe(600); // 1000 - 400 = 600
    });
  });

  describe('createBulk', () => {
    it('should create transactions for ALL units in the property', async () => {
      // 1. ARRANGE
      const managerId = 'manager-1';
      const propertyId = 'prop-1';

      const mockPropertyWithUnits = {
        id: propertyId,
        managerId,
        blocks: [
          {
            units: [
              { id: 'unit-1', doorNumber: '1' },
              { id: 'unit-2', doorNumber: '2' },
            ],
          },
        ],
      };

      jest
        .spyOn(prisma.property, 'findFirst')
        .mockResolvedValue(mockPropertyWithUnits as any);

      jest
        .spyOn(prisma.transaction, 'createMany')
        .mockResolvedValue({ count: 2 });

      // 2. ACT
      const dto = {
        propertyId,
        amount: 500,
        description: 'Ocak Aidat',
        category: 'Aidat',
      };

      const result = await service.createBulk(dto, managerId);

      // 3. ASSERT
      expect(result.count).toBe(2);

      expect(prisma.transaction.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ unitId: 'unit-1', amount: 500 }),
          expect.objectContaining({ unitId: 'unit-2', amount: 500 }),
        ]),
      });
    });

    it('should throw ForbiddenException if property does not belong to manager', async () => {
      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(null);

      const dto = {
        propertyId: 'fake',
        amount: 100,
        description: 'Test',
        category: 'Test',
      };

      await expect(service.createBulk(dto, 'manager-1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if property has NO units', async () => {
      const emptyProperty = {
        id: 'prop-1',
        managerId: 'manager-1',
        blocks: [],
      };

      jest
        .spyOn(prisma.property, 'findFirst')
        .mockResolvedValue(emptyProperty as any);

      const dto = {
        propertyId: 'prop-1',
        amount: 100,
        description: 'Test',
        category: 'Test',
      };

      await expect(service.createBulk(dto, 'manager-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

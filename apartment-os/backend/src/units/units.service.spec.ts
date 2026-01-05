import { Test, TestingModule } from '@nestjs/testing';
import { UnitsService } from './units.service';
import { PrismaService } from '../prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { createMockBlock } from '../../test/factories/block.factory';
import { createMockUnit } from '../../test/factories/unit.factory';

const mockPrismaService = {
  block: { findFirst: jest.fn() },
  unit: { create: jest.fn(), findMany: jest.fn() },
};

describe('UnitsService', () => {
  let service: UnitsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UnitsService>(UnitsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create unit if manager owns the block via property', async () => {
      // ARRANGE
      const managerId = 'manager-1';
      const mockBlock = createMockBlock();

      jest.spyOn(prisma.block, 'findFirst').mockResolvedValue(mockBlock);

      const unitDto = { doorNumber: '1', floor: 1, blockId: mockBlock.id };
      const expectedUnit = createMockUnit({ ...unitDto });

      jest.spyOn(prisma.unit, 'create').mockResolvedValue(expectedUnit);

      // ACT
      const result = await service.create(unitDto, managerId);

      // ASSERT
      expect(result).toEqual(expectedUnit);
      expect(prisma.block.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: mockBlock.id,
            property: { managerId },
          },
        }),
      );
    });

    it('should throw ForbiddenException if block does not belong to manager', async () => {
      // ARRANGE
      jest.spyOn(prisma.block, 'findFirst').mockResolvedValue(null);

      // ACT & ASSERT
      await expect(
        service.create(
          { doorNumber: '1', floor: 1, blockId: 'fake' },
          'manager-1',
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

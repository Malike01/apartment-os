import { Test, TestingModule } from '@nestjs/testing';
import { BlocksService } from './blocks.service';
import { PrismaService } from '../prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { createMockProperty } from '../../test/factories/property.factory';
import { createMockBlock } from '../../test/factories/block.factory';

const mockPrismaService = {
  property: { findFirst: jest.fn() },
  block: { create: jest.fn(), findMany: jest.fn() },
};

describe('BlocksService', () => {
  let service: BlocksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlocksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BlocksService>(BlocksService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create block if manager owns the property', async () => {
      // ARRANGE
      const managerId = 'manager-1';
      const property = createMockProperty({ managerId });
      const blockDto = { name: 'A Blok', propertyId: property.id };
      const expectedBlock = createMockBlock({ ...blockDto });

      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(property);
      jest.spyOn(prisma.block, 'create').mockResolvedValue(expectedBlock);

      // ACT
      const result = await service.create(blockDto, managerId);

      // ASSERT
      expect(result).toEqual(expectedBlock);
      expect(prisma.property.findFirst).toHaveBeenCalledWith({
        where: { id: property.id, managerId },
      });
    });

    it('should throw ForbiddenException if manager does NOT own the property', async () => {
      // ARRANGE
      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(null);
      // ACT & ASSERT
      await expect(
        service.create({ name: 'B Blok', propertyId: 'fake' }, 'manager-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

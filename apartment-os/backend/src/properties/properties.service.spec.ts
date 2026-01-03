import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';
import { createMockProperty } from '../../test/factories/property.factory'; // Factory import

// Prisma Mock Helper
const mockPrismaService = {
  property: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('PropertiesService', () => {
  let service: PropertiesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a property linked to the manager', async () => {
      // 1. ARRANGE
      const mockManagerId = 'manager-123';
      const createDto = { name: 'Yeni Site', city: 'İzmir' };
      const expectedProperty = createMockProperty({
        ...createDto,
        managerId: mockManagerId,
      });

      jest.spyOn(prisma.property, 'create').mockResolvedValue(expectedProperty);

      // 2. ACT
      const result = await service.create(createDto, mockManagerId);

      // 3. ASSERT
      expect(prisma.property.create).toHaveBeenCalledWith({
        data: { ...createDto, managerId: mockManagerId },
      });
      expect(result).toEqual(expectedProperty);
    });
  });

  describe('findAll', () => {
    it('should return a list of properties for the manager', async () => {
      // 1. ARRANGE
      const mockManagerId = 'manager-123';
      const mockProperties = [
        createMockProperty({ managerId: mockManagerId }),
        createMockProperty({ managerId: mockManagerId }),
        createMockProperty({ managerId: mockManagerId }),
      ];

      jest.spyOn(prisma.property, 'findMany').mockResolvedValue(mockProperties);

      // 2. ACT
      const result = await service.findAll(mockManagerId);

      // 3. ASSERT
      expect(result).toHaveLength(3);
      expect(prisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { managerId: mockManagerId } }),
      );
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if property belongs to another manager', async () => {
      // 1. ARRANGE
      const targetId = 'target-prop';
      const managerId = 'current-manager';

      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(null);

      // 2. ACT & 3. ASSERT
      await expect(service.findOne(targetId, managerId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

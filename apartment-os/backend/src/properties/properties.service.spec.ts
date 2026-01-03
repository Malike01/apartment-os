// backend/src/properties/properties.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

// 1. Mock Data
const mockManagerId = 'manager-123';
const mockPropertyId = 'property-abc';

const mockProperty = {
  id: mockPropertyId,
  name: 'Güneş Sitesi',
  managerId: mockManagerId,
  blocks: [],
};

// 2. Mock Prisma Service
const mockPrismaService = {
  property: {
    create: jest.fn().mockResolvedValue(mockProperty),
    findMany: jest.fn().mockResolvedValue([mockProperty]),
    findFirst: jest.fn(),
    update: jest
      .fn()
      .mockResolvedValue({ ...mockProperty, name: 'Updated Name' }),
    delete: jest.fn().mockResolvedValue(mockProperty),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- CREATE TESTING ---
  describe('create', () => {
    it('should create a property with correct managerId', async () => {
      const dto = { name: 'Yeni Site', address: 'Istanbul' };

      const result = await service.create(dto, mockManagerId);

      expect(prisma.property.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          managerId: mockManagerId,
        },
      });
      expect(result).toEqual(mockProperty);
    });
  });

  // --- FIND ALL TESTING ---
  describe('findAll', () => {
    it('should return properties belonging to the manager', async () => {
      await service.findAll(mockManagerId);

      expect(prisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { managerId: mockManagerId },
        }),
      );
    });
  });

  // --- FIND ONE TESTING ---
  describe('findOne', () => {
    it('should return property if it belongs to manager', async () => {
      jest
        .spyOn(prisma.property, 'findFirst')
        .mockResolvedValue(mockProperty as any);

      const result = await service.findOne(mockPropertyId, mockManagerId);
      expect(result).toEqual(mockProperty);
    });

    it('should throw NotFoundException if property does not exist or belongs to another manager', async () => {
      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne('fake-id', mockManagerId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // --- UPDATE TESTING ---
  describe('update', () => {
    it('should update property if owned by manager', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProperty as any);

      const updateDto = { name: 'Updated Name' };
      await service.update(mockPropertyId, updateDto, mockManagerId);

      expect(service.findOne).toHaveBeenCalledWith(
        mockPropertyId,
        mockManagerId,
      );

      expect(prisma.property.update).toHaveBeenCalledWith({
        where: { id: mockPropertyId },
        data: updateDto,
      });
    });
  });
});

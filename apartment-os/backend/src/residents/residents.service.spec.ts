import { Test, TestingModule } from '@nestjs/testing';
import { ResidentsService } from './residents.service';
import { PrismaService } from '../prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { createMockResident } from '../../test/factories/resident.factory';
import { createMockUnit } from '../../test/factories/unit.factory';
import { ResidentType } from '@prisma/client';

const mockPrismaService = {
  unit: { findFirst: jest.fn() },
  resident: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
};

describe('ResidentsService', () => {
  let service: ResidentsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResidentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ResidentsService>(ResidentsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create resident if manager owns the unit (via block->property)', async () => {
      // 1. ARRANGE
      const managerId = 'manager-1';
      const mockUnit = createMockUnit();

      const createDto = {
        fullName: 'Ahmet Yılmaz',
        phone: '5551234567',
        unitId: mockUnit.id,
        type: ResidentType.TENANT,
      };

      const expectedResident = createMockResident({ ...createDto });

      jest.spyOn(prisma.unit, 'findFirst').mockResolvedValue(mockUnit);
      jest.spyOn(prisma.resident, 'create').mockResolvedValue(expectedResident);

      // 2. ACT
      const result = await service.create(createDto, managerId);

      // 3. ASSERT
      expect(result).toEqual(expectedResident);

      expect(prisma.unit.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: mockUnit.id,
            block: { property: { managerId } },
          },
        }),
      );
    });

    it('should throw ForbiddenException if unit does NOT belong to manager', async () => {
      // 1. ARRANGE
      jest.spyOn(prisma.unit, 'findFirst').mockResolvedValue(null);

      const createDto = {
        fullName: 'Mehmet',
        phone: '555',
        unitId: 'fake-unit-id',
        type: ResidentType.OWNER,
      };

      // 2. ACT & 3. ASSERT
      await expect(service.create(createDto, 'manager-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findAllByUnit', () => {
    it('should return residents if manager owns the unit', async () => {
      const managerId = 'manager-1';
      const mockUnit = createMockUnit();
      const mockResidents = [createMockResident(), createMockResident()];

      // Yetki var
      jest.spyOn(prisma.unit, 'findFirst').mockResolvedValue(mockUnit);
      jest.spyOn(prisma.resident, 'findMany').mockResolvedValue(mockResidents);

      const result = await service.findAllByUnit(mockUnit.id, managerId);
      expect(result).toHaveLength(2);
    });

    it('should throw NotFoundException if unit not found or forbidden', async () => {
      jest.spyOn(prisma.unit, 'findFirst').mockResolvedValue(null);

      await expect(
        service.findAllByUnit('fake-id', 'manager-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createResidentDto: CreateResidentDto, managerId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: {
        id: createResidentDto.unitId,
        block: {
          property: {
            managerId: managerId,
          },
        },
      },
    });

    if (!unit) {
      throw new ForbiddenException('Bu daireye sakin ekleme yetkiniz yok.');
    }

    return this.prisma.resident.create({
      data: createResidentDto,
    });
  }

  async findAllByUnit(unitId: string, managerId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: {
        id: unitId,
        block: { property: { managerId } },
      },
    });

    if (!unit) throw new NotFoundException('Daire bulunamadı.');

    return this.prisma.resident.findMany({
      where: { unitId },
      orderBy: { type: 'asc' },
    });
  }

  async findOne(id: string, managerId: string) {
    const resident = await this.prisma.resident.findFirst({
      where: {
        id,
        unit: { block: { property: { managerId } } }, // Deep security check
      },
      include: { unit: true },
    });

    if (!resident) throw new NotFoundException('Sakin bulunamadı.');
    return resident;
  }

  async update(
    id: string,
    updateResidentDto: UpdateResidentDto,
    managerId: string,
  ) {
    await this.findOne(id, managerId);

    return this.prisma.resident.update({
      where: { id },
      data: updateResidentDto,
    });
  }

  async remove(id: string, managerId: string) {
    const result = await this.prisma.resident.deleteMany({
      where: {
        id,
        unit: { block: { property: { managerId } } },
      },
    });

    if (result.count === 0) throw new NotFoundException('Sakin silinemedi.');
    return { message: 'Sakin silindi' };
  }
}

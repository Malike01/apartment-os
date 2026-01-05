import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async create(createUnitDto: CreateUnitDto, managerId: string) {
    const block = await this.prisma.block.findFirst({
      where: {
        id: createUnitDto.blockId,
        property: { managerId },
      },
    });

    if (!block) {
      throw new ForbiddenException('Bu bloğa daire ekleme yetkiniz yok.');
    }

    return this.prisma.unit.create({
      data: createUnitDto,
    });
  }

  async findAllByBlock(blockId: string, managerId: string) {
    const block = await this.prisma.block.findFirst({
      where: { id: blockId, property: { managerId } },
    });
    if (!block) throw new NotFoundException('Blok bulunamadı.');

    return this.prisma.unit.findMany({
      where: { blockId },
      orderBy: [{ floor: 'asc' }, { doorNumber: 'asc' }],
      include: { residents: true },
    });
  }

  async findOne(id: string, managerId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: {
        id,
        block: { property: { managerId } },
      },
      include: { block: true, residents: true },
    });

    if (!unit) throw new NotFoundException('Daire bulunamadı.');
    return unit;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto, managerId: string) {
    await this.findOne(id, managerId);

    return this.prisma.unit.update({
      where: { id },
      data: updateUnitDto,
    });
  }

  async remove(id: string, managerId: string) {
    const result = await this.prisma.unit.deleteMany({
      where: {
        id,
        block: { property: { managerId } },
      },
    });

    if (result.count === 0) throw new NotFoundException('Daire silinemedi.');
    return { message: 'Daire silindi' };
  }
}

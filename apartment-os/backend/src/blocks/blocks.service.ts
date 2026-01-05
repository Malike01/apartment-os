import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BlocksService {
  constructor(private prisma: PrismaService) {}

  async create(createBlockDto: CreateBlockDto, managerId: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: createBlockDto.propertyId, managerId },
    });

    if (!property) {
      throw new ForbiddenException('Bu siteye blok ekleme yetkiniz yok.');
    }

    return this.prisma.block.create({
      data: createBlockDto,
    });
  }

  async findAllByProperty(propertyId: string, managerId: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, managerId },
    });
    if (!property) throw new NotFoundException('Site bulunamadı.');

    return this.prisma.block.findMany({
      where: { propertyId },
      orderBy: { name: 'asc' },
      include: { _count: { select: { units: true } } },
    });
  }

  async findOne(id: string, managerId: string) {
    const block = await this.prisma.block.findFirst({
      where: {
        id,
        property: { managerId },
      },
      include: { property: true },
    });

    if (!block) throw new NotFoundException('Blok bulunamadı.');
    return block;
  }

  async update(id: string, updateBlockDto: UpdateBlockDto, managerId: string) {
    await this.findOne(id, managerId);

    return this.prisma.block.update({
      where: { id },
      data: updateBlockDto,
    });
  }

  async remove(id: string, managerId: string) {
    const result = await this.prisma.block.deleteMany({
      where: {
        id,
        property: { managerId },
      },
    });

    if (result.count === 0) throw new NotFoundException('Blok silinemedi.');
    return { message: 'Blok silindi' };
  }
}

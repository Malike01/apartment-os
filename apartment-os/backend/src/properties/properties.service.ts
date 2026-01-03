import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(createPropertyDto: CreatePropertyDto, managerId: string) {
    return this.prisma.property.create({
      data: {
        ...createPropertyDto,
        managerId,
      },
    });
  }

  async findAll(managerId: string) {
    return this.prisma.property.findMany({
      where: { managerId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { blocks: true },
        },
      },
    });
  }

  async findOne(id: string, managerId: string) {
    const property = await this.prisma.property.findFirst({
      where: {
        id,
        managerId,
      },
      include: {
        blocks: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Site bulunamadı veya erişim yetkiniz yok.`);
    }

    return property;
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    managerId: string,
  ) {
    await this.findOne(id, managerId);

    return this.prisma.property.update({
      where: { id },
      data: updatePropertyDto,
    });
  }

  async remove(id: string, managerId: string) {
    await this.findOne(id, managerId);
    return this.prisma.property.delete({
      where: { id },
    });
  }
}

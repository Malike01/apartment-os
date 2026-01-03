import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { GetUser } from 'src/common/get-user.decorator';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';

@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  create(
    @Body() createPropertyDto: CreatePropertyDto,
    @GetUser('userId') userId: string,
  ) {
    return this.propertiesService.create(createPropertyDto, userId);
  }

  @Get()
  findAll(@GetUser('userId') userId: string) {
    return this.propertiesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.propertiesService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @GetUser('userId') userId: string,
  ) {
    return this.propertiesService.update(id, updatePropertyDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.propertiesService.remove(id, userId);
  }
}

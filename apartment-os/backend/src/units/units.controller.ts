import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { GetUser } from 'src/common/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  create(
    @Body() createUnitDto: CreateUnitDto,
    @GetUser('userId') userId: string,
  ) {
    return this.unitsService.create(createUnitDto, userId);
  }

  // GET /units?blockId=abc
  @Get()
  findAll(
    @Query('blockId') blockId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.unitsService.findAllByBlock(blockId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.unitsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
    @GetUser('userId') userId: string,
  ) {
    return this.unitsService.update(id, updateUnitDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.unitsService.remove(id, userId);
  }
}

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
import { ResidentsService } from './residents.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { GetUser } from 'src/common/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  @Post()
  create(
    @Body() createResidentDto: CreateResidentDto,
    @GetUser('userId') userId: string,
  ) {
    return this.residentsService.create(createResidentDto, userId);
  }

  // GET /residents?unitId=...
  @Get()
  findAll(@Query('unitId') unitId: string, @GetUser('userId') userId: string) {
    return this.residentsService.findAllByUnit(unitId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.residentsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResidentDto: UpdateResidentDto,
    @GetUser('userId') userId: string,
  ) {
    return this.residentsService.update(id, updateResidentDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.residentsService.remove(id, userId);
  }
}

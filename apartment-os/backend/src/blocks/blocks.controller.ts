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
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { GetUser } from 'src/common/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  create(
    @Body() createBlockDto: CreateBlockDto,
    @GetUser('userId') userId: string,
  ) {
    return this.blocksService.create(createBlockDto, userId);
  }

  // GET /blocks?propertyId=xyz
  @Get()
  findAll(
    @Query('propertyId') propertyId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.blocksService.findAllByProperty(propertyId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.blocksService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlockDto: UpdateBlockDto,
    @GetUser('userId') userId: string,
  ) {
    return this.blocksService.update(id, updateBlockDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.blocksService.remove(id, userId);
  }
}

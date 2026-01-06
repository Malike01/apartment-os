import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { GetUser } from 'src/common/get-user.decorator';
import { CreateBulkTransactionDto } from './dto/create-bulk-transaction.dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser('userId') userId: string,
  ) {
    return this.transactionsService.create(createTransactionDto, userId);
  }

  @Get()
  findAll(
    @Query('propertyId') propertyId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.transactionsService.findAllByProperty(propertyId, userId);
  }

  @Get('stats')
  getStats(
    @Query('propertyId') propertyId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.transactionsService.getStats(propertyId, userId);
  }

  @Post('bulk')
  createBulk(
    @Body() createBulkDto: CreateBulkTransactionDto,
    @GetUser('userId') userId: string,
  ) {
    return this.transactionsService.createBulk(createBulkDto, userId);
  }
}

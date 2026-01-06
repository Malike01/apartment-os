import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { type Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { GetUser } from 'src/common/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('finance/excel')
  async downloadExcel(
    @Query('propertyId') propertyId: string,
    @GetUser('userId') userId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateFinanceExcel(
      propertyId,
      userId,
    );

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=finans-raporu.xlsx',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get('finance/pdf')
  async downloadPdf(
    @Query('propertyId') propertyId: string,
    @GetUser('userId') userId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateFinancePdf(
      propertyId,
      userId,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=finans-raporu.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}

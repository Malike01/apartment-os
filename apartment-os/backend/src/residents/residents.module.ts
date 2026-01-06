import { Module } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { ResidentsController } from './residents.controller';

@Module({
  controllers: [ResidentsController],
  providers: [ResidentsService],
})
export class ResidentsModule {}

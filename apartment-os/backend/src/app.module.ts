import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { BlocksModule } from './blocks/blocks.module';
import { UnitsModule } from './units/units.module';
import { ResidentsModule } from './residents/residents.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [UsersModule, AuthModule, PropertiesModule, BlocksModule, UnitsModule, ResidentsModule, TransactionsModule, DashboardModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

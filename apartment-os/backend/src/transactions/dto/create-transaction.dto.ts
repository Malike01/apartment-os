import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType; // INCOME | EXPENSE

  @IsNumber()
  @Min(0.01, { message: 'Tutar 0 dan büyük olmalıdır.' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string; // 'Aidat', 'Elektrik' vb.

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  propertyId: string;

  @IsUUID()
  @IsOptional()
  unitId?: string;
}

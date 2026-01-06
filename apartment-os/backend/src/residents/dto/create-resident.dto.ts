import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ResidentType } from '@prisma/client';

export class CreateResidentDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(ResidentType, { message: 'Tip OWNER veya TENANT olmalıdır.' })
  type: ResidentType; // 'OWNER' | 'TENANT'

  @IsUUID()
  @IsNotEmpty()
  unitId: string;
}

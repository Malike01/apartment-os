import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  doorNumber: string; // "1", "1A", "Z-1"

  @IsInt()
  @Min(-5)
  floor: number;

  @IsString()
  @IsOptional()
  type?: string; // "3+1", "Dublex"

  @IsUUID()
  @IsNotEmpty()
  blockId: string;
}

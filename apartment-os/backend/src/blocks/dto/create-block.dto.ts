import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBlockDto {
  @IsString()
  @IsNotEmpty()
  name: string; // "A Blok"

  @IsUUID()
  @IsNotEmpty()
  propertyId: string;
}

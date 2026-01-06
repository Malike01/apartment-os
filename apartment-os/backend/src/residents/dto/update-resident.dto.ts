import { PartialType } from '@nestjs/mapped-types';
import { CreateResidentDto } from './create-resident.dto';

export class UpdateResidentDto extends PartialType(CreateResidentDto) {}

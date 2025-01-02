import { PartialType } from '@nestjs/mapped-types';
import { CreateParadaDto } from './create-parada.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateParadaDto extends PartialType(CreateParadaDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateRutaDto } from './create-ruta.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRutaDto extends PartialType(CreateRutaDto) {}

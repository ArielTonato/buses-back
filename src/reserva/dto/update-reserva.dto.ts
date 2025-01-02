import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaDto } from './create-reserva.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {}

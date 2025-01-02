import { PartialType } from '@nestjs/mapped-types';
import { CreateBoletoDto } from './create-boleto.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoletoDto extends PartialType(CreateBoletoDto) {}

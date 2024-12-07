import { PartialType } from '@nestjs/mapped-types';
import { CreateParadaDto } from './create-parada.dto';

export class UpdateParadaDto extends PartialType(CreateParadaDto) {}

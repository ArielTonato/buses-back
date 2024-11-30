import { PartialType } from '@nestjs/mapped-types';
import { CreateFrecuenciaDto } from './create-frecuencia.dto';

export class UpdateFrecuenciaDto extends PartialType(CreateFrecuenciaDto) {}

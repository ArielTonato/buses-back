import { PartialType } from '@nestjs/mapped-types';
import { CreateFrecuenciaDto } from './create-frecuencia.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFrecuenciaDto extends PartialType(CreateFrecuenciaDto) {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  descripcion: string;
}

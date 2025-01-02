import { IsString, IsUUID, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFacturaDto {
  @ApiProperty({
    description: 'ID de la reserva asociada a la factura',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  reservaId: number;

  @ApiProperty({
    description: 'ID del usuario al que se emite la factura',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;
  
  @ApiProperty({
    description: 'ID de la cooperativa que emite la factura',
    example: 1,
    default: 1,
    required: false
  })
  @IsNumber()
  @IsOptional()
  cooperativaId?: number = 1;

  @ApiProperty({
    description: 'ID del boleto asociado a la factura',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  boleto_id: number;
}

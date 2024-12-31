import { IsString, IsUUID, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateFacturaDto {
  @IsString()
  @IsNotEmpty()
  tipoPago: string;

  @IsUUID()
  @IsNotEmpty()
  reservaId: string;

  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  @IsUUID()
  @IsNotEmpty()
  cooperativaId: string;
}

import { IsString, IsUUID, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFacturaDto {
  @IsNumber()
  @IsNotEmpty()
  reservaId: number;

  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;
  
  @IsNumber()
  @IsOptional()
  cooperativaId?: number = 1;

  @IsNumber()
  @IsNotEmpty()
  boleto_id: number;
}

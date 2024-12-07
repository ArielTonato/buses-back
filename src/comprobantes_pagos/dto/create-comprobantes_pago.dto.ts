import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateComprobantesPagoDto {
    @IsNumber()
    @Type(() => Number)
    boleto_id: number;

    @IsNumber()
    @Type(() => Number)
    usuario_id: number;

    @IsString()
    @IsOptional()
    url_comprobante?: string;

    @IsEnum(['pendiente', 'aceptado', 'rechazado'])
    estado: 'pendiente' | 'aceptado' | 'rechazado';

    @IsString()
    @IsOptional()   
    comentarios?: string;    
}

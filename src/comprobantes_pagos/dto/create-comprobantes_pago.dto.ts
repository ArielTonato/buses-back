import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateComprobantesPagoDto {
    @IsNumber()
    boleto_id: number;

    @IsNumber()
    usuario_id: number;

    @IsString()
    url_comprobante: string;

    @IsEnum(['pendiente', 'aceptado', 'rechazado'])
    estado: 'pendiente' | 'aceptado' | 'rechazado';

    @IsString()
    @IsOptional()   
    comentarios?: string;    
}

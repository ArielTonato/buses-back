import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { EstadoComprobante } from "src/common/enums/comprobantes.enum";

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

    @IsEnum(EstadoComprobante)
    estado: EstadoComprobante;

    @IsString()
    @IsOptional()   
    comentarios?: string;    
}

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoComprobante } from '../../common/enums/comprobantes.enum';

export class UpdateComprobantesPagoDto {
    @IsEnum(EstadoComprobante)
    @IsOptional()
    estado?: EstadoComprobante;

    @IsString()
    @IsOptional()
    comentarios?: string;

    @IsString()
    @IsOptional()
    url_comprobante?: string;
}

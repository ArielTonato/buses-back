import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EstadoComprobante } from '../../common/enums/comprobantes.enum';
import { Transform } from 'class-transformer';

export class UpdateComprobantesPagoDto {

    @IsEnum(EstadoComprobante)
    @IsOptional()
    estado?: EstadoComprobante;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.trim())
    @MinLength(5,{message: 'El comentario debe tener al menos 5 caracteres'})
    comentarios?: string;

    @IsString()
    @IsOptional()
    url_comprobante?: string;
}

import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EstadoComprobante } from '../../common/enums/comprobantes.enum';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateComprobantesPagoDto {
    @ApiProperty({
        description: 'Estado del comprobante de pago',
        enum: EstadoComprobante,
        example: EstadoComprobante.APROBADO,
        required: false
    })
    @IsEnum(EstadoComprobante)
    @IsOptional()
    estado?: EstadoComprobante;

    @ApiProperty({
        description: 'Comentarios sobre la aprobación o rechazo del comprobante',
        example: 'Comprobante verificado correctamente',
        minLength: 5,
        required: false
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.trim())
    @MinLength(5,{message: 'El comentario debe tener al menos 5 caracteres'})
    comentarios?: string;

    @ApiProperty({
        description: 'URL de la imagen del comprobante de pago',
        example: 'https://storage.googleapis.com/comprobantes/imagen.jpg',
        required: false
    })
    @IsString()
    @IsOptional()
    url_comprobante?: string;
}

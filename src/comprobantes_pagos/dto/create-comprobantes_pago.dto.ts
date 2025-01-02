import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { EstadoComprobante } from "src/common/enums/comprobantes.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateComprobantesPagoDto {
    @ApiProperty({
        description: 'ID del boleto asociado al comprobante',
        example: 1
    })
    @IsNumber()
    @Type(() => Number)
    boleto_id: number;

    @ApiProperty({
        description: 'ID del usuario que realiza el pago',
        example: 1
    })
    @IsNumber()
    @Type(() => Number)
    usuario_id: number;

    @ApiProperty({
        description: 'URL de la imagen del comprobante de pago',
        example: 'https://storage.googleapis.com/comprobantes/imagen.jpg',
        required: false
    })
    @IsString()
    @IsOptional()
    url_comprobante?: string;

    @ApiProperty({
        description: 'Estado del comprobante de pago',
        enum: EstadoComprobante,
        default: EstadoComprobante.PENDIENTE,
        example: EstadoComprobante.PENDIENTE,
        required: false
    })
    @IsEnum(EstadoComprobante)
    @IsOptional()
    estado?: EstadoComprobante = EstadoComprobante.PENDIENTE;

    @ApiProperty({
        description: 'Comentarios adicionales sobre el comprobante',
        example: 'Pago realizado mediante transferencia bancaria',
        required: false
    })
    @IsString()
    @IsOptional()   
    comentarios?: string;    
}

import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { EstadoReserva, MetodoPago } from "src/common/enums/reserva.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReservaDto {
    @ApiProperty({
        description: 'ID del usuario que realiza la reserva',
        example: 1
    })
    @IsNumber()
    @Type(() => Number)
    usuario_id: number

    @ApiProperty({
        description: 'ID del asiento a reservar',
        example: 15
    })
    @IsNumber()
    @Type(() => Number)
    asiento_id: number

    @ApiProperty({
        description: 'ID de la frecuencia del viaje',
        example: 1
    })
    @IsNumber()
    @Type(() => Number)
    frecuencia_id: number

    @ApiProperty({
        description: 'ID del boleto asociado (opcional)',
        example: 1,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    boleto_id?: number

    @ApiProperty({
        description: 'Nombre del pasajero',
        example: 'Juan Pérez',
        required: false
    })
    @IsOptional()
    @IsString()
    nombre_pasajero?: string

    @ApiProperty({
        description: 'Método de pago de la reserva',
        enum: MetodoPago,
        example: MetodoPago.PRESENCIAL,
        default: MetodoPago.PRESENCIAL,
        required: false
    })
    @IsEnum(MetodoPago)
    @IsOptional()
    metodo_pago: MetodoPago = MetodoPago.PRESENCIAL

    @ApiProperty({
        description: 'Número de identificación del pasajero',
        example: '1234567890',
        required: false
    })
    @IsOptional()
    @IsString()
    identificacion_pasajero?: string

    @ApiProperty({
        description: 'Estado de la reserva',
        enum: EstadoReserva,
        example: EstadoReserva.PENDIENTE,
        default: EstadoReserva.PENDIENTE,
        required: false
    })
    @IsOptional()
    @IsEnum(EstadoReserva)
    estado?: EstadoReserva

    @ApiProperty({
        description: 'Fecha del viaje',
        example: '2025-01-15T00:00:00.000Z',
        type: Date
    })
    @IsDate()
    @Type(() => Date)
    fecha_viaje: Date

    @ApiProperty({
        description: 'Hora del viaje en formato HH:mm',
        example: '14:30',
        required: false
    })
    @IsOptional()
    @IsString()
    hora_viaje?: string

    @ApiProperty({
        description: 'Precio de la reserva',
        example: 25.50,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    precio?: number

    @ApiProperty({
        description: 'Destino de la reserva',
        example: 'Bogotá',
        required: true
    })
    @IsString()
    destino_reserva: string
}

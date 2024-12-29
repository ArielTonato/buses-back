import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { EstadoReserva } from "src/common/enums/reserva.enum";

export class CreateReservaDto {
    @IsNumber()
    @Type(() => Number)
    usuario_id: number

    @IsNumber()
    @Type(() => Number)
    asiento_id: number

    @IsNumber()
    @Type(() => Number)
    frecuencia_id: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    boleto_id?: number

    @IsOptional()
    @IsString()
    nombre_pasajero?: string

    @IsOptional()
    @IsString()
    identificacion_pasajero?: string

    @IsOptional()
    @IsEnum(EstadoReserva)
    estado?: EstadoReserva

    @IsDate()
    @Type(() => Date)
    fecha_viaje: Date

    @IsOptional()
    @IsString()
    hora_viaje?: string

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    precio?: number

    @IsOptional()
    @IsString()
    observacion?: string

    @IsString()
    destino_reserva: string
}

import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { ValidarCadena } from "src/common/decorators/cadenasTexto.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFrecuenciaDto {
    @ApiProperty({
        description: 'Nombre identificador de la frecuencia',
        example: 'Quito - Guayaquil 08:00'
    })
    @IsString({message: "El nombre de la frecuencia debe ser una cadena"})
    nombre_frecuencia: string

    @ApiProperty({
        description: 'ID del bus asignado a la frecuencia',
        example: 1
    })
    @IsNumber({}, {message: "El id del bus es un número"})
    bus_id: number

    @ApiProperty({
        description: 'ID del conductor asignado a la frecuencia',
        example: 1
    })
    @IsNumber({}, {message: "El id del conductor es un número"})
    conductor_id: number

    @ApiProperty({
        description: 'Hora de salida de la frecuencia',
        example: '08:00'
    })
    @IsString({message: "La hora de salida debe ser una cadena"})
    hora_salida: string

    @ApiProperty({
        description: 'Hora estimada de llegada',
        example: '14:00'
    })
    @IsString({message: "La hora de llegada debe ser una cadena"})
    hora_llegada: string

    @ApiProperty({
        description: 'Ciudad de origen',
        example: 'Quito'
    })
    @ValidarCadena({value: "origen"})
    origen: string

    @ApiProperty({
        description: 'Ciudad de destino',
        example: 'Guayaquil'
    })
    @ValidarCadena({value: "destino"})
    destino: string

    @ApiProperty({
        description: 'Provincia de destino',
        example: 'Guayas'
    })
    @ValidarCadena({value: "provincia"})
    provincia: string

    @ApiProperty({
        description: 'Estado de la frecuencia',
        example: true,
        required: false,
        default: true
    })
    @IsBoolean({message: "El estado debe ser verdadero o falso"})
    @IsOptional()
    activo?: boolean

    @ApiProperty({
        description: 'Precio total del viaje',
        example: 25.50
    })
    @IsNumber({}, {message: "El precio debe ser un número"})
    total: number

    @ApiProperty({
        description: 'Número de aprobación de la frecuencia',
        example: 'ANT-2024-001'
    })
    @IsString({message: "El número de aprobación debe ser una cadena"})
    nro_aprobacion: string

    @ApiProperty({
        description: 'Indica si el viaje es directo sin paradas',
        example: true,
        required: false,
        default: false
    })
    @IsBoolean({message: "El estado debe ser verdadero o falso"})
    @IsOptional()
    es_directo?: boolean
}

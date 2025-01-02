import { IsNumber, IsBoolean, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRutaDto {
    @ApiProperty({
        description: 'ID de la frecuencia a la que pertenece la ruta',
        example: 1
    })
    @IsNumber({}, {message: "La frecuencia debe ser un número"})
    frecuencia_id: number;

    @ApiProperty({
        description: 'ID de la parada en la ruta',
        example: 1
    })
    @IsNumber({}, {message: "La parada debe ser un número"})
    parada_id: number;

    @ApiProperty({
        description: 'Orden de la parada en la ruta',
        example: 1,
        minimum: 1
    })
    @IsNumber({}, {message: "El orden debe ser un número"})
    orden: number;

    @ApiProperty({
        description: 'Distancia acumulada desde el origen hasta esta parada (en kilómetros)',
        example: 25.5,
        minimum: 0
    })
    @IsNumber({}, {message: "La distancia acumulada debe ser un número"})
    @Min(0)
    distancia_parada: number;

    @ApiProperty({
        description: 'Precio acumulado hasta esta parada',
        example: 5.50,
        minimum: 0
    })
    @IsNumber({}, {message: "El precio acumulado debe ser un número"})
    @Min(0)
    precio_parada: number;

    @ApiProperty({
        description: 'Tiempo estimado de llegada a esta parada (formato HH:mm)',
        example: '10:30'
    })
    @IsString()
    tiempo_parada: string;

    @ApiProperty({
        description: 'Estado de la ruta',
        example: true,
        required: false,
        default: true
    })
    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}

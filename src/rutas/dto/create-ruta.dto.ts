import { IsNumber, IsBoolean, IsOptional, IsString, Min } from 'class-validator';

export class CreateRutaDto {
    @IsNumber({}, {message: "La frecuencia debe ser un número"})
    frecuencia_id: number;

    @IsNumber({}, {message: "La parada debe ser un número"})
    parada_id: number;

    @IsNumber({}, {message: "El orden debe ser un número"})
    orden: number;

    @IsNumber({}, {message: "La distancia acumulada debe ser un número"})
    @Min(0)
    distancia_parada: number;

    @IsNumber({}, {message: "El precio acumulado debe ser un número"})
    @Min(0)
    precio_parada: number;

    //Este tiempo no debe ser mayor al tiempo de llegada de la frecuencia
    @IsString()
    tiempo_parada: string;

    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}

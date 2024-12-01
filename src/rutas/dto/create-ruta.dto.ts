import { IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRutaDto {
    @IsNumber({}, {message: "La frecuencia debe ser un número"})
    frecuencia_id: number;

    @IsNumber({}, {message: "La parada debe ser un número"})
    parada_id: number;

    @IsNumber({}, {message: "El orden debe ser un número"})
    orden: number;

    @IsNumber({}, {message: "La distancia acumulada debe ser un número"})
    distancia_acumulada: number;

    @IsNumber({}, {message: "El precio acumulado debe ser un número"})
    precio_acumulado: number;

    @IsString()
    tiempo_acumulado: string;

    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}

import { IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRutaDto {
    @IsNumber({}, {message: "La frecuencia debe ser un número"})
    frecuencia_id: number;

    @IsNumber({}, {message: "La parada debe ser un número"})
    parada_id: number;

    @IsNumber({}, {message: "El orden debe ser un número"})
    orden: number;

    @IsNumber({}, {message: "La distancia acumulada debe ser un número"})
    distancia_parada: number;

    @IsNumber({}, {message: "El precio acumulado debe ser un número"})
    precio_parada: number;

    //Este tiempo no debe ser mayor al tiempo de llegada de la frecuencia
    @IsString({message: "El tiempo acumulado debe ser una cadena"})
    @IsString()
    tiempo_parada: string;

    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}

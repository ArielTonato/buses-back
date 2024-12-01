import { IsBoolean, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { Type } from "class-transformer";

export class CreateParadaDto {
    @IsNumber({}, {message: "El id de la parada debe ser un número"})
    @Type(() => Number)
    frecuencia_id: number;


    @IsString({message: "La ciudad debe ser una cadena de texto"})
    @Matches(/^[a-zA-Z\s]+$/, { message: 'La ciudad no puede contener números' })
    ciudad: string;

    @IsNumber({}, {message: "El orden debe ser un número"})
    @Type(() => Number)
    orden: number;

    @IsNumber({}, {message: "La distancia debe ser un número"})
    @Type(() => Number)
    distancia_km: number;

    @IsString({message: "El tiempo estimado debe ser una cadena de texto"})
    tiempo_estimado: string;

    @IsNumber({}, {message: "El precio debe ser un número"})
    @Type(() => Number)
    precio_base: number;


    @IsBoolean({message: "El estado debe ser verdadero o falso"})
    @IsOptional()
    activo?: boolean;
}

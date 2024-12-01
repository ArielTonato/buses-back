import { IsBoolean, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { Type } from "class-transformer";
import { Capitalize } from "src/common/decorators/capitalize.decorator";

export class CreateParadaDto {


    @IsString({message: "La ciudad debe ser una cadena de texto"})
    @Matches(/^(?!\s*$)[a-zA-Z\s]+$/, { message: 'La ciudad no puede contener solo espacios ni números' })
    @Capitalize()
    ciudad: string;


    @IsBoolean({message: "El estado debe ser verdadero o falso"})
    @IsOptional()
    activo?: boolean;
}

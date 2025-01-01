import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { ValidarCadena } from "src/common/decorators/cadenasTexto.decorator";

export class CreateFrecuenciaDto {
    @IsString({message: "El nombre de la frecuencia debe ser una cadena"})
    nombre_frecuencia: string

    @IsNumber({}, {message: "El id del bus es un número"})
    bus_id: number

    @IsNumber({}, {message: "El id del conductor es un número"})
    conductor_id: number


    @IsString({message: "La hora de salida debe ser una cadena"})
    hora_salida: string

    @IsString({message: "La hora de llegada debe ser una cadena"})
    hora_llegada: string

    @ValidarCadena({value: "origen"})
    origen: string

    @ValidarCadena({value: "destino"})
    destino: string

    @ValidarCadena({value: "provincia"})
    provincia: string

    @IsBoolean({message: "El estado debe ser verdadero o falso"})
    @IsOptional()
    activo?: boolean


    @IsNumber({}, {message: "El precio debe ser un número"})
    total: number

    @IsString({message: "El número de aprobación debe ser una cadena"})
    nro_aprobacion: string

    @IsBoolean({message: "El estado debe ser verdadero o falso"})
    @IsOptional()
    es_directo?: boolean
}

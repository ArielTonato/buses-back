import { Type } from "class-transformer";
import { IsNumber, IsString, IsOptional } from "class-validator";
import { IsAEcuadorianLicensePlate } from "src/common/decorators/placa.validator";

export class CreateBusDto {
    @IsNumber({}, {message: "El numero de bus debe ser un número"})
    @Type(() => Number)
    numero_bus: number;

    @IsString()
    @IsAEcuadorianLicensePlate({message: "La placa debe tener formato válido (XXX-1234 o XXX-123)"})
    placa: string;

    @IsString({message: "El chasis debe ser una cadena de texto"})
    chasis: string;

    @IsString()
    carroceria: string;

    @IsNumber({}, {message: "El total de asientos normales debe ser un número"})
    @Type(() => Number)   
    total_asientos_normales: number;

    @IsNumber({}, {message: "El total de asientos VIP debe ser un número"})
    @Type(() => Number)
    total_asientos_vip: number;

    @IsOptional()
    files?: Express.Multer.File[];
}
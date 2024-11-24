import {  IsNumber, IsString } from "class-validator";
import { IsAEcuadorianLicensePlate } from "src/common/decorators/placa.validator";

export class CreateBusDto {
    @IsNumber()
    numero_bus: number;

    @IsString()
    @IsAEcuadorianLicensePlate({message: "La placa debe tener formato válido (XXX-1234 o XXX-123)"})
    placa: string;

    @IsString()
    chasis: string;

    @IsString()
    carroceria: string;

    @IsNumber()
    total_asientos_normales: number;

    @IsNumber()
    total_asientos_vip: number;

}

import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateBusDto {
    @IsNumber()
    numero_bus: number;

    @IsString()
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

import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { EstadoBoleto } from "src/common/enums/boletos.enum";

export class CreateBoletoDto {
    @IsNumber()
    @IsOptional()
    total?: number

    @IsNumber()
    @IsOptional()
    cantidad_asientos?: number


    @IsOptional()
    @IsEnum(EstadoBoleto)
    estado?: EstadoBoleto

    @IsString()
    @IsOptional()
    url_imagen_qr?: string   

    @IsString()
    @IsOptional()
    asientos?: string
}

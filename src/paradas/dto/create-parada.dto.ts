
import { IsBoolean, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { ValidarCadena } from "src/common/decorators/cadenasTexto.decorator";


export class CreateParadaDto {

    @ValidarCadena()
    ciudad: string;


    @IsBoolean({message: "El estado debe ser verdadero o falso"})
    @IsOptional()
    activo?: boolean;
}

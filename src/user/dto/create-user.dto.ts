import { IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { IsEcuadorianId } from "src/common/decorators/cedula.validator";

export class CreateUserDto {
    @IsString()
    @IsEcuadorianId({message:"La cedula ingresada no es valida"})
    identification: string;

}

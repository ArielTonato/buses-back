import { IsString, IsNotEmpty, IsEmail, MaxLength, IsOptional } from 'class-validator';
import { ValidarCadena } from 'src/common/decorators/cadenasTexto.decorator';

export class CreateCooperativaDto {
    @IsString()
    @ValidarCadena()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    telefono: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsOptional()
    logo?: string;

    @IsString()
    @IsNotEmpty()
    ruc: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;
}

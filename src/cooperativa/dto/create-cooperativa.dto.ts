import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ValidarCadena } from 'src/common/decorators/cadenasTexto.decorator';

export class CreateCooperativaDto {
    @IsString()
    @ValidarCadena()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsNotEmpty()
    logo: string;

    @IsString()
    @IsNotEmpty()
    ruc: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;
}

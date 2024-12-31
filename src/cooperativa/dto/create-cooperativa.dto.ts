import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCooperativaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsString()
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

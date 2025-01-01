import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'usuario@ejemplo.com'
    })
    @IsEmail()
    correo: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: '********',
        minLength: 6
    })
    @IsString()
    password: string;
}
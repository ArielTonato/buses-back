import { 
    IsEmail, 
    IsOptional, 
    IsPhoneNumber,  
    IsString, 
    Matches, 
    MinLength 
} from "class-validator";
import { IsEcuadorianId } from "../../common/decorators/cedula.validator";
import { ValidarCadena } from "src/common/decorators/cadenasTexto.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({
        description: 'Número de identificación (cédula)',
        example: '1234567890'
    })
    @IsString()
    @IsEcuadorianId({ message: "La cédula ingresada no es válida" })
    identificacion: string;

    @ApiProperty({
        description: 'Primer nombre del usuario',
        example: 'Juan'
    })
    @ValidarCadena({ value: "primer nombre" })
    primer_nombre: string;

    @ApiProperty({
        description: 'Segundo nombre del usuario',
        example: 'Carlos'
    })
    @ValidarCadena({ value: "segundo nombre" })
    segundo_nombre: string;

    @ApiProperty({
        description: 'Primer apellido del usuario',
        example: 'Pérez'
    })
    @ValidarCadena({ value: "primer apellido" })
    primer_apellido: string;

    @ApiProperty({
        description: 'Segundo apellido del usuario',
        example: 'García'
    })
    @ValidarCadena({ value: "segundo apellido" })
    segundo_apellido: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'usuario@ejemplo.com'
    })
    @IsEmail({}, { message: "El correo ingresado no es válido" })
    correo: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: '********',
        minLength: 6
    })
    @IsString()
    @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    @Matches(/^(?!\s*$)(?:(?!^\s).)*$/, { message: 'Contraseña Invalida' })
    password: string;

    @ApiProperty({
        description: 'Número de teléfono del usuario',
        example: '+593987654321'
    })
    @IsPhoneNumber("EC", { message: "El número de teléfono debe ser válido para Ecuador" })
    telefono: string;

    @ApiProperty({
        description: 'Dirección del usuario',
        example: 'Calle 123 entre Av. 1 y Av. 2'
    })
    @IsString()
    @MinLength(5, { message: "La dirección debe tener al menos 5 caracteres" })
    direccion: string;
}

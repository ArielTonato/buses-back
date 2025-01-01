import { 
    IsEmail, 
    IsPhoneNumber,  
    IsString, 
    Matches, 
    MinLength 
} from "class-validator";
import { IsEcuadorianId } from "../../common/decorators/cedula.validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        description: 'Número de identificación (cédula)',
        example: '1234567890'
    })
    @IsString()
    @IsEcuadorianId({ message: "La cédula ingresada no es válida" })
    identificacion: string;

    @ApiProperty({
        description: 'Primer nombre del usuario',
        example: 'Juan',
        minLength: 3
    })
    @IsString()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'El primer nombre no puede contener números' })
    @MinLength(3, { message: "El primer nombre debe tener al menos 3 caracteres" })
    primer_nombre: string;

    @ApiProperty({
        description: 'Segundo nombre del usuario',
        example: 'Carlos',
        minLength: 3
    })
    @IsString()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'El segundo nombre no puede contener números' })
    @MinLength(3, { message: "El segundo nombre debe tener al menos 3 caracteres" })
    segundo_nombre: string;

    @ApiProperty({
        description: 'Primer apellido del usuario',
        example: 'Pérez',
        minLength: 3
    })
    @IsString()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'El primer apellido no puede contener números' })
    @MinLength(3, { message: "El primer apellido debe tener al menos 3 caracteres" })
    primer_apellido: string;

    @ApiProperty({
        description: 'Segundo apellido del usuario',
        example: 'García',
        minLength: 3
    })
    @IsString()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'El segundo apellido no puede contener números' })
    @MinLength(3, { message: "El segundo apellido debe tener al menos 3 caracteres" })
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
    password: string;

    @ApiProperty({
        description: 'Número de teléfono del usuario',
        example: '+593987654321'
    })
    @IsPhoneNumber("EC", { message: "El número de teléfono debe ser válido para Ecuador" })
    telefono: string;

    @ApiProperty({
        description: 'Dirección del usuario',
        example: 'Calle Principal 123',
        minLength: 5
    })
    @IsString()
    @MinLength(5, { message: "La dirección debe tener al menos 5 caracteres" })
    direccion: string;
}

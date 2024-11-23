import { 
    IsEmail, 
    IsOptional, 
    IsPhoneNumber,  
    IsString, 
    Matches, 
    MinLength 
} from "class-validator";
import { IsEcuadorianId } from "../../common/decorators/cedula.validator";

export class CreateUserDto {
    @IsString()
    @IsEcuadorianId({ message: "La cédula ingresada no es válida" })
    identificacion: string;

    @IsString()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'El primer nombre no puede contener números' })
    @MinLength(3, { message: "El primer nombre debe tener al menos 3 caracteres" })
    primer_nombre: string;


    @IsString()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'El segundo nombre no puede contener números' })
    @MinLength(3, { message: "El segundo nombre debe tener al menos 3 caracteres" })
    segundo_nombre: string;

    @IsString()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'El primer apellido no puede contener números' })
    @MinLength(3, { message: "El primer apellido debe tener al menos 3 caracteres" })
    primer_apellido: string;

    @IsString()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'El segundo apellido no puede contener números' })
    @MinLength(3, { message: "El segundo apellido debe tener al menos 3 caracteres" })
    segundo_apellido: string;

    @IsEmail({}, { message: "El correo ingresado no es válido" })
    correo: string;

    @IsString()
    @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    password: string;

    @IsPhoneNumber("EC", { message: "El número de teléfono debe ser válido para Ecuador" })
    telefono: string;

    @IsString()
    @MinLength(5, { message: "La dirección debe tener al menos 5 caracteres" })
    direccion: string;
}

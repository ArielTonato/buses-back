import { 
    IsEmail, 
    IsOptional, 
    IsPhoneNumber,  
    IsString, 
    MinLength 
} from "class-validator";
import { IsEcuadorianId } from "../../common/decorators/cedula.validator";

export class CreateUserDto {
    @IsString()
    @IsEcuadorianId({ message: "La cédula ingresada no es válida" })
    identificacion: string;

    @IsString()
    @MinLength(3, { message: "El primer nombre debe tener al menos 3 caracteres" })
    primer_nombre: string;

    @IsOptional()
    @IsString()
    @MinLength(3, { message: "El segundo nombre debe tener al menos 3 caracteres" })
    segundo_nombre?: string;

    @IsString()
    @MinLength(3, { message: "El primer apellido debe tener al menos 3 caracteres" })
    primer_apellido: string;

    @IsOptional()
    @IsString()
    @MinLength(3, { message: "El segundo apellido debe tener al menos 3 caracteres" })
    segundo_apellido?: string;

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

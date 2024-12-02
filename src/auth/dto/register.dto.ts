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

export class RegisterDto {
    @IsString()
    @IsEcuadorianId({ message: "La cédula ingresada no es válida" })
    identificacion: string;

    @ValidarCadena({ value: "primer nombre" })
    primer_nombre: string;


    @ValidarCadena({ value: "segundo nombre" })
    segundo_nombre: string;

    @ValidarCadena({ value: "primer apellido" })
    primer_apellido: string;

    @ValidarCadena({ value: "segundo apellido" })
    segundo_apellido: string;

    @IsEmail({}, { message: "El correo ingresado no es válido" })
    correo: string;

    @IsString()
    @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    @Matches(/^(?!\s*$)(?:(?!^\s).)*$/, { message: 'Contraseña Invalida' })
    password: string;

    @IsPhoneNumber("EC", { message: "El número de teléfono debe ser válido para Ecuador" })
    telefono: string;

    @IsString()
    @MinLength(5, { message: "La dirección debe tener al menos 5 caracteres" })
    direccion: string;
}

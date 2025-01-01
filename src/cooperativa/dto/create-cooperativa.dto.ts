import { IsString, IsNotEmpty, IsEmail, MaxLength, IsOptional } from 'class-validator';
import { ValidarCadena } from 'src/common/decorators/cadenasTexto.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCooperativaDto {
    @ApiProperty({
        description: 'Nombre de la cooperativa de transporte',
        example: 'Cooperativa Trans Express',
        minLength: 1
    })
    @IsString()
    @ValidarCadena()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        description: 'Número de teléfono de la cooperativa',
        example: '0987654321',
        maxLength: 10
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    telefono: string;

    @ApiProperty({
        description: 'Correo electrónico de contacto de la cooperativa',
        example: 'info@transexpress.com'
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @ApiProperty({
        description: 'URL del logo de la cooperativa',
        example: 'https://storage.googleapis.com/cooperativas/logo-transexpress.png',
        required: false
    })
    @IsString()
    @IsOptional()
    logo?: string;

    @ApiProperty({
        description: 'RUC (Registro Único de Contribuyentes) de la cooperativa',
        example: '1234567890001'
    })
    @IsString()
    @IsNotEmpty()
    ruc: string;

    @ApiProperty({
        description: 'Dirección física de la cooperativa',
        example: 'Av. Principal 123 y Secundaria'
    })
    @IsString()
    @IsNotEmpty()
    direccion: string;
}

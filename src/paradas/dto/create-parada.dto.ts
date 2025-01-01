import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ValidarCadena } from "src/common/decorators/cadenasTexto.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateParadaDto {

    @ApiProperty({
        description: 'Nombre de la ciudad donde se encuentra la parada',
        example: 'Ambato',
        minLength: 3
    })
    @ValidarCadena()
    ciudad: string;

    @ApiProperty({
        description: 'Estado de la parada (activa/inactiva)',
        example: true,
        required: false,
        default: true
    })
    @IsBoolean({message: "El estado debe ser verdadero o falso"})
    @IsOptional()
    activo?: boolean;
}

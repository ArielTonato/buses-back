import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, Matches, MinLength } from 'class-validator';
import { Capitalize } from 'src/common/decorators/capitalize.decorator';

export function ValidarCadena(options: { minLength?: number, value?: string } = { minLength: 3, value: 'valor' }) {
    return applyDecorators(
        Transform(({ value }) => {
            if (typeof value !== 'string') {
                throw new BadRequestException(`El ${options.value} debe ser una cadena de texto`);
            }
            return value.trim();
        }),
        MinLength(options.minLength, { message: `El ${options.value} debe tener al menos ${options.minLength || 3} caracteres` }),
        Matches(/^[a-zA-Z\s\xF1]+$/, { message: `El ${options.value} no puede contener números` }),
        Capitalize()
    );
}

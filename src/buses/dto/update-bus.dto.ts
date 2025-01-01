import { PartialType } from '@nestjs/mapped-types';
import { CreateBusDto } from './create-bus.dto';
import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBusDto extends PartialType(CreateBusDto) {
    @ApiProperty({
        description: 'Estado del bus (activo/inactivo)',
        example: true
    })
    @IsBoolean()
    activo: boolean
}

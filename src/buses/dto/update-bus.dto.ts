import { PartialType } from '@nestjs/mapped-types';
import { CreateBusDto } from './create-bus.dto';
import { IsBoolean } from 'class-validator';

export class UpdateBusDto extends PartialType(CreateBusDto) {
    @IsBoolean()
    activo: boolean
}
